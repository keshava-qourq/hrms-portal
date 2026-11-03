// @ts-nocheck -- matches the generated Administration screen's JS runtime contract.
import React from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { Icons } from "@/lib/icons";
import { brand } from "@/lib/brand";
import { formatDate } from "@/lib/datetime";
import { apiFetch } from "@/lib/api";

// GET /api/employees -> { items[], total }. The directory is the live list; the create
// and manager-change forms write back to it through POST and PATCH /api/employees.
async function fetchEmployees() {
  const data = await apiFetch("/api/employees");
  return data?.items || [];
}

// GET /api/departments -> { items[] }. The department select reuses this one shared list.
async function fetchDepartments() {
  const data = await apiFetch("/api/departments");
  return Array.isArray(data) ? data : data?.items || [];
}

const BLANK = {
  employee_number: "",
  full_name: "",
  work_email: "",
  department_id: "",
  reporting_manager_id: "",
  start_date: "",
};

// The mandatory fields POST /api/employees expects; each is flagged inline if missing.
const REQUIRED = {
  full_name: "Full name is required.",
  employee_number: "Employee ID is required.",
  work_email: "Work email is required.",
  department_id: "Department is required.",
  reporting_manager_id: "Reporting manager is required.",
  start_date: "Start date is required.",
};

export default function EmployeesTab() {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = React.useState(null);
  const [notice, setNotice] = React.useState(null);

  const C = {
    bg: brand.backgroundColor,
    panel: `color-mix(in srgb, ${brand.primaryColor} 5%, ${brand.backgroundColor})`,
    field: `color-mix(in srgb, black 22%, ${brand.backgroundColor})`,
    line: `color-mix(in srgb, ${brand.primaryColor} 12%, transparent)`,
    text: brand.primaryColor,
    muted: brand.neutralColor,
    accent: brand.accentColor,
    bad: "hsl(5 78% 76%)",
  };

  const employeesQuery = useQuery({ queryKey: ["employees"], queryFn: fetchEmployees });
  const departmentsQuery = useQuery({ queryKey: ["departments"], queryFn: fetchDepartments });
  const employees = employeesQuery.data || [];
  const departments = departmentsQuery.data || [];

  const deptName = (id) => (departments.find((d) => String(d.id) === String(id)) || {}).name || "—";
  const empName = (id) =>
    (employees.find((e) => String(e.id) === String(id)) || {}).full_name || "—";

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: BLANK, mode: "onSubmit" });

  const createMutation = useMutation({
    mutationFn: (body) =>
      apiFetch("/api/employees", { method: "POST", body: JSON.stringify(body) }),
    onSuccess: (created) => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      reset(BLANK);
      setNotice({ tone: "ok", text: `${created?.full_name || "The employee"} is in the directory.` });
    },
    onError: (err) => setNotice({ tone: "err", text: err?.message || "The record was not saved." }),
  });

  const patchMutation = useMutation({
    mutationFn: ({ id, body }) =>
      apiFetch(`/api/employees/${id}`, { method: "PATCH", body: JSON.stringify(body) }),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      setNotice({
        tone: "ok",
        text: `Saved. ${updated?.full_name || "The record"} now reports to ${empName(
          updated?.reporting_manager_id,
        )}.`,
      });
      selectRow(null);
    },
    onError: (err) => setNotice({ tone: "err", text: err?.message || "The change was not saved." }),
  });

  const selectRow = (emp) => {
    setNotice(null);
    if (!emp || (editingId && editingId === emp.id)) {
      setEditingId(null);
      reset(BLANK);
      return;
    }
    setEditingId(emp.id);
    reset({
      employee_number: emp.employee_number || "",
      full_name: emp.full_name || "",
      work_email: emp.work_email || "",
      department_id: emp.department_id ? String(emp.department_id) : "",
      reporting_manager_id: emp.reporting_manager_id ? String(emp.reporting_manager_id) : "",
      start_date: emp.start_date || "",
    });
  };

  const onSubmit = (values) => {
    if (editingId) {
      // PATCH carries only the HR-editable fields; the reporting manager is the one
      // this flow changes and the directory reflects after the refetch (AC-034).
      patchMutation.mutate({
        id: editingId,
        body: {
          department_id: values.department_id,
          reporting_manager_id: values.reporting_manager_id,
        },
      });
    } else {
      createMutation.mutate({
        employee_number: values.employee_number.trim(),
        full_name: values.full_name.trim(),
        work_email: values.work_email.trim(),
        department_id: values.department_id,
        reporting_manager_id: values.reporting_manager_id,
        start_date: values.start_date,
      });
    }
  };

  /* ---------- styling helpers ---------- */
  const labelStyle = {
    display: "block",
    fontSize: 12,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: C.muted,
    marginBottom: 6,
    fontWeight: 600,
  };
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

  const fieldError = (name) =>
    errors[name] ? (
      <p
        id={name + "-msg"}
        role="alert"
        style={{
          margin: "6px 0 0",
          fontSize: 13,
          color: C.bad,
          display: "flex",
          gap: 6,
          alignItems: "flex-start",
        }}
      >
        <Icons.AlertCircle aria-hidden="true" style={{ width: 14, height: 14, marginTop: 2 }} />
        <span>{errors[name].message}</span>
      </p>
    ) : null;

  const textField = (name, label, type, extra = {}) => (
    <div style={{ marginBottom: 16 }}>
      <label htmlFor={"emp-" + name} style={labelStyle}>
        {label}
      </label>
      <input
        id={"emp-" + name}
        type={type || "text"}
        disabled={extra.disabled}
        aria-invalid={errors[name] ? "true" : undefined}
        aria-describedby={errors[name] ? name + "-msg" : undefined}
        style={{ ...inputStyle(errors[name]), opacity: extra.disabled ? 0.5 : 1 }}
        {...register(name, { required: REQUIRED[name] })}
      />
      {fieldError(name)}
    </div>
  );

  const selectField = (name, label, options, extra = {}) => (
    <div style={{ marginBottom: 16 }}>
      <label htmlFor={"emp-" + name} style={labelStyle}>
        {label}
      </label>
      <select
        id={"emp-" + name}
        aria-invalid={errors[name] ? "true" : undefined}
        aria-describedby={errors[name] ? name + "-msg" : undefined}
        style={inputStyle(errors[name])}
        {...register(name, { required: REQUIRED[name] })}
      >
        <option value="">{extra.placeholder || "Choose…"}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {fieldError(name)}
    </div>
  );

  const deptOptions = departments.map((d) => ({ value: String(d.id), label: d.name }));
  const mgrOptions = employees
    .filter((e) => String(e.id) !== String(editingId))
    .map((e) => ({ value: String(e.id), label: e.full_name }));

  const noticeColor = notice && notice.tone === "err" ? C.bad : C.accent;

  return (
    <div
      style={{
        color: C.text,
        fontFamily: brand.fontBody,
        display: "grid",
        gap: 24,
      }}
    >
      {notice ? (
        <p
          role="status"
          style={{
            margin: 0,
            padding: "12px 16px",
            borderRadius: 6,
            fontSize: 14,
            border: `1px solid ${noticeColor}`,
            color: noticeColor,
          }}
        >
          {notice.text}
        </p>
      ) : null}

      <div
        style={{
          display: "grid",
          gap: 24,
          gridTemplateColumns: "minmax(0, 1fr)",
          alignItems: "start",
        }}
      >
        <section
          aria-labelledby="emp-dir-h"
          style={{ background: C.panel, border: `1px solid ${C.line}`, borderRadius: 6 }}
        >
          <div style={{ padding: "24px 24px 16px" }}>
            <h2
              id="emp-dir-h"
              style={{ fontFamily: brand.fontHeading, fontSize: 22, fontWeight: 400, margin: 0 }}
            >
              Employee directory
            </h2>
          </div>
          <div style={{ overflowX: "auto" }}>
            {employeesQuery.isLoading ? (
              <p style={{ padding: "0 24px 24px", color: C.muted }}>Loading the directory…</p>
            ) : employeesQuery.isError ? (
              <p role="alert" style={{ padding: "0 24px 24px", color: C.bad }}>
                The employee directory could not be loaded.
              </p>
            ) : employees.length === 0 ? (
              <p style={{ padding: "0 24px 24px", color: C.muted }}>
                No employees yet. Add the first record using the form.
              </p>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 760 }}>
                <thead>
                  <tr>
                    <th scope="col" style={thS}>
                      Employee ID
                    </th>
                    <th scope="col" style={thS}>
                      Name
                    </th>
                    <th scope="col" style={thS}>
                      Department
                    </th>
                    <th scope="col" style={thS}>
                      Reporting manager
                    </th>
                    <th scope="col" style={thS}>
                      Start date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((e) => (
                    <tr key={e.id}>
                      <td style={{ ...tdS, color: C.accent, fontWeight: 600 }}>
                        {e.employee_number}
                      </td>
                      <td style={tdS}>
                        <button
                          type="button"
                          aria-pressed={editingId === e.id}
                          onClick={() => selectRow(e)}
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
                            textUnderlineOffset: 4,
                          }}
                        >
                          {e.full_name}
                        </button>
                      </td>
                      <td style={tdS}>{deptName(e.department_id)}</td>
                      <td style={tdS}>
                        {e.reporting_manager_id ? (
                          empName(e.reporting_manager_id)
                        ) : (
                          <span style={{ color: C.muted }}>None — routes to HR</span>
                        )}
                      </td>
                      <td style={{ ...tdS, whiteSpace: "nowrap" }}>{formatDate(e.start_date)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>

        <section
          aria-labelledby="emp-form-h"
          style={{ background: C.panel, border: `1px solid ${C.line}`, borderRadius: 6 }}
        >
          <div style={{ padding: "24px 24px 16px" }}>
            <h2
              id="emp-form-h"
              style={{ fontFamily: brand.fontHeading, fontSize: 22, fontWeight: 400, margin: 0 }}
            >
              Employee record
            </h2>
            <p style={{ color: C.muted, fontSize: 13, margin: "8px 0 0" }}>
              {editingId
                ? "Editing — change the department or reporting manager."
                : "New employee — records are created one at a time."}
            </p>
          </div>
          <div style={{ padding: "0 24px 24px" }}>
            <form id="emp-form" onSubmit={handleSubmit(onSubmit)} noValidate>
              {textField("employee_number", "Employee ID", "text", { disabled: !!editingId })}
              {textField("full_name", "Full name", "text", { disabled: !!editingId })}
              {textField("work_email", "Work email", "email", { disabled: !!editingId })}
              {selectField("department_id", "Department", deptOptions)}
              {selectField("reporting_manager_id", "Reporting manager", mgrOptions)}
              {textField("start_date", "Start date", "date", { disabled: !!editingId })}
              <div style={{ display: "flex", gap: 12 }}>
                <button
                  type="submit"
                  disabled={createMutation.isPending || patchMutation.isPending}
                  style={{
                    minHeight: 44,
                    padding: "10px 16px",
                    borderRadius: 6,
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: "pointer",
                    background: C.accent,
                    color: C.bg,
                    border: `1px solid ${C.accent}`,
                  }}
                >
                  {editingId ? "Save changes" : "Save employee"}
                </button>
                {editingId ? (
                  <button
                    type="button"
                    onClick={() => selectRow(null)}
                    style={{
                      minHeight: 44,
                      padding: "10px 16px",
                      borderRadius: 6,
                      fontSize: 14,
                      fontWeight: 600,
                      cursor: "pointer",
                      background: "transparent",
                      color: C.text,
                      border: `1px solid ${C.line}`,
                    }}
                  >
                    Cancel
                  </button>
                ) : null}
              </div>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}
