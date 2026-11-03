// @ts-nocheck -- generated from the approved design under its JS runtime contract; not hand-written TypeScript.
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import * as UI from "@/lib/ui";
import { Icons } from "@/lib/icons";
import { brand } from "@/lib/brand";
import { formatDate, formatDateTime } from "@/lib/datetime";
import { apiFetch } from "@/lib/api";
import EmployeesTab from "@/screens/EmployeesTab";

// The API speaks role codes (SYSTEM_ADMIN); this screen's labels are the display names.
const ROLE_CODE_TO_NAME = {
  EMPLOYEE: "Employee",
  REPORTING_MANAGER: "Reporting Manager",
  HR_ADMIN: "HR Admin",
  PROJECT_MANAGER: "Project Manager",
  SYSTEM_ADMIN: "System Admin",
};
const ROLE_NAME_TO_CODE = Object.fromEntries(
  Object.entries(ROLE_CODE_TO_NAME).map(([code, name]) => [name, code]),
);
const rolesToNames = (codes) => (codes || []).map((c) => ROLE_CODE_TO_NAME[c] || c);
const rolesToCodes = (names) => (names || []).map((n) => ROLE_NAME_TO_CODE[n] || n);

// There is no list endpoint in the contract (POST/PATCH /api/admin/users only), so the
// table starts from the live-but-empty baseline and reflects the accounts created or
// changed in this session, each appended from the API's own response.
async function fetchAdminUsers() {
  return [];
}

// The linked-employee picker needs the employee directory. GET /api/employees is the
// documented source; a System Admin without HR Admin may be refused, in which case the
// picker is simply empty rather than broken.
async function fetchUserEmployees() {
  try {
    const data = await apiFetch("/api/employees");
    return (data.items || []).map((e) => ({
      id: e.id,
      name: e.full_name || e.name || e.work_email || "—",
      number: e.employee_number || e.number || "",
      status: e.status || "Active",
    }));
  } catch {
    return [];
  }
}

const { Button, Input, Textarea, Label, Select, Table, THead, TBody, TR, TH, TD, Empty } = UI;

const { Check, User, Users, Home, Clock, ArrowLeft, ArrowRight } = Icons;

const ME = {
  name: "Priya Raman",
  employeeId: 2,
  roles: ["Employee", "HR Admin", "Project Manager", "System Admin"],
};
const ALL_ROLES = ["Employee", "Reporting Manager", "HR Admin", "Project Manager", "System Admin"];
const TODAY = "2026-11-03";
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const TABS = [
  { key: "users", label: "Users & roles", wf: "i-1-0-0", need: "System Admin" },
  { key: "audit", label: "Audit log", wf: "i-1-0-1", need: "System Admin" },
  { key: "employees", label: "Employees", wf: "i-1-0-2", need: "HR Admin" },
  { key: "departments", label: "Departments", wf: "i-1-0-3", need: "HR Admin" },
  { key: "leavetypes", label: "Leave types", wf: "i-1-0-4", need: "HR Admin" },
  { key: "holidays", label: "Holidays", wf: "i-1-0-5", need: "HR Admin" },
  { key: "balances", label: "Leave balances", wf: "i-1-0-6", need: "HR Admin" },
  { key: "attendance", label: "Attendance", wf: "i-1-0-7", need: "HR Admin" },
  { key: "projects", label: "Projects", wf: "i-1-0-8", need: "Project Manager" },
];

const SEED_DEPTS = [
  { id: 1, name: "Engineering" },
  { id: 2, name: "Finance" },
  { id: 3, name: "People & Culture" },
  { id: 4, name: "Operations" },
  { id: 5, name: "Customer Success" },
  { id: 6, name: "Design" },
];
const SEED_EMPLOYEES = [
  {
    id: 1,
    number: "E-1000",
    name: "Helena Brandt",
    email: "helena.brandt@ashgrove.co",
    deptId: 4,
    mgrId: null,
    start: "2016-03-14",
    end: "",
    status: "Active",
  },
  {
    id: 2,
    number: "E-1001",
    name: "Priya Raman",
    email: "priya.raman@ashgrove.co",
    deptId: 3,
    mgrId: 1,
    start: "2019-06-03",
    end: "",
    status: "Active",
  },
  {
    id: 3,
    number: "E-1002",
    name: "Marcus Whitfield",
    email: "marcus.whitfield@ashgrove.co",
    deptId: 1,
    mgrId: 1,
    start: "2018-01-22",
    end: "",
    status: "Active",
  },
  {
    id: 4,
    number: "E-1003",
    name: "Anika Deshmukh",
    email: "anika.deshmukh@ashgrove.co",
    deptId: 1,
    mgrId: 3,
    start: "2021-09-06",
    end: "",
    status: "Active",
  },
  {
    id: 5,
    number: "E-1004",
    name: "Tomás Herrera",
    email: "tomas.herrera@ashgrove.co",
    deptId: 1,
    mgrId: 3,
    start: "2022-02-14",
    end: "",
    status: "Active",
  },
  {
    id: 6,
    number: "E-1005",
    name: "Grace Okonkwo",
    email: "grace.okonkwo@ashgrove.co",
    deptId: 2,
    mgrId: 1,
    start: "2020-04-27",
    end: "",
    status: "Active",
  },
  {
    id: 7,
    number: "E-1006",
    name: "Liam Fitzgerald",
    email: "liam.fitzgerald@ashgrove.co",
    deptId: 5,
    mgrId: 8,
    start: "2023-03-20",
    end: "",
    status: "Active",
  },
  {
    id: 8,
    number: "E-1007",
    name: "Sofia Marchetti",
    email: "sofia.marchetti@ashgrove.co",
    deptId: 5,
    mgrId: 1,
    start: "2019-11-11",
    end: "",
    status: "Active",
  },
  {
    id: 9,
    number: "E-1008",
    name: "Jun Watanabe",
    email: "jun.watanabe@ashgrove.co",
    deptId: 6,
    mgrId: 1,
    start: "2023-05-08",
    end: "",
    status: "Active",
  },
  {
    id: 10,
    number: "E-1009",
    name: "Beatrice Lang",
    email: "beatrice.lang@ashgrove.co",
    deptId: 2,
    mgrId: 6,
    start: "2024-01-15",
    end: "2026-10-30",
    status: "Leaver",
  },
  {
    id: 11,
    number: "E-1010",
    name: "Daniel Osei",
    email: "daniel.osei@ashgrove.co",
    deptId: 4,
    mgrId: 1,
    start: "2025-08-18",
    end: "",
    status: "Active",
  },
];
const SEED_USERS = [
  {
    id: 1,
    email: "priya.raman@ashgrove.co",
    empId: 2,
    roles: ["Employee", "HR Admin", "Project Manager", "System Admin"],
    active: true,
    lockedAt: null,
    failed: 0,
    last: "2026-11-03T08:41",
  },
  {
    id: 2,
    email: "helena.brandt@ashgrove.co",
    empId: 1,
    roles: ["Employee", "Reporting Manager"],
    active: true,
    lockedAt: null,
    failed: 0,
    last: "2026-11-02T17:12",
  },
  {
    id: 3,
    email: "marcus.whitfield@ashgrove.co",
    empId: 3,
    roles: ["Employee", "Reporting Manager", "Project Manager"],
    active: true,
    lockedAt: null,
    failed: 0,
    last: "2026-11-03T09:05",
  },
  {
    id: 4,
    email: "anika.deshmukh@ashgrove.co",
    empId: 4,
    roles: ["Employee"],
    active: true,
    lockedAt: null,
    failed: 0,
    last: "2026-11-03T08:58",
  },
  {
    id: 5,
    email: "tomas.herrera@ashgrove.co",
    empId: 5,
    roles: ["Employee"],
    active: true,
    lockedAt: "2026-10-29T11:30",
    failed: 5,
    last: "2026-10-29T09:14",
  },
  {
    id: 6,
    email: "grace.okonkwo@ashgrove.co",
    empId: 6,
    roles: ["Employee", "HR Admin"],
    active: true,
    lockedAt: null,
    failed: 0,
    last: "2026-11-02T16:40",
  },
  {
    id: 7,
    email: "sofia.marchetti@ashgrove.co",
    empId: 8,
    roles: ["Employee", "Reporting Manager"],
    active: true,
    lockedAt: null,
    failed: 0,
    last: "2026-11-03T08:30",
  },
  {
    id: 8,
    email: "beatrice.lang@ashgrove.co",
    empId: 10,
    roles: ["Employee"],
    active: false,
    lockedAt: null,
    failed: 0,
    last: "2026-10-30T17:30",
  },
  {
    id: 9,
    email: "jun.watanabe@ashgrove.co",
    empId: 9,
    roles: ["Employee"],
    active: true,
    lockedAt: null,
    failed: 0,
    last: null,
  },
];
const SEED_AUDIT = [
  {
    id: 9,
    ts: "2026-11-03T10:02",
    actor: "Marcus Whitfield",
    action: "Timesheet approved",
    record: "Timesheet · A. Deshmukh · w/c 26 Oct 2026",
    before: "status: Submitted",
    after: "status: Approved",
    reason: "Hours match the sprint log.",
  },
  {
    id: 8,
    ts: "2026-11-03T09:48",
    actor: "Priya Raman",
    action: "Attendance punch corrected",
    record: "Attendance · J. Watanabe · 02 Nov 2026",
    before: "clock_out_at: —",
    after: "clock_out_at: 17:30 (regularised)",
    reason: "Forgot to clock out; manager confirmed the time.",
  },
  {
    id: 7,
    ts: "2026-11-02T17:20",
    actor: "Helena Brandt",
    action: "Leave request rejected",
    record: "Leave · D. Osei · 23–24 Dec 2026",
    before: "status: Submitted",
    after: "status: Rejected",
    reason: "Year-end cover needed; please move to 29 Dec.",
  },
  {
    id: 6,
    ts: "2026-11-02T15:05",
    actor: "Priya Raman",
    action: "Employee record changed",
    record: "Employee · E-1006 L. Fitzgerald",
    before: "reporting_manager: Helena Brandt",
    after: "reporting_manager: Sofia Marchetti",
    reason: "Customer Success restructure.",
  },
  {
    id: 5,
    ts: "2026-10-30T17:46",
    actor: "Priya Raman",
    action: "Account deactivated",
    record: "User · beatrice.lang@ashgrove.co",
    before: "is_active: true",
    after: "is_active: false",
    reason: "Linked employee marked as leaver.",
  },
  {
    id: 4,
    ts: "2026-10-30T17:45",
    actor: "Priya Raman",
    action: "Employee marked as leaver",
    record: "Employee · E-1009 B. Lang",
    before: "status: Active; end_date: —",
    after: "status: Leaver; end_date: 30 Oct 2026",
    reason: "Resignation, last day 30 Oct.",
  },
  {
    id: 3,
    ts: "2026-10-29T11:30",
    actor: "System",
    action: "Account locked",
    record: "User · tomas.herrera@ashgrove.co",
    before: "failed_login_count: 4",
    after: "failed_login_count: 5; locked_at: 29 Oct 2026 11:30",
    reason: "Five consecutive failed sign-ins.",
  },
  {
    id: 2,
    ts: "2026-10-28T14:10",
    actor: "Priya Raman",
    action: "Opening balance set",
    record: "Leave balance · G. Okonkwo · Annual 2026",
    before: "entitlement_days: 20",
    after: "entitlement_days: 22",
    reason: "Length-of-service uplift.",
  },
  {
    id: 1,
    ts: "2026-10-27T09:15",
    actor: "Priya Raman",
    action: "Password reset issued",
    record: "User · jun.watanabe@ashgrove.co",
    before: "must_change_password: false",
    after: "password_hash replaced; must_change_password: true",
    reason: "New starter hand-off.",
  },
];
const SEED_LEAVE_TYPES = [
  { id: 1, name: "Annual", days: 20, unpaid: false, active: true },
  { id: 2, name: "Sick", days: 10, unpaid: false, active: true },
  { id: 3, name: "Unpaid", days: 0, unpaid: true, active: true },
  { id: 4, name: "Compassionate", days: 5, unpaid: false, active: true },
  { id: 5, name: "Study", days: 3, unpaid: false, active: false },
];
const SEED_BALANCES = { "6|1|2026": 22, "4|1|2026": 20, "5|2|2026": 10 };
const HOLIDAYS = [
  { date: "2026-01-01", name: "New Year's Day", year: 2026 },
  { date: "2026-04-03", name: "Good Friday", year: 2026 },
  { date: "2026-04-06", name: "Easter Monday", year: 2026 },
  { date: "2026-05-04", name: "Early May Bank Holiday", year: 2026 },
  { date: "2026-05-25", name: "Spring Bank Holiday", year: 2026 },
  { date: "2026-08-31", name: "Summer Bank Holiday", year: 2026 },
  { date: "2026-12-25", name: "Christmas Day", year: 2026 },
  { date: "2026-12-28", name: "Boxing Day (substitute)", year: 2026 },
  { date: "2027-01-01", name: "New Year's Day", year: 2027 },
];
const SEED_ATT = [
  { id: 1, empId: 4, date: "2026-11-03", inT: "08:52", out: null, reg: false, reason: "" },
  { id: 2, empId: 5, date: "2026-11-03", inT: "09:10", out: null, reg: false, reason: "" },
  { id: 3, empId: 6, date: "2026-11-03", inT: "08:30", out: null, reg: false, reason: "" },
  { id: 4, empId: 8, date: "2026-11-03", inT: "08:41", out: null, reg: false, reason: "" },
  { id: 5, empId: 11, date: "2026-11-03", inT: "09:25", out: null, reg: false, reason: "" },
  { id: 6, empId: 5, date: "2026-11-02", inT: "09:02", out: null, reg: false, reason: "" },
  { id: 7, empId: 11, date: "2026-11-02", inT: "09:18", out: null, reg: false, reason: "" },
  {
    id: 8,
    empId: 9,
    date: "2026-11-02",
    inT: "09:00",
    out: "17:30",
    reg: true,
    reason: "Forgot to clock out; manager confirmed the time.",
  },
  { id: 9, empId: 4, date: "2026-11-02", inT: "08:49", out: "17:34", reg: false, reason: "" },
  { id: 10, empId: 6, date: "2026-11-02", inT: "08:33", out: "17:05", reg: false, reason: "" },
  { id: 11, empId: 8, date: "2026-11-02", inT: "08:40", out: "16:55", reg: false, reason: "" },
  { id: 12, empId: 3, date: "2026-11-02", inT: "08:20", out: "18:10", reg: false, reason: "" },
];
const SEED_PROJECTS = [
  {
    id: 1,
    code: "ASH-ONB",
    name: "Onboarding Redesign",
    pmId: 2,
    start: "2026-08-17",
    status: "active",
  },
  {
    id: 2,
    code: "ASH-PAY",
    name: "Pay Review 2026",
    pmId: 2,
    start: "2026-09-07",
    status: "active",
  },
  {
    id: 3,
    code: "ASH-MOV",
    name: "Level 4 Office Move",
    pmId: 2,
    start: "2026-02-02",
    status: "closed",
  },
];
const SEED_ASSIGN = [
  { id: 1, projectId: 1, empId: 8, hours: 40 },
  { id: 2, projectId: 1, empId: 11, hours: 60 },
  { id: 3, projectId: 2, empId: 6, hours: 80 },
  { id: 4, projectId: 2, empId: 9, hours: 24 },
  { id: 5, projectId: 3, empId: 11, hours: 120 },
];
const OTPS = ["Tq7-Lm4-92x", "Hk3-Wd8-41p", "Zr5-Bn6-07c", "Vf9-Xs2-58j", "Mc4-Gy1-63k"];

const BLANK_USER = { email: "", employeeId: "", roles: ["Employee"], active: true };
const BLANK_EMP = { number: "", name: "", email: "", deptId: "", mgrId: "", start: "", end: "" };
const BLANK_PROJ = { code: "", name: "", start: "", status: "active", empId: "", hours: "" };

const pad = (n) => String(n).padStart(2, "0");
const fmtDate = formatDate;
const fmtStamp = formatDateTime;
const toMin = (t) => {
  const [h, m] = t.split(":");
  return +h * 60 + +m;
};
const fmtDur = (m) => `${Math.floor(m / 60)}h ${pad(m % 60)}m`;
const stampFor = (len) => {
  const total = 14 * 60 + 12 + Math.max(0, len - SEED_AUDIT.length);
  return `${TODAY}T${pad(Math.floor(total / 60) % 24)}:${pad(total % 60)}`;
};
const nextId = (list) => list.reduce((m, x) => Math.max(m, x.id), 0) + 1;

export default function Screen() {
  const C = {
    bg: brand.backgroundColor,
    panel: `color-mix(in srgb, ${brand.primaryColor} 5%, ${brand.backgroundColor})`,
    raised: `color-mix(in srgb, ${brand.primaryColor} 10%, ${brand.backgroundColor})`,
    field: `color-mix(in srgb, black 22%, ${brand.backgroundColor})`,
    line: `color-mix(in srgb, ${brand.primaryColor} 12%, transparent)`,
    text: brand.primaryColor,
    muted: brand.neutralColor,
    accent: brand.accentColor,
    warn: "hsl(38 70% 68%)",
    bad: "hsl(5 78% 76%)",
  };
  const queryClient = useQueryClient();
  // Who is signed in, from the server — not a seeded identity. Role names drive which
  // tabs show: Users & roles and Audit need System Admin (AC-008).
  const { data: me } = useQuery({
    queryKey: ["me"],
    queryFn: () => apiFetch("/api/me"),
  });
  const myRoleNames = rolesToNames(me?.roles);
  const myName = me?.display_name || me?.email || "—";
  const visibleTabs = TABS.filter((t) => myRoleNames.includes(t.need));

  const [tab, setTab] = React.useState(visibleTabs[0] ? visibleTabs[0].key : "users");
  const [notice, setNotice] = React.useState(null);
  // Live account list. The contract has no users-list endpoint, so this holds the
  // accounts created or changed through POST/PATCH /api/admin/users this session.
  const { data: users = [] } = useQuery({ queryKey: ["admin", "users"], queryFn: fetchAdminUsers });
  const setUsers = (updater) =>
    queryClient.setQueryData(["admin", "users"], (prev = []) =>
      typeof updater === "function" ? updater(prev) : updater,
    );
  // The linked-employee picker's options come from the live directory.
  const { data: userEmployees = [] } = useQuery({
    queryKey: ["admin", "user-employees"],
    queryFn: fetchUserEmployees,
  });
  // POST creates the account; PATCH changes roles/active state. Both audit-log server-side.
  const createUserMutation = useMutation({
    mutationFn: (body) =>
      apiFetch("/api/admin/users", { method: "POST", body: JSON.stringify(body) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "users"] }),
  });
  const patchUserMutation = useMutation({
    mutationFn: ({ userId, body }) =>
      apiFetch(`/api/admin/users/${userId}`, { method: "PATCH", body: JSON.stringify(body) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "users"] }),
  });
  const [audit, setAudit] = React.useState(SEED_AUDIT);
  const [employees, setEmployees] = React.useState(SEED_EMPLOYEES);
  const [depts, setDepts] = React.useState(SEED_DEPTS);
  const [leaveTypes, setLeaveTypes] = React.useState(SEED_LEAVE_TYPES);
  const [balances, setBalances] = React.useState(SEED_BALANCES);
  const [att, setAtt] = React.useState(SEED_ATT);
  const [projects, setProjects] = React.useState(SEED_PROJECTS);
  const [assigns, setAssigns] = React.useState(SEED_ASSIGN);

  const [userSel, setUserSel] = React.useState(null);
  const [userForm, setUserForm] = React.useState(BLANK_USER);
  const [userErr, setUserErr] = React.useState({});
  const [otp, setOtp] = React.useState(null);
  const [otpCount, setOtpCount] = React.useState(0);

  const [empSel, setEmpSel] = React.useState(null);
  const [empForm, setEmpForm] = React.useState(BLANK_EMP);
  const [empErr, setEmpErr] = React.useState({});
  const [confirm, setConfirm] = React.useState(null);

  const [deptName, setDeptName] = React.useState("");
  const [deptErr, setDeptErr] = React.useState("");
  const [ltForm, setLtForm] = React.useState({ name: "", days: "", unpaid: false, active: true });
  const [ltErr, setLtErr] = React.useState({});
  const [balForm, setBalForm] = React.useState({ empId: "", ltId: "1", year: "2026", days: "" });
  const [balErr, setBalErr] = React.useState({});
  const [attSel, setAttSel] = React.useState(null);
  const [attForm, setAttForm] = React.useState({ out: "", reason: "" });
  const [attErr, setAttErr] = React.useState({});
  const [projSel, setProjSel] = React.useState(null);
  const [projForm, setProjForm] = React.useState(BLANK_PROJ);
  const [projErr, setProjErr] = React.useState({});

  const empById = (id) => employees.find((e) => e.id === +id);
  const empName = (id) => {
    const e = empById(id);
    return e ? e.name : "—";
  };
  const deptName_ = (id) => {
    const d = depts.find((x) => x.id === +id);
    return d ? d.name : "—";
  };
  const activeEmps = employees.filter((e) => e.status === "Active");
  // Users tab draws its linked employees from the live directory, keyed by the real id.
  const userEmpById = (id) => userEmployees.find((e) => String(e.id) === String(id));
  const userEmpName = (id) => {
    const e = userEmpById(id);
    return e ? e.name : "—";
  };
  const notify = (tone, text) => setNotice({ tone, text, n: Date.now() });
  const log = (action, record, before, after, reason) =>
    setAudit((a) => [
      {
        id: nextId(a),
        ts: stampFor(a.length),
        actor: myName,
        action,
        record,
        before,
        after,
        reason: reason || "—",
      },
      ...a,
    ]);
  const userStatus = (u) =>
    !u.active ? ["off", "Deactivated"] : u.lockedAt ? ["warn", "Locked"] : ["ok", "Active"];

  const changeTab = (key) => {
    setTab(key);
    setNotice(null);
    setConfirm(null);
    setOtp(null);
  };
  const onTabKey = (e, i) => {
    let n = null;
    if (e.key === "ArrowRight") n = (i + 1) % visibleTabs.length;
    else if (e.key === "ArrowLeft") n = (i - 1 + visibleTabs.length) % visibleTabs.length;
    else if (e.key === "Home") n = 0;
    else if (e.key === "End") n = visibleTabs.length - 1;
    if (n === null) return;
    e.preventDefault();
    changeTab(visibleTabs[n].key);
    requestAnimationFrame(() => {
      const el = document.getElementById("tab-" + visibleTabs[n].key);
      if (el) el.focus();
    });
  };
  const cancelConfirm = (e) => {
    if (e.key === "Escape" && confirm) {
      setConfirm(null);
      setNotice(null);
    }
  };

  /* Enter submits the button-less blocks (Add department, Add leave type, Set opening leave balance, Correct punch) */
  const submitOnEnter = (e, fn) => {
    const t = e.target;
    const isField = t.tagName === "INPUT" && t.type !== "checkbox";
    const isArea = t.tagName === "TEXTAREA" && (e.ctrlKey || e.metaKey);
    if (e.key === "Enter" && (isField || isArea)) fn(e);
  };

  /* ---------- shared styling helpers ---------- */
  const inputStyle = (bad) => ({
    background: C.field,
    border: `1px solid ${bad ? C.bad : C.line}`,
    color: C.text,
    borderRadius: 6,
    padding: "10px 12px",
    fontSize: 14,
    width: "100%",
    minHeight: 44,
  });
  const labelStyle = {
    display: "block",
    fontSize: 12,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: C.muted,
    marginBottom: 6,
    fontWeight: 600,
  };
  const btn = (kind) => ({
    minHeight: 44,
    width: "100%",
    padding: "10px 16px",
    borderRadius: 6,
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    background: kind === "primary" ? C.accent : "transparent",
    color: kind === "primary" ? C.bg : kind === "danger" ? C.bad : C.text,
    border: `1px solid ${kind === "primary" ? C.accent : kind === "danger" ? C.bad : C.line}`,
  });
  const thS = {
    textAlign: "left",
    padding: "12px 16px",
    fontSize: 11,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: C.muted,
    fontWeight: 600,
    borderBottom: `1px solid ${C.line}`,
    whiteSpace: "nowrap",
  };
  const tdS = {
    padding: "12px 16px",
    fontSize: 14,
    borderBottom: `1px solid ${C.line}`,
    verticalAlign: "top",
  };
  const refS = { color: C.accent, fontWeight: 600 };
  const mutedS = { color: C.muted, fontSize: 13 };

  const pill = (kind, text) => {
    const col =
      kind === "ok" ? C.accent : kind === "warn" ? C.warn : kind === "bad" ? C.bad : C.muted;
    const Ic =
      kind === "ok"
        ? Icons.CheckCircle
        : kind === "warn" || kind === "bad"
          ? Icons.AlertCircle
          : kind === "off"
            ? Icons.X
            : Icons.Clock;
    return (
      <span
        style={{
          display: "inline-flex",
          gap: 6,
          alignItems: "center",
          color: col,
          fontSize: 12,
          fontWeight: 600,
          whiteSpace: "nowrap",
        }}
      >
        <Ic aria-hidden="true" style={{ width: 14, height: 14 }} />
        {text}
      </span>
    );
  };

  const panel = (id, title, sub, body, o = {}) => (
    <section
      data-wf={id}
      aria-labelledby={id + "-h"}
      className={"adm-in s" + (o.span || 12)}
      style={{ background: C.panel, border: `1px solid ${C.line}`, borderRadius: 6, minWidth: 0 }}
    >
      <div style={{ padding: "24px 24px 16px" }}>
        <span
          aria-hidden="true"
          style={{ display: "block", width: 40, height: 1, background: C.accent, marginBottom: 16 }}
        />
        <h2
          id={id + "-h"}
          style={{
            fontFamily: brand.fontHeading,
            fontSize: 22,
            fontWeight: 400,
            margin: 0,
            lineHeight: 1.25,
          }}
        >
          {title}
          {sub ? (
            <span
              style={{
                fontFamily: brand.fontBody,
                fontSize: 13,
                color: C.muted,
                marginLeft: 8,
                letterSpacing: "0.02em",
              }}
            >
              {sub}
            </span>
          ) : null}
        </h2>
        {o.hint ? (
          <p style={{ ...mutedS, margin: "8px 0 0", lineHeight: 1.5, maxWidth: 560 }}>{o.hint}</p>
        ) : null}
      </div>
      <div style={o.flush ? {} : { padding: "0 24px 24px" }}>{body}</div>
    </section>
  );

  const tableWrap = (min, head, rows) => (
    <div style={{ overflowX: "auto" }}>
      <Table
        style={{
          width: "100%",
          minWidth: min,
          borderCollapse: "collapse",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        <THead>
          <TR>{head}</TR>
        </THead>
        <TBody>{rows}</TBody>
      </Table>
    </div>
  );
  const th = (label, wf) => (
    <TH key={label} scope="col" data-wf={wf} style={thS}>
      {label}
    </TH>
  );

  const rowLink = (label, selected, onClick) => (
    <button
      type="button"
      className="adm-link"
      aria-pressed={selected}
      onClick={onClick}
      style={{
        background: "none",
        border: 0,
        padding: 0,
        color: C.text,
        fontSize: 14,
        fontWeight: 600,
        cursor: "pointer",
        textAlign: "left",
        textDecoration: "underline",
        textDecorationColor: C.line,
        textUnderlineOffset: 4,
        display: "inline-flex",
        gap: 6,
        alignItems: "center",
      }}
    >
      {selected ? (
        <Icons.Check aria-hidden="true" style={{ width: 14, height: 14, color: C.accent }} />
      ) : null}
      {label}
    </button>
  );
  const rowStyle = (sel) => (sel ? { background: C.raised } : undefined);

  const msgFor = (id, error, hint) =>
    error || hint ? (
      <p
        id={id + "-msg"}
        style={{
          margin: "6px 0 0",
          fontSize: 13,
          lineHeight: 1.45,
          color: error ? C.bad : C.muted,
          display: "flex",
          gap: 6,
          alignItems: "flex-start",
        }}
      >
        {error ? (
          <Icons.AlertCircle
            aria-hidden="true"
            style={{ width: 14, height: 14, marginTop: 2, flexShrink: 0 }}
          />
        ) : null}
        <span>{error || hint}</span>
      </p>
    ) : null;

  const txt = (id, wf, label, value, onChange, o = {}) => (
    <div style={{ marginBottom: 16 }}>
      <Label htmlFor={id} style={labelStyle}>
        {label}
      </Label>
      <Input
        id={id}
        data-wf={wf}
        type={o.type || "text"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={o.disabled}
        aria-invalid={o.error ? "true" : undefined}
        aria-describedby={o.error || o.hint ? id + "-msg" : undefined}
        step={o.step}
        min={o.min}
        placeholder={o.placeholder}
        autoComplete="off"
        style={{ ...inputStyle(o.error), opacity: o.disabled ? 0.5 : 1 }}
      />
      {msgFor(id, o.error, o.hint)}
    </div>
  );
  const sel = (id, wf, label, value, onChange, options, o = {}) => (
    <div style={{ marginBottom: 16 }}>
      <label htmlFor={id} style={labelStyle}>
        {label}
      </label>
      <select
        id={id}
        data-wf={wf}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={o.disabled}
        aria-invalid={o.error ? "true" : undefined}
        aria-describedby={o.error || o.hint ? id + "-msg" : undefined}
        style={{ ...inputStyle(o.error), opacity: o.disabled ? 0.5 : 1 }}
      >
        <option value="">{o.placeholder || "Choose…"}</option>
        {options.map((x) => (
          <option key={x.value} value={x.value}>
            {x.label}
          </option>
        ))}
      </select>
      {msgFor(id, o.error, o.hint)}
    </div>
  );
  const check = (id, wf, label, checked, onChange, o = {}) => (
    <label
      htmlFor={id}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        minHeight: 36,
        fontSize: 14,
        cursor: "pointer",
      }}
    >
      <input
        id={id}
        data-wf={wf}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={o.disabled}
        style={{ width: 20, height: 20, accentColor: C.accent, flexShrink: 0 }}
      />
      <span>{label}</span>
    </label>
  );

  const empOptions = (list) =>
    list.map((e) => ({ value: String(e.id), label: `${e.name} · ${e.number}` }));
  const mgrOptions = activeEmps.map((e) => ({ value: String(e.id), label: e.name }));

  /* ---------- USERS ---------- */
  const selectUser = (u) => {
    setOtp(null);
    setUserErr({});
    if (userSel === u.id) {
      setUserSel(null);
      setUserForm(BLANK_USER);
      return;
    }
    setUserSel(u.id);
    setUserForm({ email: u.email, employeeId: String(u.empId), roles: u.roles, active: u.active });
  };
  // Email cannot change on an existing account via the contract; lock it while editing.
  const emailLocked = userSel !== null;
  const toggleRole = (r, on) =>
    setUserForm((f) => ({
      ...f,
      roles: ALL_ROLES.filter((x) => (x === r ? on : f.roles.includes(x))),
    }));
  const saveUser = (e) => {
    e.preventDefault();
    const errs = {};
    const email = userForm.email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errs.email = "Enter a work email address, like name@ashgrove.co.";
    else if (users.some((u) => u.id !== userSel && u.email.toLowerCase() === email))
      errs.email = "That email is already in use by another account.";
    if (!userForm.employeeId) errs.employeeId = "Link the account to an employee record.";
    if (!userForm.roles.length) errs.roles = "Give the account at least one role.";
    setUserErr(errs);
    if (Object.keys(errs).length) {
      notify(
        "err",
        "The account was not saved. Fix the flagged fields — everything you typed is kept.",
      );
      return;
    }
    const emp = userEmpById(userForm.employeeId);
    if (userSel) {
      const u = users.find((x) => x.id === userSel);
      // The contract's PATCH changes roles, active state and lock only.
      const body = {};
      if (u.roles.join(", ") !== userForm.roles.join(", "))
        body.role_codes = rolesToCodes(userForm.roles);
      if (u.active !== userForm.active) body.is_active = userForm.active;
      if (!Object.keys(body).length) {
        notify("ok", "Nothing to save — the account already matches the form.");
        return;
      }
      patchUserMutation.mutate(
        { userId: u.id, body },
        {
          onSuccess: (saved) => {
            setUsers((l) =>
              l.map((x) =>
                x.id === userSel
                  ? {
                      ...x,
                      roles: saved?.roles ? rolesToNames(saved.roles) : userForm.roles,
                      active: saved?.is_active !== undefined ? saved.is_active : userForm.active,
                    }
                  : x,
              ),
            );
            notify("ok", `Saved ${email}. The change is in the audit log.`);
          },
          onError: (err) =>
            notify("err", err instanceof Error ? err.message : "The account was not saved."),
        },
      );
    } else {
      createUserMutation.mutate(
        {
          email,
          employee_id: userForm.employeeId,
          role_codes: rolesToCodes(userForm.roles),
        },
        {
          onSuccess: (created) => {
            setUsers((l) => [
              ...l,
              {
                id: created?.user_id ?? email,
                email: created?.email ?? email,
                empId: userForm.employeeId,
                roles: created?.roles ? rolesToNames(created.roles) : userForm.roles,
                active: created?.is_active !== undefined ? created.is_active : true,
                lockedAt: null,
                failed: 0,
                last: null,
              },
            ]);
            notify(
              "ok",
              `Account created for ${email} with ${userForm.roles.join(" and ")}. Issue a one-time password so they can sign in.`,
            );
            setUserForm(BLANK_USER);
          },
          onError: (err) =>
            notify("err", err instanceof Error ? err.message : "The account was not created."),
        },
      );
    }
  };
  const selectedUser = users.find((u) => u.id === userSel);
  const unlockUser = () => {
    if (!selectedUser) {
      notify("err", "Select an account in the table first.");
      return;
    }
    if (!selectedUser.lockedAt) {
      notify("err", `${selectedUser.email} is not locked, so there is nothing to unlock.`);
      return;
    }
    setUsers((l) =>
      l.map((u) => (u.id === selectedUser.id ? { ...u, lockedAt: null, failed: 0 } : u)),
    );
    log(
      "Account unlocked",
      `User · ${selectedUser.email}`,
      `failed_login_count: ${selectedUser.failed}; locked_at: ${fmtStamp(selectedUser.lockedAt)}`,
      "failed_login_count: 0; locked_at: —",
    );
    notify(
      "ok",
      `${selectedUser.email} is unlocked. They can sign in with their existing password.`,
    );
  };
  const resetPassword = () => {
    if (!selectedUser) {
      notify("err", "Select an account in the table first.");
      return;
    }
    const code = OTPS[otpCount % OTPS.length];
    setOtpCount((c) => c + 1);
    setOtp({ code, email: selectedUser.email });
    setUsers((l) => l.map((u) => (u.id === selectedUser.id ? { ...u } : u)));
    log(
      "Password reset issued",
      `User · ${selectedUser.email}`,
      "must_change_password: false",
      "password_hash replaced; must_change_password: true",
    );
    notify(
      "ok",
      `One-time password issued for ${selectedUser.email}. They must set a new password at first sign-in.`,
    );
  };

  const usersTab = (
    <div style={{ display: "grid", gap: 24 }}>
      <div className="adm-grid">
        {panel(
          "b-2-0",
          "User accounts",
          "(System Admin)",
          tableWrap(
            720,
            [
              th("Email", "i-2-0-0"),
              th("Employee", "i-2-0-1"),
              th("Roles", "i-2-0-2"),
              th("Status", "i-2-0-3"),
              th("Last login", "i-2-0-4"),
            ],
            users.map((u) => {
              const [k, label] = userStatus(u);
              const s = userSel === u.id;
              return (
                <TR key={u.id} className="adm-row" style={rowStyle(s)}>
                  <TD style={tdS}>{rowLink(u.email, s, () => selectUser(u))}</TD>
                  <TD style={tdS}>
                    {userEmpName(u.empId)}
                    <div style={{ ...mutedS, ...refS, fontWeight: 400 }}>
                      {(userEmpById(u.empId) || {}).number}
                    </div>
                  </TD>
                  <TD style={{ ...tdS, maxWidth: 220 }}>{u.roles.join(", ")}</TD>
                  <TD style={tdS}>
                    {pill(k, label)}
                    {u.lockedAt ? <div style={mutedS}>{u.failed} failed attempts</div> : null}
                  </TD>
                  <TD style={{ ...tdS, whiteSpace: "nowrap" }}>
                    {u.last ? fmtStamp(u.last) : <span style={mutedS}>Never signed in</span>}
                  </TD>
                </TR>
              );
            }),
          ),
          {
            span: 8,
            flush: true,
            hint: "Select an account to edit it, unlock it or reset its password. Select it again to start a new account.",
          },
        )}
        {panel(
          "b-2-1",
          "Create or edit user",
          "",
          <form id="user-form" onSubmit={saveUser} noValidate>
            <p style={{ ...mutedS, margin: "0 0 16px" }}>
              {selectedUser
                ? `Editing ${selectedUser.email}`
                : "New account — no public sign-up exists; you create every account."}
            </p>
            {txt(
              "u-email",
              "i-2-1-0",
              "Email",
              userForm.email,
              (v) => setUserForm((f) => ({ ...f, email: v })),
              {
                type: "email",
                error: userErr.email,
                placeholder: "name@ashgrove.co",
                disabled: emailLocked,
              },
            )}
            {sel(
              "u-emp",
              "i-2-1-1",
              "Linked employee",
              userForm.employeeId,
              (v) => setUserForm((f) => ({ ...f, employeeId: v })),
              empOptions(
                userEmployees.filter(
                  (e) => e.status === "Active" || String(e.id) === userForm.employeeId,
                ),
              ),
              { error: userErr.employeeId, placeholder: "Choose an employee record" },
            )}
            <fieldset
              data-wf="i-2-1-2"
              aria-describedby={userErr.roles ? "u-roles-msg" : undefined}
              style={{ border: 0, padding: 0, margin: "0 0 16px", minWidth: 0 }}
            >
              <legend style={{ ...labelStyle, padding: 0 }}>Roles</legend>
              {ALL_ROLES.map((r, i) => (
                <div key={r}>
                  {check("u-role-" + i, null, r, userForm.roles.includes(r), (on) =>
                    toggleRole(r, on),
                  )}
                </div>
              ))}
              {msgFor(
                "u-roles",
                userErr.roles,
                "Permissions combine: a person holding two roles gets both sets.",
              )}
            </fieldset>
            <div style={{ borderTop: `1px solid ${C.line}`, paddingTop: 12 }}>
              <span data-wf="i-2-1-3" style={{ display: "block" }}>
                {check("u-active", null, "Active — the person can sign in", userForm.active, (on) =>
                  setUserForm((f) => ({ ...f, active: on })),
                )}
              </span>
            </div>
          </form>,
          { span: 4 },
        )}
      </div>
      <div>
        <p style={{ ...mutedS, margin: "0 0 12px" }}>
          Selected account:{" "}
          <span style={{ color: C.text }}>
            {selectedUser ? selectedUser.email : "none — Save user will create a new one"}
          </span>
        </p>
        <div className="adm-grid">
          <Button
            data-wf="b-3-0"
            type="submit"
            form="user-form"
            className="adm-btn s3"
            style={btn("primary")}
          >
            Save user
          </Button>
          <Button
            data-wf="b-3-1"
            type="button"
            onClick={unlockUser}
            className="adm-btn s3"
            style={btn("secondary")}
          >
            Unlock account
          </Button>
          <Button
            data-wf="b-3-2"
            type="button"
            onClick={resetPassword}
            className="adm-btn s3"
            style={btn("secondary")}
          >
            Issue password reset
          </Button>
          <div
            data-wf="b-3-3"
            className="s3"
            role="status"
            style={{
              border: `1px dashed ${C.line}`,
              borderRadius: 6,
              padding: "10px 16px",
              minHeight: 44,
              display: "flex",
              alignItems: "center",
              fontSize: 14,
              lineHeight: 1.4,
            }}
          >
            {otp ? (
              <span>
                One-time password shown once:{" "}
                <strong
                  style={{
                    ...refS,
                    fontFamily: "ui-monospace, Menlo, monospace",
                    fontSize: 15,
                    letterSpacing: "0.04em",
                  }}
                >
                  {otp.code}
                </strong>
              </span>
            ) : (
              <span style={mutedS}>
                A one-time password appears here, once, after you issue a reset.
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  /* ---------- AUDIT ---------- */
  const auditTab = panel(
    "b-4-0",
    "Audit log",
    "(read-only)",
    tableWrap(
      1000,
      [
        th("Timestamp", "i-4-0-0"),
        th("Actor", "i-4-0-1"),
        th("Action", "i-4-0-2"),
        th("Affected record", "i-4-0-3"),
        th("Before / after values", "i-4-0-4"),
        th("Reason or comment", "i-4-0-5"),
      ],
      audit.map((a) => (
        <TR key={a.id} className="adm-row">
          <TD style={{ ...tdS, whiteSpace: "nowrap", ...refS, fontWeight: 400 }}>
            {fmtStamp(a.ts)}
          </TD>
          <TD style={tdS}>{a.actor}</TD>
          <TD style={{ ...tdS, fontWeight: 600 }}>{a.action}</TD>
          <TD style={{ ...tdS, maxWidth: 240 }}>{a.record}</TD>
          <TD style={{ ...tdS, maxWidth: 300, fontSize: 13 }}>
            <div>
              <span style={mutedS}>Before </span>
              {a.before}
            </div>
            <div style={{ marginTop: 4 }}>
              <span style={mutedS}>After </span>
              {a.after}
            </div>
          </TD>
          <TD style={{ ...tdS, maxWidth: 240, color: C.muted }}>{a.reason}</TD>
        </TR>
      )),
    ),
    {
      flush: true,
      hint: "Newest first, stamped by the server clock. Nobody — including System Admins — can edit or delete an entry.",
    },
  );

  /* ---------- EMPLOYEES ---------- */
  const selectEmp = (e) => {
    setEmpErr({});
    setConfirm(null);
    if (empSel === e.id) {
      setEmpSel(null);
      setEmpForm(BLANK_EMP);
      return;
    }
    setEmpSel(e.id);
    setEmpForm({
      number: e.number,
      name: e.status === "Erased" ? "" : e.name,
      email: e.status === "Erased" ? "" : e.email,
      deptId: String(e.deptId || ""),
      mgrId: e.mgrId ? String(e.mgrId) : "",
      start: e.start,
      end: e.end,
    });
  };
  const selectedEmp = employees.find((e) => e.id === empSel);
  const saveEmployee = (ev) => {
    ev.preventDefault();
    const errs = {};
    const f = empForm;
    if (!f.number.trim()) errs.number = "Employee number is required.";
    else if (
      employees.some(
        (e) => e.id !== empSel && e.number.toLowerCase() === f.number.trim().toLowerCase(),
      )
    )
      errs.number = "That employee number is already used.";
    if (!f.name.trim()) errs.name = "Full name is required.";
    if (!f.email.trim()) errs.email = "Work email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim()))
      errs.email = "Enter a valid work email.";
    if (!f.deptId) errs.deptId = "Department is required.";
    if (!f.mgrId) errs.mgrId = "Reporting manager is required.";
    else if (empSel && +f.mgrId === empSel) errs.mgrId = "Someone cannot report to themselves.";
    if (!f.start) errs.start = "Start date is required.";
    if (selectedEmp && selectedEmp.status === "Erased")
      errs.name = "An erased record cannot be edited.";
    setEmpErr(errs);
    if (Object.keys(errs).length) {
      notify(
        "err",
        `The record was not saved — ${Object.keys(errs).length} field${Object.keys(errs).length > 1 ? "s" : ""} need attention. Your entries are kept.`,
      );
      return;
    }
    if (selectedEmp) {
      const before = [];
      const after = [];
      const cmp = (label, a, b) => {
        if (String(a) !== String(b)) {
          before.push(`${label}: ${a || "—"}`);
          after.push(`${label}: ${b || "—"}`);
        }
      };
      cmp("employee_number", selectedEmp.number, f.number.trim());
      cmp("full_name", selectedEmp.name, f.name.trim());
      cmp("work_email", selectedEmp.email, f.email.trim());
      cmp("department", deptName_(selectedEmp.deptId), deptName_(f.deptId));
      cmp("reporting_manager", empName(selectedEmp.mgrId), empName(f.mgrId));
      cmp("start_date", fmtDate(selectedEmp.start), fmtDate(f.start));
      if (!before.length) {
        notify("ok", "Nothing to save — the record already matches the form.");
        return;
      }
      setEmployees((l) =>
        l.map((e) =>
          e.id === empSel
            ? {
                ...e,
                number: f.number.trim(),
                name: f.name.trim(),
                email: f.email.trim(),
                deptId: +f.deptId,
                mgrId: +f.mgrId,
                start: f.start,
              }
            : e,
        ),
      );
      log(
        "Employee record changed",
        `Employee · ${f.number.trim()} ${f.name.trim()}`,
        before.join("; "),
        after.join("; "),
      );
      notify(
        "ok",
        `Saved ${f.name.trim()}.${selectedEmp.mgrId !== +f.mgrId ? ` They now appear in ${empName(f.mgrId)}'s team list and no longer in ${empName(selectedEmp.mgrId)}'s.` : ""}`,
      );
    } else {
      setEmployees((l) => [
        ...l,
        {
          id: nextId(l),
          number: f.number.trim(),
          name: f.name.trim(),
          email: f.email.trim(),
          deptId: +f.deptId,
          mgrId: +f.mgrId,
          start: f.start,
          end: "",
          status: "Active",
        },
      ]);
      log(
        "Employee record created",
        `Employee · ${f.number.trim()} ${f.name.trim()}`,
        "—",
        `department: ${deptName_(f.deptId)}; reporting_manager: ${empName(f.mgrId)}; start_date: ${fmtDate(f.start)}`,
      );
      notify("ok", `${f.name.trim()} is in the employee directory.`);
      setEmpForm(BLANK_EMP);
    }
  };
  const markLeaver = () => {
    setConfirm(null);
    if (!selectedEmp) {
      notify("err", "Select an employee in the directory first.");
      return;
    }
    if (selectedEmp.status !== "Active") {
      notify(
        "err",
        `${selectedEmp.status === "Erased" ? "This record" : selectedEmp.name} is already ${selectedEmp.status === "Erased" ? "erased" : "marked as a leaver"}.`,
      );
      return;
    }
    if (!empForm.end) {
      setEmpErr({ end: "Enter the last working day to mark this person as a leaver." });
      notify("err", "Add an end date first — it is the last working day.");
      return;
    }
    if (empForm.end < selectedEmp.start) {
      setEmpErr({ end: "The end date cannot be before the start date." });
      notify("err", "The end date is before the start date.");
      return;
    }
    setEmpErr({});
    const acct = users.find((u) => u.empId === selectedEmp.id);
    setEmployees((l) =>
      l.map((e) => (e.id === selectedEmp.id ? { ...e, status: "Leaver", end: empForm.end } : e)),
    );
    log(
      "Employee marked as leaver",
      `Employee · ${selectedEmp.number} ${selectedEmp.name}`,
      "status: Active; end_date: —",
      `status: Leaver; end_date: ${fmtDate(empForm.end)}`,
    );
    if (acct && acct.active) {
      setUsers((l) => l.map((u) => (u.id === acct.id ? { ...u, active: false } : u)));
      log(
        "Account deactivated",
        `User · ${acct.email}`,
        "is_active: true",
        "is_active: false",
        "Linked employee marked as leaver.",
      );
    }
    notify(
      "ok",
      `${selectedEmp.name} is a leaver as of ${fmtDate(empForm.end)}. They no longer appear in team lists or assignment pickers${acct ? ", and their portal account is deactivated" : ""}.`,
    );
  };
  const askErase = () => {
    if (!selectedEmp) {
      notify("err", "Select an employee in the directory first.");
      return;
    }
    if (selectedEmp.status === "Erased") {
      notify("err", "This record has already been erased.");
      return;
    }
    if (selectedEmp.status !== "Leaver") {
      notify("err", "Erasure applies to leavers. Mark the employee as a leaver first.");
      return;
    }
    if (confirm && confirm.kind === "erase") {
      doErase();
      return;
    }
    setConfirm({ kind: "erase" });
    notify(
      "warn",
      `Name, work email and contact details for ${selectedEmp.number} are removed for good and cannot be restored. The audit log keeps who did it, and when. Press the button again to erase; press Escape or pick another row to keep the record.`,
    );
  };
  const doErase = () => {
    const e = selectedEmp;
    setEmployees((l) =>
      l.map((x) =>
        x.id === e.id ? { ...x, name: "Erased record", email: "—", status: "Erased" } : x,
      ),
    );
    log(
      "Personal data erased",
      `Employee · ${e.number}`,
      "name, work_email, contact details present",
      "identifying fields removed; is_erased: true",
      "Erasure request from leaver.",
    );
    setEmpForm({
      ...BLANK_EMP,
      number: e.number,
      deptId: String(e.deptId),
      start: e.start,
      end: e.end,
    });
    setConfirm(null);
    notify(
      "ok",
      `Personal data for ${e.number} is erased. The audit log keeps who did it and when.`,
    );
  };
  const statusOf = (e) =>
    e.status === "Active" ? (
      pill("ok", "Active")
    ) : e.status === "Leaver" ? (
      <span>
        {pill("off", "Leaver")}
        <div style={mutedS}>until {fmtDate(e.end)}</div>
      </span>
    ) : (
      pill("bad", "Erased")
    );

  const employeesTab = (
    <div style={{ display: "grid", gap: 24 }}>
      <div className="adm-grid">
        {panel(
          "b-5-0",
          "Employee directory",
          "(HR Admin)",
          tableWrap(
            760,
            [
              th("Employee ID", "i-5-0-0"),
              th("Name", "i-5-0-1"),
              th("Department", "i-5-0-2"),
              th("Reporting manager", "i-5-0-3"),
              th("Start date", "i-5-0-4"),
              th("Status", "i-5-0-5"),
            ],
            employees.map((e) => {
              const s = empSel === e.id;
              return (
                <TR key={e.id} className="adm-row" style={rowStyle(s)}>
                  <TD style={{ ...tdS, ...refS }}>{e.number}</TD>
                  <TD style={tdS}>{rowLink(e.name, s, () => selectEmp(e))}</TD>
                  <TD style={tdS}>{deptName_(e.deptId)}</TD>
                  <TD style={tdS}>
                    {e.mgrId ? empName(e.mgrId) : <span style={mutedS}>None — routes to HR</span>}
                  </TD>
                  <TD style={{ ...tdS, whiteSpace: "nowrap" }}>{fmtDate(e.start)}</TD>
                  <TD style={tdS}>{statusOf(e)}</TD>
                </TR>
              );
            }),
          ),
          {
            span: 7,
            flush: true,
            hint: "Select a person to edit their record. Select them again to add a new employee.",
          },
        )}
        {panel(
          "b-5-1",
          "Employee record",
          "",
          <form id="emp-form" onSubmit={saveEmployee} noValidate>
            <p style={{ ...mutedS, margin: "0 0 16px" }}>
              {selectedEmp
                ? `Editing ${selectedEmp.number}`
                : "New employee — records are created one at a time."}
            </p>
            {txt(
              "e-num",
              "i-5-1-0",
              "Employee number",
              empForm.number,
              (v) => setEmpForm((f) => ({ ...f, number: v })),
              { error: empErr.number, placeholder: "E-1011" },
            )}
            {txt(
              "e-name",
              "i-5-1-1",
              "Full name",
              empForm.name,
              (v) => setEmpForm((f) => ({ ...f, name: v })),
              { error: empErr.name },
            )}
            {txt(
              "e-email",
              "i-5-1-2",
              "Work email",
              empForm.email,
              (v) => setEmpForm((f) => ({ ...f, email: v })),
              { type: "email", error: empErr.email },
            )}
            {sel(
              "e-dept",
              "i-5-1-3",
              "Department",
              empForm.deptId,
              (v) => setEmpForm((f) => ({ ...f, deptId: v })),
              depts.map((d) => ({ value: String(d.id), label: d.name })),
              { error: empErr.deptId },
            )}
            {sel(
              "e-mgr",
              "i-5-1-4",
              "Reporting manager",
              empForm.mgrId,
              (v) => setEmpForm((f) => ({ ...f, mgrId: v })),
              mgrOptions.filter((m) => m.value !== String(empSel)),
              { error: empErr.mgrId },
            )}
            {txt(
              "e-start",
              "i-5-1-5",
              "Start date",
              empForm.start,
              (v) => setEmpForm((f) => ({ ...f, start: v })),
              { type: "date", error: empErr.start },
            )}
            {txt(
              "e-end",
              "i-5-1-6",
              "End date (mark as leaver)",
              empForm.end,
              (v) => setEmpForm((f) => ({ ...f, end: v })),
              { type: "date", error: empErr.end, hint: "Only used when you press Mark as leaver." },
            )}
          </form>,
          { span: 5 },
        )}
      </div>
      <div className="adm-grid">
        <Button
          data-wf="b-6-0"
          type="submit"
          form="emp-form"
          className="adm-btn s3"
          style={btn("primary")}
        >
          Save employee
        </Button>
        <Button
          data-wf="b-6-1"
          type="button"
          onClick={markLeaver}
          className="adm-btn s3"
          style={btn("secondary")}
        >
          Mark as leaver
        </Button>
        <Button
          data-wf="b-6-2"
          type="button"
          onClick={askErase}
          onKeyDown={cancelConfirm}
          className="adm-btn s3"
          style={btn("danger")}
        >
          {confirm && confirm.kind === "erase"
            ? "Confirm: erase permanently"
            : "Erase personal data"}
        </Button>
      </div>
    </div>
  );

  /* ---------- DEPARTMENTS ---------- */
  const addDept = (e) => {
    e.preventDefault();
    const n = deptName.trim();
    if (!n) {
      setDeptErr("Give the department a name.");
      notify("err", "The department was not added — it needs a name.");
      return;
    }
    if (depts.some((d) => d.name.toLowerCase() === n.toLowerCase())) {
      setDeptErr(`There is already a department called “${n}”.`);
      notify("err", "That department already exists. There is one shared list.");
      return;
    }
    setDepts((l) => [...l, { id: nextId(l), name: n }]);
    log("Department added", `Department · ${n}`, "—", `name: ${n}`);
    setDeptName("");
    setDeptErr("");
    notify("ok", `${n} is now selectable on employee records.`);
  };
  const departmentsTab = (
    <div className="adm-grid">
      {panel(
        "b-7-0",
        "Departments",
        "",
        tableWrap(
          360,
          [
            th("Department name", "i-7-0-0"),
            <TH key="c" scope="col" data-wf="i-7-0-1" style={{ ...thS, textAlign: "right" }}>
              Employees assigned
            </TH>,
          ],
          depts.map((d) => (
            <TR key={d.id} className="adm-row">
              <TD style={tdS}>{d.name}</TD>
              <TD style={{ ...tdS, textAlign: "right", ...refS }}>
                {employees.filter((e) => e.deptId === d.id && e.status === "Active").length}
              </TD>
            </TR>
          )),
        ),
        {
          span: 6,
          flush: true,
          hint: "One shared list for the whole company. A department with people in it cannot be deleted.",
        },
      )}
      {panel(
        "b-8-0",
        "Add department",
        "",
        <div role="group" aria-labelledby="b-8-0-h" onKeyDown={(e) => submitOnEnter(e, addDept)}>
          {txt(
            "d-name",
            "i-8-0-0",
            "Department name",
            deptName,
            (v) => {
              setDeptName(v);
              setDeptErr("");
            },
            {
              error: deptErr,
              placeholder: "e.g. Legal & Compliance",
              hint: "Press Enter to add the department.",
            },
          )}
        </div>,
        { span: 6 },
      )}
    </div>
  );

  /* ---------- LEAVE TYPES ---------- */
  const addLeaveType = (e) => {
    e.preventDefault();
    const errs = {};
    const n = ltForm.name.trim();
    const d = ltForm.unpaid ? 0 : Number(ltForm.days);
    if (!n) errs.name = "Give the leave type a name.";
    else if (leaveTypes.some((t) => t.name.toLowerCase() === n.toLowerCase()))
      errs.name = `“${n}” already exists.`;
    if (!ltForm.unpaid && (ltForm.days === "" || isNaN(d) || d < 0 || (d * 2) % 1 !== 0))
      errs.days = "Enter a number of days in steps of 0.5, such as 20 or 7.5.";
    setLtErr(errs);
    if (Object.keys(errs).length) {
      notify(
        "err",
        "The leave type was not added. Fix the flagged fields — your entries are kept.",
      );
      return;
    }
    setLeaveTypes((l) => [
      ...l,
      { id: nextId(l), name: n, days: d, unpaid: ltForm.unpaid, active: ltForm.active },
    ]);
    log(
      "Leave type created",
      `Leave type · ${n}`,
      "—",
      `annual_entitlement_days: ${d}; is_unpaid: ${ltForm.unpaid}; is_active: ${ltForm.active}`,
    );
    setLtForm({ name: "", days: "", unpaid: false, active: true });
    notify(
      "ok",
      ltForm.active
        ? `${n} is now selectable on leave requests and appears in balance views.`
        : `${n} was saved as inactive — employees will not see it yet.`,
    );
  };
  const leaveTypesTab = (
    <div className="adm-grid">
      {panel(
        "b-7-1",
        "Leave types",
        "",
        tableWrap(
          460,
          [
            th("Name", "i-7-1-0"),
            <TH key="d" scope="col" data-wf="i-7-1-1" style={{ ...thS, textAlign: "right" }}>
              Annual entitlement (days)
            </TH>,
            th("Unpaid", "i-7-1-2"),
            th("Active", "i-7-1-3"),
          ],
          leaveTypes.map((t) => (
            <TR key={t.id} className="adm-row">
              <TD style={{ ...tdS, fontWeight: 600 }}>{t.name}</TD>
              <TD style={{ ...tdS, textAlign: "right", ...refS }}>
                {t.unpaid ? <span style={mutedS}>No limit</span> : t.days}
              </TD>
              <TD style={tdS}>{t.unpaid ? "Yes" : "No"}</TD>
              <TD style={tdS}>{t.active ? pill("ok", "Active") : pill("off", "Inactive")}</TD>
            </TR>
          )),
        ),
        { span: 6, flush: true, hint: "Only active types are offered on employee leave requests." },
      )}
      {panel(
        "b-8-1",
        "Add leave type",
        "",
        <div
          role="group"
          aria-labelledby="b-8-1-h"
          onKeyDown={(e) => submitOnEnter(e, addLeaveType)}
        >
          {txt(
            "l-name",
            "i-8-1-0",
            "Name",
            ltForm.name,
            (v) => setLtForm((f) => ({ ...f, name: v })),
            { error: ltErr.name, placeholder: "e.g. Parental" },
          )}
          {txt(
            "l-days",
            "i-8-1-1",
            "Annual entitlement (days)",
            ltForm.unpaid ? "" : ltForm.days,
            (v) => setLtForm((f) => ({ ...f, days: v })),
            {
              type: "number",
              step: "0.5",
              min: "0",
              disabled: ltForm.unpaid,
              error: ltErr.days,
              hint: ltForm.unpaid
                ? "Unpaid leave carries no balance check, so there is no entitlement."
                : "Half a day is the smallest step.",
            },
          )}
          <div style={{ marginBottom: 16 }}>
            <span data-wf="i-8-1-2" style={{ display: "block" }}>
              {check("l-unpaid", null, "Unpaid leave", ltForm.unpaid, (on) =>
                setLtForm((f) => ({ ...f, unpaid: on })),
              )}
            </span>
            <span data-wf="i-8-1-3" style={{ display: "block" }}>
              {check("l-active", null, "Active — offered on leave requests", ltForm.active, (on) =>
                setLtForm((f) => ({ ...f, active: on })),
              )}
            </span>
          </div>
          <p style={{ ...mutedS, margin: 0, lineHeight: 1.5 }}>
            Press Enter in the name or days field to add the leave type.
          </p>
        </div>,
        { span: 6 },
      )}
    </div>
  );

  /* ---------- HOLIDAYS ---------- */
  const holidaysTab = (
    <div className="adm-grid">
      {panel(
        "b-9-0",
        "Company holidays",
        "",
        tableWrap(
          420,
          [th("Date", "i-9-0-0"), th("Holiday name", "i-9-0-1"), th("Year", "i-9-0-2")],
          HOLIDAYS.map((h) => (
            <TR key={h.date} className="adm-row">
              <TD style={{ ...tdS, ...refS, whiteSpace: "nowrap" }}>{fmtDate(h.date)}</TD>
              <TD style={tdS}>{h.name}</TD>
              <TD style={tdS}>{h.year}</TD>
            </TR>
          )),
        ),
        { span: 6, flush: true },
      )}
    </div>
  );

  /* ---------- BALANCES ---------- */
  const balType = leaveTypes.find((t) => String(t.id) === balForm.ltId);
  const balKey = `${balForm.empId}|${balForm.ltId}|${balForm.year}`;
  const balCurrent = balType
    ? balances[balKey] !== undefined
      ? balances[balKey]
      : balType.days
    : null;
  const saveBalance = (e) => {
    e.preventDefault();
    const errs = {};
    const d = Number(balForm.days);
    if (!balForm.empId) errs.empId = "Choose an employee.";
    if (!balForm.ltId) errs.ltId = "Choose a leave type.";
    else if (balType && balType.unpaid)
      errs.ltId = "Unpaid leave has no balance check, so there is no entitlement to set.";
    if (!balForm.year) errs.year = "Choose a year.";
    if (balForm.days === "" || isNaN(d) || d < 0 || (d * 2) % 1 !== 0)
      errs.days = "Enter days in steps of 0.5, such as 22 or 7.5.";
    setBalErr(errs);
    if (Object.keys(errs).length) {
      notify("err", "The balance was not changed. Fix the flagged fields — your entries are kept.");
      return;
    }
    const emp = empById(balForm.empId);
    setBalances((b) => ({ ...b, [balKey]: d }));
    log(
      "Opening balance set",
      `Leave balance · ${emp.name} · ${balType.name} ${balForm.year}`,
      `entitlement_days: ${balCurrent}`,
      `entitlement_days: ${d}`,
    );
    setBalForm((f) => ({ ...f, days: "" }));
    notify(
      "ok",
      `${emp.name}'s ${balType.name.toLowerCase()} entitlement for ${balForm.year} is now ${d} days (was ${balCurrent}). Logged with both values.`,
    );
  };
  const balancesTab = (
    <div className="adm-grid">
      {panel(
        "b-9-1",
        "Set opening leave balance",
        "",
        <div
          role="group"
          aria-labelledby="b-9-1-h"
          onKeyDown={(e) => submitOnEnter(e, saveBalance)}
        >
          {sel(
            "b-emp",
            "i-9-1-0",
            "Employee",
            balForm.empId,
            (v) => setBalForm((f) => ({ ...f, empId: v })),
            empOptions(activeEmps),
            { error: balErr.empId, placeholder: "Choose an employee" },
          )}
          {sel(
            "b-lt",
            "i-9-1-1",
            "Leave type",
            balForm.ltId,
            (v) => setBalForm((f) => ({ ...f, ltId: v })),
            leaveTypes.filter((t) => t.active).map((t) => ({ value: String(t.id), label: t.name })),
            { error: balErr.ltId },
          )}
          {sel(
            "b-year",
            "i-9-1-2",
            "Year",
            balForm.year,
            (v) => setBalForm((f) => ({ ...f, year: v })),
            [
              { value: "2026", label: "2026" },
              { value: "2027", label: "2027" },
            ],
            { error: balErr.year },
          )}
          {txt(
            "b-days",
            "i-9-1-3",
            "Entitlement days",
            balForm.days,
            (v) => setBalForm((f) => ({ ...f, days: v })),
            {
              type: "number",
              step: "0.5",
              min: "0",
              error: balErr.days,
              hint:
                balForm.empId && balType && !balType.unpaid
                  ? `Current entitlement: ${balCurrent} days${balances[balKey] === undefined ? " (the leave type default)" : ""}.`
                  : "Choose an employee to see their current entitlement.",
            },
          )}
          <p style={{ ...mutedS, margin: 0, lineHeight: 1.5 }}>
            Press Enter in the days field to save the balance.
          </p>
        </div>,
        { span: 6 },
      )}
    </div>
  );

  /* ---------- ATTENDANCE ---------- */
  const isIncomplete = (r) => r.out === null && r.date < TODAY;
  const attRows = [...att].sort((a, b) =>
    a.date === b.date
      ? (isIncomplete(b) ? 1 : 0) - (isIncomplete(a) ? 1 : 0)
      : a.date < b.date
        ? 1
        : -1,
  );
  const selectedAtt = att.find((r) => r.id === attSel);
  const selectAtt = (r) => {
    setAttErr({});
    if (attSel === r.id) {
      setAttSel(null);
      setAttForm({ out: "", reason: "" });
      return;
    }
    setAttSel(r.id);
    setAttForm({ out: r.out || "", reason: "" });
  };
  const saveCorrection = (e) => {
    e.preventDefault();
    const errs = {};
    if (!selectedAtt) {
      notify("err", "Select an attendance row first.");
      return;
    }
    if (!attForm.out) errs.out = "Enter the clock out time.";
    else if (toMin(attForm.out) <= toMin(selectedAtt.inT))
      errs.out = `Clock out must be after the ${selectedAtt.inT} clock in.`;
    if (!attForm.reason.trim()) errs.reason = "A reason is required — it goes in the audit log.";
    setAttErr(errs);
    if (Object.keys(errs).length) {
      notify("err", "The punch was not corrected. Fix the flagged fields — your entries are kept.");
      return;
    }
    setAtt((l) =>
      l.map((r) =>
        r.id === selectedAtt.id
          ? { ...r, out: attForm.out, reg: true, reason: attForm.reason.trim() }
          : r,
      ),
    );
    log(
      "Attendance punch corrected",
      `Attendance · ${empName(selectedAtt.empId)} · ${fmtDate(selectedAtt.date)}`,
      `clock_out_at: ${selectedAtt.out || "—"}`,
      `clock_out_at: ${attForm.out} (regularised)`,
      attForm.reason.trim(),
    );
    notify(
      "ok",
      `${empName(selectedAtt.empId)}'s punch is regularised. Worked time is now ${fmtDur(toMin(attForm.out) - toMin(selectedAtt.inT))}.`,
    );
    setAttSel(null);
    setAttForm({ out: "", reason: "" });
  };
  const attendanceTab = (
    <div className="adm-grid">
      {panel(
        "b-10-0",
        "Daily attendance",
        "(HR Admin)",
        attRows.length ? (
          tableWrap(
            680,
            [
              th("Employee", "i-10-0-0"),
              th("Date", "i-10-0-1"),
              th("Clock in", "i-10-0-2"),
              th("Clock out", "i-10-0-3"),
              th("Worked", "i-10-0-4"),
              th("Incomplete punch flag", "i-10-0-5"),
            ],
            attRows.map((r) => {
              const s = attSel === r.id;
              const inc = isIncomplete(r);
              return (
                <TR key={r.id} className="adm-row" style={rowStyle(s)}>
                  <TD style={tdS}>{rowLink(empName(r.empId), s, () => selectAtt(r))}</TD>
                  <TD style={{ ...tdS, whiteSpace: "nowrap" }}>{fmtDate(r.date)}</TD>
                  <TD style={tdS}>{r.inT}</TD>
                  <TD style={tdS}>{r.out || <span style={mutedS}>—</span>}</TD>
                  <TD style={{ ...tdS, ...(r.out ? refS : mutedS) }}>
                    {r.out ? fmtDur(toMin(r.out) - toMin(r.inT)) : "—"}
                  </TD>
                  <TD style={tdS}>
                    {inc ? (
                      pill("warn", "Incomplete punch")
                    ) : r.reg ? (
                      pill("ok", "Regularised")
                    ) : r.out === null ? (
                      pill("info", "On shift")
                    ) : (
                      <span style={mutedS}>Complete</span>
                    )}
                  </TD>
                </TR>
              );
            }),
          )
        ) : (
          <Empty
            title="No punches recorded"
            description="When employees clock in, their arrival and departure times for the day are listed here."
          />
        ),
        {
          span: 8,
          flush: true,
          hint: "Punch times come from the server clock. Select a row to correct it.",
        },
      )}
      {panel(
        "b-10-1",
        "Correct punch",
        "",
        <div
          role="group"
          aria-labelledby="b-10-1-h"
          onKeyDown={(e) => submitOnEnter(e, saveCorrection)}
        >
          <p style={{ ...mutedS, margin: "0 0 16px", lineHeight: 1.5 }}>
            {selectedAtt ? (
              <span>
                Correcting <span style={{ color: C.text }}>{empName(selectedAtt.empId)}</span>,{" "}
                {fmtDate(selectedAtt.date)}, clocked in {selectedAtt.inT}.
              </span>
            ) : (
              "Select a row in the table to correct its punch."
            )}
          </p>
          {txt(
            "a-out",
            "i-10-1-0",
            "Clock out time",
            attForm.out,
            (v) => setAttForm((f) => ({ ...f, out: v })),
            { type: "time", disabled: !selectedAtt, error: attErr.out },
          )}
          <div style={{ marginBottom: 16 }}>
            <Label htmlFor="a-reason" style={labelStyle}>
              Reason for correction
            </Label>
            <Textarea
              id="a-reason"
              data-wf="i-10-1-1"
              rows={4}
              value={attForm.reason}
              disabled={!selectedAtt}
              onChange={(e) => setAttForm((f) => ({ ...f, reason: e.target.value }))}
              aria-invalid={attErr.reason ? "true" : undefined}
              aria-describedby={attErr.reason ? "a-reason-msg" : undefined}
              style={{
                ...inputStyle(attErr.reason),
                opacity: selectedAtt ? 1 : 0.5,
                resize: "vertical",
              }}
            />
            {msgFor("a-reason", attErr.reason)}
          </div>
          <p style={{ ...mutedS, margin: 0, lineHeight: 1.5 }}>
            Press Enter in the time field to save the correction, or Ctrl+Enter from the reason box.
          </p>
        </div>,
        { span: 4 },
      )}
    </div>
  );

  /* ---------- PROJECTS ---------- */
  const myProjects = projects.filter((p) => p.pmId === ME.employeeId);
  const selectedProj = myProjects.find((p) => p.id === projSel);
  const projAssigns = (pid) => assigns.filter((a) => a.projectId === pid);
  const selectProj = (p) => {
    setProjErr({});
    setConfirm(null);
    if (projSel === p.id) {
      setProjSel(null);
      setProjForm(BLANK_PROJ);
      return;
    }
    setProjSel(p.id);
    setProjForm((f) => ({ ...f, code: p.code, name: p.name, start: p.start, status: p.status }));
  };
  const saveProject = (e) => {
    e.preventDefault();
    const errs = {};
    const code = projForm.code.trim().toUpperCase();
    if (!code) errs.code = "Project code is required.";
    else if (projects.some((p) => p.id !== projSel && p.code === code))
      errs.code = `${code} is already in use.`;
    if (!projForm.name.trim()) errs.name = "Project name is required.";
    if (!projForm.start) errs.start = "Start date is required.";
    setProjErr(errs);
    if (Object.keys(errs).length) {
      notify("err", "The project was not saved. Fix the flagged fields — your entries are kept.");
      return;
    }
    if (selectedProj) {
      setProjects((l) =>
        l.map((p) =>
          p.id === projSel
            ? {
                ...p,
                code,
                name: projForm.name.trim(),
                start: projForm.start,
                status: projForm.status,
              }
            : p,
        ),
      );
      notify(
        "ok",
        projForm.status === "closed" && selectedProj.status !== "closed"
          ? `${code} is closed. It leaves timesheet project pickers; hours already booked stay visible.`
          : `Saved ${code}.`,
      );
    } else {
      setProjects((l) => [
        ...l,
        {
          id: nextId(l),
          code,
          name: projForm.name.trim(),
          pmId: ME.employeeId,
          start: projForm.start,
          status: projForm.status,
        },
      ]);
      notify(
        "ok",
        `${code} · ${projForm.name.trim()} is created${projForm.status === "active" ? " and ready for assignments" : ""}.`,
      );
      setProjForm(BLANK_PROJ);
    }
  };
  const assignEmployee = () => {
    const h = projForm.hours === "" ? null : Number(projForm.hours);
    if (!selectedProj) {
      notify("err", "Select one of your projects in the table first.");
      return;
    }
    if (selectedProj.status === "closed") {
      notify(
        "err",
        `${selectedProj.code} is closed and cannot take new assignments. Set it back to active first.`,
      );
      return;
    }
    if (!projForm.empId) {
      setProjErr({ empId: "Choose an employee to assign." });
      notify("err", "Choose an employee to assign.");
      return;
    }
    if (h !== null && (isNaN(h) || h <= 0)) {
      setProjErr({ hours: "Allocated hours must be a positive number, or left empty." });
      notify("err", "Check the allocated hours.");
      return;
    }
    if (projAssigns(selectedProj.id).some((a) => String(a.empId) === projForm.empId)) {
      setProjErr({
        empId: `${empName(projForm.empId)} is already assigned to ${selectedProj.code}.`,
      });
      notify("err", "That person is already on this project.");
      return;
    }
    setProjErr({});
    setAssigns((l) => [
      ...l,
      { id: nextId(l), projectId: selectedProj.id, empId: +projForm.empId, hours: h },
    ]);
    notify(
      "ok",
      `${empName(projForm.empId)} is assigned to ${selectedProj.code}${h ? ` with ${h} allocated hours` : ""}. It now appears in their timesheet picker.`,
    );
    setProjForm((f) => ({ ...f, empId: "", hours: "" }));
  };
  const askUnassign = () => {
    if (!selectedProj) {
      notify("err", "Select one of your projects in the table first.");
      return;
    }
    if (!projForm.empId) {
      setProjErr({ empId: "Choose which assigned employee to remove." });
      notify("err", "Choose the employee whose assignment should be removed.");
      return;
    }
    if (!projAssigns(selectedProj.id).some((a) => String(a.empId) === projForm.empId)) {
      setProjErr({ empId: `${empName(projForm.empId)} is not assigned to ${selectedProj.code}.` });
      notify("err", "That person is not on this project.");
      return;
    }
    setProjErr({});
    if (confirm && confirm.kind === "unassign") {
      doUnassign();
      return;
    }
    setConfirm({ kind: "unassign" });
    notify(
      "warn",
      `${empName(projForm.empId)} will no longer see ${selectedProj.code} in their picker for new entries; hours already recorded are kept. Press the button again to remove; press Escape or pick another project to keep the assignment.`,
    );
  };
  function doUnassign() {
    setAssigns((l) =>
      l.filter((a) => !(a.projectId === selectedProj.id && String(a.empId) === projForm.empId)),
    );
    notify(
      "ok",
      `${empName(projForm.empId)} is removed from ${selectedProj.code}. Hours already recorded are kept.`,
    );
    setProjForm((f) => ({ ...f, empId: "", hours: "" }));
    setConfirm(null);
  }
  const projectsTab = (
    <div style={{ display: "grid", gap: 24 }}>
      <div className="adm-grid">
        {panel(
          "b-11-0",
          "Projects",
          "(only those you manage)",
          myProjects.length ? (
            tableWrap(
              640,
              [
                th("Code", "i-11-0-0"),
                th("Name", "i-11-0-1"),
                th("Start date", "i-11-0-2"),
                th("Status", "i-11-0-3"),
                th("Assigned employees", "i-11-0-4"),
              ],
              myProjects.map((p) => {
                const s = projSel === p.id;
                const as = projAssigns(p.id);
                return (
                  <TR key={p.id} className="adm-row" style={rowStyle(s)}>
                    <TD style={tdS}>{rowLink(p.code, s, () => selectProj(p))}</TD>
                    <TD style={tdS}>{p.name}</TD>
                    <TD style={{ ...tdS, whiteSpace: "nowrap" }}>{fmtDate(p.start)}</TD>
                    <TD style={tdS}>
                      {p.status === "active" ? pill("ok", "Active") : pill("off", "Closed")}
                    </TD>
                    <TD style={tdS}>
                      {as.length ? (
                        <span>
                          <span style={refS}>{as.length}</span>{" "}
                          <span style={mutedS}>
                            · {as.map((a) => empName(a.empId).split(" ")[0]).join(", ")}
                          </span>
                        </span>
                      ) : (
                        <span style={mutedS}>No one yet</span>
                      )}
                    </TD>
                  </TR>
                );
              }),
            )
          ) : (
            <Empty
              title="You don't manage any projects yet"
              description="Create your first project in the form, then assign the people who may book hours to it."
            />
          ),
          {
            span: 7,
            flush: true,
            hint: "Select a project to edit it or to assign people to it. Select it again to start a new one.",
          },
        )}
        {panel(
          "b-11-1",
          "Create project or assign employee",
          "",
          <form id="proj-form" onSubmit={saveProject} noValidate>
            <p style={{ ...mutedS, margin: "0 0 16px" }}>
              {selectedProj
                ? `Working on ${selectedProj.code} · ${selectedProj.name}`
                : "New project — select a row to edit or assign instead."}
            </p>
            {txt(
              "p-code",
              "i-11-1-0",
              "Project code",
              projForm.code,
              (v) => setProjForm((f) => ({ ...f, code: v })),
              { error: projErr.code, placeholder: "ASH-OPS" },
            )}
            {txt(
              "p-name",
              "i-11-1-1",
              "Project name",
              projForm.name,
              (v) => setProjForm((f) => ({ ...f, name: v })),
              { error: projErr.name },
            )}
            {txt(
              "p-start",
              "i-11-1-2",
              "Start date",
              projForm.start,
              (v) => setProjForm((f) => ({ ...f, start: v })),
              { type: "date", error: projErr.start },
            )}
            <div style={{ marginBottom: 16 }}>
              <label htmlFor="p-status" style={labelStyle}>
                Status
              </label>
              <select
                id="p-status"
                data-wf="i-11-1-3"
                value={projForm.status}
                onChange={(e) => setProjForm((f) => ({ ...f, status: e.target.value }))}
                style={inputStyle(false)}
              >
                <option value="active">Active</option>
                <option value="closed">Closed</option>
              </select>
            </div>
            <div style={{ borderTop: `1px solid ${C.line}`, paddingTop: 16 }}>
              {sel(
                "p-emp",
                "i-11-1-4",
                "Employee to assign",
                projForm.empId,
                (v) => setProjForm((f) => ({ ...f, empId: v })),
                empOptions(activeEmps),
                { error: projErr.empId, placeholder: "Choose an employee" },
              )}
              {txt(
                "p-hours",
                "i-11-1-5",
                "Allocated hours (optional)",
                projForm.hours,
                (v) => setProjForm((f) => ({ ...f, hours: v })),
                { type: "number", min: "0", error: projErr.hours },
              )}
            </div>
          </form>,
          { span: 5 },
        )}
      </div>
      <div className="adm-grid">
        <Button
          data-wf="b-12-0"
          type="submit"
          form="proj-form"
          className="adm-btn s3"
          style={btn("primary")}
        >
          Save project
        </Button>
        <Button
          data-wf="b-12-1"
          type="button"
          onClick={assignEmployee}
          className="adm-btn s3"
          style={btn("secondary")}
        >
          Assign employee
        </Button>
        <Button
          data-wf="b-12-2"
          type="button"
          onClick={askUnassign}
          onKeyDown={cancelConfirm}
          className="adm-btn s3"
          style={btn("danger")}
        >
          {confirm && confirm.kind === "unassign"
            ? "Confirm: remove assignment"
            : "Remove assignment"}
        </Button>
      </div>
    </div>
  );

  const bodies = {
    users: usersTab,
    audit: auditTab,
    employees: <EmployeesTab />,
    departments: departmentsTab,
    leavetypes: leaveTypesTab,
    holidays: holidaysTab,
    balances: balancesTab,
    attendance: attendanceTab,
    projects: projectsTab,
  };
  const activeTab = TABS.find((t) => t.key === tab);
  const allowed = visibleTabs.some((t) => t.key === tab);
  const noticeColor = notice
    ? notice.tone === "err"
      ? C.bad
      : notice.tone === "warn"
        ? C.warn
        : C.accent
    : C.accent;

  return (
    <div
      className="adm"
      style={{
        "--acc": C.accent,
        color: C.text,
        fontFamily: brand.fontBody,
        fontVariantNumeric: "tabular-nums",
        background: C.bg,
        colorScheme: "dark",
        padding: "32px 24px 64px",
        minHeight: "100%",
      }}
    >
      <style>{`
        .adm *{box-sizing:border-box}
        .adm *:focus-visible{outline:2px solid var(--acc);outline-offset:2px}
        .adm input::placeholder,.adm textarea::placeholder{color:${C.muted};opacity:.8}
        .adm-grid{display:grid;grid-template-columns:minmax(0,1fr);gap:24px;align-items:start}
        @media (min-width:1100px){
          .adm-grid{grid-template-columns:repeat(12,minmax(0,1fr))}
          .adm-grid>.s3{grid-column:span 3}.adm-grid>.s4{grid-column:span 4}.adm-grid>.s5{grid-column:span 5}
          .adm-grid>.s6{grid-column:span 6}.adm-grid>.s7{grid-column:span 7}.adm-grid>.s8{grid-column:span 8}.adm-grid>.s12{grid-column:span 12}
        }
        .adm-btn{transition:filter .15s ease,transform .1s ease,background-color .15s ease}
        .adm-btn:hover{filter:brightness(1.12)}
        .adm-btn:active{transform:translateY(1px)}
        .adm-link:hover{text-decoration-color:var(--acc)!important}
        .adm-row{transition:background-color .15s ease}
        .adm-row:hover{background:${C.raised}}
        .adm-tab{transition:color .15s ease,border-color .15s ease}
        .adm-tab:hover{color:${C.text}!important}
        .adm-in{animation:adm-in .25s ease both}
        @keyframes adm-in{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}
        @media (prefers-reduced-motion:reduce){.adm *{animation:none!important;transition:none!important}}
      `}</style>

      <header style={{ marginBottom: 32 }}>
        <span
          aria-hidden="true"
          style={{ display: "block", width: 56, height: 1, background: C.accent, marginBottom: 16 }}
        />
        <h1
          data-wf="b-0-0"
          style={{
            fontFamily: brand.fontHeading,
            fontWeight: 400,
            fontSize: 40,
            lineHeight: 1.1,
            margin: 0,
            letterSpacing: "-0.01em",
          }}
        >
          Administration
        </h1>
        <p style={{ margin: "12px 0 0", color: C.muted, fontSize: 14, lineHeight: 1.5 }}>
          Signed in as <span style={{ color: C.text }}>{myName}</span> · {myRoleNames.join(" · ")}
        </p>
      </header>

      <div data-wf="b-1-0" style={{ marginBottom: 24 }}>
        <p style={{ ...labelStyle, marginBottom: 8 }}>Sections shown depend on your roles</p>
        <div
          role="tablist"
          aria-label="Administration sections"
          style={{
            display: "flex",
            gap: 24,
            overflowX: "auto",
            borderBottom: `1px solid ${C.line}`,
          }}
        >
          {visibleTabs.map((t, i) => {
            const on = t.key === tab;
            return (
              <button
                key={t.key}
                id={"tab-" + t.key}
                data-wf={t.wf}
                role="tab"
                type="button"
                aria-selected={on}
                aria-controls="adm-panel"
                tabIndex={on ? 0 : -1}
                className="adm-tab"
                onClick={() => changeTab(t.key)}
                onKeyDown={(e) => onTabKey(e, i)}
                style={{
                  background: "none",
                  border: 0,
                  borderBottom: `2px solid ${on ? C.accent : "transparent"}`,
                  marginBottom: -1,
                  padding: "12px 0",
                  minHeight: 44,
                  color: on ? C.text : C.muted,
                  fontSize: 14,
                  fontWeight: on ? 600 : 400,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ minHeight: 56, marginBottom: notice ? 24 : 0 }}>
        {notice ? (
          <div
            key={notice.n}
            className="adm-in"
            role={notice.tone === "err" ? "alert" : "status"}
            style={{
              display: "flex",
              gap: 12,
              alignItems: "flex-start",
              padding: "12px 16px",
              borderRadius: 6,
              border: `1px solid ${noticeColor}`,
              background: C.panel,
              fontSize: 14,
              lineHeight: 1.5,
            }}
          >
            {notice.tone === "err" || notice.tone === "warn" ? (
              <Icons.AlertCircle
                aria-hidden="true"
                style={{ width: 18, height: 18, marginTop: 1, flexShrink: 0, color: noticeColor }}
              />
            ) : (
              <Icons.CheckCircle
                aria-hidden="true"
                style={{ width: 18, height: 18, marginTop: 1, flexShrink: 0, color: noticeColor }}
              />
            )}
            <span>
              <strong style={{ color: noticeColor }}>
                {notice.tone === "err"
                  ? "Not saved. "
                  : notice.tone === "warn"
                    ? "Confirm first. "
                    : "Done. "}
              </strong>
              {notice.text}
            </span>
          </div>
        ) : null}
      </div>

      <div id="adm-panel" role="tabpanel" aria-labelledby={"tab-" + tab} key={tab}>
        {allowed ? (
          bodies[tab]
        ) : (
          <Empty
            title="This section is not available to your roles"
            description={`${activeTab ? activeTab.label : "This section"} needs the ${activeTab ? activeTab.need : "right"} role. Ask a System Admin to add it to your account.`}
          />
        )}
      </div>
    </div>
  );
}
