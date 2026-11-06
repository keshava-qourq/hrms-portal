import React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addDays, addWeeks, format, parseISO, startOfWeek } from "date-fns";

import * as UI from "@/lib/ui";
import { Icons } from "@/lib/icons";
import { brand } from "@/lib/brand";
import { apiFetch } from "@/lib/api";

const { Button, Badge, Empty } = UI;

type Project = { id: string; code: string; name: string; status: string; pickable: boolean };
type Entry = { project_id: string; work_date: string; hours: number };
type Week = {
  week_start: string;
  week_end: string;
  status: "draft" | "submitted" | "approved" | "rejected";
  editable: boolean;
  timesheet_id: string | null;
  projects: Project[];
  entries: Entry[];
  totals: { by_project: Record<string, number>; by_day: Record<string, number>; week: number };
};
type Sent = { project_id: string; work_date: string };

const ISO = "yyyy-MM-dd";
const DANGER = "hsl(6 68% 72%)";
const fmtH = (n: number) => String(Math.round(n * 100) / 100);
const keyOf = (pid: string, d: string) => `${pid}|${d}`;
const parseHours = (v: string): number | null => {
  const t = v.trim();
  if (t === "") return 0;
  const n = Number(t);
  return Number.isFinite(n) && n >= 0 ? n : null;
};
const mondayOf = (d: Date) => format(startOfWeek(d, { weekStartsOn: 1 }), ISO);

export default function Screen() {
  const P = brand.primaryColor,
    A = brand.accentColor,
    N = brand.neutralColor,
    B = brand.backgroundColor;
  const panel = `color-mix(in srgb, ${P} 5%, ${B})`;
  const line = `color-mix(in srgb, ${P} 12%, transparent)`;
  const lineStrong = `color-mix(in srgb, ${P} 24%, transparent)`;

  const client = useQueryClient();
  const [wk, setWk] = React.useState(() => mondayOf(new Date()));
  const [draft, setDraft] = React.useState<Record<string, string>>({});
  const [cellErrors, setCellErrors] = React.useState<Record<string, string>>({});
  const [dayErrors, setDayErrors] = React.useState<Record<string, boolean>>({});
  const [notice, setNotice] = React.useState<{ tone: "ok" | "err"; text: string } | null>(null);

  const query = useQuery({
    queryKey: ["timesheet-week", wk],
    queryFn: () => apiFetch<Week>(`/api/timesheets/week/${wk}`),
  });
  const data = query.data;
  const dates = Array.from({ length: 7 }, (_, i) => format(addDays(parseISO(wk), i), ISO));
  const saved: Record<string, number> = {};
  (data?.entries || []).forEach((e) => (saved[keyOf(e.project_id, e.work_date)] = e.hours));
  const projects = data?.projects || [];
  const canEdit = !!data?.editable;

  const cellValue = (pid: string, d: string) => {
    const k = keyOf(pid, d);
    if (k in draft) return draft[k];
    return saved[k] ? fmtH(saved[k]) : "";
  };
  const hoursOf = (pid: string, d: string) => parseHours(cellValue(pid, d)) ?? 0;
  const rowTotal = (pid: string) => dates.reduce((s, d) => s + hoursOf(pid, d), 0);
  const dayTotal = (d: string) => projects.reduce((s, p) => s + hoursOf(p.id, d), 0);
  const weekTotal = dates.reduce((s, d) => s + dayTotal(d), 0);

  const resetFeedback = () => {
    setCellErrors({});
    setDayErrors({});
    setNotice(null);
  };
  const goTo = (target: string) => {
    setWk(target);
    setDraft({});
    resetFeedback();
  };
  const shift = (n: number) => goTo(format(addWeeks(parseISO(wk), n), ISO));

  const onEdit = (pid: string, d: string, v: string) => {
    const k = keyOf(pid, d);
    setDraft((cur) => ({ ...cur, [k]: v }));
    setCellErrors((cur) => {
      const rest = { ...cur };
      delete rest[k];
      return rest;
    });
  };

  const save = useMutation({
    mutationFn: (entries: Array<Sent & { hours: number }>) =>
      apiFetch<Week>(`/api/timesheets/week/${wk}/entries`, {
        method: "PUT",
        body: JSON.stringify({ entries }),
      }),
  });

  const onSave = () => {
    resetFeedback();
    const errs: Record<string, string> = {};
    const entries: Array<Sent & { hours: number }> = [];
    Object.entries(draft).forEach(([k, v]) => {
      const h = parseHours(v);
      if (h === null) errs[k] = "Enter hours as a number, zero or more.";
      else {
        const [project_id, work_date] = k.split("|");
        entries.push({ project_id, work_date, hours: h });
      }
    });
    if (Object.keys(errs).length) {
      setCellErrors(errs);
      setNotice({ tone: "err", text: "Fix the highlighted cells. Nothing was saved." });
      return;
    }
    if (!entries.length) {
      setNotice({ tone: "ok", text: "Nothing to save." });
      return;
    }
    save.mutate(entries, {
      onSuccess: (resp) => {
        client.setQueryData(["timesheet-week", wk], resp);
        setDraft({});
        setNotice({ tone: "ok", text: "Draft saved." });
      },
      onError: (error) => {
        const err = error as Error & { detail?: unknown };
        const detail: Array<{ loc?: unknown[]; msg?: unknown }> = Array.isArray(err.detail)
          ? err.detail
          : [];
        const ce: Record<string, string> = {};
        const de: Record<string, boolean> = {};
        const messages: string[] = [];
        detail.forEach((item) => {
          const loc = item?.loc || [];
          const at = loc.indexOf("entries");
          const i = at >= 0 ? Number(loc[at + 1]) : NaN;
          const sent = entries[i];
          const msg = String(item?.msg ?? "");
          messages.push(msg);
          if (sent) {
            if (/daily maximum/i.test(msg)) de[sent.work_date] = true;
            else ce[keyOf(sent.project_id, sent.work_date)] = msg;
          }
        });
        const text = messages.length ? messages.join(" ") : err.message || "The week was not saved.";
        if (/daily maximum/i.test(text))
          dates.forEach((d) => {
            if (dayTotal(d) > 24) de[d] = true;
          });
        setCellErrors(ce);
        setDayErrors(de);
        setNotice({ tone: "err", text });
      },
    });
  };

  const eyebrow: React.CSSProperties = {
    fontSize: 12,
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    color: N,
    fontWeight: 500,
  };
  const h2: React.CSSProperties = {
    fontFamily: brand.fontHeading,
    fontSize: 20,
    fontWeight: 600,
    color: P,
    margin: 0,
  };
  const panelStyle: React.CSSProperties = {
    backgroundColor: panel,
    border: `1px solid ${line}`,
    borderRadius: brand.radius,
    padding: 24,
  };
  const th: React.CSSProperties = {
    ...eyebrow,
    textAlign: "left",
    padding: "12px 8px",
    borderBottom: `1px solid ${lineStrong}`,
  };
  const td: React.CSSProperties = {
    padding: "10px 8px",
    borderBottom: `1px solid ${line}`,
    verticalAlign: "top",
    fontVariantNumeric: "tabular-nums",
  };
  const status = data?.status ?? "draft";
  const statusLabel = status.charAt(0).toUpperCase() + status.slice(1);
  const weekLabel = `${format(parseISO(wk), "d MMM")} – ${format(addDays(parseISO(wk), 6), "d MMM yyyy")}`;

  return (
    <div
      className="ts"
      style={{
        backgroundColor: B,
        color: P,
        fontFamily: brand.fontBody,
        minHeight: "100%",
        padding: "32px 16px 64px",
      }}
    >
      <style>{`
        .ts button:disabled{opacity:.45;cursor:not-allowed}
        .ts-cell{width:72px;min-height:44px;padding:0 8px;text-align:right;background:${B};color:${P};border:1px solid ${lineStrong};border-radius:${brand.radius};font-variant-numeric:tabular-nums}
        .ts-cell[readonly]{background:transparent;border-style:dashed}
        .ts-cell[aria-invalid="true"]{border-color:${DANGER}}
      `}</style>
      <div
        style={{
          maxWidth: 1152,
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: 32,
        }}
      >
        <header data-wf="b-0-0">
          <p style={{ ...eyebrow, margin: 0 }}>Hours &amp; approvals</p>
          <h1
            style={{
              fontFamily: brand.fontHeading,
              fontSize: 40,
              fontWeight: 700,
              lineHeight: 1.15,
              margin: "8px 0 0",
              color: P,
            }}
          >
            My Timesheet
          </h1>
          <div
            aria-hidden="true"
            style={{ width: 48, height: 1, backgroundColor: A, margin: "16px 0" }}
          />
          <p style={{ margin: 0, color: N, fontSize: 16, lineHeight: 1.5, maxWidth: 620 }}>
            Book your hours against the projects you’re assigned to.
          </p>
        </header>

        <nav
          aria-label="Choose week"
          style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}
        >
          <Button type="button" variant="outline" onClick={() => shift(-1)}>
            <Icons.ArrowLeft className="h-4 w-4" aria-hidden="true" /> Previous week
          </Button>
          <p data-wf="b-2-1" style={{ margin: 0, fontSize: 16 }}>
            Week of {weekLabel}
          </p>
          <Button type="button" variant="outline" onClick={() => shift(1)}>
            Next week <Icons.ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Button>
          <span data-wf="b-1-1">
            <Badge>{statusLabel}</Badge>
          </span>
        </nav>

        {notice ? (
          <p
            role={notice.tone === "err" ? "alert" : "status"}
            style={{
              margin: 0,
              padding: "12px 16px",
              borderRadius: brand.radius,
              border: `1px solid ${notice.tone === "err" ? DANGER : A}`,
              color: notice.tone === "err" ? DANGER : P,
            }}
          >
            {notice.text}
          </p>
        ) : null}

        {query.isLoading ? (
          <p style={{ color: N }}>Loading this week…</p>
        ) : query.isError ? (
          <p role="alert" style={{ color: DANGER }}>
            This week could not be loaded.
          </p>
        ) : projects.length === 0 ? (
          <div data-wf="b-1-2" style={{ ...panelStyle, borderStyle: "dashed" }}>
            <Empty
              title="No projects yet"
              description="A Project Manager must assign you before you can log project hours."
            />
          </div>
        ) : (
          <section data-wf="b-3-0" aria-labelledby="h-grid" style={panelStyle}>
            <h2 id="h-grid" style={h2}>
              Hours by project
            </h2>
            {!canEdit ? (
              <p style={{ color: N, fontSize: 14 }}>
                This week is {status} and read-only.
              </p>
            ) : null}
            <div style={{ overflowX: "auto", marginTop: 16 }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th scope="col" style={th}>
                      Project
                    </th>
                    {dates.map((d) => (
                      <th key={d} scope="col" style={th}>
                        {format(parseISO(d), "EEE d")}
                      </th>
                    ))}
                    <th scope="col" style={{ ...th, textAlign: "right" }}>
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((p) => (
                    <tr key={p.id}>
                      <th scope="row" style={{ ...td, textAlign: "left", fontWeight: 500 }}>
                        <span style={{ color: A }}>{p.code}</span> {p.name}
                      </th>
                      {dates.map((d) => {
                        const k = keyOf(p.id, d);
                        const err = cellErrors[k];
                        const flagged = !!err || !!dayErrors[d];
                        const editable = canEdit && p.pickable;
                        return (
                          <td key={d} style={td}>
                            <input
                              className="ts-cell"
                              inputMode="decimal"
                              aria-label={`${p.code} ${format(parseISO(d), "EEE d MMM")}`}
                              value={cellValue(p.id, d)}
                              readOnly={!editable}
                              aria-invalid={flagged ? "true" : undefined}
                              aria-describedby={err ? "err-" + k : undefined}
                              onChange={(e) => onEdit(p.id, d, e.target.value)}
                            />
                            {err ? (
                              <p
                                id={"err-" + k}
                                style={{ margin: "4px 0 0", fontSize: 12, color: DANGER }}
                              >
                                {err}
                              </p>
                            ) : null}
                          </td>
                        );
                      })}
                      <td style={{ ...td, textAlign: "right" }} data-testid={"row-total-" + p.id}>
                        {fmtH(rowTotal(p.id))}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <th scope="row" style={{ ...td, textAlign: "left" }}>
                      Day total
                    </th>
                    {dates.map((d) => (
                      <td
                        key={d}
                        style={{ ...td, color: dayErrors[d] ? DANGER : P }}
                        data-testid={"day-total-" + d}
                      >
                        {fmtH(dayTotal(d))}
                      </td>
                    ))}
                    <td style={{ ...td, textAlign: "right", color: A }} data-testid="week-total">
                      {fmtH(weekTotal)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
            <div style={{ display: "flex", gap: 16, marginTop: 24, flexWrap: "wrap" }}>
              <Button type="button" data-wf="b-2-0" disabled={!canEdit || save.isPending} onClick={onSave}>
                Save draft
              </Button>
              <Button type="button" variant="outline" data-wf="b-2-2" disabled>
                Submit for approval
              </Button>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
