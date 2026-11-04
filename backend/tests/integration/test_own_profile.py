"""US-008 own profile: read, employee-editable update with audit, and refusal of
restricted-field updates, via real handlers on live Postgres and Redis."""

import uuid

import pytest

from app.database import SessionLocal
from app.models import Employee
from tests.integration.test_auth import client
from tests.integration.test_employees import AUDIT, EMPLOYEES, factory  # noqa: F401
from tests.integration.test_rbac import _headers, make_roled  # noqa: F401


@pytest.fixture
def me(make_roled, factory):  # noqa: F811
    dept = factory.department()
    mgr = factory.employee(dept)
    emp = factory.employee(dept, manager_id=mgr)
    user = make_roled("EMPLOYEE")
    factory.link(user, emp)
    factory.dept = dept
    factory.mgr = mgr
    return user, emp, factory


def _row(eid):
    with SessionLocal() as db:
        e = db.get(Employee, eid)
        return {
            "mobile": e.mobile_number,
            "personal": e.personal_contact,
            "dept": e.department_id,
            "mgr": e.reporting_manager_id,
            "number": e.employee_number,
        }


def test_ac029_own_profile_shows_identity_fields(me):
    user, emp, f = me
    res = client.get(f"{EMPLOYEES}/{emp}", headers=_headers(user))
    assert res.status_code == 200, res.text
    b = res.json()
    for k in (
        "full_name",
        "employee_number",
        "department_id",
        "department_name",
        "reporting_manager_id",
        "reporting_manager_name",
        "work_email",
        "mobile_number",
        "personal_contact",
    ):
        assert k in b
    assert b["id"] == str(emp)
    assert b["department_id"] == str(f.dept)
    assert b["reporting_manager_id"] == str(f.mgr)
    assert b["department_name"] and b["reporting_manager_name"]


def test_ac029_other_employee_record_is_403(me):
    user, _emp, f = me
    other = f.employee(f.dept)
    res = client.get(f"{EMPLOYEES}/{other}", headers=_headers(user))
    assert res.status_code == 403
    assert str(other) not in res.text


def test_ac030_update_mobile_is_stored_and_audited(me, make_roled):  # noqa: F811
    user, emp, _f = me
    admin = make_roled("SYSTEM_ADMIN")
    res = client.patch(
        f"{EMPLOYEES}/{emp}",
        headers=_headers(user),
        json={"mobile_number": "+1 555 0100"},
    )
    assert res.status_code == 200, res.text
    assert res.json()["mobile_number"] == "+1 555 0100"
    assert _row(emp)["mobile"] == "+1 555 0100"
    again = client.get(f"{EMPLOYEES}/{emp}", headers=_headers(user)).json()
    assert again["mobile_number"] == "+1 555 0100"

    a = client.get(AUDIT, headers=_headers(admin), params={"entity_id": str(emp)})
    assert a.status_code == 200, a.text
    entry = a.json()["items"][0]
    assert entry["actor"] == user.email
    assert entry["after_values"].get("mobile_number") == "+1 555 0100"
    assert "mobile_number" in entry["before_values"]
    assert entry["created_at"]
    assert "work_email" not in entry["after_values"]


def test_ac030_personal_contact_editable(me):
    user, emp, _f = me
    res = client.patch(
        f"{EMPLOYEES}/{emp}", headers=_headers(user), json={"personal_contact": "home@x.com"}
    )
    assert res.status_code == 200, res.text
    assert _row(emp)["personal"] == "home@x.com"


@pytest.mark.parametrize("field", ["department_id", "reporting_manager_id", "employee_number"])
def test_ac031_direct_patch_of_restricted_field_is_403_and_unsaved(me, field):
    user, emp, f = me
    before = _row(emp)
    value = {
        "department_id": str(f.department()),
        "reporting_manager_id": str(f.employee(f.dept)),
        "employee_number": "HACK" + uuid.uuid4().hex[:6].upper(),
    }[field]
    res = client.patch(f"{EMPLOYEES}/{emp}", headers=_headers(user), json={field: value})
    assert res.status_code == 403, res.text
    assert _row(emp) == before


def test_ac031_mixed_payload_is_refused_whole(me):
    user, emp, f = me
    before = _row(emp)
    res = client.patch(
        f"{EMPLOYEES}/{emp}",
        headers=_headers(user),
        json={"mobile_number": "999", "department_id": str(f.department())},
    )
    assert res.status_code == 403
    assert _row(emp) == before


def test_ac031_cannot_patch_another_employee(me):
    user, _emp, f = me
    other = f.employee(f.dept)
    before = _row(other)
    res = client.patch(f"{EMPLOYEES}/{other}", headers=_headers(user), json={"mobile_number": "1"})
    assert res.status_code == 403
    assert _row(other) == before


def test_ac031_refused_attempt_writes_no_audit(me, make_roled):  # noqa: F811
    user, emp, f = me
    admin = make_roled("SYSTEM_ADMIN")
    client.patch(
        f"{EMPLOYEES}/{emp}", headers=_headers(user), json={"department_id": str(f.department())}
    )
    items = client.get(AUDIT, headers=_headers(admin), params={"entity_id": str(emp)}).json()[
        "items"
    ]
    assert items == []


def test_ac031_unauthenticated_patch_is_401(me):
    _user, emp, _f = me
    assert client.patch(f"{EMPLOYEES}/{emp}", json={"mobile_number": "1"}).status_code == 401
