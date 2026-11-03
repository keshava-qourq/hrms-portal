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
const { Clock } = Icons;

const PROFILE = {
  fullName: 'Priya Nair',
  employeeNumber: 'EMP-0412',
  department: 'Product Engineering',
  manager: 'Rahul Mehta',
  email: 'priya.nair@company.com',
  mobile: '+91 98765 43210',
  contact: 'Anil Nair (spouse), +91 98765 40021',
};

const ROLES = ['Employee', 'Reporting Manager'];

const BALANCES = [
  { id: 'annual', name: 'Annual', entitlement: 20, taken: 5, pending: 3, unlimited: false },
  { id: 'sick', name: 'Sick', entitlement: 10, taken: 2, pending: 0.5, unlimited: false },
  { id: 'unpaid', name: 'Unpaid', entitlement: 0, taken: 0, pending: 0, unlimited: true },
];

const PENDING_LEAVE = [
  { id: 'lr-1', type: 'Annual', dates: '10–12 Mar', count: '3 days', status: 'Submitted', sent: 'Sent Mon 2 Nov' },
  { id: 'lr-2', type: 'Sick', dates: '18 Mar', count: '0.5 day (first half)', status: 'Submitted', sent: 'Sent Mon 2 Nov' },
];

const ATTENDANCE = [
  { id: 'a1', date: 'Mon 2 Nov', in: '08:56', out: '17:41', worked: '8h 45m', note: '' },
  { id: 'a2', date: 'Fri 30 Oct', in: '09:10', out: '18:02', worked: '8h 52m', note: '' },
  { id: 'a3', date: 'Thu 29 Oct', in: '09:04', out: null, worked: null, note: 'incomplete' },
  { id: 'a4', date: 'Wed 28 Oct', in: '08:49', out: '17:30', worked: '8h 41m', note: '' },
  { id: 'a5', date: 'Tue 27 Oct', in: '09:15', out: '17:58', worked: '8h 43m', note: '' },
  { id: 'a6', date: 'Mon 26 Oct', in: '09:01', out: '17:36', worked: '8h 35m', note: '' },
  { id: 'a7', date: 'Fri 23 Oct', in: '09:07', out: '16:20', worked: '7h 13m', note: 'regularised' },
];

const ALERTS = [
  { id: 'n1', kind: 'approved', text: 'Timesheet 26 Oct week approved by Rahul Mehta', when: 'Mon 2 Nov, 16:20', unread: false },
  { id: 'n2', kind: 'rejected', text: 'Leave request rejected: “Team release that week”', when: 'Mon 2 Nov, 11:48', unread: true },
  { id: 'n3', kind: 'submitted', text: 'Aisha Khan submitted a timesheet', when: 'Mon 2 Nov, 09:15', unread: true },
];

const CSS = `
.hm-root{--hm-fg:${brand.primaryColor};--hm-bg:${brand.backgroundColor};--hm-ac:${brand.accentColor};--hm-mu:${brand.neutralColor};
--hm-panel:color-mix(in srgb,var(--hm-fg) 5%,var(--hm-bg));--hm-panel2:color-mix(in srgb,var(--hm-fg) 9%,var(--hm-bg));
--hm-line:color-mix(in srgb,var(--hm-fg) 12%,transparent);--hm-line2:color-mix(in srgb,var(--hm-fg) 28%,transparent);
background:var(--hm-bg);color:var(--hm-fg);font-family:${brand.fontBody};font-variant-numeric:tabular-nums;}
.hm-root *:focus-visible{outline:2px solid var(--hm-ac);outline-offset:2px;}
.hm-serif{font-family:${brand.fontHeading};font-weight:400;letter-spacing:0.005em;}
.hm-eyebrow{font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:var(--hm-mu);font-weight:500;}
.hm-panel{position:relative;background:var(--hm-panel);border:1px solid var(--hm-line);border-radius:${brand.radius};}
.hm-panel::before{content:"";position:absolute;top:-1px;left:24px;width:32px;height:1px;background:var(--hm-ac);}
.hm-btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:48px;padding:12px 24px;border-radius:${brand.radius};font-size:15px;font-weight:500;cursor:pointer;transition:background-color .15s,border-color .15s,transform .1s;width:100%;}
.hm-btn:active:not(:disabled){transform:translateY(1px);}
.hm-btn-primary{background:var(--hm-ac);color:var(--hm-bg);border:1px solid var(--hm-ac);}
.hm-btn-primary:hover:not(:disabled){background:color-mix(in srgb,var(--hm-ac) 85%,var(--hm-fg));}
.hm-btn-ghost{background:transparent;color:var(--hm-fg);border:1px solid var(--hm-line2);}
.hm-btn-ghost:hover:not(:disabled){background:var(--hm-panel2);border-color:var(--hm-ac);}
.hm-btn:disabled{background:var(--hm-panel2);color:var(--hm-mu);border:1px solid var(--hm-line);cursor:not-allowed;}
.hm-link{display:inline-flex;align-items:center;gap:8px;min-height:48px;padding:0 4px;color:var(--hm-ac);font-size:15px;font-weight:500;background:none;border:0;cursor:pointer;text-decoration:underline;text-underline-offset:4px;text-decoration-thickness:1px;}
.hm-link:hover{color:var(--hm-fg);}
.hm-rowbtn{display:flex;width:100%;text-align:left;align-items:center;gap:16px;padding:16px 24px;background:transparent;border:0;color:inherit;cursor:pointer;transition:background-color .15s;}
.hm-rowbtn:hover{background:var(--hm-panel2);}
.hm-cardbtn{display:block;width:100%;text-align:left;color:inherit;cursor:pointer;transition:background-color .15s,border-color .15s;}
.hm-cardbtn:hover{background:var(--hm-panel2);border-color:var(--hm-line2);}
.hm-input{width:100%;min-height:48px;padding:12px;background:var(--hm-bg);color:var(--hm-fg);border:1px solid var(--hm-line2);border-radius:${brand.radius};font-size:15px;font-family:inherit;}
.hm-input:hover:not([readonly]){border-color:var(--hm-ac);}
.hm-input[readonly]{background:transparent;border-style:dashed;border-color:var(--hm-line);color:color-mix(in srgb,var(--hm-fg) 85%,var(--hm-bg));cursor:default;}
.hm-input[aria-invalid="true"]{border-color:var(--hm-fg);}
.hm-divide>*+*{border-top:1px solid var(--hm-line);}
.hm-chip{display:inline-flex;align-items:center;gap:4px;padding:4px 8px;border:1px solid var(--hm-line2);border-radius:${brand.radius};font-size:12px;font-weight:500;white-space:nowrap;}
.hm-th{font-size:12px;letter-spacing:0.1em;text-transform:uppercase;color:var(--hm-mu);font-weight:500;text-align:left;padding:12px 8px;border-bottom:1px solid var(--hm-line);}
.hm-td{padding:12px 8px;font-size:14px;border-bottom:1px solid var(--hm-line);vertical-align:top;}
.hm-enter{animation:hm-in .35s ease-out both;}
@keyframes hm-in{from{opacity:0;transform:translateY(-6px);}to{opacity:1;transform:none;}}
@keyframes hm-pulse{0%,100%{opacity:1;}50%{opacity:.45;}}
.hm-busy{animation:hm-pulse 1s ease-in-out infinite;}
@media (prefers-reduced-motion:reduce){.hm-root *{animation:none!important;transition:none!important;}}
`;

function Panel({ children, className, style, ...rest }) {
  return (
    <section className={'hm-panel ' + (className || '')} style={style} {...rest}>
      {children}
    </section>
  );
}

function PanelHead({ title, id, aside }) {
  return (
    <div className="flex items-baseline justify-between gap-4 px-6 pt-6 pb-4">
      <h2 id={id} className="hm-serif text-xl" style={{ margin: 0 }}>{title}</h2>
      {aside}
    </div>
  );
}

function BalanceRow({ b, ...rest }) {
  const remaining = b.entitlement - b.taken;
  return (
    <li>
      <button type="button" {...rest} className="hm-rowbtn" onClick={() => navigate('leave')}>
        <span className="flex-1 min-w-0">
          <span className="block" style={{ fontSize: 16, fontWeight: 500 }}>{b.name}</span>
          <span className="block" style={{ fontSize: 12, color: 'var(--hm-mu)', marginTop: 4 }}>
            {b.unlimited
              ? 'No entitlement check applies to unpaid leave'
              : 'Entitlement ' + b.entitlement + ' · ' + b.taken + ' taken · ' + b.pending + ' pending'}
          </span>
        </span>
        <span className="text-right">
          {b.unlimited ? (
            <span className="hm-serif" style={{ fontSize: 22, color: 'var(--hm-ac)' }}>No limit</span>
          ) : (
            <>
              <span className="hm-serif" style={{ fontSize: 28, color: 'var(--hm-ac)', lineHeight: 1 }}>{remaining}</span>
              <span className="block" style={{ fontSize: 12, color: 'var(--hm-mu)', marginTop: 4 }}>days remaining</span>
            </>
          )}
        </span>
        <Icons.ChevronRight className="w-4 h-4 shrink-0" aria-hidden="true" />
      </button>
    </li>
  );
}

export default function Screen() {
  const navigate = useNavigate();
  const [punch, setPunch] = React.useState('idle'); // idle | in | out
  const [busy, setBusy] = React.useState(false);
  const [alerts, setAlerts] = React.useState(ALERTS);
  const [form, setForm] = React.useState({ mobile: PROFILE.mobile, contact: PROFILE.contact });
  const [saved, setSaved] = React.useState({ mobile: PROFILE.mobile, contact: PROFILE.contact });
  const [errors, setErrors] = React.useState({});
  const [saveMsg, setSaveMsg] = React.useState(null);
  const timer = React.useRef(null);

  React.useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  const isManager = ROLES.indexOf('Reporting Manager') !== -1;
  const unread = alerts.filter((a) => a.unread).length;

  function doPunch() {
    if (busy || punch === 'out') return;
    setBusy(true);
    timer.current = setTimeout(() => {
      setPunch((p) => (p === 'idle' ? 'in' : 'out'));
      setBusy(false);
    }, 700);
  }

  function readAlert(id) {
    setAlerts((list) => list.map((a) => (a.id === id ? { ...a, unread: false } : a)));
  }

  function edit(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
    setSaveMsg(null);
    setErrors((e) => ({ ...e, [field]: undefined }));
  }

  function onSave(e) {
    e.preventDefault();
    const errs = {};
    const digits = form.mobile.replace(/\D/g, '');
    if (!form.mobile.trim()) errs.mobile = 'Enter a mobile number so your manager and HR can reach you.';
    else if (!/^[+\d\s()-]+$/.test(form.mobile) || digits.length < 8 || digits.length > 15)
      errs.mobile = 'Use 8 to 15 digits. Spaces, +, brackets and hyphens are fine.';
    if (form.contact.length > 120) errs.contact = 'Keep this to 120 characters or fewer.';
    setErrors(errs);
    if (Object.keys(errs).length) { setSaveMsg(null); return; }
    if (form.mobile === saved.mobile && form.contact === saved.contact) {
      setSaveMsg({ kind: 'info', text: 'Nothing to save. These details already match what HR holds.' });
      return;
    }
    setSaved({ ...form });
    setSaveMsg({ kind: 'ok', text: 'Contact details saved on Tue 3 Nov 2026. The change is recorded in the audit log.' });
  }

  // attendance card content
  let attTitle = 'Not clocked in';
  let attLine = 'Tue 3 Nov 2026, 09:02';
  if (punch === 'in') { attTitle = 'Clocked in at 09:02'; attLine = 'Tue 3 Nov 2026, arrival recorded'; }
  if (punch === 'out') { attTitle = 'Worked 8h 32m'; attLine = 'Tue 3 Nov 2026, 09:02 to 17:34'; }

  const btnLabel = busy ? 'Stamping with server time…' : punch === 'idle' ? 'Clock in' : punch === 'in' ? 'Clock out' : 'Clocked out for today';

  return (
    <div className="hm-root min-h-full">
      <style>{CSS}</style>
      <div className="mx-auto w-full px-4 py-8 sm:px-8 lg:px-12" style={{ maxWidth: 1200 }}>

        {/* Row 1 */}
        <header data-wf="b-0-0" className="pb-8" style={{ borderBottom: '1px solid var(--hm-line)' }}>
          <p className="hm-eyebrow" style={{ margin: 0 }}>Tuesday 3 November 2026 · Company time</p>
          <h1 className="hm-serif" style={{ fontSize: 'clamp(2rem, 4.5vw, 2.5rem)', lineHeight: 1.15, margin: '12px 0 0' }}>
            Good morning, Priya Nair
          </h1>
          <p style={{ margin: '12px 0 0', fontSize: 14, color: 'var(--hm-mu)' }}>
            Signed in with {ROLES.length} roles: {ROLES.join(' and ')}. Your access is the combined set.
          </p>
        </header>

        {/* Row 2 */}
        <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Panel data-wf="b-1-0" aria-labelledby="h-att" className="p-6">
            <h2 id="h-att" className="hm-eyebrow" style={{ margin: 0 }}>Today's attendance</h2>
            <p className="hm-serif" style={{ fontSize: 28, margin: '16px 0 4px', color: 'var(--hm-ac)' }} role="status" aria-live="polite">{attTitle}</p>
            <p style={{ margin: 0, fontSize: 14 }}>{attLine}</p>
            <p style={{ margin: '12px 0 0', fontSize: 12, color: 'var(--hm-mu)' }}>Punches are stamped by the server clock, not your device.</p>
          </Panel>

          <Panel data-wf="b-1-1" aria-labelledby="h-ts" className="p-6">
            <h2 id="h-ts" className="hm-eyebrow" style={{ margin: 0 }}>Current timesheet · Week of 2 Nov</h2>
            <div className="flex items-center gap-3" style={{ margin: '16px 0 4px' }}>
              <span className="hm-serif" style={{ fontSize: 28, color: 'var(--hm-ac)' }}>Draft</span>
              <span className="hm-chip"><Icons.Edit className="w-3 h-3" aria-hidden="true" /> Not yet submitted</span>
            </div>
            <p style={{ margin: 0, fontSize: 14 }}><strong style={{ fontWeight: 500 }}>16.0 h</strong> logged, Mon 2 Nov to Sun 8 Nov</p>
            <p style={{ margin: '12px 0 0', fontSize: 12, color: 'var(--hm-mu)' }}>Still with you. Your manager sees it once you submit.</p>
          </Panel>

          {isManager && (
            <button type="button" data-wf="b-1-2" onClick={() => navigate('approvals')} className="hm-panel hm-cardbtn p-6" aria-label="Awaiting your approval: 3 items. Open Team and Approvals">
              <span className="hm-eyebrow block">Awaiting your approval</span>
              <span className="flex items-baseline gap-2" style={{ margin: '16px 0 4px' }}>
                <span className="hm-serif" style={{ fontSize: 28, color: 'var(--hm-ac)' }}>3</span>
                <span style={{ fontSize: 15 }}>items</span>
              </span>
              <span className="block" style={{ fontSize: 14 }}>2 timesheets, 1 leave request</span>
              <span className="mt-3 flex items-center gap-2" style={{ fontSize: 12, color: 'var(--hm-mu)' }}>
                Open Team &amp; Approvals <Icons.ChevronRight className="w-3 h-3" aria-hidden="true" />
              </span>
            </button>
          )}
        </div>

        {/* Row 3 */}
        <div className="mt-6 grid grid-cols-1 items-center gap-4 lg:grid-cols-3">
          <button type="button" data-wf="b-2-0" className={'hm-btn hm-btn-primary' + (busy ? ' hm-busy' : '')} onClick={doPunch} disabled={punch === 'out'} aria-busy={busy}>
            <Icons.Clock className="w-4 h-4" aria-hidden="true" /> {btnLabel}
          </button>
          <button type="button" data-wf="b-2-1" className="hm-btn hm-btn-ghost" onClick={() => navigate('timesheet')}>
            <Icons.FileText className="w-4 h-4" aria-hidden="true" /> Complete and submit timesheet
          </button>
          {isManager && (
            <div className="lg:flex lg:justify-start">
              <button type="button" data-wf="b-2-2" className="hm-link" onClick={() => navigate('approvals')}>
                Review pending approvals <Icons.ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          )}
        </div>

        {/* Row 4 */}
        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Panel data-wf="b-3-0" aria-labelledby="h-bal">
            <PanelHead id="h-bal" title="Leave balances" aside={<span className="hm-eyebrow">2026</span>} />
            <ul className="hm-divide" style={{ listStyle: 'none', margin: 0, padding: 0, borderTop: '1px solid var(--hm-line)' }}>
              <BalanceRow data-wf="i-3-0-0" b={BALANCES[0]} />
              <BalanceRow data-wf="i-3-0-1" b={BALANCES[1]} />
              <BalanceRow data-wf="i-3-0-2" b={BALANCES[2]} />
            </ul>
          </Panel>

          <Panel data-wf="b-3-1" aria-labelledby="h-pend">
            <PanelHead id="h-pend" title="Pending leave requests" aside={<span className="hm-eyebrow">{PENDING_LEAVE.length} awaiting decision</span>} />
            {PENDING_LEAVE.length === 0 ? (
              <p style={{ margin: 0, padding: '16px 24px 24px', borderTop: '1px solid var(--hm-line)', fontSize: 14, color: 'var(--hm-mu)' }}>
                Nothing waiting on your manager. Requests you submit appear here until they are decided.
              </p>
            ) : (
              <ul className="hm-divide" style={{ listStyle: 'none', margin: 0, padding: 0, borderTop: '1px solid var(--hm-line)' }}>
                {PENDING_LEAVE.map((r, i) => (
                  <li key={r.id} data-wf={'i-3-1-' + i} className="flex items-center justify-between gap-4 px-6 py-4">
                    <div className="min-w-0">
                      <p style={{ margin: 0, fontSize: 16, fontWeight: 500 }}>{r.type}</p>
                      <p style={{ margin: '4px 0 0', fontSize: 14 }}>{r.dates} · {r.count}</p>
                      <p style={{ margin: '4px 0 0', fontSize: 12, color: 'var(--hm-mu)' }}>{r.sent}</p>
                    </div>
                    <span className="hm-chip"><Icons.Clock className="w-3 h-3" aria-hidden="true" /> {r.status}</span>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>

        {/* Row 5 */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
          <Panel data-wf="b-4-0" aria-labelledby="h-rec" className="lg:col-span-7">
            <PanelHead id="h-rec" title="Recent attendance" aside={<span className="hm-eyebrow">Last 7 working days</span>} />
            <div className="px-4 pb-4 sm:px-6 sm:pb-6">
              <table className="w-full" style={{ borderCollapse: 'collapse' }}>
                <caption className="sr-only">Arrival, departure and worked time for recent days</caption>
                <thead>
                  <tr>
                    <th scope="col" data-wf="i-4-0-0" className="hm-th">Date</th>
                    <th scope="col" data-wf="i-4-0-1" className="hm-th">Arrival</th>
                    <th scope="col" data-wf="i-4-0-2" className="hm-th">Departure</th>
                    <th scope="col" data-wf="i-4-0-3" className="hm-th">Worked</th>
                    <th scope="col" data-wf="i-4-0-4" className="hm-th">Flag</th>
                  </tr>
                </thead>
                <tbody>
                  {punch !== 'idle' && (
                    <tr className="hm-enter" style={{ background: 'var(--hm-panel2)' }}>
                      <th scope="row" className="hm-td" style={{ textAlign: 'left', fontWeight: 500 }}>Tue 3 Nov</th>
                      <td className="hm-td">09:02</td>
                      <td className="hm-td">{punch === 'out' ? '17:34' : '—'}</td>
                      <td className="hm-td">{punch === 'out' ? '8h 32m' : '—'}</td>
                      <td className="hm-td">
                        {punch === 'in' ? <span className="hm-chip"><Icons.Clock className="w-3 h-3" aria-hidden="true" /> In progress</span> : <span style={{ color: 'var(--hm-mu)' }}>Complete</span>}
                      </td>
                    </tr>
                  )}
                  {ATTENDANCE.map((r) => (
                    <tr key={r.id} style={r.note === 'incomplete' ? { background: 'var(--hm-panel2)' } : undefined}>
                      <th scope="row" className="hm-td" style={{ textAlign: 'left', fontWeight: 500, whiteSpace: 'nowrap' }}>{r.date}</th>
                      <td className="hm-td">{r.in}</td>
                      <td className="hm-td">{r.out || '—'}</td>
                      <td className="hm-td">{r.worked || 'Not calculated'}</td>
                      <td className="hm-td">
                        {r.note === 'incomplete' && (
                          <span className="hm-chip" style={{ borderColor: 'var(--hm-fg)', fontWeight: 600 }}>
                            <Icons.AlertCircle className="w-3 h-3" aria-hidden="true" /> Incomplete punch
                          </span>
                        )}
                        {r.note === 'regularised' && <span style={{ fontSize: 12, color: 'var(--hm-mu)' }}>Regularised by HR</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p style={{ margin: '12px 8px 0', fontSize: 12, color: 'var(--hm-mu)' }}>
                Missed a punch? Ask HR to regularise it. Only HR can correct attendance.
              </p>
            </div>
          </Panel>

          <Panel data-wf="b-4-1" aria-labelledby="h-al" className="lg:col-span-5">
            <PanelHead id="h-al" title={'Alerts (' + (unread === 0 ? 'all read' : unread + ' unread') + ')'} aside={<Icons.Bell className="w-4 h-4" aria-hidden="true" />} />
            <ul className="hm-divide" style={{ listStyle: 'none', margin: 0, padding: 0, borderTop: '1px solid var(--hm-line)' }}>
              {alerts.map((a, i) => (
                <li key={a.id}>
                  <button type="button" data-wf={'i-4-1-' + i} className="hm-rowbtn" style={{ alignItems: 'flex-start' }} onClick={() => readAlert(a.id)} aria-label={(a.unread ? 'Unread alert, mark as read: ' : 'Read alert: ') + a.text}>
                    <Icons.Bell className="w-4 h-4 shrink-0" aria-hidden="true" style={{ marginTop: 4, color: a.unread ? 'var(--hm-ac)' : 'var(--hm-mu)' }} />
                    <span className="flex-1 min-w-0">
                      <span className="block" style={{ fontSize: 14, fontWeight: a.unread ? 600 : 400, lineHeight: 1.5 }}>{a.text}</span>
                      <span className="block" style={{ fontSize: 12, color: 'var(--hm-mu)', marginTop: 4 }}>{a.when}</span>
                    </span>
                    {a.unread && <span className="hm-chip" style={{ borderColor: 'var(--hm-ac)', color: 'var(--hm-ac)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>New</span>}
                  </button>
                </li>
              ))}
            </ul>
            <p style={{ margin: 0, padding: '12px 24px 24px', fontSize: 12, color: 'var(--hm-mu)', borderTop: '1px solid var(--hm-line)' }}>
              Select an alert to mark it read. Alerts are in-app only; no email or text message is sent.
            </p>
          </Panel>
        </div>

        {/* Row 6 */}
        <Panel data-wf="b-5-0" aria-labelledby="h-prof" className="mt-6">
          <PanelHead id="h-prof" title="My profile" aside={<span className="hm-eyebrow" style={{ color: 'var(--hm-ac)' }}>{PROFILE.employeeNumber}</span>} />
          <form id="profile-form" onSubmit={onSave} noValidate className="px-6 pb-6" style={{ borderTop: '1px solid var(--hm-line)' }}>
            <fieldset style={{ border: 0, padding: 0, margin: '24px 0 0' }}>
              <legend className="hm-eyebrow" style={{ padding: 0 }}>Held by HR · read-only</legend>
              <p style={{ margin: '8px 0 16px', fontSize: 12, color: 'var(--hm-mu)' }}>These come from your employee record. Ask HR if something is out of date.</p>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  ['name', 'Full name', PROFILE.fullName, 'i-5-0-0'],
                  ['empid', 'Employee ID', PROFILE.employeeNumber, 'i-5-0-1'],
                  ['dept', 'Department', PROFILE.department, 'i-5-0-2'],
                  ['mgr', 'Reporting manager', PROFILE.manager, 'i-5-0-3'],
                  ['mail', 'Work email', PROFILE.email, 'i-5-0-4'],
                ].map(([key, label, value, wf]) => (
                  <div key={key}>
                    <label htmlFor={'pf-' + key} className="hm-eyebrow block" style={{ marginBottom: 8 }}>{label}</label>
                    <input id={'pf-' + key} data-wf={wf} className="hm-input" value={value} readOnly aria-readonly="true" />
                  </div>
                ))}
              </div>
            </fieldset>

            <fieldset style={{ border: 0, padding: 0, margin: '32px 0 0' }}>
              <legend className="hm-eyebrow" style={{ padding: 0, color: 'var(--hm-ac)' }}>Your contact details · editable</legend>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2" style={{ marginTop: 16 }}>
                <div>
                  <label htmlFor="pf-mobile" className="hm-eyebrow block" style={{ marginBottom: 8 }}>Mobile number</label>
                  <input id="pf-mobile" data-wf="i-5-0-5" className="hm-input" type="tel" inputMode="tel" autoComplete="tel" value={form.mobile} onChange={(e) => edit('mobile', e.target.value)} aria-invalid={errors.mobile ? 'true' : 'false'} aria-describedby={errors.mobile ? 'pf-mobile-err' : 'pf-mobile-hint'} />
                  {errors.mobile ? (
                    <p id="pf-mobile-err" role="alert" className="flex items-start gap-2" style={{ margin: '8px 0 0', fontSize: 13, fontWeight: 500 }}>
                      <Icons.AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" /> {errors.mobile}
                    </p>
                  ) : (
                    <p id="pf-mobile-hint" style={{ margin: '8px 0 0', fontSize: 12, color: 'var(--hm-mu)' }}>Used by your manager and HR for urgent contact.</p>
                  )}
                </div>
                <div>
                  <label htmlFor="pf-contact" className="hm-eyebrow block" style={{ marginBottom: 8 }}>Personal contact</label>
                  <input id="pf-contact" data-wf="i-5-0-6" className="hm-input" value={form.contact} onChange={(e) => edit('contact', e.target.value)} aria-invalid={errors.contact ? 'true' : 'false'} aria-describedby={errors.contact ? 'pf-contact-err' : 'pf-contact-hint'} />
                  {errors.contact ? (
                    <p id="pf-contact-err" role="alert" className="flex items-start gap-2" style={{ margin: '8px 0 0', fontSize: 13, fontWeight: 500 }}>
                      <Icons.AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" /> {errors.contact}
                    </p>
                  ) : (
                    <p id="pf-contact-hint" style={{ margin: '8px 0 0', fontSize: 12, color: 'var(--hm-mu)' }}>A person and number to reach if the company cannot contact you.</p>
                  )}
                </div>
              </div>
            </fieldset>
          </form>
        </Panel>

        {/* Row 7 */}
        <div className="mt-6 grid grid-cols-1 items-center gap-4 lg:grid-cols-3">
          <button type="submit" form="profile-form" data-wf="b-6-0" className="hm-btn hm-btn-primary">
            <Icons.Check className="w-4 h-4" aria-hidden="true" /> Save contact details
          </button>
          <div className="lg:col-span-2" role="status" aria-live="polite" style={{ minHeight: 24 }}>
            {saveMsg && (
              <p key={saveMsg.text} className="hm-enter flex items-start gap-2" style={{ margin: 0, fontSize: 14, color: saveMsg.kind === 'ok' ? 'var(--hm-ac)' : 'var(--hm-fg)' }}>
                {saveMsg.kind === 'ok' ? <Icons.CheckCircle className="w-4 h-4 shrink-0" aria-hidden="true" style={{ marginTop: 2 }} /> : <Icons.AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" style={{ marginTop: 2 }} />}
                {saveMsg.text}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
