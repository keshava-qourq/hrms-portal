import React from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { apiFetch } from "@/lib/api";
import { brand } from "@/lib/brand";

type Me = { employee_id?: string | null };
type Employee = {
  id: string;
  employee_number: string;
  full_name: string;
  work_email: string;
  mobile_number: string | null;
  personal_contact: string | null;
  department_id: string;
  reporting_manager_id: string | null;
};
type Values = { mobile_number: string; personal_contact: string };

const HAIRLINE = "1px solid rgba(255,255,255,0.10)";
const labelStyle = { color: brand.neutralColor, letterSpacing: "0.18em" };
const fieldStyle = {
  border: HAIRLINE,
  borderRadius: brand.radius,
  height: 44,
  backgroundColor: "rgba(0,0,0,0.25)",
  color: brand.primaryColor,
};

export default function Screen() {
  const client = useQueryClient();
  const [notice, setNotice] = React.useState<{ ok: boolean; text: string } | null>(null);

  const meQuery = useQuery({ queryKey: ["me"], queryFn: () => apiFetch<Me>("/api/me") });
  const empId = meQuery.data?.employee_id;
  const empQuery = useQuery({
    queryKey: ["employee", empId],
    queryFn: () => apiFetch<Employee>(`/api/employees/${empId}`),
    enabled: !!empId,
  });
  const emp = empQuery.data;
  const deptQuery = useQuery({
    queryKey: ["departments"],
    queryFn: async () => {
      const d = await apiFetch<{ items?: Array<{ id: string; name: string }> }>("/api/departments");
      return Array.isArray(d) ? d : (d?.items ?? []);
    },
    enabled: !!emp,
    retry: false,
  });
  const mgrId = emp?.reporting_manager_id;
  const mgrQuery = useQuery({
    queryKey: ["employee", mgrId],
    queryFn: () => apiFetch<Employee>(`/api/employees/${mgrId}`),
    enabled: !!mgrId,
    retry: false,
  });

  const { register, handleSubmit, reset } = useForm<Values>({
    defaultValues: { mobile_number: "", personal_contact: "" },
  });
  React.useEffect(() => {
    if (emp)
      reset({ mobile_number: emp.mobile_number ?? "", personal_contact: emp.personal_contact ?? "" });
  }, [emp, reset]);

  const save = useMutation({
    mutationFn: (v: Values) =>
      apiFetch<Employee>(`/api/employees/${empId}`, {
        method: "PATCH",
        body: JSON.stringify({
          mobile_number: v.mobile_number,
          personal_contact: v.personal_contact,
        }),
      }),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["employee", empId] });
      setNotice({ ok: true, text: "Your contact details were saved." });
    },
    onError: (err) =>
      setNotice({ ok: false, text: err instanceof Error ? err.message : "The change was not saved." }),
  });

  const deptName = deptQuery.data?.find((d) => String(d.id) === String(emp?.department_id))?.name;

  let body: React.ReactNode;
  if (meQuery.isLoading || empQuery.isLoading) {
    body = <p style={{ color: brand.neutralColor }}>Loading your profile…</p>;
  } else if (meQuery.isError || empQuery.isError || !emp) {
    body = <p role="alert">Your profile could not be loaded.</p>;
  } else {
    const readOnly: Array<[string, string]> = [
      ["Name", emp.full_name],
      ["Employee ID", emp.employee_number],
      ["Department", deptName ?? "—"],
      ["Reporting manager", mgrQuery.data?.full_name ?? "—"],
      ["Work email", emp.work_email],
    ];
    body = (
      <form
        className="space-y-5"
        onSubmit={handleSubmit((v) => {
          setNotice(null);
          save.mutate(v);
        })}
        noValidate
      >
        {readOnly.map(([label, value]) => (
          <div key={label} className="space-y-2">
            <label htmlFor={"pf-" + label} className="block text-xs uppercase" style={labelStyle}>
              {label}
            </label>
            <input
              id={"pf-" + label}
              readOnly
              value={value}
              className="w-full px-3 text-sm"
              style={{ ...fieldStyle, opacity: 0.7 }}
            />
          </div>
        ))}
        {(
          [
            ["mobile_number", "Mobile number"],
            ["personal_contact", "Personal contact"],
          ] as const
        ).map(([name, label]) => (
          <div key={name} className="space-y-2">
            <label htmlFor={"pf-" + name} className="block text-xs uppercase" style={labelStyle}>
              {label}
            </label>
            <input
              id={"pf-" + name}
              className="w-full px-3 text-sm"
              style={fieldStyle}
              {...register(name)}
            />
          </div>
        ))}
        {notice ? (
          <p role={notice.ok ? "status" : "alert"} className="text-sm">
            {notice.text}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={save.isPending}
          className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.25em]"
          style={{
            backgroundColor: brand.accentColor,
            color: brand.backgroundColor,
            borderRadius: brand.radius,
          }}
        >
          Save changes
        </button>
      </form>
    );
  }

  return (
    <div className="mx-auto w-full max-w-xl p-4 sm:p-8" style={{ fontFamily: brand.fontBody }}>
      <h1 className="mb-6 text-3xl" style={{ fontFamily: brand.fontHeading }}>
        My Profile
      </h1>
      {body}
    </div>
  );
}
