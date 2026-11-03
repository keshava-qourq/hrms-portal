"""US-009 employee records: CRUD, mandatory-field validation, the manager's team
view and the before/after edit audit, via real handlers on live Postgres.

Authored from the contract (GET/POST/PATCH /api/employees, GET /api/my/team) and
the acceptance criteria. Tests whose prerequisite endpoint is absent skip as
PENDING rather than fail.

Covered:
  AC-032  create persists and is then listed
  AC-033  a missing mandatory field is a 422 naming that field
  AC-034  changing the reporting manager moves the employee between team lists
  AC-035  an edit records the field, its old and new value, the actor and a timestamp
"""

import uuid
from datetime import date

import pytest
from sqlalchemy import text

from app.database import SessionLocal
from app.models import Employee, User
from tests.integration.test_auth import client
from tests.integration.test_rbac import _headers, make_roled  # noqa: F401

EMPLOYEES = "/api/employees"
DEPARTMENTS = "/api/departments"
MY_TEAM = "/api/my/team"
AUDIT = "/api/admin/audit-logs"

MANDATORY = [
    "employee_number",
    "full_name",
    "work_email",
    "department_id",
    "reporting_manager_id",
    "start_date",
]


@pytest.fixture
def factory():
    """Insert departments and employee rows directly, and link a user to an
    employee record, cleaning every row up afterwards."""
    dept_ids: list[uuid.UUID] = []
    emp_ids: list[uuid.UUID] = []

    def department() -> uuid.UUID:
        with SessionLocal() as db:
            did = uuid.uuid4()
            db.execute(
                text("INSERT INTO departments (id, name) VALUES (:i, :n)"),
                {"i": did, "n": "Dept-" + uuid.uuid4().hex[:8]},
            )
            db.commit()
        dept_ids.append(did)
        return did

    def employee(department_id: uuid.UUID, manager_id: uuid.UUID | None = None) -> uuid.UUID:
        with SessionLocal() as db:
            emp = Employee(
                employee_number="E" + uuid.uuid4().hex[:8].upper(),
                full_name="Person " + uuid.uuid4().hex[:6],
                work_email=f"{uuid.uuid4().hex[:10]}@example.com",
                department_id=department_id,
                reporting_manager_id=manager_id,
                start_date=date(2024, 1, 1),
                is_active=True,
                is_erased=False,
            )
            db.add(emp)
            db.commit()
            eid = emp.id
        emp_ids.append(eid)
        return eid

    def link(user: User, employee_id: uuid.UUID) -> None:
        with SessionLocal() as db:
            db.execute(
                text("UPDATE users SET employee_id = :e WHERE id = :u"),
                {"e": employee_id, "u": user.id},
            )
            db.commit()

    class F:
        pass

    f = F()
    f.department = department
    f.employee = employee
    f.link = link
    f.track = emp_ids.append
    yield f

    with SessionLocal() as db:
        if emp_ids:
            db.execute(
                text("UPDATE employees SET reporting_manager_id = NULL WHERE id = ANY(:ids)"),
                {"ids": emp_ids},
            )
            db.execute(text("DELETE FROM employees WHERE id = ANY(:ids)"), {"ids": emp_ids})
        for did in dept_ids:
            db.execute(text("DELETE FROM departments WHERE id = :i"), {"i": did})
        db.commit()


def _full_payload(dept_id, manager_id):
    return {
        "employee_number": "N" + uuid.uuid4().hex[:8].upper(),
        "full_name": "New Hire " + uuid.uuid4().hex[:6],
        "work_email": f"{uuid.uuid4().hex[:10]}@example.com",
        "department_id": str(dept_id),
        "reporting_manager_id": str(manager_id),
        "start_date": "2026-02-01",
    }


def _create(hr, payload):
    res = client.post(EMPLOYEES, headers=_headers(hr), json=payload)
    if res.status_code == 404:
        pytest.skip("PENDING: POST /api/employees not implemented yet")
    return res


# ---------------------------------------------------------------- AC-032


def test_ac032_create_persists_and_is_listed(make_roled, factory):  # noqa: F811
    hr = make_roled("HR_ADMIN")
    dept = factory.department()
    manager = factory.employee(dept)
    payload = _full_payload(dept, manager)

    res = _create(hr, payload)
    assert res.status_code in (200, 201), res.text
    body = res.json()
    factory.track(uuid.UUID(body["id"]))
    assert body["employee_number"] == payload["employee_number"]
    assert body["full_name"] == payload["full_name"]
    assert body["work_email"] == payload["work_email"].lower()
    assert body["department_id"] == str(dept)
    assert body["reporting_manager_id"] == str(manager)
    assert body["is_active"] is True

    # Persisted on the row.
    with SessionLocal() as db:
        row = db.get(Employee, uuid.UUID(body["id"]))
        assert row is not None and row.employee_number == payload["employee_number"]

    # And then offered by the directory list the Employees tab reads.
    listing = client.get(EMPLOYEES, headers=_headers(hr), params={"limit": 200})
    assert listing.status_code == 200, listing.text
    numbers = [e["employee_number"] for e in listing.json()["items"]]
    assert payload["employee_number"] in numbers


# ---------------------------------------------------------------- AC-033


@pytest.mark.parametrize("missing", MANDATORY)
def test_ac033_missing_mandatory_field_is_422_naming_it(make_roled, factory, missing):  # noqa: F811
    hr = make_roled("HR_ADMIN")
    dept = factory.department()
    manager = factory.employee(dept)
    payload = _full_payload(dept, manager)
    payload.pop(missing)

    res = client.post(EMPLOYEES, headers=_headers(hr), json=payload)
    if res.status_code == 404:
        pytest.skip("PENDING: POST /api/employees not implemented yet")
    assert res.status_code == 422, res.text
    # The 422 body must name the field that was left out.
    assert missing in res.text, res.text
    # Nothing was written for the omitted-field attempt.
    if "employee_number" in payload:
        with SessionLocal() as db:
            n = db.execute(
                text("SELECT count(*) FROM employees WHERE employee_number = :e"),
                {"e": payload["employee_number"]},
            ).scalar()
        assert n == 0


# ---------------------------------------------------------------- AC-034


def _team_numbers(user):
    res = client.get(MY_TEAM, headers=_headers(user))
    if res.status_code == 404:
        pytest.skip("PENDING: GET /api/my/team not implemented yet")
    assert res.status_code == 200, res.text
    return {e["employee_number"] for e in res.json()["items"]}


def test_ac034_manager_change_moves_employee_between_team_lists(make_roled, factory):  # noqa: F811
    hr = make_roled("HR_ADMIN")
    dept = factory.department()

    # Two managers, each an employee record linked to a signing-in user account.
    mgr_a_emp = factory.employee(dept)
    mgr_b_emp = factory.employee(dept)
    user_a = make_roled("REPORTING_MANAGER")
    user_b = make_roled("REPORTING_MANAGER")
    factory.link(user_a, mgr_a_emp)
    factory.link(user_b, mgr_b_emp)

    # A report that starts under manager A.
    created = _create(hr, _full_payload(dept, mgr_a_emp))
    assert created.status_code in (200, 201), created.text
    report = created.json()
    report_id = report["id"]
    number = report["employee_number"]
    factory.track(uuid.UUID(report_id))

    assert number in _team_numbers(user_a)
    assert number not in _team_numbers(user_b)

    # Move the report to manager B.
    moved = client.patch(
        f"{EMPLOYEES}/{report_id}",
        headers=_headers(hr),
        json={"reporting_manager_id": str(mgr_b_emp)},
    )
    assert moved.status_code == 200, moved.text
    assert moved.json()["reporting_manager_id"] == str(mgr_b_emp)

    # The directory moved it across the two team lists.
    assert number not in _team_numbers(user_a)
    assert number in _team_numbers(user_b)


# ---------------------------------------------------------------- AC-035


def _audit_items(admin, entity_id):
    res = client.get(AUDIT, headers=_headers(admin), params={"entity_id": str(entity_id)})
    if res.status_code == 404:
        pytest.skip("PENDING: GET /api/admin/audit-logs not implemented yet")
    assert res.status_code == 200, res.text
    return res.json()["items"]


def test_ac035_edit_records_field_old_new_actor_timestamp(make_roled, factory):  # noqa: F811
    hr = make_roled("HR_ADMIN")
    admin = make_roled("SYSTEM_ADMIN")
    dept_before = factory.department()
    dept_after = factory.department()
    manager = factory.employee(dept_before)

    created = _create(hr, _full_payload(dept_before, manager))
    assert created.status_code in (200, 201), created.text
    employee_id = created.json()["id"]
    factory.track(uuid.UUID(employee_id))

    before_items = _audit_items(admin, employee_id)

    edit = client.patch(
        f"{EMPLOYEES}/{employee_id}",
        headers=_headers(hr),
        json={"department_id": str(dept_after)},
    )
    assert edit.status_code == 200, edit.text

    items = _audit_items(admin, employee_id)
    assert len(items) == len(before_items) + 1, "edit produced no additional audit entry"
    entry = items[0]
    # The changed field, with its old and its new value.
    assert entry["before_values"].get("department_id") == str(dept_before)
    assert entry["after_values"].get("department_id") == str(dept_after)
    # Only the field that changed is recorded.
    assert "work_email" not in (entry["after_values"] or {})
    # The actor who made the change, and when.
    assert entry["actor"] == hr.email
    assert entry["created_at"]
    assert "employee" in entry["entity_type"]
    assert str(entry["entity_id"]) == str(employee_id)
    # Never a password anywhere in the entry.
    assert "password" not in str(entry).lower()


def test_ac035_unchanged_edit_records_nothing(make_roled, factory):  # noqa: F811
    hr = make_roled("HR_ADMIN")
    admin = make_roled("SYSTEM_ADMIN")
    dept = factory.department()
    manager = factory.employee(dept)
    created = _create(hr, _full_payload(dept, manager))
    assert created.status_code in (200, 201), created.text
    employee_id = created.json()["id"]
    factory.track(uuid.UUID(employee_id))

    before = len(_audit_items(admin, employee_id))
    # Re-set the department to the value it already has: no change, no entry.
    same = client.patch(
        f"{EMPLOYEES}/{employee_id}",
        headers=_headers(hr),
        json={"department_id": str(dept)},
    )
    assert same.status_code == 200, same.text
    assert len(_audit_items(admin, employee_id)) == before


def test_authz_non_hr_admin_cannot_create_employee(make_roled, factory):  # noqa: F811
    make_roled("HR_ADMIN")
    dept = factory.department()
    manager = factory.employee(dept)
    payload = _full_payload(dept, manager)
    for role in ("EMPLOYEE", "REPORTING_MANAGER", "PROJECT_MANAGER"):
        actor = make_roled(role)
        res = client.post(EMPLOYEES, headers=_headers(actor), json=payload)
        if res.status_code == 404:
            pytest.skip("PENDING: POST /api/employees not implemented yet")
        assert res.status_code == 403, res.text
    with SessionLocal() as db:
        n = db.execute(
            text("SELECT count(*) FROM employees WHERE employee_number = :e"),
            {"e": payload["employee_number"]},
        ).scalar()
    assert n == 0


def test_authz_unauthenticated_create_is_401():
    res = client.post(EMPLOYEES, json={})
    if res.status_code == 404:
        pytest.skip("PENDING: POST /api/employees not implemented yet")
    assert res.status_code == 401
