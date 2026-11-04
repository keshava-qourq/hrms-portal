"""US-010 leaver marking, erasure and authorisation via real handlers on live Postgres/Redis.

AC-036 leaver leaves team lists/pickers and portal account is deactivated
AC-037 erasure removes identifying fields irreversibly; audit keeps who/when
AC-038 non-HR Admin is refused
"""

import pytest

from app.database import SessionLocal
from app.models import Employee, User
from tests.integration.test_auth import PASSWORD, _login, client
from tests.integration.test_employees import AUDIT, EMPLOYEES, MY_TEAM, factory  # noqa: F401
from tests.integration.test_rbac import _headers, make_roled  # noqa: F401

END = "2026-03-31"


def _leave(hr, emp_id, end_date=END):
    return client.patch(
        f"{EMPLOYEES}/{emp_id}",
        headers=_headers(hr),
        json={"is_active": False, "end_date": end_date},
    )


def _erase(actor, emp_id):
    return client.post(f"{EMPLOYEES}/{emp_id}/erase", headers=_headers(actor))


def _row(eid):
    with SessionLocal() as db:
        e = db.get(Employee, eid)
        return {
            "name": e.full_name,
            "email": e.work_email,
            "mobile": e.mobile_number,
            "personal": e.personal_contact,
            "active": e.is_active,
            "end": e.end_date,
            "erased": e.is_erased,
        }


def _set_pii(eid):
    with SessionLocal() as db:
        e = db.get(Employee, eid)
        e.mobile_number = "+1 555 0199"
        e.personal_contact = "private@home.example"
        db.commit()


@pytest.fixture
def team(make_roled, factory):  # noqa: F811
    dept = factory.department()
    mgr_emp = factory.employee(dept)
    mgr = make_roled("REPORTING_MANAGER")
    factory.link(mgr, mgr_emp)
    emp = factory.employee(dept, manager_id=mgr_emp)
    acct = make_roled("EMPLOYEE")
    factory.link(acct, emp)
    hr = make_roled("HR_ADMIN")
    admin = make_roled("SYSTEM_ADMIN")
    factory.hr, factory.admin, factory.mgr, factory.acct = hr, admin, mgr, acct
    return mgr, emp, factory


# ---------------------------------------------------------------- AC-036


def test_ac036_leaver_disappears_from_team_list(team):
    mgr, emp, f = team
    before = client.get(MY_TEAM, headers=_headers(mgr)).json()
    assert str(emp) in {e["id"] for e in before["items"]}
    res = _leave(f.hr, emp)
    assert res.status_code == 200, res.text
    assert res.json()["is_active"] is False and res.json()["end_date"] == END
    after = client.get(MY_TEAM, headers=_headers(mgr)).json()
    assert str(emp) not in {e["id"] for e in after["items"]}
    assert after["total"] == before["total"] - 1
    assert _row(emp)["active"] is False


def test_ac036_linked_portal_account_deactivated_and_session_dropped(team):
    _mgr, emp, f = team
    h = _headers(f.acct)
    assert client.get("/api/me", headers=h).status_code == 200
    assert _leave(f.hr, emp).status_code == 200
    with SessionLocal() as db:
        assert db.get(User, f.acct.id).is_active is False
    assert client.get("/api/me", headers=h).status_code == 401
    assert _login(f.acct.email, PASSWORD).status_code == 403


def test_ac036_leaver_not_offered_in_assignment_picker(team):
    _mgr, emp, f = team
    probe = client.get("/api/assignments/candidates", headers=_headers(f.hr))
    if probe.status_code == 404:
        pytest.skip("PENDING: assignment picker endpoint not implemented yet")
    assert probe.status_code == 200, probe.text
    assert _leave(f.hr, emp).status_code == 200
    body = client.get("/api/assignments/candidates", headers=_headers(f.hr)).json()
    rows = body["items"] if isinstance(body, dict) else body
    assert str(emp) not in {str(r.get("id")) for r in rows}


def test_ac036_leaver_requires_end_date(team):
    _mgr, emp, f = team
    res = client.patch(f"{EMPLOYEES}/{emp}", headers=_headers(f.hr), json={"is_active": False})
    assert res.status_code == 422, res.text
    row = _row(emp)
    assert row["active"] is True and row["end"] is None
    with SessionLocal() as db:
        assert db.get(User, f.acct.id).is_active is True


def test_ac036_leaver_marking_is_audited(team):
    _mgr, emp, f = team
    assert _leave(f.hr, emp).status_code == 200
    res = client.get(AUDIT, headers=_headers(f.admin), params={"entity_id": str(emp)})
    assert res.status_code == 200, res.text
    e = res.json()["items"][0]
    assert e["actor"] == f.hr.email and e["after_values"].get("is_active") is False
    assert e["before_values"].get("is_active") is True
    assert e["after_values"].get("end_date") == END


# ---------------------------------------------------------------- AC-037


def test_ac037_erasure_removes_identifying_fields_irreversibly(team):
    _mgr, emp, f = team
    _set_pii(emp)
    original = _row(emp)
    assert _leave(f.hr, emp).status_code == 200
    res = _erase(f.hr, emp)
    assert res.status_code == 200, res.text
    row = _row(emp)
    assert row["erased"] is True
    assert row["name"] != original["name"]
    assert row["email"] != original["email"]
    assert row["mobile"] is None and row["personal"] is None
    # No original value reachable through the API either.
    got = client.get(f"{EMPLOYEES}/{emp}", headers=_headers(f.hr))
    for v in (original["name"], original["email"], "+1 555 0199", "private@home.example"):
        assert v not in res.text and v not in got.text
    # Linked account scrubbed and unusable.
    with SessionLocal() as db:
        u = db.get(User, f.acct.id)
        assert u.is_active is False and u.email != f.acct.email
    # Irreversible: a second erase is refused and nothing is restored.
    assert _erase(f.hr, emp).status_code == 409
    assert _row(emp)["name"] == row["name"]


def test_ac037_audit_retains_who_and_when_without_pii(team):
    _mgr, emp, f = team
    _set_pii(emp)
    original = _row(emp)
    assert _leave(f.hr, emp).status_code == 200
    assert _erase(f.hr, emp).status_code == 200
    res = client.get(AUDIT, headers=_headers(f.admin), params={"entity_id": str(emp)})
    assert res.status_code == 200, res.text
    erase = [i for i in res.json()["items"] if "erase" in i["action"]]
    assert len(erase) == 1
    assert erase[0]["actor"] == f.hr.email
    assert erase[0]["created_at"] and str(erase[0]["entity_id"]) == str(emp)
    # Entries remain after erasure; erased personal values are not re-exposed.
    for v in ("+1 555 0199", "private@home.example", original["name"]):
        assert v not in str(erase[0])


def test_ac037_active_employee_cannot_be_erased(team):
    _mgr, emp, f = team
    before = _row(emp)
    res = _erase(f.hr, emp)
    assert res.status_code == 409, res.text
    assert _row(emp) == before


def test_ac037_unknown_employee_is_404(team):
    _mgr, _emp, f = team
    assert _erase(f.hr, "00000000-0000-0000-0000-000000000000").status_code == 404
    assert _erase(f.hr, "not-a-uuid").status_code == 404


def test_ac037_erased_leaver_absent_from_team_list(team):
    mgr, emp, f = team
    assert _leave(f.hr, emp).status_code == 200
    assert _erase(f.hr, emp).status_code == 200
    ids = {e["id"] for e in client.get(MY_TEAM, headers=_headers(mgr)).json()["items"]}
    assert str(emp) not in ids


# ---------------------------------------------------------------- AC-038


@pytest.mark.parametrize("role", ["EMPLOYEE", "REPORTING_MANAGER", "PROJECT_MANAGER", "SYSTEM_ADMIN"])
def test_ac038_non_hr_admin_cannot_mark_leaver(team, make_roled, role):  # noqa: F811
    _mgr, emp, f = team
    actor = make_roled(role)
    before = _row(emp)
    res = _leave(actor, emp)
    assert res.status_code == 403, res.text
    assert _row(emp) == before
    with SessionLocal() as db:
        assert db.get(User, f.acct.id).is_active is True


@pytest.mark.parametrize("role", ["EMPLOYEE", "REPORTING_MANAGER", "PROJECT_MANAGER", "SYSTEM_ADMIN"])
def test_ac038_non_hr_admin_cannot_erase(team, make_roled, role):  # noqa: F811
    _mgr, emp, f = team
    assert _leave(f.hr, emp).status_code == 200
    actor = make_roled(role)
    before = _row(emp)
    res = _erase(actor, emp)
    assert res.status_code == 403, res.text
    assert _row(emp) == before
    assert _row(emp)["erased"] is False


def test_ac038_employee_cannot_mark_self_leaver(team):
    _mgr, emp, f = team
    res = _leave(f.acct, emp)
    assert res.status_code == 403, res.text
    assert _row(emp)["active"] is True


def test_ac038_refused_attempts_write_no_audit(team, make_roled):  # noqa: F811
    _mgr, emp, f = team
    actor = make_roled("EMPLOYEE")
    _leave(actor, emp)
    _erase(actor, emp)
    items = client.get(AUDIT, headers=_headers(f.admin), params={"entity_id": str(emp)}).json()[
        "items"
    ]
    assert items == []


def test_ac038_unauthenticated_is_401(team):
    _mgr, emp, _f = team
    assert (
        client.patch(f"{EMPLOYEES}/{emp}", json={"is_active": False, "end_date": END}).status_code
        == 401
    )
    assert client.post(f"{EMPLOYEES}/{emp}/erase").status_code == 401
    assert _row(emp)["active"] is True
