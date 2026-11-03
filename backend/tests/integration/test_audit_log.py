"""US-007 audit log: append-only and admin-only, via real handlers on live Postgres.

Written from the contract while the audit feature is built; tests whose
prerequisite endpoint is absent skip as PENDING rather than fail.
"""

import uuid

import pytest
from sqlalchemy import text

from app.database import SessionLocal
from tests.integration.test_auth import client
from tests.integration.test_rbac import _headers, make_roled  # noqa: F401

URL = "/api/admin/audit-logs"


def _logs(admin, **params):
    res = client.get(URL, headers=_headers(admin), params=params)
    if res.status_code == 404:
        pytest.skip("PENDING: GET /api/admin/audit-logs not implemented yet")
    assert res.status_code == 200, res.text
    body = res.json()
    assert "items" in body and "total" in body
    return body["items"]


def _items_for(admin, entity_id):
    return [i for i in _logs(admin) if str(i.get("entity_id")) == str(entity_id)]


def test_ac025_approval_or_rejection_entry_has_required_fields(make_roled):  # noqa: F811
    admin = make_roled("SYSTEM_ADMIN")
    manager = make_roled("REPORTING_MANAGER")
    _logs(admin)  # skips if the endpoint is missing
    # Exercise the real reject handler; an unknown item must not create an entry,
    # a real one must. Prerequisite item creation is endpoint-dependent.
    mh = _headers(manager)
    probe = client.post(
        f"/api/approvals/leave_request/{uuid.uuid4()}/reject", headers=mh, json={"comment": "x"}
    )
    if probe.status_code in (404, 405) and "not found" not in probe.text.lower():
        pytest.skip("PENDING: approvals endpoints not implemented yet")
    before = len(_logs(admin))
    pending = client.get("/api/approvals/pending", headers=mh)
    if pending.status_code != 200 or not pending.json():
        pytest.skip("PENDING: no submitted item can be created through the API yet")
    data = pending.json()
    item = (data.get("items") if isinstance(data, dict) else data)[0]
    item_type, item_id = item["item_type"], item["item_id"]
    res = client.post(
        f"/api/approvals/{item_type}/{item_id}/reject", headers=mh, json={"comment": "needs fix"}
    )
    assert res.status_code == 200
    entries = _items_for(admin, item_id)
    assert len(_logs(admin)) == before + 1
    e = entries[0]
    assert e["actor"] and "reject" in e["action"].lower()
    assert e["entity_type"] and str(e["entity_id"]) == str(item_id)
    assert e["reason_or_comment"] == "needs fix"
    assert e["created_at"]


def test_ac026_edit_records_before_and_after_for_changed_fields(make_roled):  # noqa: F811
    admin = make_roled("SYSTEM_ADMIN")
    target = make_roled("EMPLOYEE")
    _logs(admin)
    res = client.patch(
        f"/api/admin/users/{target.id}", headers=_headers(admin), json={"is_active": False}
    )
    assert res.status_code == 200
    entries = _items_for(admin, target.id)
    assert entries, "edit produced no audit entry"
    e = entries[0]
    assert e["before_values"].get("is_active") is True
    assert e["after_values"].get("is_active") is False
    assert e["created_at"] and e["actor"]


def test_ac026_unchanged_fields_not_recorded(make_roled):  # noqa: F811
    admin = make_roled("SYSTEM_ADMIN")
    target = make_roled("EMPLOYEE")
    _logs(admin)
    client.patch(f"/api/admin/users/{target.id}", headers=_headers(admin), json={"is_active": False})
    e = _items_for(admin, target.id)[0]
    assert "email" not in (e["after_values"] or {})
    assert "password_hash" not in str(e)


@pytest.mark.parametrize("verb", ["post", "put", "patch", "delete"])
def test_ac027_nfr010_no_write_verbs_on_collection(make_roled, verb):  # noqa: F811
    admin = make_roled("SYSTEM_ADMIN")
    res = getattr(client, verb)(URL, headers=_headers(admin), **({} if verb == "delete" else {"json": {}}))
    assert res.status_code in (404, 405)


@pytest.mark.parametrize("verb", ["put", "patch", "delete"])
def test_ac027_nfr010_no_write_verbs_on_single_entry(make_roled, verb):  # noqa: F811
    admin = make_roled("SYSTEM_ADMIN")
    target = make_roled("EMPLOYEE")
    h = _headers(admin)
    _logs(admin)
    client.patch(f"/api/admin/users/{target.id}", headers=h, json={"is_active": False})
    entry = _items_for(admin, target.id)[0]
    eid = entry.get("id", 1)
    kwargs = {} if verb == "delete" else {"json": {"action": "tampered"}}
    res = getattr(client, verb)(f"{URL}/{eid}", headers=h, **kwargs)
    assert res.status_code in (404, 405)
    assert _items_for(admin, target.id)[0]["action"] == entry["action"]


def test_ac027_nfr010_database_refuses_update_and_delete(make_roled):  # noqa: F811
    admin = make_roled("SYSTEM_ADMIN")
    target = make_roled("EMPLOYEE")
    _logs(admin)
    client.patch(f"/api/admin/users/{target.id}", headers=_headers(admin), json={"is_active": False})
    for sql in (
        "UPDATE audit_logs SET action = 'tampered' WHERE entity_id = :e",
        "DELETE FROM audit_logs WHERE entity_id = :e",
    ):
        with SessionLocal() as db:
            with pytest.raises(Exception):
                db.execute(text(sql), {"e": str(target.id)})
                db.commit()
    with SessionLocal() as db:
        n = db.execute(
            text("SELECT count(*) FROM audit_logs WHERE entity_id = :e"), {"e": str(target.id)}
        ).scalar()
    assert n >= 1


def test_ac027_user_deletion_cannot_erase_entries(make_roled):  # noqa: F811
    admin = make_roled("SYSTEM_ADMIN")
    target = make_roled("EMPLOYEE")
    _logs(admin)
    client.patch(f"/api/admin/users/{target.id}", headers=_headers(admin), json={"is_active": False})
    with SessionLocal() as db:
        before = db.execute(text("SELECT count(*) FROM audit_logs")).scalar()
    with SessionLocal() as db:
        db.execute(text("DELETE FROM users WHERE id = :i"), {"i": target.id})
        db.commit()
    with SessionLocal() as db:
        after = db.execute(text("SELECT count(*) FROM audit_logs")).scalar()
    assert after == before


@pytest.mark.parametrize("role", ["EMPLOYEE", "REPORTING_MANAGER", "HR_ADMIN", "PROJECT_MANAGER"])
def test_ac028_nfr010_non_admin_roles_get_403(make_roled, role):  # noqa: F811
    user = make_roled(role)
    res = client.get(URL, headers=_headers(user))
    assert res.status_code == 403
    assert res.json() == {"detail": "Forbidden"}


def test_ac028_unauthenticated_is_401():
    assert client.get(URL).status_code == 401


def test_ac028_system_admin_gets_200(make_roled):  # noqa: F811
    admin = make_roled("SYSTEM_ADMIN")
    res = client.get(URL, headers=_headers(admin))
    assert res.status_code == 200
    assert {"items", "total"} <= set(res.json())


def test_nfr008_passwords_never_appear_in_audit_entries(make_roled):  # noqa: F811
    admin = make_roled("SYSTEM_ADMIN")
    target = make_roled("EMPLOYEE")
    _logs(admin)
    client.patch(f"/api/admin/users/{target.id}", headers=_headers(admin), json={"is_active": False})
    res = client.get(URL, headers=_headers(admin))
    assert target.password_hash not in res.text


# NFR notes (not testable in this suite): NFR-008 TLS/at-rest encryption, NFR-011
# single-region residency and NFR-012 daily backups/PITR are infrastructure
# properties; NFR-014 sizing needs load testing. Not asserted here.
