// @ts-nocheck -- generated from the approved design under its JS runtime contract; not hand-written TypeScript.
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";

import * as UI from "@/lib/ui";
import { Icons } from "@/lib/icons";
import { brand } from "@/lib/brand";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { Button, Input, Badge, Empty } = UI;

const MANAGER = 'Rahul Mehta';
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const MIN_WEEK = '2026-09-28';
const MAX_WEEK = '2026-11-16';
const THIS_WEEK = '2026-11-02';
const DANGER = 'hsl(6 68% 72%)';
const AMBER = 'hsl(38 72% 66%)';

const PROJECTS = [
  { id: 'p101', code: 'PRJ-101', name: 'Website Revamp', status: 'Active', wf: 'i-1-0-0' },
  { id: 'p117', code: 'PRJ-117', name: 'Mobile Billing', status: 'Active', wf: 'i-1-0-1' },
];

const row = (...a) => Array.from({ length: 7 }, (_, i) => (a[i] == null || a[i] === 0 ? '' : String(a[i])));

const INITIAL_WEEKS = {
  '2026-09-28': {
    status: 'Approved', entries: { p101: row(8, 8, 8, 6, 5.5), p117: row(0, 0, 0, 2, 2.5) },
    submittedAt: '2 Oct 16:55', decided: '5 Oct 2026', comment: '',
    history: [{ at: '5 Oct 09:41', kind: 'Approved', by: MANAGER }, { at: '2 Oct 16:55', kind: 'Submitted' }],
  },
  '2026-10-05': {
    status: 'Approved', entries: { p101: row(8, 7.5, 8, 8, 7), p117: row() },
    submittedAt: '9 Oct 17:30', decided: '12 Oct 2026', comment: 'Thanks, all in order.',
    history: [{ at: '12 Oct 11:02', kind: 'Approved', by: MANAGER, comment: 'Thanks, all in order.' }, { at: '9 Oct 17:30', kind: 'Submitted' }],
  },
  '2026-10-12': {
    status: 'Approved', entries: { p101: row(4, 4, 6, 4, 4), p117: row(4, 4, 2, 4, 4) },
    submittedAt: '16 Oct 16:48', decided: '19 Oct 2026', comment: '',
    history: [{ at: '19 Oct 09:30', kind: 'Approved', by: MANAGER }, { at: '16 Oct 16:48', kind: 'Submitted' }],
  },
  '2026-10-19': {
    status: 'Approved', entries: { p101: row(8, 8, 8, 5, 4), p117: row(0, 0, 0, 3, 4) },
    submittedAt: '23 Oct 17:05', decided: '26 Oct 2026', comment: '',
    history: [{ at: '26 Oct 10:12', kind: 'Approved', by: MANAGER }, { at: '23 Oct 17:05', kind: 'Submitted' }],
  },
  '2026-10-26': {
    status: 'Rejected', entries: { p101: row(6, 5, 4, 8, 8), p117: row(2, 3, 4, 0, 0) },
    submittedAt: '27 Oct 09:15', decided: '28 Oct 2026', comment: 'Please split Friday hours between both projects.',
    history: [
      { at: '28 Oct 16:40', kind: 'Rejected', by: MANAGER, comment: 'Please split Friday hours between both projects.' },
      { at: '27 Oct 09:15', kind: 'Submitted' },
    ],
  },
  '2026-11-02': {
    status: 'Draft', entries: { p101: row(8, 6), p117: row(0, 2) },
    submittedAt: null, decided: null, comment: '', history: [], savedAt: '3 Nov 08:50',
  },
};

const parseKey = (k) => { const [y, m, d] = k.split('-').map(Number); return new Date(Date.UTC(y, m - 1, d)); };
const addDays = (k, n) => { const d = parseKey(k); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); };
const dm = (k) => { const d = parseKey(k); return d.getUTCDate() + ' ' + MONTHS[d.getUTCMonth()]; };
const rangeLabel = (k) => { const e = addDays(k, 6); return dm(k) + ' – ' + dm(e) + ' ' + parseKey(e).getUTCFullYear(); };
const pad = (n) => String(n).padStart(2, '0');
const nowStamp = () => { const d = new Date(); return d.getDate() + ' ' + MONTHS[d.getMonth()] + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes()); };
const fmtH = (n) => String(Math.round(n * 100) / 100);
const num = (v) => { const n = Number(String(v).trim()); return isNaN(n) ? 0 : n; };
const blankWeek = () => ({ status: 'Draft', entries: {}, submittedAt: null, decided: null, comment: '', history: [] });

export default function Screen() {
  const P = brand.primaryColor, A = brand.accentColor, N = brand.neutralColor, B = brand.backgroundColor;
  const panel = `color-mix(in srgb, ${P} 5%, ${B})`;
  const raised = `color-mix(in srgb, ${P} 9%, ${B})`;
  const line = `color-mix(in srgb, ${P} 12%, transparent)`;
  const lineStrong = `color-mix(in srgb, ${P} 24%, transparent)`;

  const [weeks, setWeeks] = React.useState(INITIAL_WEEKS);
  const [wk, setWk] = React.useState('2026-10-26');
  const [errors, setErrors] = React.useState({});
  const [notice, setNotice] = React.useState(null);

  const week = weeks[wk] || blankWeek();
  const locked = week.status === 'Submitted' || week.status === 'Approved';
  const dates = DAYS.map((_, i) => addDays(wk, i));

  const cell = (pid, i) => (week.entries[pid] ? week.entries[pid][i] : '') || '';
  const rowTotal = (pid) => DAYS.reduce((s, _, i) => s + num(cell(pid, i)), 0);
  const dayTotal = (i) => PROJECTS.reduce((s, p) => s + num(cell(p.id, i)), 0);
  const weekTotal = PROJECTS.reduce((s, p) => s + rowTotal(p.id), 0);
  const totalFor = (w) => PROJECTS.reduce((s, p) => s + (w.entries[p.id] || []).reduce((a, v) => a + num(v), 0), 0);

  const statusMeta = {
    Draft: { icon: Icons.Edit, color: N },
    Submitted: { icon: Icons.Clock, color: AMBER },
    Approved: { icon: Icons.CheckCircle, color: A },
    Rejected: { icon: Icons.AlertCircle, color: DANGER },
  };
  const statusBadge = (s) => {
    const m = statusMeta[s]; const I = m.icon;
    return (
      <Badge style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '2px 10px', borderRadius: 999, fontSize: 12, fontWeight: 500, color: m.color, backgroundColor: `color-mix(in srgb, ${m.color} 12%, transparent)`, border: `1px solid color-mix(in srgb, ${m.color} 40%, transparent)` }}>
        <I className="h-3.5 w-3.5" aria-hidden="true" />{s}
      </Badge>
    );
  };

  const updateCell = (pid, i, val) => {
    setWeeks((w) => {
      const cur = w[wk] || blankWeek();
      const r = [...(cur.entries[pid] || Array(7).fill(''))];
      r[i] = val;
      return { ...w, [wk]: { ...cur, entries: { ...cur.entries, [pid]: r }, dirty: true } };
    });
    setErrors((e) => { const n = { ...e }; DAYS.forEach((_, d) => { if (d === i) PROJECTS.forEach((p) => delete n[p.id + ':' + d]); }); delete n[pid + ':' + i]; return n; });
    setNotice(null);
  };

  const validate = () => {
    const errs = {}; const msgs = [];
    PROJECTS.forEach((p) => DAYS.forEach((d, i) => {
      const v = String(cell(p.id, i)).trim();
      if (v === '') return;
      const ok = /^\d+(\.\d{1,2})?$/.test(v);
      if (!ok) { errs[p.id + ':' + i] = 1; msgs.push(`${p.code} on ${d} ${dm(dates[i])}: “${v}” isn’t a valid number of hours. Use a figure from 0 to 24, like 7.5.`); }
      else if (Number(v) > 24) { errs[p.id + ':' + i] = 1; msgs.push(`${p.code} on ${d} ${dm(dates[i])}: ${v} hours is more than a day holds. The daily maximum is 24.`); }
    }));
    DAYS.forEach((d, i) => {
      if (dayTotal(i) > 24) {
        PROJECTS.forEach((p) => { if (cell(p.id, i) !== '') errs[p.id + ':' + i] = 1; });
        msgs.push(`${d} ${dm(dates[i])} adds up to ${fmtH(dayTotal(i))} hours across projects. The daily maximum is 24.`);
      }
    });
    return { errs, msgs };
  };

  const save = () => {
    if (locked) return;
    const { errs, msgs } = validate();
    if (msgs.length) { setErrors(errs); setNotice({ kind: 'error', title: `Draft not saved — ${msgs.length === 1 ? 'one entry needs' : msgs.length + ' entries need'} fixing. Your hours are still here.`, items: msgs }); return; }
    setErrors({});
    const at = nowStamp();
    setWeeks((w) => ({ ...w, [wk]: { ...(w[wk] || blankWeek()), dirty: false, savedAt: at } }));
    setNotice({ kind: 'success', title: `Draft saved ${at}. Nothing is sent to ${MANAGER.split(' ')[0]} until you submit.`, items: [] });
  };

  const submit = () => {
    if (locked) return;
    const { errs, msgs } = validate();
    if (msgs.length) { setErrors(errs); setNotice({ kind: 'error', title: `Not submitted — ${msgs.length === 1 ? 'one entry needs' : msgs.length + ' entries need'} fixing. Your hours are still here.`, items: msgs }); return; }
    if (weekTotal <= 0) { setErrors({}); setNotice({ kind: 'error', title: 'Not submitted — at least one hours entry is required.', items: ['Add hours against a project for any day this week, then submit again.'] }); return; }
    setErrors({});
    const at = nowStamp();
    const kind = week.status === 'Rejected' ? 'Resubmitted' : 'Submitted';
    setWeeks((w) => {
      const cur = w[wk] || blankWeek();
      return { ...w, [wk]: { ...cur, status: 'Submitted', submittedAt: at, decided: null, comment: '', dirty: false, history: [{ at, kind }, ...cur.history] } };
    });
    setNotice({ kind: 'success', title: `${kind} to ${MANAGER} at ${at}. Hours are locked until he decides.`, items: [] });
  };

  const go = (n) => { setWk((k) => addDays(k, 7 * n)); setErrors({}); setNotice(null); };
  const open = (k) => { setWk(k); setErrors({}); setNotice(null); };

  const eyebrow = { fontSize: 12, letterSpacing: '0.14em', textTransform: 'uppercase', color: N, fontWeight: 500 };
  const h2 = { fontFamily: brand.fontHeading, fontSize: 20, fontWeight: 600, color: P, margin: 0, lineHeight: 1.3 };
  const panelStyle = { backgroundColor: panel, border: `1px solid ${line}`, borderRadius: brand.radius, padding: 24 };
  const th = { ...eyebrow, textAlign: 'left', padding: '12px 8px', borderBottom: `1px solid ${lineStrong}`, fontWeight: 500 };
  const td = { padding: '10px 8px', borderBottom: `1px solid ${line}`, verticalAlign: 'middle' };
  const num_ = { fontVariantNumeric: 'tabular-nums' };
  const btn = { minHeight: 44, padding: '0 20px', borderRadius: brand.radius, fontSize: 15, fontWeight: 500, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%' };

  const hint = (() => {
    if (week.status === 'Approved') return 'Approved timesheets are locked. Only an HR Admin can reopen one.';
    if (week.status === 'Submitted') return `Submitted ${week.submittedAt} — locked until ${MANAGER} decides.`;
    if (week.status === 'Rejected') return `Hours are editable again. Correct what ${MANAGER.split(' ')[0]} flagged, then submit this week again.`;
    if (week.dirty) return 'You have unsaved changes.';
    if (week.savedAt) return `Draft saved ${week.savedAt}.`;
    return 'Nothing is sent to your manager until you submit.';
  })();

  const historyKeys = Object.keys(weeks).sort().reverse();

  return (
    <div className="ts" style={{ backgroundColor: B, color: P, fontFamily: brand.fontBody, minHeight: '100%', padding: '32px 16px 64px' }}>
      <style>{`
        .ts *{box-sizing:border-box}
        .ts :is(button,input,a):focus-visible{outline:2px solid ${A};outline-offset:2px}
        .ts-cell{transition:border-color .15s ease,background-color .15s ease}
        .ts-cell:hover:not([readonly]){border-color:${A}}
        .ts-primary:not(:disabled):hover{filter:brightness(1.1)}
        .ts-secondary:not(:disabled):hover{background-color:${raised}}
        .ts-link:hover{text-decoration:underline}
        .ts button:disabled{opacity:.45;cursor:not-allowed}
        @keyframes ts-in{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}
        .ts-in{animation:ts-in .28s ease-out}
        @media (max-width:639px){
          .ts-stack thead{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)}
          .ts-stack,.ts-stack tbody,.ts-stack tfoot,.ts-stack tr,.ts-stack th,.ts-stack td{display:block;width:100%}
          .ts-stack tr{padding:12px 0;border-bottom:1px solid ${lineStrong}}
          .ts-stack th,.ts-stack td{border-bottom:0 !important;padding:4px 0 !important}
          .ts-stack td{display:flex;justify-content:space-between;align-items:center;gap:16px;min-height:44px;text-align:right}
          .ts-stack td::before{content:attr(data-label);color:${N};font-size:12px;letter-spacing:.14em;text-transform:uppercase;text-align:left;flex:none}
          .ts-cell{width:96px !important}
        }
        @media (prefers-reduced-motion:reduce){.ts-in{animation:none}.ts *{transition:none !important}}
      `}</style>

      <div style={{ maxWidth: 1152, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 32 }}>
        {/* Row 1 */}
        <header data-wf="b-0-0">
          <p style={{ ...eyebrow, margin: 0 }}>Hours &amp; approvals</p>
          <h1 style={{ fontFamily: brand.fontHeading, fontSize: 40, fontWeight: 700, lineHeight: 1.15, margin: '8px 0 0', color: P }}>My Timesheet</h1>
          <div aria-hidden="true" style={{ width: 48, height: 1, backgroundColor: A, margin: '16px 0' }} />
          <p style={{ margin: 0, color: N, fontSize: 16, lineHeight: 1.5, maxWidth: 620 }}>
            Book your hours against the projects you’re assigned to, then send the week to {MANAGER} for approval.
          </p>
        </header>

        {/* Row 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12" style={{ gap: 24 }}>
          <section data-wf="b-1-0" aria-labelledby="h-projects" className="lg:col-span-4" style={panelStyle}>
            <p style={{ ...eyebrow, margin: 0 }}>Assigned</p>
            <h2 id="h-projects" style={{ ...h2, marginTop: 4 }}>My projects</h2>
            <ul style={{ listStyle: 'none', margin: '16px 0 0', padding: 0 }}>
              {PROJECTS.map((p, i) => (
                <li key={p.id} data-wf={p.wf} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '16px 0', borderTop: `1px solid ${line}`, borderBottom: i === PROJECTS.length - 1 ? `1px solid ${line}` : 0 }}>
                  <div>
                    <div style={{ ...num_, color: A, fontSize: 13, letterSpacing: '0.08em', fontWeight: 500 }}>{p.code}</div>
                    <div style={{ fontSize: 16, marginTop: 2 }}>{p.name}</div>
                  </div>
                  <Badge style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '2px 10px', borderRadius: 999, fontSize: 12, color: A, backgroundColor: `color-mix(in srgb, ${A} 12%, transparent)`, border: `1px solid color-mix(in srgb, ${A} 40%, transparent)` }}>
                    <Icons.Check className="h-3.5 w-3.5" aria-hidden="true" />{p.status}
                  </Badge>
                </li>
              ))}
            </ul>
            <p style={{ margin: '16px 0 0', color: N, fontSize: 13, lineHeight: 1.5 }}>Only active projects you’re assigned to can take hours.</p>
          </section>

          <section data-wf="b-1-1" aria-labelledby="h-status" className="lg:col-span-4" style={panelStyle}>
            <div key={wk + week.status} className="ts-in">
              <p style={{ ...eyebrow, margin: 0 }}>This week’s decision</p>
              <h2 id="h-status" style={{ ...h2, marginTop: 4, display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                Status {statusBadge(week.status)}
              </h2>
              <div style={{ marginTop: 16, borderTop: `1px solid ${line}`, paddingTop: 16 }}>
                {week.status === 'Rejected' && (
                  <>
                    <p style={{ ...eyebrow, margin: 0 }}>Manager comment</p>
                    <blockquote style={{ margin: '8px 0 0', padding: '0 0 0 16px', borderLeft: `1px solid ${A}`, fontFamily: brand.fontHeading, fontStyle: 'italic', fontSize: 18, lineHeight: 1.5 }}>
                      “{week.comment}”
                    </blockquote>
                    <p style={{ ...num_, margin: '12px 0 0', color: N, fontSize: 13 }}>{MANAGER} · {week.decided}</p>
                    <p style={{ margin: '12px 0 0', fontSize: 14, lineHeight: 1.5 }}>The grid below is editable again. Fix it and submit for approval.</p>
                  </>
                )}
                {week.status === 'Draft' && (
                  <p style={{ margin: 0, fontSize: 15, lineHeight: 1.5 }}>Not submitted yet. Fill in the grid, save as you go, and submit when the week is complete.</p>
                )}
                {week.status === 'Submitted' && (
                  <>
                    <p style={{ margin: 0, fontSize: 15, lineHeight: 1.5 }}>With {MANAGER} for a decision. Hours are read-only until he approves or rejects.</p>
                    <p style={{ ...num_, margin: '12px 0 0', color: N, fontSize: 13 }}>Submitted {week.submittedAt}</p>
                  </>
                )}
                {week.status === 'Approved' && (
                  <>
                    <p style={{ margin: 0, fontSize: 15, lineHeight: 1.5 }}>Approved by {MANAGER}. This week is locked.</p>
                    {week.comment && <p style={{ margin: '12px 0 0', fontFamily: brand.fontHeading, fontStyle: 'italic', fontSize: 16 }}>“{week.comment}”</p>}
                    <p style={{ ...num_, margin: '12px 0 0', color: N, fontSize: 13 }}>Decided {week.decided}</p>
                  </>
                )}
              </div>
            </div>
          </section>

          <div data-wf="b-1-2" className="lg:col-span-4 md:col-span-2" style={{ ...panelStyle, borderStyle: 'dashed', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <p style={{ ...eyebrow, margin: '0 0 8px' }}>First-use state</p>
            <Empty title="No projects yet" description="A Project Manager must assign you before you can log project hours." />
          </div>
        </div>

        {/* Row 3 */}
        <nav aria-label="Choose week" className="grid grid-cols-2 lg:grid-cols-12" style={{ gap: 16, alignItems: 'center' }}>
          <p data-wf="b-2-1" aria-live="polite" className="col-span-2 lg:col-span-6 lg:order-2" style={{ margin: 0, textAlign: 'center', fontFamily: brand.fontHeading, fontSize: 22, fontWeight: 600, ...num_ }}>
            Week of {rangeLabel(wk)}
            {wk === THIS_WEEK && <span style={{ ...eyebrow, display: 'block', marginTop: 4, color: A }}>Current week</span>}
          </p>
          <div className="lg:col-span-3 lg:order-1">
            <Button data-wf="b-2-0" type="button" onClick={() => go(-1)} disabled={wk <= MIN_WEEK} className="ts-secondary" style={{ ...btn, backgroundColor: 'transparent', color: P, border: `1px solid ${lineStrong}` }}>
              <Icons.ArrowLeft className="h-4 w-4" aria-hidden="true" />Previous week
            </Button>
          </div>
          <div className="lg:col-span-3 lg:order-3">
            <Button data-wf="b-2-2" type="button" onClick={() => go(1)} disabled={wk >= MAX_WEEK} className="ts-secondary" style={{ ...btn, backgroundColor: 'transparent', color: P, border: `1px solid ${lineStrong}` }}>
              Next week<Icons.ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        </nav>

        {/* Rows 4 & 5 */}
        <form onSubmit={(e) => { e.preventDefault(); save(); }} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <section data-wf="b-3-0" aria-labelledby="h-grid" style={{ ...panelStyle, padding: '24px 24px 16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 16, flexWrap: 'wrap' }}>
              <h2 id="h-grid" style={h2}>Weekly hours (project by day)</h2>
              <span style={{ ...eyebrow, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                {locked ? <Icons.Clock className="h-4 w-4" aria-hidden="true" /> : <Icons.Edit className="h-4 w-4" aria-hidden="true" />}
                {locked ? 'Read-only' : 'Editable'}
              </span>
            </div>
            <table className="ts-stack" aria-labelledby="h-grid" style={{ width: '100%', borderCollapse: 'collapse', marginTop: 8 }}>
              <thead>
                <tr>
                  <th scope="col" data-wf="i-3-0-0" style={{ ...th, width: '22%' }}>Project</th>
                  {DAYS.map((d, i) => (
                    <th key={d} scope="col" data-wf={`i-3-0-${i + 1}`} style={{ ...th, textAlign: 'center', opacity: i > 4 ? 0.8 : 1 }}>
                      {d}
                      <span style={{ ...num_, display: 'block', fontSize: 12, letterSpacing: 0, textTransform: 'none', marginTop: 2 }}>{dm(dates[i])}</span>
                    </th>
                  ))}
                  <th scope="col" data-wf="i-3-0-8" style={{ ...th, textAlign: 'right' }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {PROJECTS.map((p) => (
                  <tr key={p.id}>
                    <th scope="row" style={{ ...td, textAlign: 'left', fontWeight: 400 }}>
                      <span style={{ ...num_, color: A, fontSize: 13, letterSpacing: '0.08em', display: 'block' }}>{p.code}</span>
                      <span style={{ fontSize: 15 }}>{p.name}</span>
                    </th>
                    {DAYS.map((d, i) => {
                      const key = p.id + ':' + i; const bad = !!errors[key];
                      return (
                        <td key={d} data-label={`${d} ${dm(dates[i])}`} style={{ ...td, textAlign: 'center', ...num_ }}>
                          {locked ? (
                            <span style={{ color: cell(p.id, i) ? P : N }}>{cell(p.id, i) || '–'}</span>
                          ) : (
                            <Input
                              className="ts-cell"
                              inputMode="decimal"
                              autoComplete="off"
                              aria-label={`${p.code} ${p.name} hours on ${d} ${dm(dates[i])}`}
                              aria-invalid={bad ? 'true' : undefined}
                              value={cell(p.id, i)}
                              placeholder="0"
                              onChange={(e) => updateCell(p.id, i, e.target.value)}
                              style={{ width: 64, height: 44, textAlign: 'center', ...num_, backgroundColor: B, color: P, border: `1px solid ${bad ? DANGER : lineStrong}`, borderRadius: brand.radius, fontSize: 15, padding: '0 4px' }}
                            />
                          )}
                        </td>
                      );
                    })}
                    <td data-label="Total" style={{ ...td, textAlign: 'right', ...num_, fontWeight: 500 }}>{fmtH(rowTotal(p.id))}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr style={{ borderTop: `3px double ${A}` }}>
                  <th scope="row" style={{ ...eyebrow, padding: '16px 8px', textAlign: 'left', borderTop: `3px double ${A}` }}>Day total</th>
                  {DAYS.map((d, i) => {
                    const t = dayTotal(i); const over = t > 24;
                    return (
                      <td key={d} data-label={`${d} ${dm(dates[i])}`} style={{ padding: '16px 8px', textAlign: 'center', ...num_, borderTop: `3px double ${A}`, color: over ? DANGER : t ? P : N }}>
                        {over && <Icons.AlertCircle className="h-4 w-4" aria-label="Over the 24 hour daily maximum" style={{ display: 'inline', marginRight: 4, verticalAlign: 'text-bottom' }} />}
                        {fmtH(t)}
                      </td>
                    );
                  })}
                  <td data-label="Week total" style={{ padding: '16px 8px', textAlign: 'right', ...num_, borderTop: `3px double ${A}`, fontFamily: brand.fontHeading, fontSize: 24, fontWeight: 700, color: A }}>
                    {fmtH(weekTotal)}<span style={{ fontSize: 13, fontFamily: brand.fontBody, color: N, fontWeight: 400 }}> h</span>
                  </td>
                </tr>
              </tfoot>
            </table>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-12" style={{ gap: 16, alignItems: 'start' }}>
            <div className="lg:col-span-3">
              <Button data-wf="b-4-0" type="submit" disabled={locked} className="ts-secondary" style={{ ...btn, backgroundColor: 'transparent', color: P, border: `1px solid ${lineStrong}` }}>
                Save draft
              </Button>
            </div>
            <div className="lg:col-span-3">
              <Button data-wf="b-4-1" type="button" onClick={submit} disabled={locked} className="ts-primary" style={{ ...btn, backgroundColor: A, color: B, border: `1px solid ${A}`, fontWeight: 600 }}>
                Submit for approval
              </Button>
            </div>
            <div className="lg:col-span-6" aria-live="polite" style={{ minHeight: 44, display: 'flex', alignItems: 'center' }}>
              {notice ? (
                <div role={notice.kind === 'error' ? 'alert' : 'status'} className="ts-in" style={{ width: '100%', padding: '12px 16px', borderRadius: brand.radius, backgroundColor: `color-mix(in srgb, ${notice.kind === 'error' ? DANGER : A} 10%, transparent)`, border: `1px solid color-mix(in srgb, ${notice.kind === 'error' ? DANGER : A} 40%, transparent)`, fontSize: 14, lineHeight: 1.5 }}>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                    {notice.kind === 'error'
                      ? <Icons.AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" style={{ color: DANGER, marginTop: 3 }} />
                      : <Icons.CheckCircle className="h-4 w-4 shrink-0" aria-hidden="true" style={{ color: A, marginTop: 3 }} />}
                    <span><strong style={{ fontWeight: 600 }}>{notice.title}</strong></span>
                  </div>
                  {notice.items.length > 0 && (
                    <ul style={{ margin: '8px 0 0 24px', padding: 0, color: P }}>
                      {notice.items.map((m, i) => <li key={i}>{m}</li>)}
                    </ul>
                  )}
                </div>
              ) : (
                <p style={{ margin: 0, color: N, fontSize: 14, lineHeight: 1.5, display: 'flex', gap: 8, alignItems: 'center' }}>
                  {locked && <Icons.Clock className="h-4 w-4 shrink-0" aria-hidden="true" />}
                  <span>{hint}</span>
                </p>
              )}
            </div>
          </div>
        </form>

        {/* Row 6 */}
        <div className="grid grid-cols-1 lg:grid-cols-12" style={{ gap: 24, alignItems: 'start' }}>
          <section data-wf="b-5-0" aria-labelledby="h-history" className="lg:col-span-7" style={{ ...panelStyle, padding: '24px 24px 16px' }}>
            <h2 id="h-history" style={h2}>Timesheet history</h2>
            <table className="ts-stack" aria-labelledby="h-history" style={{ width: '100%', borderCollapse: 'collapse', marginTop: 8 }}>
              <thead>
                <tr>
                  <th scope="col" data-wf="i-5-0-0" style={th}>Week</th>
                  <th scope="col" data-wf="i-5-0-1" style={th}>Status</th>
                  <th scope="col" data-wf="i-5-0-2" style={{ ...th, textAlign: 'right' }}>Total hours</th>
                  <th scope="col" data-wf="i-5-0-3" style={th}>Decision date</th>
                  <th scope="col" data-wf="i-5-0-4" style={th}>Manager comment</th>
                </tr>
              </thead>
              <tbody>
                {historyKeys.map((k) => {
                  const w = weeks[k]; const current = k === wk;
                  return (
                    <tr key={k} aria-current={current ? 'true' : undefined} style={{ backgroundColor: current ? raised : 'transparent' }}>
                      <th scope="row" style={{ ...td, textAlign: 'left', fontWeight: 400, boxShadow: current ? `inset 1px 0 0 ${A}` : 'none', ...num_ }}>
                        <button type="button" className="ts-link" onClick={() => open(k)} aria-label={`Open week of ${rangeLabel(k)}`} style={{ background: 'none', border: 0, padding: '8px 0 8px 8px', minHeight: 44, color: current ? A : P, cursor: 'pointer', font: 'inherit', textAlign: 'left' }}>
                          {dm(k)} – {dm(addDays(k, 6))}
                        </button>
                      </th>
                      <td data-label="Status" style={td}>{statusBadge(w.status)}</td>
                      <td data-label="Total hours" style={{ ...td, textAlign: 'right', ...num_ }}>{fmtH(totalFor(w))}</td>
                      <td data-label="Decision date" style={{ ...td, ...num_, color: w.decided ? P : N }}>{w.decided || '—'}</td>
                      <td data-label="Manager comment" style={{ ...td, fontSize: 14, fontStyle: w.comment ? 'italic' : 'normal', color: w.comment ? P : N }}>{w.comment || '—'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </section>

          <section data-wf="b-5-1" aria-labelledby="h-trail" className="lg:col-span-5" style={panelStyle}>
            <p style={{ ...eyebrow, margin: 0 }}>{rangeLabel(wk)}</p>
            <h2 id="h-trail" style={{ ...h2, marginTop: 4 }}>Approval history for this week</h2>
            {week.history.length === 0 ? (
              <div style={{ marginTop: 16, padding: 16, border: `1px dashed ${lineStrong}`, borderRadius: brand.radius }}>
                <p style={{ margin: 0, fontSize: 15, fontWeight: 500 }}>Nothing submitted for this week yet</p>
                <p style={{ margin: '4px 0 0', color: N, fontSize: 14, lineHeight: 1.5 }}>Each step — submitted, rejected, resubmitted, approved — is logged here with its time and any comment.</p>
              </div>
            ) : (
              <ol style={{ listStyle: 'none', margin: '16px 0 0', padding: 0 }}>
                {week.history.map((h, i) => {
                  const c = h.kind === 'Rejected' ? DANGER : h.kind === 'Approved' ? A : h.kind === 'Resubmitted' || h.kind === 'Submitted' ? AMBER : N;
                  return (
                    <li key={h.at + h.kind} data-wf={i < 2 ? `i-5-1-${i}` : undefined} className="ts-in" style={{ display: 'grid', gridTemplateColumns: '16px 1fr', columnGap: 16, paddingBottom: i === week.history.length - 1 ? 0 : 20, position: 'relative' }}>
                      <span aria-hidden="true" style={{ width: 9, height: 9, borderRadius: 999, border: `1px solid ${c}`, backgroundColor: i === 0 ? c : B, marginTop: 6, marginLeft: 3 }} />
                      {i !== week.history.length - 1 && <span aria-hidden="true" style={{ position: 'absolute', left: 7, top: 20, bottom: 4, width: 1, backgroundColor: line }} />}
                      <div>
                        <span style={{ ...num_, color: A, fontSize: 14, marginRight: 8 }}>{h.at}</span>
                        <span style={{ fontSize: 15 }}>{h.kind}{h.by ? ` by ${h.by}` : ''}</span>
                        {h.comment && <p style={{ margin: '6px 0 0', fontFamily: brand.fontHeading, fontStyle: 'italic', fontSize: 15, lineHeight: 1.5, color: N }}>“{h.comment}”</p>}
                      </div>
                    </li>
                  );
                })}
              </ol>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
