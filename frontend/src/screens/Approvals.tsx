// @ts-nocheck -- generated from the approved design under its JS runtime contract; not hand-written TypeScript.
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";

import * as UI from "@/lib/ui";
import { Icons } from "@/lib/icons";
import { brand } from "@/lib/brand";
import { useNavigate } from "@/lib/navigate";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { Select } = UI;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { X, Home, Clock, Edit, ArrowLeft, ArrowRight, CheckCircle } = Icons;

const VIEWER = {
  name: 'Daniel Okafor',
  employeeId: 'E-1042',
  roles: ['Employee', 'Reporting Manager', 'HR Admin'],
};

const DAY_LABELS = [
  { d: 'Mon', n: '26' },
  { d: 'Tue', n: '27' },
  { d: 'Wed', n: '28' },
  { d: 'Thu', n: '29' },
  { d: 'Fri', n: '30' },
  { d: 'Sat', n: '31' },
  { d: 'Sun', n: '1' },
];

const INITIAL_PENDING = [
  {
    id: 'LR-0218',
    empId: 'E-1215',
    name: 'Lena Fischer',
    kind: 'leave',
    typeText: 'Leave request · Annual',
    periodText: '19–24 Nov 2026',
    periodNote: '4.0 days',
    title: 'Review: Lena Fischer, Annual leave 19–24 Nov (4.0 days)',
    submitted: 'Fri 30 Oct, 17:05',
    leaveType: 'Annual',
    days: 4,
    reason: 'Family visit abroad. Handover notes for the design system audit are with Aisha.',
    breakdown: [
      { label: 'Thu 19 Nov', note: 'Working day', value: 1 },
      { label: 'Fri 20 Nov', note: 'Working day', value: 1 },
      { label: 'Sat 21 Nov', note: 'Weekend, not counted', value: 0 },
      { label: 'Sun 22 Nov', note: 'Weekend, not counted', value: 0 },
      { label: 'Mon 23 Nov', note: 'Working day', value: 1 },
      { label: 'Tue 24 Nov', note: 'Working day', value: 1 },
    ],
    balance: { entitlement: 20, taken: 6, pending: 4 },
  },
  {
    id: 'TS-0446',
    empId: 'E-1187',
    name: 'Aisha Khan',
    kind: 'timesheet',
    typeText: 'Timesheet',
    periodText: 'Week of 26 Oct',
    periodNote: '40.0 h',
    title: 'Review: Aisha Khan, timesheet week of 26 Oct (40.0 h)',
    submitted: 'Mon 2 Nov, 08:52',
    projects: [
      { code: 'HLR-101', name: 'Harbour Ledger Rewrite', hours: [6, 5, 8, 4, 3, 0, 0] },
      { code: 'CPV-330', name: 'Customer Portal v3', hours: [2, 3, 0, 4, 5, 0, 0] },
    ],
  },
  {
    id: 'TS-0447',
    empId: 'E-1203',
    name: 'Marcus Webb',
    kind: 'timesheet',
    typeText: 'Timesheet',
    periodText: 'Week of 26 Oct',
    periodNote: '37.5 h',
    title: 'Review: Marcus Webb, timesheet week of 26 Oct (37.5 h)',
    submitted: 'Mon 2 Nov, 16:40',
    projects: [
      { code: 'HLR-101', name: 'Harbour Ledger Rewrite', hours: [7.5, 7.5, 7.5, 7.5, 0, 0, 0] },
      { code: 'OPS-017', name: 'Platform On-call Rota', hours: [0, 0, 0, 0, 7.5, 0, 0] },
    ],
  },
];

const INITIAL_TEAM = [
  {
    id: 'E-1187',
    name: 'Aisha Khan',
    dept: 'Engineering',
    ts: { status: 'Submitted', detail: 'Week of 26 Oct' },
    leave: { status: 'Approved', detail: 'Annual · 21–22 Dec' },
  },
  {
    id: 'E-1203',
    name: 'Marcus Webb',
    dept: 'Engineering',
    ts: { status: 'Submitted', detail: 'Week of 26 Oct' },
    leave: { status: 'None', detail: 'No open requests' },
  },
  {
    id: 'E-1215',
    name: 'Lena Fischer',
    dept: 'Design',
    ts: { status: 'Approved', detail: 'Week of 26 Oct' },
    leave: { status: 'Submitted', detail: 'Annual · 19–24 Nov' },
  },
];

const INITIAL_APPROVED = [
  { id: 'ap-1', empId: 'E-1215', name: 'Lena Fischer', kind: 'timesheet', typeText: 'Timesheet', periodText: 'Week of 26 Oct (36.0 h)', period: 'Week of 26 Oct', approvedBy: 'Daniel Okafor' },
  { id: 'ap-2', empId: 'E-1187', name: 'Aisha Khan', kind: 'leave', typeText: 'Leave request · Annual', periodText: '21–22 Dec (2.0 days)', days: 2, leaveType: 'Annual', approvedBy: 'Daniel Okafor' },
  { id: 'ap-3', empId: 'E-1122', name: 'Tomás Alvarez', kind: 'timesheet', typeText: 'Timesheet', periodText: 'Week of 19 Oct (38.0 h)', period: 'Week of 19 Oct', approvedBy: 'Sofia Marino' },
  { id: 'ap-4', empId: 'E-1098', name: 'Hannah Brooks', kind: 'leave', typeText: 'Leave request · Sick', periodText: '28 Oct, first half (0.5 days)', days: 0.5, leaveType: 'Sick', approvedBy: 'Sofia Marino' },
  { id: 'ap-5', empId: 'E-1160', name: 'Ravi Patel', kind: 'leave', typeText: 'Leave request · Annual', periodText: '5–9 Oct (5.0 days)', days: 5, leaveType: 'Annual', approvedBy: 'Priya Nair' },
];

const CSS = `
.ta-root { --ta-radius: 6px; }
.ta-root *:focus-visible { outline: 2px solid var(--ta-accent); outline-offset: 2px; }
.ta-root button { font-family: inherit; cursor: pointer; }
.ta-eyebrow { font-size: 12px; letter-spacing: .1em; text-transform: uppercase; color: var(--ta-muted); font-weight: 500; }
.ta-ref { color: var(--ta-accent); letter-spacing: .04em; font-size: 12px; }
.ta-panel { background: var(--ta-surface); border: 1px solid var(--ta-line); border-radius: var(--ta-radius); }
.ta-btn { min-height: 44px; padding: 0 20px; border-radius: var(--ta-radius); display: inline-flex; align-items: center; justify-content: center; gap: 8px; font-size: 14px; font-weight: 500; border: 1px solid var(--ta-line-strong); background: transparent; color: var(--ta-text); transition: background-color .15s, filter .15s, transform .1s; }
.ta-btn:hover { background: var(--ta-raise); }
.ta-btn:active { transform: translateY(1px); }
.ta-btn-primary { background: var(--ta-accent); border-color: var(--ta-accent); color: var(--ta-bg); }
.ta-btn-primary:hover { background: var(--ta-accent); filter: brightness(1.1); }
.ta-icon-btn { min-width: 44px; min-height: 44px; display: inline-flex; align-items: center; justify-content: center; border: 1px solid transparent; background: transparent; color: var(--ta-muted); border-radius: var(--ta-radius); transition: background-color .15s, color .15s; }
.ta-icon-btn:hover { background: var(--ta-raise); color: var(--ta-text); }
.ta-tab { min-height: 48px; padding: 0 20px; background: transparent; border: 0; border-bottom: 2px solid transparent; color: var(--ta-muted); font-size: 14px; font-weight: 500; white-space: nowrap; transition: color .15s, border-color .15s; }
.ta-tab:hover { color: var(--ta-text); }
.ta-tab[aria-selected="true"] { color: var(--ta-text); border-bottom-color: var(--ta-accent); }
.ta-field { width: 100%; background: var(--ta-bg); color: var(--ta-text); border: 1px solid var(--ta-line-strong); border-radius: var(--ta-radius); padding: 12px; font-size: 14px; font-family: inherit; line-height: 1.5; transition: border-color .15s; }
.ta-field::placeholder { color: var(--ta-muted); }
.ta-field:hover { border-color: var(--ta-muted); }
.ta-field[aria-invalid="true"] { border-color: var(--ta-text); }
.ta-table { width: 100%; border-collapse: collapse; font-size: 14px; }
.ta-table th { text-align: left; font-size: 12px; letter-spacing: .08em; text-transform: uppercase; color: var(--ta-muted); font-weight: 500; padding: 12px 16px; border-bottom: 1px solid var(--ta-line); }
.ta-table td { padding: 16px; border-bottom: 1px solid var(--ta-line); vertical-align: top; line-height: 1.5; }
.ta-table tbody tr:last-child td { border-bottom: 0; }
.ta-table tbody tr { transition: background-color .15s; animation: ta-in .28s ease-out both; }
.ta-table tbody tr:hover { background: var(--ta-raise); }
.ta-table tbody tr[data-selected="true"] { background: var(--ta-raise); }
.ta-link { display: inline-flex; align-items: center; gap: 4px; min-height: 44px; background: transparent; border: 0; padding: 0; color: var(--ta-text); font-size: 15px; font-weight: 500; text-decoration: underline; text-decoration-color: var(--ta-line-strong); text-underline-offset: 4px; text-align: left; transition: text-decoration-color .15s; }
.ta-link:hover { text-decoration-color: var(--ta-accent); }
.ta-tag { display: inline-flex; align-items: center; gap: 6px; padding: 2px 10px; border: 1px solid var(--ta-line-strong); border-radius: 999px; font-size: 12px; font-weight: 500; letter-spacing: .02em; white-space: nowrap; }
.ta-tag[data-status="Approved"] { color: var(--ta-accent); border-color: var(--ta-accent); }
.ta-tag[data-status="Rejected"] { border-style: dashed; }
.ta-tag[data-status="Draft"] { color: var(--ta-muted); }
.ta-sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
.ta-scrim { background: color-mix(in srgb, var(--ta-bg) 82%, transparent); animation: ta-fade .18s ease-out both; }
.ta-dialog { background: var(--ta-surface); border: 1px solid var(--ta-line-strong); border-radius: var(--ta-radius); box-shadow: 0 24px 48px color-mix(in srgb, var(--ta-bg) 70%, transparent); animation: ta-pop .22s ease-out both; }
.ta-dialog:focus { outline: none; }
.ta-notice { animation: ta-in .25s ease-out both; }
@keyframes ta-in { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
@keyframes ta-fade { from { opacity: 0; } to { opacity: 1; } }
@keyframes ta-pop { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }
@media (max-width: 639px) {
  .ta-table thead { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); }
  .ta-table, .ta-table tbody, .ta-table tr, .ta-table td { display: block; }
  .ta-table tbody tr { padding: 12px 16px; border-bottom: 1px solid var(--ta-line); }
  .ta-table tbody tr:last-child { border-bottom: 0; }
  .ta-table td { display: flex; justify-content: space-between; align-items: center; gap: 16px; padding: 6px 0; border: 0; text-align: right; }
  .ta-table td::before { content: attr(data-label); color: var(--ta-muted); font-size: 12px; letter-spacing: .08em; text-transform: uppercase; text-align: left; flex-shrink: 0; }
  .ta-table td .ta-field { min-width: 0; }
  .ta-btn-row { flex-direction: column; }
  .ta-btn-row .ta-btn { width: 100%; }
}
@media (prefers-reduced-motion: reduce) {
  .ta-root *, .ta-root *::before { animation: none !important; transition: none !important; }
}
`;

export default function Screen() {
  const navigate = useNavigate();
  const canReopen = VIEWER.roles.indexOf('HR Admin') !== -1;

  const [tab, setTab] = React.useState('pending');
  const [pending, setPending] = React.useState(INITIAL_PENDING);
  const [team, setTeam] = React.useState(INITIAL_TEAM);
  const [approved, setApproved] = React.useState(INITIAL_APPROVED);
  const [openId, setOpenId] = React.useState(null);
  const [comment, setComment] = React.useState('');
  const [commentError, setCommentError] = React.useState('');
  const [notice, setNotice] = React.useState(null);
  const [reopenSel, setReopenSel] = React.useState(null);
  const [reopenReason, setReopenReason] = React.useState('');
  const [reopenError, setReopenError] = React.useState('');

  const dialogRef = React.useRef(null);
  const commentRef = React.useRef(null);

  const openItem = pending.find((p) => p.id === openId) || null;

  React.useEffect(() => {
    if (!openId) return undefined;
    const prev = document.activeElement;
    if (dialogRef.current) dialogRef.current.focus();
    return () => {
      if (prev && document.contains(prev) && prev.focus) {
        prev.focus();
      } else {
        const t = document.getElementById('ta-tab-pending');
        if (t) t.focus();
      }
    };
  }, [openId]);

  const vars = {
    '--ta-bg': brand.backgroundColor,
    '--ta-surface': 'color-mix(in srgb, ' + brand.primaryColor + ' 5%, ' + brand.backgroundColor + ')',
    '--ta-raise': 'color-mix(in srgb, ' + brand.primaryColor + ' 9%, ' + brand.backgroundColor + ')',
    '--ta-line': 'color-mix(in srgb, ' + brand.primaryColor + ' 12%, transparent)',
    '--ta-line-strong': 'color-mix(in srgb, ' + brand.primaryColor + ' 26%, transparent)',
    '--ta-text': brand.primaryColor,
    '--ta-muted': brand.neutralColor,
    '--ta-accent': brand.accentColor,
    '--ta-radius': brand.radius,
  };

  const fmt = (n) => Number(n).toFixed(1);

  const openReview = (id) => {
    setComment('');
    setCommentError('');
    setOpenId(id);
  };
  const closeReview = () => {
    setOpenId(null);
    setComment('');
    setCommentError('');
  };

  const decide = (action) => {
    if (!openItem) return;
    if (openItem.empId === VIEWER.employeeId) {
      setCommentError('You cannot decide your own submission. It has been routed to your reporting manager.');
      return;
    }
    if (action === 'reject' && !comment.trim()) {
      setCommentError('Add a comment before rejecting. ' + openItem.name.split(' ')[0] + ' needs to know what to change.');
      if (commentRef.current) commentRef.current.focus();
      return;
    }
    const item = openItem;
    const first = item.name.split(' ')[0];
    setPending((p) => p.filter((x) => x.id !== item.id));
    setTeam((t) =>
      t.map((m) => {
        if (m.id !== item.empId) return m;
        if (item.kind === 'timesheet') {
          return {
            ...m,
            ts: action === 'approve'
              ? { status: 'Approved', detail: item.periodText }
              : { status: 'Rejected', detail: item.periodText + ' · editable again' },
          };
        }
        return {
          ...m,
          leave: {
            status: action === 'approve' ? 'Approved' : 'Rejected',
            detail: item.leaveType + ' · ' + item.periodText.replace(' 2026', ''),
          },
        };
      })
    );
    if (action === 'approve') {
      setApproved((a) => [
        {
          id: 'ap-' + item.id,
          empId: item.empId,
          name: item.name,
          kind: item.kind,
          typeText: item.typeText,
          periodText: item.kind === 'timesheet'
            ? item.periodText + ' (' + item.periodNote + ')'
            : item.periodText.replace(' 2026', '') + ' (' + item.periodNote + ')',
          period: item.periodText,
          days: item.days,
          leaveType: item.leaveType,
          approvedBy: VIEWER.name + ' (you)',
        },
        ...a,
      ]);
      setNotice({
        text: item.kind === 'timesheet'
          ? 'Approved. ' + first + '’s timesheet for ' + item.periodText.toLowerCase() + ' is now locked, and she has an in-app alert.'
          : 'Approved. ' + item.days.toFixed(1) + ' days are deducted from ' + first + '’s ' + item.leaveType + ' balance, and she has an in-app alert.',
      });
    } else {
      setNotice({
        text: item.kind === 'timesheet'
          ? 'Rejected. ' + first + '’s timesheet is back with her as an editable draft, with your comment attached.'
          : 'Rejected. Nothing was deducted from ' + first + '’s balance, and your comment is on the request.',
      });
    }
    closeReview();
  };

  const onDialogKey = (e) => {
    if (e.key === 'Escape') {
      e.stopPropagation();
      closeReview();
      return;
    }
    if (e.key !== 'Tab' || !dialogRef.current) return;
    const f = dialogRef.current.querySelectorAll('button, textarea, input, [href], [tabindex]:not([tabindex="-1"])');
    if (!f.length) return;
    const firstEl = f[0];
    const lastEl = f[f.length - 1];
    if (e.shiftKey && (document.activeElement === firstEl || document.activeElement === dialogRef.current)) {
      e.preventDefault();
      lastEl.focus();
    } else if (!e.shiftKey && document.activeElement === lastEl) {
      e.preventDefault();
      firstEl.focus();
    }
  };

  const doReopen = () => {
    if (!reopenSel) {
      setReopenError('Choose an approved item from the table first.');
      return;
    }
    if (!reopenReason.trim()) {
      setReopenError('Give a reason. It is written to the audit log with your name and the previous status.');
      return;
    }
    const item = approved.find((a) => a.id === reopenSel);
    if (!item) return;
    const first = item.name.split(' ')[0];
    setApproved((a) => a.filter((x) => x.id !== item.id));
    setTeam((t) =>
      t.map((m) => {
        if (m.id !== item.empId) return m;
        if (item.kind === 'timesheet') return { ...m, ts: { status: 'Draft', detail: item.period + ' · reopened' } };
        return { ...m, leave: { status: 'None', detail: 'No open requests' } };
      })
    );
    setNotice({
      text: item.kind === 'timesheet'
        ? 'Reopened. ' + first + '’s timesheet (' + item.period.toLowerCase() + ') is a Draft again and no longer counts as approved. Logged with your reason.'
        : 'Reopened. ' + item.days.toFixed(1) + ' days went back into ' + first + '’s ' + item.leaveType + ' balance. Logged with your reason.',
    });
    setReopenSel(null);
    setReopenReason('');
    setReopenError('');
  };

  const TABS = [
    { key: 'pending', label: 'Pending approvals (' + pending.length + ')', wf: 'i-1-0-0' },
    { key: 'team', label: 'My team', wf: 'i-1-0-1' },
    { key: 'reopen', label: 'Reopen approved items', wf: 'i-1-0-2' },
  ];

  const onTabKey = (e, idx) => {
    let next = null;
    if (e.key === 'ArrowRight') next = (idx + 1) % TABS.length;
    if (e.key === 'ArrowLeft') next = (idx - 1 + TABS.length) % TABS.length;
    if (e.key === 'Home') next = 0;
    if (e.key === 'End') next = TABS.length - 1;
    if (next === null) return;
    e.preventDefault();
    setTab(TABS[next].key);
    const el = document.getElementById('ta-tab-' + TABS[next].key);
    if (el) el.focus();
  };

  const tag = (status) => {
    const map = { Submitted: 'Clock', Approved: 'CheckCircle', Rejected: 'X', Draft: 'Edit' };
    const I = map[status] ? Icons[map[status]] : null;
    return (
      <span className="ta-tag" data-status={status}>
        {I ? <I className="h-3.5 w-3.5" aria-hidden="true" /> : null}
        {status === 'None' ? 'None open' : status}
      </span>
    );
  };

  const renderHours = (item) => {
    if (item.kind === 'timesheet') {
      const totals = DAY_LABELS.map((_, i) => item.projects.reduce((s, p) => s + p.hours[i], 0));
      return (
        <ul className="m-0 flex list-none flex-col gap-4 p-0">
          {item.projects.map((p) => (
            <li key={p.code}>
              <div className="mb-2 flex items-baseline justify-between gap-4">
                <span className="text-sm">
                  <span className="ta-ref">{p.code}</span>
                  <span className="ml-2">{p.name}</span>
                </span>
                <span className="text-sm">{fmt(p.hours.reduce((a, b) => a + b, 0))} h</span>
              </div>
              <div className="grid grid-cols-7 gap-1">
                {DAY_LABELS.map((d, i) => (
                  <div
                    key={d.d}
                    className="px-1 py-2 text-center"
                    style={{ border: '1px solid var(--ta-line)', borderRadius: 'var(--ta-radius)', background: 'var(--ta-bg)' }}
                  >
                    <div style={{ fontSize: 11, color: 'var(--ta-muted)', letterSpacing: '.04em' }}>{d.d} {d.n}</div>
                    <div className="mt-1 text-sm" style={{ color: p.hours[i] ? 'var(--ta-text)' : 'var(--ta-muted)' }}>
                      {p.hours[i] ? fmt(p.hours[i]) : '–'}
                    </div>
                  </div>
                ))}
              </div>
            </li>
          ))}
          <li style={{ borderTop: '1px solid var(--ta-line)', paddingTop: 12 }}>
            <div className="mb-2 flex items-baseline justify-between gap-4">
              <span className="ta-eyebrow">Day totals</span>
              <span style={{ color: 'var(--ta-accent)', fontFamily: brand.fontHeading, fontSize: 20 }}>{item.periodNote}</span>
            </div>
            <div className="grid grid-cols-7 gap-1">
              {totals.map((t, i) => (
                <div key={i} className="px-1 py-1 text-center text-sm" style={{ color: t ? 'var(--ta-text)' : 'var(--ta-muted)' }}>
                  {t ? fmt(t) : '–'}
                </div>
              ))}
            </div>
          </li>
        </ul>
      );
    }
    const b = item.balance;
    return (
      <div className="flex flex-col gap-4">
        <ul className="m-0 list-none p-0">
          {item.breakdown.map((r) => (
            <li
              key={r.label}
              className="flex items-baseline justify-between gap-4 py-2 text-sm"
              style={{ borderBottom: '1px solid var(--ta-line)', color: r.value ? 'var(--ta-text)' : 'var(--ta-muted)' }}
            >
              <span>{r.label}</span>
              <span>{r.note}</span>
              <span style={{ minWidth: 32, textAlign: 'right' }}>{fmt(r.value)}</span>
            </li>
          ))}
          <li className="flex items-baseline justify-between gap-4 pt-3">
            <span className="ta-eyebrow">Days deducted on approval</span>
            <span style={{ color: 'var(--ta-accent)', fontFamily: brand.fontHeading, fontSize: 20 }}>{item.periodNote}</span>
          </li>
        </ul>
        <p className="m-0 text-sm" style={{ color: 'var(--ta-muted)' }}>
          {item.leaveType} balance: {fmt(b.entitlement)} entitlement · {fmt(b.taken)} taken · {fmt(b.pending)} pending
        </p>
        <div>
          <div className="ta-eyebrow mb-1">Reason given</div>
          <p className="m-0 text-sm" style={{ lineHeight: 1.6 }}>{item.reason}</p>
        </div>
      </div>
    );
  };

  return (
    <div
      className="ta-root"
      style={{ ...vars, fontFamily: brand.fontBody, fontVariantNumeric: 'tabular-nums', color: 'var(--ta-text)', background: 'var(--ta-bg)', minHeight: '100%' }}
    >
      <style>{CSS}</style>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 p-4 sm:p-8">
        <header>
          <div aria-hidden="true" style={{ width: 48, height: 1, background: 'var(--ta-accent)', marginBottom: 16 }} />
          <p className="ta-eyebrow m-0 mb-2">
            {VIEWER.name} · {VIEWER.roles.filter((r) => r !== 'Employee').join(' · ')}
          </p>
          <h1
            data-wf="b-0-0"
            className="m-0"
            style={{ fontFamily: brand.fontHeading, fontSize: 'clamp(30px, 5vw, 40px)', fontWeight: 400, lineHeight: 1.15, letterSpacing: '-0.01em' }}
          >
            Team &amp; Approvals
          </h1>
        </header>

        <div data-wf="b-1-0" style={{ borderBottom: '1px solid var(--ta-line)' }}>
          <div role="tablist" aria-label="Team and approvals sections" className="flex overflow-x-auto" style={{ maxWidth: '100%' }}>
            {TABS.map((t, i) => (
              <button
                key={t.key}
                type="button"
                role="tab"
                id={'ta-tab-' + t.key}
                data-wf={t.wf}
                aria-selected={tab === t.key}
                aria-controls={'ta-panel-' + t.key}
                tabIndex={tab === t.key ? 0 : -1}
                className="ta-tab"
                onClick={() => setTab(t.key)}
                onKeyDown={(e) => onTabKey(e, i)}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div role="status" aria-live="polite">
          {notice ? (
            <div
              className="ta-notice ta-panel flex items-start gap-3 p-4"
              style={{ borderLeft: '1px solid var(--ta-accent)', boxShadow: 'inset 2px 0 0 var(--ta-accent)' }}
            >
              <Icons.CheckCircle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" style={{ color: 'var(--ta-accent)' }} />
              <p className="m-0 flex-1 text-sm" style={{ lineHeight: 1.6 }}>{notice.text}</p>
            </div>
          ) : null}
        </div>

        {tab === 'pending' ? (
          <div role="tabpanel" id="ta-panel-pending" aria-labelledby="ta-tab-pending" className="flex flex-col gap-8">
            <section data-wf="b-2-0" aria-labelledby="ta-h-pending">
              <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
                <div>
                  <h2 id="ta-h-pending" className="m-0" style={{ fontFamily: brand.fontHeading, fontSize: 24, fontWeight: 400 }}>
                    Pending approvals
                  </h2>
                  <p className="m-0 mt-1 text-sm" style={{ color: 'var(--ta-muted)' }}>
                    Select a name to read the full item before you decide. Oldest first.
                  </p>
                </div>
                <span className="ta-eyebrow">{pending.length} awaiting you</span>
              </div>
              <div className="ta-panel overflow-hidden">
                {pending.length === 0 ? (
                  <div className="flex flex-col items-start gap-3 p-8">
                    <Icons.CheckCircle className="h-6 w-6" aria-hidden="true" style={{ color: 'var(--ta-accent)' }} />
                    <h3 className="m-0" style={{ fontFamily: brand.fontHeading, fontSize: 20, fontWeight: 400 }}>
                      Nothing is waiting on you
                    </h3>
                    <p className="m-0 text-sm" style={{ color: 'var(--ta-muted)', maxWidth: 480, lineHeight: 1.6 }}>
                      Every timesheet and leave request from your direct reports has been decided. New submissions appear here as soon as your team sends them.
                    </p>
                    <button type="button" className="ta-btn" onClick={() => navigate('home')}>
                      Back to Home
                    </button>
                  </div>
                ) : (
                  <table className="ta-table">
                    <caption className="ta-sr">Timesheets and leave requests from your direct reports awaiting a decision</caption>
                    <thead>
                      <tr>
                        <th scope="col" data-wf="i-2-0-0">Employee</th>
                        <th scope="col" data-wf="i-2-0-1">Item type</th>
                        <th scope="col" data-wf="i-2-0-2">Period or dates</th>
                        <th scope="col" data-wf="i-2-0-3">Submitted on</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pending.map((p) => (
                        <tr key={p.id}>
                          <td data-label="Employee">
                            <button
                              type="button"
                              className="ta-link"
                              aria-label={'Review ' + p.name + ', ' + p.typeText.toLowerCase() + ', ' + p.periodText}
                              onClick={() => openReview(p.id)}
                            >
                              {p.name}
                              <Icons.ChevronRight className="h-4 w-4" aria-hidden="true" style={{ color: 'var(--ta-accent)' }} />
                            </button>
                            <div className="ta-ref">{p.id}</div>
                          </td>
                          <td data-label="Item type">{p.typeText}</td>
                          <td data-label="Period or dates">
                            <span>{p.periodText}</span>
                            <span style={{ color: 'var(--ta-muted)' }}> · {p.periodNote}</span>
                          </td>
                          <td data-label="Submitted on">{p.submitted}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </section>

            {openItem ? (
              <div
                data-wf="b-3-0"
                className="ta-scrim fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6"
                onMouseDown={(e) => {
                  if (e.target === e.currentTarget) closeReview();
                }}
              >
                <div
                  ref={dialogRef}
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="ta-dialog-title"
                  tabIndex={-1}
                  className="ta-dialog w-full sm:max-w-2xl"
                  style={{ maxHeight: '92vh', overflowY: 'auto' }}
                  onKeyDown={onDialogKey}
                >
                  <div className="flex items-start justify-between gap-4 p-4 sm:p-6" style={{ borderBottom: '1px solid var(--ta-line)' }}>
                    <div>
                      <div className="ta-ref mb-2">{openItem.id} · submitted {openItem.submitted}</div>
                      <h2 id="ta-dialog-title" className="m-0" style={{ fontFamily: brand.fontHeading, fontSize: 22, fontWeight: 400, lineHeight: 1.3 }}>
                        {openItem.title}
                      </h2>
                    </div>
                    <button type="button" className="ta-icon-btn" aria-label="Close review" onClick={closeReview} style={{ marginTop: -8, marginRight: -8 }}>
                      <Icons.X className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </div>

                  <div className="flex flex-col gap-6 p-4 sm:p-6">
                    <div data-wf="i-3-0-0">
                      <h3 className="ta-eyebrow m-0 mb-3">
                        {openItem.kind === 'timesheet' ? 'Hours by project and day (read-only)' : 'Request details (read-only)'}
                      </h3>
                      {renderHours(openItem)}
                    </div>

                    <div>
                      <label htmlFor="ta-comment" className="ta-eyebrow mb-2 block">
                        Comment (required to reject)
                      </label>
                      <textarea
                        id="ta-comment"
                        ref={commentRef}
                        data-wf="i-3-0-1"
                        className="ta-field"
                        rows={3}
                        value={comment}
                        aria-invalid={commentError ? 'true' : 'false'}
                        aria-describedby={commentError ? 'ta-comment-help ta-comment-err' : 'ta-comment-help'}
                        placeholder={openItem.kind === 'timesheet' ? 'e.g. Friday’s 5 h on CPV-330 should be on HLR-101.' : 'Optional when approving.'}
                        onChange={(e) => {
                          setComment(e.target.value);
                          if (commentError) setCommentError('');
                        }}
                        style={{ resize: 'vertical' }}
                      />
                      <p id="ta-comment-help" className="m-0 mt-2 text-xs" style={{ color: 'var(--ta-muted)' }}>
                        Optional when approving. {openItem.name.split(' ')[0]} sees your comment in her in-app alerts.
                      </p>
                      {commentError ? (
                        <p id="ta-comment-err" role="alert" className="m-0 mt-2 flex items-start gap-2 text-sm" style={{ color: 'var(--ta-text)' }}>
                          <Icons.AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                          <span>{commentError}</span>
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <div className="ta-btn-row flex flex-wrap gap-3 p-4 sm:p-6" style={{ borderTop: '1px solid var(--ta-line)' }}>
                    <button type="button" data-wf="i-3-0-2" className="ta-btn ta-btn-primary" onClick={() => decide('approve')}>
                      <Icons.Check className="h-4 w-4" aria-hidden="true" />
                      Approve
                    </button>
                    <button type="button" data-wf="i-3-0-3" className="ta-btn" onClick={() => decide('reject')}>
                      <Icons.X className="h-4 w-4" aria-hidden="true" />
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ) : null}

            <p
              data-wf="b-4-0"
              className="m-0 text-sm"
              style={{ color: 'var(--ta-muted)', borderLeft: '1px solid var(--ta-accent)', paddingLeft: 16, maxWidth: 640, lineHeight: 1.6 }}
            >
              Your own submissions are never listed here; they go to your reporting manager, or to the HR Admin queue if you have none.
            </p>
          </div>
        ) : null}

        {tab === 'team' ? (
          <div role="tabpanel" id="ta-panel-team" aria-labelledby="ta-tab-team">
            <section data-wf="b-5-0" aria-labelledby="ta-h-team">
              <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
                <div>
                  <h2 id="ta-h-team" className="m-0" style={{ fontFamily: brand.fontHeading, fontSize: 24, fontWeight: 400 }}>
                    My team (direct reports)
                  </h2>
                  <p className="m-0 mt-1 text-sm" style={{ color: 'var(--ta-muted)' }}>
                    Only people who report to you appear here. Statuses update as you decide items.
                  </p>
                </div>
                <span className="ta-eyebrow">{team.length} direct reports</span>
              </div>
              <div className="ta-panel overflow-hidden">
                <table className="ta-table">
                  <caption className="ta-sr">Your direct reports with their latest timesheet and leave status</caption>
                  <thead>
                    <tr>
                      <th scope="col" data-wf="i-5-0-0">Name</th>
                      <th scope="col" data-wf="i-5-0-1">Department</th>
                      <th scope="col" data-wf="i-5-0-2">Timesheet status</th>
                      <th scope="col" data-wf="i-5-0-3">Leave status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {team.map((m) => (
                      <tr key={m.id}>
                        <td data-label="Name">
                          <div style={{ fontWeight: 500, fontSize: 15 }}>{m.name}</div>
                          <div className="ta-ref">{m.id}</div>
                        </td>
                        <td data-label="Department">{m.dept}</td>
                        <td data-label="Timesheet status">
                          <div className="flex flex-col items-start gap-1 sm:items-start" style={{ alignItems: undefined }}>
                            {tag(m.ts.status)}
                            <span className="text-xs" style={{ color: 'var(--ta-muted)' }}>{m.ts.detail}</span>
                          </div>
                        </td>
                        <td data-label="Leave status">
                          <div className="flex flex-col gap-1">
                            {tag(m.leave.status)}
                            <span className="text-xs" style={{ color: 'var(--ta-muted)' }}>{m.leave.detail}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        ) : null}

        {tab === 'reopen' ? (
          <div role="tabpanel" id="ta-panel-reopen" aria-labelledby="ta-tab-reopen">
            {!canReopen ? (
              <div className="ta-panel flex flex-col items-start gap-3 p-8">
                <Icons.AlertCircle className="h-6 w-6" aria-hidden="true" />
                <h2 className="m-0" style={{ fontFamily: brand.fontHeading, fontSize: 22, fontWeight: 400 }}>
                  Reopening is for HR Admins
                </h2>
                <p className="m-0 text-sm" style={{ color: 'var(--ta-muted)', maxWidth: 520, lineHeight: 1.6 }}>
                  Approved items are locked so payroll can rely on them. Ask an HR Admin to reopen one, and tell them the reason. They will log it.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                <section data-wf="b-6-0" aria-labelledby="ta-h-approved" className="lg:col-span-9">
                  <div className="mb-4">
                    <h2 id="ta-h-approved" className="m-0" style={{ fontFamily: brand.fontHeading, fontSize: 24, fontWeight: 400 }}>
                      Approved items (HR Admin only)
                    </h2>
                    <p className="m-0 mt-1 text-sm" style={{ color: 'var(--ta-muted)', lineHeight: 1.6 }}>
                      Choose one row, then say why it is being reopened. Approved timesheets and leave across the organisation are listed.
                    </p>
                  </div>
                  <div className="ta-panel overflow-hidden">
                    {approved.length === 0 ? (
                      <div className="flex flex-col items-start gap-3 p-8">
                        <Icons.FileText className="h-6 w-6" aria-hidden="true" style={{ color: 'var(--ta-accent)' }} />
                        <h3 className="m-0" style={{ fontFamily: brand.fontHeading, fontSize: 20, fontWeight: 400 }}>
                          No approved items to reopen
                        </h3>
                        <p className="m-0 text-sm" style={{ color: 'var(--ta-muted)', maxWidth: 440, lineHeight: 1.6 }}>
                          Once a manager approves a timesheet or leave request, it shows up here so an HR Admin can reverse a mistake.
                        </p>
                      </div>
                    ) : (
                      <table className="ta-table">
                        <caption className="ta-sr">Approved timesheets and leave requests that an HR Admin can reopen</caption>
                        <thead>
                          <tr>
                            <th scope="col" data-wf="i-6-0-0">Employee</th>
                            <th scope="col" data-wf="i-6-0-1">Item type</th>
                            <th scope="col" data-wf="i-6-0-2">Period or dates</th>
                            <th scope="col" data-wf="i-6-0-3">Approved by</th>
                            <th scope="col" data-wf="i-6-0-4">Reopen reason</th>
                          </tr>
                        </thead>
                        <tbody>
                          {approved.map((a) => {
                            const selected = reopenSel === a.id;
                            return (
                              <tr key={a.id} data-selected={selected ? 'true' : 'false'}>
                                <td data-label="Employee">
                                  <label className="flex min-h-[44px] cursor-pointer items-center gap-3">
                                    <input
                                      type="radio"
                                      name="ta-reopen-item"
                                      checked={selected}
                                      onChange={() => {
                                        setReopenSel(a.id);
                                        setReopenReason('');
                                        setReopenError('');
                                      }}
                                      style={{ width: 20, height: 20, accentColor: brand.accentColor }}
                                    />
                                    <span>
                                      <span style={{ fontWeight: 500, fontSize: 15 }}>{a.name}</span>
                                      <span className="ta-ref block" style={{ textAlign: 'left' }}>{a.empId}</span>
                                    </span>
                                  </label>
                                </td>
                                <td data-label="Item type">{a.typeText}</td>
                                <td data-label="Period or dates">{a.periodText}</td>
                                <td data-label="Approved by">{a.approvedBy}</td>
                                <td data-label="Reopen reason" style={{ minWidth: 200 }}>
                                  {selected ? (
                                    <div className="w-full">
                                      <label htmlFor={'ta-reason-' + a.id} className="ta-sr">
                                        Reason for reopening {a.name}’s {a.typeText.toLowerCase()}
                                      </label>
                                      <input
                                        id={'ta-reason-' + a.id}
                                        type="text"
                                        className="ta-field"
                                        value={reopenReason}
                                        placeholder="Approved against the wrong week"
                                        aria-invalid={reopenError && !reopenReason.trim() ? 'true' : 'false'}
                                        aria-describedby={reopenError ? 'ta-reopen-err' : undefined}
                                        onChange={(e) => {
                                          setReopenReason(e.target.value);
                                          if (reopenError) setReopenError('');
                                        }}
                                        onKeyDown={(e) => {
                                          if (e.key === 'Enter') doReopen();
                                        }}
                                      />
                                    </div>
                                  ) : (
                                    <span className="text-sm" style={{ color: 'var(--ta-muted)' }}>Select this row to add a reason</span>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    )}
                  </div>
                </section>

                <div data-wf="b-6-1" className="flex flex-col gap-3 lg:col-span-3 lg:pt-[72px]">
                  <button type="button" className="ta-btn ta-btn-primary w-full" onClick={doReopen}>
                    <Icons.ArrowLeft className="h-4 w-4" aria-hidden="true" />
                    Reopen item
                  </button>
                  {reopenError ? (
                    <p id="ta-reopen-err" role="alert" className="m-0 flex items-start gap-2 text-sm" style={{ lineHeight: 1.5 }}>
                      <Icons.AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                      <span>{reopenError}</span>
                    </p>
                  ) : null}
                  <p className="m-0 text-xs" style={{ color: 'var(--ta-muted)', lineHeight: 1.6 }}>
                    Timesheets return to Draft. Leave requests give their days back to the balance. Either way the reversal is audit-logged.
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}
