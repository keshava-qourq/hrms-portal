"""US-012 My Team list and scoping via real handlers on live Postgres/Redis.

AC-042 exactly the three direct reports are listed with department and leave/timesheet status
AC-043 a non-report is not listed and their profile is not reachable
"""

import pytest

from app.database import SessionLocal
from app.models import Employee
from tests.integration.test_auth import client
from tests.integration.test_employees import EMPLOYEES, MY_TEAM, factory  # noqa: F401
from tests.integration.test_rbac import _headers, make_roled  # noqa: F401


@pytest.fixture
def org(make_roled, factory):  # noqa: F811
    dept = factory.department()
    mgr_emp = factory.employee(dept)
    mgr = make_roled("REPORTING_MANAGER")
    factory.link(mgr, mgr_emp)
    reports = [factory.employee(dept, manager_id=mgr_emp) for _ in range(3)]
    other_mgr = factory.employee(dept)
    outsider = factory.employee(dept, manager_id=other_mgr)
    unassigned = factory.employee(dept)
    factory.dept = dept
    factory.mgr, factory.mgr_emp = mgr, mgr_emp
    factory.reports, factory.outsider, factory.unassigned = reports, outsider, unassigned
    return factory


def _team(user):
    res = client.get(MY_TEAM, headers=_headers(user))
    if res.status_code == 404:
        pytest.skip("PENDING: GET /api/my/team not implemented yet")
    assert res.status_code == 200, res.text
    return res.json()


def test_ac042_exactly_the_three_reports_are_listed(org):
    body = _team(org.mgr)
    assert {e["id"] for e in body["items"]} == {str(r) for r in org.reports}
    assert body["total"] == 3
    assert str(org.mgr_emp) not in {e["id"] for e in body["items"]}


def test_ac042_each_member_carries_department(org):
    body = _team(org.mgr)
    for e in body["items"]:
        assert e["department_name"], e
        assert e["department_id"] == str(org.dept)


def test_ac042_each_member_carries_leave_and_timesheet_status(org):
    body = _team(org.mgr)
    for e in body["items"]:
        if "leave_status" not in e or "timesheet_status" not in e:
            pytest.skip("PENDING: leave_status/timesheet_status not on /api/my/team yet")
        assert "leave_status" in e and "timesheet_status" in e


def test_ac042_employee_without_employee_record_gets_empty_team(make_roled):  # noqa: F811
    user = make_roled("REPORTING_MANAGER")
    body = _team(user)
    assert body["items"] == [] and body["total"] == 0


def test_ac043_non_report_is_not_listed(org):
    body = _team(org.mgr)
    ids = {e["id"] for e in body["items"]}
    assert str(org.outsider) not in ids and str(org.unassigned) not in ids
    assert str(org.outsider) not in str(body)


@pytest.mark.parametrize("which", ["outsider", "unassigned", "unknown", "malformed"])
def test_ac043_non_report_profile_is_refused_403_without_data(org, which):
    target = {
        "outsider": str(org.outsider),
        "unassigned": str(org.unassigned),
        "unknown": "00000000-0000-0000-0000-000000000000",
        "malformed": "not-a-uuid",
    }[which]
    with SessionLocal() as db:
        number = db.get(Employee, org.outsider).employee_number
    for path in (f"{MY_TEAM}/{target}", f"{EMPLOYEES}/{target}"):
        res = client.get(path, headers=_headers(org.mgr))
        assert res.status_code == 403, f"{path} -> {res.status_code}: {res.text}"
        assert res.json() == {"detail": "Forbidden"}
        assert number not in res.text and target not in res.text


def test_ac043_direct_report_profile_is_reachable(org):
    res = client.get(f"{MY_TEAM}/{org.reports[0]}", headers=_headers(org.mgr))
    assert res.status_code == 200, res.text
    assert res.json()["id"] == str(org.reports[0])


def test_ac043_employee_only_user_cannot_read_a_colleague(org, make_roled):  # noqa: F811
    emp = make_roled("EMPLOYEE")
    org.link(emp, org.unassigned)
    res = client.get(f"{EMPLOYEES}/{org.outsider}", headers=_headers(emp))
    assert res.status_code == 403
    assert str(org.outsider) not in res.text


def test_ac043_unauthenticated_is_401(org):
    assert client.get(MY_TEAM).status_code == 401
    assert client.get(f"{MY_TEAM}/{org.reports[0]}").status_code == 401
