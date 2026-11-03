"""US-004-3 relationship scoping: team, project, own-record and HR-admin reach,
exercised through the real handlers on live Postgres and Redis.

Authored from the contract (GET /api/my/team, GET /api/my/projects,
GET /api/timesheets) and the acceptance criteria. The project-timesheet and
own-record endpoints are not built yet; the tests that need them probe the real
route and skip as PENDING (not FAIL) rather than assert against a 404, exactly
as the concurrent-build rule requires. The team-scoping and HR-admin reach
criteria are verifiable now and are asserted.

Covered:
  AC-013  manager's team list is only the direct reports; a foreign employee
          id is refused 403 with no record data
  AC-014  a PM assigned to Project A sees only Project A hours; Project B absent
  AC-015  an employee-only user is refused 403 with no data for a timesheet,
          attendance or leave record that is not their own
  AC-016  HR Admin reaches every employee but is refused 403 on the
          users / roles / settings endpoints
"""

import uuid
from datetime import date

import pytest
from sqlalchemy import text

from app.database import SessionLocal
from app.models import Employee, User
from tests.integration.test_auth import client
from tests.integration.test_rbac import _headers, make_roled  # noqa: F401

MY_TEAM = "/api/my/team"
MY_PROJECTS = "/api/my/projects"
TIMESHEETS = "/api/timesheets"
EMPLOYEES = "/api/employees"
ADMIN_USERS = "/api/admin/users"


@pytest.fixture
def world():
    """Insert departments and employee rows directly and link a user account to
    an employee record, cleaning every row up afterwards."""
    dept_ids: list[uuid.UUID] = []
    emp_ids: list[uuid.UUID] = []

    def department() -> uuid.UUID:
        did = uuid.uuid4()
        with SessionLocal() as db:
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

    class W:
        pass

    w = W()
    w.department = department
    w.employee = employee
    w.link = link
    yield w

    with SessionLocal() as db:
        if emp_ids:
            db.execute(
                text("UPDATE employees SET reporting_manager_id = NULL WHERE id = ANY(:ids)"),
                {"ids": emp_ids},
            )
            db.execute(
                text("UPDATE users SET employee_id = NULL WHERE employee_id = ANY(:ids)"),
                {"ids": emp_ids},
            )
            db.execute(text("DELETE FROM employees WHERE id = ANY(:ids)"), {"ids": emp_ids})
        for did in dept_ids:
            db.execute(text("DELETE FROM departments WHERE id = :i"), {"i": did})
        db.commit()


def _team(user):
    res = client.get(MY_TEAM, headers=_headers(user))
    if res.status_code == 404:
        pytest.skip("PENDING: GET /api/my/team not implemented yet")
    assert res.status_code == 200, res.text
    return res.json()


# ---------------------------------------------------------------- AC-013


def test_ac013_team_list_is_only_the_managers_direct_reports(make_roled, world):  # noqa: F811
    dept = world.department()

    mgr_a_emp = world.employee(dept)
    mgr_b_emp = world.employee(dept)
    mgr_a = make_roled("REPORTING_MANAGER")
    mgr_b = make_roled("REPORTING_MANAGER")
    world.link(mgr_a, mgr_a_emp)
    world.link(mgr_b, mgr_b_emp)

    # Two reports under A, one under B.
    a1 = world.employee(dept, manager_id=mgr_a_emp)
    a2 = world.employee(dept, manager_id=mgr_a_emp)
    b1 = world.employee(dept, manager_id=mgr_b_emp)

    body = _team(mgr_a)
    ids = {e["id"] for e in body["items"]}
    assert ids == {str(a1), str(a2)}, "team list must be exactly the direct reports"
    assert str(b1) not in ids, "another manager's report must be absent"
    assert body["total"] == 2
    # No leakage of the foreign report anywhere in the payload.
    assert str(b1) not in body_text(body)


def test_ac013_manager_with_no_reports_gets_empty_team(make_roled, world):  # noqa: F811
    dept = world.department()
    mgr_emp = world.employee(dept)
    mgr = make_roled("REPORTING_MANAGER")
    world.link(mgr, mgr_emp)
    body = _team(mgr)
    assert body["items"] == [] and body["total"] == 0


def test_ac013_foreign_employee_id_is_refused_403_with_no_data(make_roled, world):  # noqa: F811
    """A manager reaching an employee record that is not one of their reports is
    refused 403 and the record's data never appears in the response."""
    dept = world.department()
    mgr_emp = world.employee(dept)
    mgr = make_roled("REPORTING_MANAGER")
    world.link(mgr, mgr_emp)

    # A foreign employee: belongs to nobody's team that this manager owns.
    foreign = world.employee(dept)
    with SessionLocal() as db:
        number = db.get(Employee, foreign).employee_number

    # The contract exposes team through /api/my/team; a per-employee read is
    # expected to be scoped to the relationship. Probe the candidate routes and
    # skip PENDING only if none of them exists yet.
    candidates = [
        f"{MY_TEAM}/{foreign}",
        f"/api/my/team/{foreign}",
        f"{EMPLOYEES}/{foreign}",
    ]
    seen = False
    for path in candidates:
        res = client.get(path, headers=_headers(mgr))
        if res.status_code == 404 and "not found" not in res.text.lower():
            continue  # route itself absent
        seen = True
        assert res.status_code == 403, f"{path} -> {res.status_code}: {res.text}"
        assert res.json() == {"detail": "Forbidden"}
        assert number not in res.text and str(foreign) not in res.text
    if not seen:
        pytest.skip("PENDING: no per-employee relationship-scoped read endpoint yet")


# ---------------------------------------------------------------- AC-014


def _projects(user):
    res = client.get(MY_PROJECTS, headers=_headers(user))
    if res.status_code == 404:
        pytest.skip("PENDING: GET /api/my/projects not implemented yet")
    assert res.status_code == 200, res.text
    return res.json()


def _hours(user, **params):
    res = client.get(TIMESHEETS, headers=_headers(user), params=params)
    if res.status_code == 404:
        pytest.skip("PENDING: GET /api/timesheets not implemented yet")
    return res


def test_ac014_pm_sees_only_assigned_project_hours(make_roled, world):  # noqa: F811
    """A PM assigned to Project A sees Project A hours; Project B is absent.

    Projects, assignments and timesheet hours are not in the schema yet, so the
    supporting fixtures cannot be built through the API. This probes the real
    endpoints and skips PENDING until they and their data exist."""
    pm = make_roled("PROJECT_MANAGER")

    projects = _projects(pm)  # skips if /api/my/projects absent
    items = projects.get("items") if isinstance(projects, dict) else projects
    if not items:
        pytest.skip("PENDING: no project assignment can be created through the API yet")

    # The PM's own project set, taken as the source of truth for scoping.
    assigned_ids = {str(p["id"]) for p in items}
    res = _hours(pm)
    assert res.status_code == 200, res.text
    hours = res.json()
    rows = hours.get("items") if isinstance(hours, dict) else hours
    if not rows:
        pytest.skip("PENDING: no timesheet hours exist to scope yet")
    seen_projects = {str(r.get("project_id")) for r in rows if r.get("project_id") is not None}
    assert seen_projects <= assigned_ids, "PM saw hours for a project they are not assigned to"


def test_ac014_pm_filtering_an_unassigned_project_is_refused_or_empty(make_roled, world):  # noqa: F811
    pm = make_roled("PROJECT_MANAGER")
    projects = _projects(pm)
    items = projects.get("items") if isinstance(projects, dict) else projects
    assigned = {str(p["id"]) for p in (items or [])}

    foreign_project = str(uuid.uuid4())
    assert foreign_project not in assigned
    res = _hours(pm, project_id=foreign_project)
    # Either refused with no data, or an empty, scoped list; never another
    # project's hours.
    assert res.status_code in (200, 403), res.text
    if res.status_code == 403:
        assert res.json() == {"detail": "Forbidden"}
    else:
        body = res.json()
        rows = body.get("items") if isinstance(body, dict) else body
        assert rows == [], "an unassigned project yielded hours"


# ---------------------------------------------------------------- AC-015


OWN_RECORD_AREAS = [
    ("timesheet", TIMESHEETS),
    ("attendance", "/api/attendance"),
    ("leave", "/api/leave-requests"),
]


@pytest.mark.parametrize("area,base", OWN_RECORD_AREAS)
def test_ac015_employee_only_refused_403_for_non_own_record(make_roled, world, area, base):  # noqa: F811
    """An employee-only user reaching a record that is not their own is refused
    403 with no data, across timesheet, attendance and leave."""
    employee = make_roled("EMPLOYEE")
    other = make_roled("EMPLOYEE")
    dept = world.department()
    other_emp = world.employee(dept)
    world.link(other, other_emp)

    # Reach the other person's record by their id. The read-by-id shape is not
    # built yet; probe candidate routes and skip PENDING if none exists.
    candidates = [
        f"{base}/{other_emp}",
        f"{base}?employee_id={other_emp}",
    ]
    seen = False
    for path in candidates:
        res = client.get(path, headers=_headers(employee))
        if res.status_code == 404 and "not found" not in res.text.lower():
            continue
        seen = True
        assert res.status_code == 403, f"{path} -> {res.status_code}: {res.text}"
        assert res.json() == {"detail": "Forbidden"}
        assert str(other_emp) not in res.text
    if not seen:
        pytest.skip(f"PENDING: {area} read-by-id endpoint not implemented yet")


def test_ac015_employee_only_may_read_own_records(make_roled, world):  # noqa: F811
    """The companion case: the employee's own records are reachable (not 403)."""
    employee = make_roled("EMPLOYEE")
    dept = world.department()
    own = world.employee(dept)
    world.link(employee, own)

    res = client.get(TIMESHEETS, headers=_headers(employee))
    if res.status_code == 404:
        pytest.skip("PENDING: GET /api/timesheets not implemented yet")
    # Own-scope read must not be forbidden.
    assert res.status_code == 200, res.text


# ---------------------------------------------------------------- AC-016


def test_ac016_hr_admin_reaches_every_employee(make_roled, world):  # noqa: F811
    hr = make_roled("HR_ADMIN")
    dept = world.department()
    e1 = world.employee(dept)
    e2 = world.employee(dept)

    res = client.get(EMPLOYEES, headers=_headers(hr), params={"limit": 200})
    if res.status_code == 404:
        pytest.skip("PENDING: GET /api/employees not implemented yet")
    assert res.status_code == 200, res.text
    ids = {e["id"] for e in res.json()["items"]}
    # HR Admin's directory is org-wide, not relationship-scoped: both show up
    # even though neither reports to the HR Admin.
    assert {str(e1), str(e2)} <= ids


def test_ac016_hr_admin_refused_403_on_user_management(make_roled, world):  # noqa: F811
    hr = make_roled("HR_ADMIN")
    target = make_roled("EMPLOYEE")
    email = f"blocked-{uuid.uuid4().hex[:8]}@example.com"

    # users: create
    create = client.post(
        ADMIN_USERS, headers=_headers(hr), json={"email": email, "role_codes": ["EMPLOYEE"]}
    )
    assert create.status_code == 403, create.text
    assert create.json() == {"detail": "Forbidden"}
    assert email not in create.text
    with SessionLocal() as db:
        n = db.execute(
            text("SELECT count(*) FROM users WHERE lower(email) = :e"), {"e": email.lower()}
        ).scalar()
    assert n == 0, "HR Admin must not be able to create a user"

    # roles: reassign
    reassign = client.patch(
        f"{ADMIN_USERS}/{target.id}",
        headers=_headers(hr),
        json={"role_codes": ["SYSTEM_ADMIN"]},
    )
    assert reassign.status_code == 403, reassign.text
    assert reassign.json() == {"detail": "Forbidden"}
    with SessionLocal() as db:
        assert db.get(User, target.id).role_codes == ["EMPLOYEE"]


@pytest.mark.parametrize(
    "method,path,body",
    [
        ("get", "/api/admin/settings", None),
        ("patch", "/api/admin/settings", {"anything": True}),
        ("put", "/api/admin/settings", {"anything": True}),
    ],
)
def test_ac016_hr_admin_refused_403_on_settings(make_roled, method, path, body):  # noqa: F811
    hr = make_roled("HR_ADMIN")
    kwargs = {"headers": _headers(hr)}
    if body is not None:
        kwargs["json"] = body
    res = getattr(client, method)(path, **kwargs)
    if res.status_code == 404:
        pytest.skip("PENDING: settings endpoint not implemented yet")
    assert res.status_code == 403, res.text
    assert res.json() == {"detail": "Forbidden"}


def body_text(body) -> str:
    import json

    return json.dumps(body)
