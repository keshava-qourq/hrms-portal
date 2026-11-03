"""US-011 department maintenance via real handlers on live Postgres.

Authored from the contract while the feature is built; tests whose prerequisite
endpoint or table is absent skip as PENDING rather than fail.
"""

import re
import uuid

import pytest
from sqlalchemy import text

from app.database import SessionLocal
from tests.integration.test_auth import client
from tests.integration.test_rbac import _headers, make_roled  # noqa: F401

URL = "/api/departments"


def _name() -> str:
    return "Dept-" + uuid.uuid4().hex[:8]


def _require_endpoint(h):
    res = client.get(URL, headers=h)
    if res.status_code == 404:
        pytest.skip("PENDING: /api/departments not implemented yet")
    assert res.status_code == 200, res.text
    return res.json()


def _items(body):
    return body["items"] if isinstance(body, dict) else body


def _create(h, name):
    return client.post(URL, headers=h, json={"name": name})


def _cleanup(name):
    with SessionLocal() as db:
        db.execute(text("DELETE FROM departments WHERE name = :n"), {"n": name})
        db.commit()


def _id_of(h, name):
    for d in _items(client.get(URL, headers=h).json()):
        if d["name"] == name:
            return d["id"]
    return None


def test_ac039_added_department_is_selectable(make_roled):  # noqa: F811
    hr = make_roled("HR_ADMIN")
    emp = make_roled("EMPLOYEE")
    h = _headers(hr)
    _require_endpoint(h)
    name = _name()
    try:
        res = _create(h, name)
        assert res.status_code in (200, 201), res.text
        # Selectable = offered in the list every authenticated user reads.
        for headers in (h, _headers(emp)):
            names = [d["name"] for d in _items(client.get(URL, headers=headers).json())]
            assert name in names
    finally:
        _cleanup(name)


def test_ac040_delete_with_assigned_employees_refused_with_count(make_roled):  # noqa: F811
    hr = make_roled("HR_ADMIN")
    h = _headers(hr)
    _require_endpoint(h)
    name = _name()
    try:
        assert _create(h, name).status_code in (200, 201)
        dept_id = _id_of(h, name)
        assert dept_id is not None
        try:
            with SessionLocal() as db:
                for _i in range(3):
                    db.execute(
                        text(
                            "INSERT INTO employees (id, department_id, email) VALUES (:i, :d, :e)"
                        ),
                        {"i": str(uuid.uuid4()), "d": dept_id, "e": f"{uuid.uuid4().hex}@x.com"},
                    )
                db.commit()
        except Exception:
            pytest.skip("PENDING: employees table not available for assignment")
        res = client.delete(f"{URL}/{dept_id}", headers=h)
        assert res.status_code in (400, 409, 422), res.text
        assert re.search(r"\b3\b", res.text), res.text
        assert _id_of(h, name) == dept_id
    finally:
        with SessionLocal() as db:
            try:
                db.execute(text("DELETE FROM employees WHERE department_id = :d"), {"d": dept_id})
                db.commit()
            except Exception:
                db.rollback()
        _cleanup(name)


def test_ac040_delete_unassigned_department_succeeds(make_roled):  # noqa: F811
    hr = make_roled("HR_ADMIN")
    h = _headers(hr)
    _require_endpoint(h)
    name = _name()
    try:
        assert _create(h, name).status_code in (200, 201)
        dept_id = _id_of(h, name)
        res = client.delete(f"{URL}/{dept_id}", headers=h)
        assert res.status_code in (200, 204), res.text
        assert _id_of(h, name) is None
    finally:
        _cleanup(name)


def test_ac041_one_shared_list_no_country_or_entity_variant(make_roled):  # noqa: F811
    hr = make_roled("HR_ADMIN")
    h = _headers(hr)
    _require_endpoint(h)
    name = _name()
    try:
        res = client.post(
            URL, headers=h, json={"name": name, "country": "DE", "entity": "Acme GmbH"}
        )
        assert res.status_code in (200, 201, 422), res.text
        if res.status_code == 422:
            return  # extra scoping fields rejected
        for d in _items(client.get(URL, headers=h).json()):
            assert "country" not in d and "entity" not in d and "entity_id" not in d
        # Filters by country/entity must not yield a different list.
        base = _items(client.get(URL, headers=h).json())
        filt = _items(client.get(URL, headers=h, params={"country": "FR"}).json())
        assert [d["name"] for d in base] == [d["name"] for d in filt]
    finally:
        _cleanup(name)


def test_ac041_departments_table_has_no_scoping_columns():
    with SessionLocal() as db:
        cols = {
            r[0]
            for r in db.execute(
                text(
                    "SELECT column_name FROM information_schema.columns "
                    "WHERE table_name = 'departments'"
                )
            )
        }
    if not cols:
        pytest.skip("PENDING: departments table not created yet")
    assert not cols & {"country", "country_code", "entity", "entity_id", "company_id", "tenant_id"}


@pytest.mark.parametrize("role", ["EMPLOYEE", "REPORTING_MANAGER", "PROJECT_MANAGER"])
def test_authz_non_hr_admin_cannot_create_department(make_roled, role):  # noqa: F811
    hr = make_roled("HR_ADMIN")
    _require_endpoint(_headers(hr))
    user = make_roled(role)
    name = _name()
    try:
        res = _create(_headers(user), name)
        assert res.status_code == 403
        assert _id_of(_headers(hr), name) is None
    finally:
        _cleanup(name)


@pytest.mark.parametrize("role", ["EMPLOYEE", "REPORTING_MANAGER", "PROJECT_MANAGER"])
def test_authz_non_hr_admin_cannot_delete_department(make_roled, role):  # noqa: F811
    hr = make_roled("HR_ADMIN")
    hh = _headers(hr)
    _require_endpoint(hh)
    user = make_roled(role)
    name = _name()
    try:
        assert _create(hh, name).status_code in (200, 201)
        dept_id = _id_of(hh, name)
        res = client.delete(f"{URL}/{dept_id}", headers=_headers(user))
        assert res.status_code == 403
        assert _id_of(hh, name) == dept_id
    finally:
        _cleanup(name)


def test_authz_unauthenticated_is_401():
    res = client.post(URL, json={"name": _name()})
    if res.status_code == 404:
        pytest.skip("PENDING: /api/departments not implemented yet")
    assert res.status_code == 401


def test_nfr022_single_shared_list_same_for_every_user(make_roled):  # noqa: F811
    hr = make_roled("HR_ADMIN")
    emp = make_roled("EMPLOYEE")
    _require_endpoint(_headers(hr))
    a = [d["name"] for d in _items(client.get(URL, headers=_headers(hr)).json())]
    b = [d["name"] for d in _items(client.get(URL, headers=_headers(emp)).json())]
    assert a == b


# NFR notes (not testable in this suite): NFR-008 TLS/at-rest encryption, NFR-011
# single-region residency and NFR-012 daily backups/PITR are infrastructure
# properties; NFR-014 sizing needs load testing. NFR-022 is covered by the
# one-shared-list tests above (no tenant/country variant in API or schema).
