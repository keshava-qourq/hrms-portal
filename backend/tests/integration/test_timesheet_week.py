"""US-016 logging hours and the weekly timesheet, via real handlers on live Postgres/Redis.

AC-052 PUT stores hours in a draft timesheet, GET returns them
AC-053 pickable only for active, actively-assigned projects; hours survive unassignment
AC-054 daily maximum 24h -> 422 naming it, nothing saved; exactly 24 accepted
AC-055 negative / non-numeric hours -> 422 with field in loc, nothing saved
AC-046 closing a project removes it from the picker but keeps its hours
NFR-004 unassigned project -> 403; own week only
"""

import uuid
from datetime import date

import pytest
from sqlalchemy import text

from app.database import SessionLocal
from tests.integration.test_auth import client
from tests.integration.test_employees import factory  # noqa: F401
from tests.integration.test_rbac import _headers, make_roled  # noqa: F401

WEEK = "2026-03-02"  # a Monday
MON, TUE = "2026-03-02", "2026-03-03"


def _url(week=WEEK):
    return f"/api/timesheets/week/{week}"


@pytest.fixture
def ts(make_roled, factory):  # noqa: F811
    dept = factory.department()
    pm_emp = factory.employee(dept)
    emp = factory.employee(dept)
    user = make_roled("EMPLOYEE")
    factory.link(user, emp)
    other_emp = factory.employee(dept)
    other = make_roled("EMPLOYEE")
    factory.link(other, other_emp)
    projects: list[uuid.UUID] = []

    def project(status="active", assign=True, who=None):
        pid = uuid.uuid4()
        with SessionLocal() as db:
            db.execute(
                text(
                    "INSERT INTO projects (id, code, name, project_manager_id, start_date, status)"
                    " VALUES (:i, :c, :n, :pm, :s, :st)"
                ),
                {
                    "i": pid,
                    "c": "P" + uuid.uuid4().hex[:8].upper(),
                    "n": "Proj " + uuid.uuid4().hex[:6],
                    "pm": pm_emp,
                    "s": date(2024, 1, 1),
                    "st": status,
                },
            )
            if assign:
                db.execute(
                    text(
                        "INSERT INTO project_assignments (id, project_id, employee_id,"
                        " assigned_on, is_active) VALUES (:i, :p, :e, :d, true)"
                    ),
                    {"i": uuid.uuid4(), "p": pid, "e": who or emp, "d": date(2024, 1, 1)},
                )
            db.commit()
        projects.append(pid)
        return pid

    class T:
        pass

    t = T()
    t.user, t.emp, t.other, t.other_emp = user, emp, other, other_emp
    t.project = project
    t.h = _headers(user)

    def sql(stmt, **p):
        with SessionLocal() as db:
            db.execute(text(stmt), p)
            db.commit()

    t.sql = sql

    def put(entries, week=WEEK, headers=None):
        body = {
            "entries": [{"project_id": str(p), "work_date": d, "hours": h} for p, d, h in entries]
        }
        return client.put(_url(week) + "/entries", headers=headers or t.h, json=body)

    t.put = put
    t.get = lambda week=WEEK, headers=None: client.get(_url(week), headers=headers or t.h)

    def count(employee=None):
        with SessionLocal() as db:
            return db.execute(
                text(
                    "SELECT count(*) FROM timesheet_entries e JOIN timesheets t"
                    " ON t.id = e.timesheet_id WHERE t.employee_id = :e"
                ),
                {"e": employee or emp},
            ).scalar()

    t.count = count
    yield t
    ids = [emp, other_emp]
    with SessionLocal() as db:
        db.execute(
            text(
                "DELETE FROM timesheet_entries WHERE timesheet_id IN"
                " (SELECT id FROM timesheets WHERE employee_id = ANY(:ids))"
            ),
            {"ids": ids},
        )
        db.execute(text("DELETE FROM timesheets WHERE employee_id = ANY(:ids)"), {"ids": ids})
        if projects:
            db.execute(
                text("DELETE FROM project_assignments WHERE project_id = ANY(:p)"), {"p": projects}
            )
            db.execute(text("DELETE FROM projects WHERE id = ANY(:p)"), {"p": projects})
        db.commit()
    factory.track(pm_emp)


def _hours(body, pid, day):
    return [
        e["hours"] for e in body["entries"] if e["project_id"] == str(pid) and e["work_date"] == day
    ]


def _proj(body, pid):
    return next(p for p in body["projects"] if p["id"] == str(pid))


# ---------------------------------------------------------------- AC-052


def test_ac052_put_stores_in_draft_and_get_returns_it(ts):
    a = ts.project()
    res = ts.put([(a, MON, 7.5)])
    assert res.status_code == 200, res.text
    got = ts.get()
    assert got.status_code == 200, got.text
    body = got.json()
    assert body["status"] == "draft"
    assert _hours(body, a, MON) == [7.5]
    assert body["totals"]["week"] == 7.5
    with SessionLocal() as db:
        st = db.execute(
            text("SELECT status FROM timesheets WHERE employee_id = :e AND week_start_date = :w"),
            {"e": ts.emp, "w": WEEK},
        ).scalar()
    assert st == "draft"


# ---------------------------------------------------------------- AC-053


def test_ac053_pickable_only_for_active_assigned_projects(ts):
    ok = ts.project()
    closed = ts.project(status="closed")
    unassigned = ts.project(assign=False)
    body = ts.get().json()
    assert _proj(body, ok)["pickable"] is True
    ids = {p["id"] for p in body["projects"]}
    for pid in (closed, unassigned):
        # never offered: either absent or flagged not pickable
        assert str(pid) not in ids or _proj(body, pid)["pickable"] is False


def test_ac053_unassignment_removes_pickable_but_keeps_hours(ts):
    a = ts.project()
    assert ts.put([(a, MON, 4)]).status_code == 200
    ts.sql("UPDATE project_assignments SET is_active = false WHERE project_id = :p", p=a)
    body = ts.get().json()
    assert _proj(body, a)["pickable"] is False
    assert _hours(body, a, MON) == [4.0]


# ---------------------------------------------------------------- AC-054


def test_ac054_over_24_is_422_naming_daily_maximum_and_nothing_saved(ts):
    a, b = ts.project(), ts.project()
    assert ts.put([(a, MON, 8)]).status_code == 200
    res = ts.put([(b, MON, 16.5)])
    assert res.status_code == 422, res.text
    assert "daily maximum" in res.text.lower()
    body = ts.get().json()
    assert _hours(body, b, MON) == []
    assert _hours(body, a, MON) == [8.0]
    assert ts.count() == 1


def test_ac054_exactly_24_is_accepted(ts):
    a, b = ts.project(), ts.project()
    assert ts.put([(a, MON, 8)]).status_code == 200
    res = ts.put([(b, MON, 16)])
    assert res.status_code == 200, res.text
    assert res.json()["totals"]["by_day"][MON] == 24.0


def test_ac054_single_cell_over_24_is_422(ts):
    a = ts.project()
    res = ts.put([(a, MON, 24.01)])
    assert res.status_code == 422, res.text
    assert ts.count() == 0


# ---------------------------------------------------------------- AC-055


@pytest.mark.parametrize("bad", [-1, -0.5, "abc", "", None])
def test_ac055_negative_or_non_numeric_hours_422_with_field_and_not_saved(ts, bad):
    a = ts.project()
    res = ts.put([(a, MON, bad)])
    assert res.status_code == 422, res.text
    locs = [d["loc"] for d in res.json()["detail"]]
    assert any("hours" in loc for loc in locs), locs
    assert ts.count() == 0


def test_ac055_bad_row_blocks_whole_payload(ts):
    a = ts.project()
    res = ts.put([(a, MON, 3), (a, TUE, -2)])
    assert res.status_code == 422
    assert ts.count() == 0


# ---------------------------------------------------------------- AC-046


def test_ac046_closing_project_unpicks_it_but_keeps_hours(ts):
    a = ts.project()
    assert ts.put([(a, MON, 6)]).status_code == 200
    ts.sql("UPDATE projects SET status = 'closed' WHERE id = :p", p=a)
    body = ts.get().json()
    assert _proj(body, a)["pickable"] is False
    assert _hours(body, a, MON) == [6.0]


@pytest.mark.parametrize("state", ["submitted", "approved"])
def test_ac046_closed_project_hours_returned_on_locked_week(ts, state):
    a = ts.project()
    assert ts.put([(a, MON, 5)]).status_code == 200
    ts.sql(
        "UPDATE timesheets SET status = :s WHERE employee_id = :e AND week_start_date = :w",
        s=state,
        e=ts.emp,
        w=WEEK,
    )
    ts.sql("UPDATE projects SET status = 'closed' WHERE id = :p", p=a)
    body = ts.get().json()
    assert body["status"] == state
    assert _proj(body, a)["pickable"] is False
    assert _hours(body, a, MON) == [5.0]


# ---------------------------------------------------------------- NFR-004


def test_nfr004_put_unassigned_project_is_403_and_not_saved(ts):
    un = ts.project(assign=False)
    res = ts.put([(un, MON, 2)])
    assert res.status_code == 403, res.text
    assert ts.count() == 0


def test_nfr004_employee_reads_only_own_week(ts):
    a = ts.project()
    mine = ts.put([(a, MON, 3)])
    assert mine.status_code == 200
    other_h = _headers(ts.other)
    body = ts.get(headers=other_h).json()
    assert body["entries"] == [] and body["totals"]["week"] == 0
    assert str(a) not in {p["id"] for p in body["projects"]}


def test_nfr004_other_employee_cannot_write_into_my_week(ts):
    a = ts.project()  # assigned to ts.emp only
    res = ts.put([(a, MON, 3)], headers=_headers(ts.other))
    assert res.status_code == 403, res.text
    assert ts.count(ts.other_emp) == 0


def test_nfr004_unauthenticated_is_401():
    assert client.get(_url()).status_code == 401
    assert client.put(_url() + "/entries", json={"entries": []}).status_code == 401
