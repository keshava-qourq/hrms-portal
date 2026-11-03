// @ts-nocheck -- generated from the approved design under its JS runtime contract; not hand-written TypeScript.
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";

import { Icons } from "@/lib/icons";
import { brand } from "@/lib/brand";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { Home, Filter, ArrowLeft, ArrowRight } = Icons;

const LV_TODAY = '2026-11-03';
const LV_MANAGER = 'Daniel Okafor';
const LV_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const LV_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const LV_DAYS_LONG = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const LV_TYPES = [
  { id: 'lt-annual', name: 'Annual', entitlement: 20, unpaid: false, active: true },
  { id: 'lt-sick', name: 'Sick', entitlement: 10, unpaid: false, active: true },
  { id: 'lt-unpaid', name: 'Unpaid', entitlement: 0, unpaid: true, active: true },
  { id: 'lt-study', name: 'Study', entitlement: 5, unpaid: false, active: false },
];

const LV_HOLIDAYS = [
  { date: '2025-01-01', name: "New Year's Day" },
  { date: '2025-04-18', name: 'Good Friday' },
  { date: '2025-04-21', name: 'Easter Monday' },
  { date: '2025-05-01', name: 'Labour Day' },
  { date: '2025-08-25', name: 'Summer Bank Holiday' },
  { date: '2025-11-16', name: "Founders' Day" },
  { date: '2025-12-25', name: 'Christmas Day' },
  { date: '2025-12-26', name: 'Boxing Day' },
  { date: '2026-01-01', name: "New Year's Day" },
  { date: '2026-04-03', name: 'Good Friday' },
  { date: '2026-04-06', name: 'Easter Monday' },
  { date: '2026-05-01', name: 'Labour Day' },
  { date: '2026-08-31', name: 'Summer Bank Holiday' },
  { date: '2026-11-16', name: "Founders' Day" },
  { date: '2026-12-25', name: 'Christmas Day' },
  { date: '2026-12-28', name: 'Boxing Day (substitute day)' },
  { date: '2027-01-01', name: "New Year's Day" },
  { date: '2027-03-26', name: 'Good Friday' },
  { date: '2027-03-29', name: 'Easter Monday' },
  { date: '2027-05-01', name: 'Labour Day' },
  { date: '2027-08-30', name: 'Summer Bank Holiday' },
  { date: '2027-11-16', name: "Founders' Day" },
  { date: '2027-12-27', name: 'Christmas Day (substitute day)' },
  { date: '2027-12-28', name: 'Boxing Day (substitute day)' },
];
const LV_HOLIDAY_MAP = LV_HOLIDAYS.reduce((m, h) => { m[h.date] = h.name; return m; }, {});

const LV_SEED = [
  { id: 'r418', seq: 418, ref: 'LV-0418', typeId: 'lt-annual', start: '2026-12-21', end: '2026-12-23', half: '', days: 3, reason: 'Family visit over the holidays', status: 'Submitted', decidedAt: '', comment: '' },
  { id: 'r402', seq: 402, ref: 'LV-0402', typeId: 'lt-sick', start: '2026-10-12', end: '2026-10-12', half: '', days: 1, reason: 'Unwell', status: 'Approved', decidedAt: '2026-10-12', comment: 'Take care. See you Tuesday.' },
  { id: 'r377', seq: 377, ref: 'LV-0377', typeId: 'lt-annual', start: '2026-08-17', end: '2026-08-21', half: '', days: 5, reason: 'Week away', status: 'Approved', decidedAt: '2026-07-21', comment: 'Enjoy the break.' },
  { id: 'r351', seq: 351, ref: 'LV-0351', typeId: 'lt-annual', start: '2026-07-03', end: '2026-07-03', half: '', days: 1, reason: 'Long weekend', status: 'Rejected', decidedAt: '2026-06-29', comment: 'Release freeze that week. Could you take Monday 6 July instead?' },
  { id: 'r336', seq: 336, ref: 'LV-0336', typeId: 'lt-annual', start: '2026-06-05', end: '2026-06-05', half: 'second', days: 0.5, reason: 'Appointment in the afternoon', status: 'Approved', decidedAt: '2026-06-02', comment: '' },
  { id: 'r318', seq: 318, ref: 'LV-0318', typeId: 'lt-unpaid', start: '2026-05-18', end: '2026-05-19', half: '', days: 2, reason: 'Moving house', status: 'Approved', decidedAt: '2026-05-05', comment: 'Approved. Please hand over the vendor queue first.' },
  { id: 'r271', seq: 271, ref: 'LV-0271', typeId: 'lt-annual', start: '2026-03-09', end: '2026-03-11', half: '', days: 3, reason: 'Short break', status: 'Approved', decidedAt: '2026-02-24', comment: '' },
  { id: 'r244', seq: 244, ref: 'LV-0244', typeId: 'lt-sick', start: '2026-02-02', end: '2026-02-03', half: '', days: 2, reason: 'Unwell', status: 'Approved', decidedAt: '2026-02-02', comment: '' },
];

function lvParse(iso) {
  const p = iso.split('-').map(Number);
  return new Date(Date.UTC(p[0], p[1] - 1, p[2]));
}
function lvIso(d) { return d.toISOString().slice(0, 10); }
function lvDate(iso) {
  const d = lvParse(iso);
  return d.getUTCDate() + ' ' + LV_MONTHS[d.getUTCMonth()] + ' ' + d.getUTCFullYear();
}
function lvShort(iso) {
  const d = lvParse(iso);
  return LV_DAYS[d.getUTCDay()] + ' ' + d.getUTCDate() + ' ' + LV_MONTHS[d.getUTCMonth()];
}
function lvRange(s, e, half) {
  const hs = half === 'first' ? ' (first half)' : half === 'second' ? ' (second half)' : '';
  if (s === e) return lvDate(s) + hs;
  const a = lvParse(s), b = lvParse(e);
  if (a.getUTCMonth() === b.getUTCMonth() && a.getUTCFullYear() === b.getUTCFullYear()) {
    return a.getUTCDate() + ' – ' + b.getUTCDate() + ' ' + LV_MONTHS[b.getUTCMonth()] + ' ' + b.getUTCFullYear();
  }
  return lvDate(s) + ' – ' + lvDate(e);
}
function lvNum(n) { return Number.isInteger(n) ? String(n) : n.toFixed(1); }
function lvUnit(n) { return n === 1 ? 'day' : 'days'; }

function lvCompute(start, end, half) {
  if (!start || !end) return { state: 'empty' };
  if (end < start) return { state: 'invalid' };
  const a = lvParse(start), b = lvParse(end);
  const span = Math.round((b - a) / 86400000) + 1;
  if (span > 366) return { state: 'toolong' };
  const excluded = [];
  let working = 0;
  for (let i = 0; i < span; i++) {
    const d = new Date(a.getTime() + i * 86400000);
    const iso = lvIso(d);
    const dow = d.getUTCDay();
    if (dow === 0 || dow === 6) excluded.push({ iso, reason: 'weekend, non-working' });
    else if (LV_HOLIDAY_MAP[iso]) excluded.push({ iso, reason: LV_HOLIDAY_MAP[iso] + ', public holiday' });
    else working++;
  }
  const days = start === end && half && working === 1 ? 0.5 : working;
  return { state: 'ok', working, days, excluded, span };
}

const LV_CSS = `
.lv{font-family:var(--lv-body);color:var(--lv-text);font-size:15px;line-height:1.55}
.lv *{box-sizing:border-box}
.lv-head{font-family:var(--lv-heading);font-weight:400;letter-spacing:.005em;margin:0}
.lv-eyebrow{font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:var(--lv-muted);font-weight:500}
.lv-muted{color:var(--lv-muted)}
.lv-num{font-variant-numeric:tabular-nums}
.lv-panel{background:var(--lv-surface);border:1px solid var(--lv-line);border-radius:var(--lv-radius)}
.lv-accent{color:var(--lv-accent)}
.lv :focus-visible{outline:2px solid var(--lv-accent);outline-offset:2px}
.lv-field{width:100%;min-height:44px;padding:10px 12px;background:var(--lv-bg);color:var(--lv-text);border:1px solid var(--lv-line-strong);border-radius:var(--lv-radius);font:inherit;font-size:15px;color-scheme:dark;transition:border-color .15s ease}
.lv-field:hover:not(:disabled){border-color:var(--lv-muted)}
.lv-field:disabled{opacity:.5;cursor:not-allowed}
.lv-field[aria-invalid="true"]{border-color:var(--lv-err-border)}
.lv-field::placeholder{color:var(--lv-muted)}
textarea.lv-field{resize:vertical;min-height:96px}
.lv-label{display:block;margin-bottom:8px;font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:var(--lv-muted);font-weight:500}
.lv-fielderr{display:flex;gap:6px;align-items:flex-start;margin:8px 0 0;font-size:13px;color:var(--lv-err)}
.lv-hint{margin:8px 0 0;font-size:13px;color:var(--lv-muted)}
.lv-btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:48px;padding:12px 24px;border-radius:var(--lv-radius);font:inherit;font-size:14px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;cursor:pointer;border:1px solid transparent;transition:background-color .15s ease,transform .08s ease}
.lv-btn-primary{background:var(--lv-accent);color:var(--lv-bg)}
.lv-btn-primary:hover{background:color-mix(in srgb,var(--lv-accent) 82%,var(--lv-text))}
.lv-btn-primary:active{transform:translateY(1px)}
.lv-btn-quiet{background:transparent;color:var(--lv-text);border-color:var(--lv-line-strong);min-height:44px;padding:8px 16px;text-transform:none;letter-spacing:0;font-weight:500}
.lv-btn-quiet:hover{background:color-mix(in srgb,var(--lv-text) 6%,transparent)}
.lv-tablist{display:flex;gap:8px;border-bottom:1px solid var(--lv-line);overflow-x:auto}
.lv-tab{min-height:44px;padding:10px 20px;background:none;border:0;color:var(--lv-muted);font-family:var(--lv-heading);font-size:18px;cursor:pointer;transition:color .15s ease}
.lv-tab:hover{color:var(--lv-text)}
.lv-tab[aria-selected="true"]{color:var(--lv-text);box-shadow:inset 0 -2px 0 var(--lv-accent)}
.lv-table{width:100%;border-collapse:collapse;font-variant-numeric:tabular-nums}
.lv-table th{padding:12px 16px;text-align:left;font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:var(--lv-muted);font-weight:500;border-bottom:1px solid var(--lv-line-strong);white-space:nowrap}
.lv-table td{padding:16px;vertical-align:top;border-bottom:1px solid var(--lv-line)}
.lv-table tbody tr:last-child td{border-bottom:0}
.lv-table tbody tr:hover{background:color-mix(in srgb,var(--lv-text) 3%,transparent)}
.lv-table .r{text-align:right}
.lv-chip{display:inline-flex;align-items:center;gap:6px;padding:2px 10px;border-radius:var(--lv-radius);font-size:13px;font-weight:500;border:1px solid var(--lv-line-strong);white-space:nowrap}
.lv-chip-Approved{color:var(--lv-accent);border-color:color-mix(in srgb,var(--lv-accent) 55%,transparent);background:color-mix(in srgb,var(--lv-accent) 10%,transparent)}
.lv-chip-Submitted{color:var(--lv-text);border-color:var(--lv-muted)}
.lv-chip-Rejected{color:var(--lv-err);border-color:var(--lv-err-border);background:color-mix(in srgb,var(--lv-err-border) 12%,transparent)}
.lv-meter{display:flex;height:4px;margin-top:8px;background:var(--lv-line);border-radius:2px;overflow:hidden;max-width:160px}
.lv-alert{display:flex;gap:12px;align-items:flex-start;padding:16px;border-radius:var(--lv-radius);border:1px solid var(--lv-err-border);background:color-mix(in srgb,var(--lv-err-border) 10%,transparent)}
.lv-ok{display:flex;gap:12px;align-items:flex-start;padding:16px;border-radius:var(--lv-radius);border:1px solid color-mix(in srgb,var(--lv-accent) 55%,transparent);background:color-mix(in srgb,var(--lv-accent) 10%,transparent)}
.lv-rise{animation:lv-rise .3s ease both}
.lv-new{animation:lv-new 1.8s ease both}
@keyframes lv-rise{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}
@keyframes lv-new{from{background:color-mix(in srgb,var(--lv-accent) 22%,transparent)}to{background:transparent}}
@media (prefers-reduced-motion:reduce){.lv *,.lv-rise,.lv-new{animation:none!important;transition:none!important}}
`;

export default function Screen() {
  const [requests, setRequests] = React.useState(LV_SEED);
  const [form, setForm] = React.useState({ typeId: 'lt-annual', start: '2026-11-12', end: '2026-11-17', half: '', reason: '' });
  const [errors, setErrors] = React.useState(null);
  const [errTick, setErrTick] = React.useState(0);
  const [sent, setSent] = React.useState(null);
  const [newId, setNewId] = React.useState(null);
  const [fType, setFType] = React.useState('all');
  const [fStatus, setFStatus] = React.useState('all');
  const [year, setYear] = React.useState(2026);
  const errRef = React.useRef(null);

  React.useEffect(() => {
    if (errTick > 0 && errRef.current) errRef.current.focus();
  }, [errTick]);

  const activeTypes = LV_TYPES.filter((t) => t.active);

  const balances = activeTypes.map((t) => {
    const mine = requests.filter((r) => r.typeId === t.id && r.start.slice(0, 4) === '2026');
    const taken = mine.filter((r) => r.status === 'Approved').reduce((s, r) => s + r.days, 0);
    const pending = mine.filter((r) => r.status === 'Submitted').reduce((s, r) => s + r.days, 0);
    const remaining = t.unpaid ? null : t.entitlement - taken;
    const available = t.unpaid ? null : t.entitlement - taken - pending;
    return { type: t, taken, pending, remaining, available };
  });

  const calc = React.useMemo(() => lvCompute(form.start, form.end, form.half), [form.start, form.end, form.half]);
  const selType = activeTypes.find((t) => t.id === form.typeId);
  const selBal = balances.find((b) => b.type.id === form.typeId);
  const singleDay = !!form.start && form.start === form.end;

  function update(field, value) {
    setForm((f) => {
      const n = Object.assign({}, f, { [field]: value });
      if ((field === 'start' || field === 'end') && n.start !== n.end) n.half = '';
      return n;
    });
    setSent(null);
    setErrors((e) => {
      if (!e) return e;
      const fields = Object.assign({}, e.fields);
      if (field === 'start' || field === 'end') { fields.start = false; fields.end = false; } else fields[field] = false;
      return { fields, messages: e.messages };
    });
  }

  function onSubmit(ev) {
    ev.preventDefault();
    const messages = [];
    const fields = {};
    if (!form.typeId) { fields.type = 'Choose a leave type.'; messages.push('Choose a leave type.'); }
    if (!form.start) { fields.start = 'Pick a start date.'; messages.push('Pick a start date.'); }
    if (!form.end) { fields.end = 'Pick an end date.'; messages.push('Pick an end date.'); }
    if (form.start && form.end && form.end < form.start) {
      fields.start = 'Start date must be on or before the end date.';
      fields.end = 'End date is earlier than the start date.';
      messages.push('The end date is earlier than the start date. Move one of them so the range runs forward.');
    }
    if (messages.length === 0) {
      if (calc.state === 'toolong') {
        fields.end = 'Choose a range within one year.';
        messages.push('That range is longer than a year. Split it into shorter requests.');
      } else if (calc.state === 'ok' && calc.days === 0) {
        fields.start = ' '; fields.end = ' ';
        messages.push('Every day in that range is a weekend or a public holiday, so there is no leave to take. Pick at least one working day.');
      } else if (calc.state === 'ok') {
        const clash = requests.find((r) => {
          if (r.status !== 'Approved' && r.status !== 'Submitted') return false;
          if (r.end < form.start || r.start > form.end) return false;
          if (r.start === r.end && form.start === form.end && r.half && form.half && r.half !== form.half) return false;
          return true;
        });
        if (clash) {
          const ct = LV_TYPES.find((t) => t.id === clash.typeId);
          fields.start = ' '; fields.end = ' ';
          messages.push('These dates overlap your ' + ct.name + ' leave request ' + clash.ref + ' (' + lvRange(clash.start, clash.end, clash.half) + ', ' + clash.status + '). Change the dates or ask ' + LV_MANAGER + ' about that request.');
        } else if (selType && !selType.unpaid && selBal && calc.days > selBal.available) {
          const short = calc.days - selBal.available;
          fields.end = ' ';
          messages.push('You have ' + lvNum(selBal.available) + ' ' + lvUnit(selBal.available) + ' of ' + selType.name + ' leave available and this request is ' + lvNum(calc.days) + ' ' + lvUnit(calc.days) + ', a shortfall of ' + lvNum(short) + '. Shorten the request, or ask HR whether an override is possible.');
        }
      }
    }
    if (messages.length > 0) {
      setErrors({ fields, messages });
      setErrTick((t) => t + 1);
      setSent(null);
      return;
    }
    const seq = Math.max.apply(null, requests.map((r) => r.seq)) + 1;
    const req = {
      id: 'r' + seq, seq, ref: 'LV-0' + seq, typeId: form.typeId, start: form.start, end: form.end,
      half: form.half, days: calc.days, reason: form.reason.trim(), status: 'Submitted', decidedAt: '', comment: '',
    };
    setRequests((rs) => [req].concat(rs));
    setNewId(req.id);
    setFType('all');
    setFStatus('all');
    setErrors(null);
    setSent({ ref: req.ref, days: req.days, type: selType.name, range: lvRange(req.start, req.end, req.half) });
    setForm((f) => ({ typeId: f.typeId, start: '', end: '', half: '', reason: '' }));
  }

  const filtered = requests
    .filter((r) => (fType === 'all' || r.typeId === fType) && (fStatus === 'all' || r.status === fStatus))
    .sort((a, b) => b.seq - a.seq);
  const filtersOn = fType !== 'all' || fStatus !== 'all';

  const yearRows = LV_HOLIDAYS.filter((h) => h.date.slice(0, 4) === String(year));
  const nextHoliday = year === 2026 ? yearRows.find((h) => h.date >= LV_TODAY) : null;
  const YEARS = [2025, 2026, 2027];

  function onTabKey(e, y) {
    const i = YEARS.indexOf(y);
    let n = null;
    if (e.key === 'ArrowRight') n = YEARS[(i + 1) % YEARS.length];
    else if (e.key === 'ArrowLeft') n = YEARS[(i + YEARS.length - 1) % YEARS.length];
    else if (e.key === 'Home') n = YEARS[0];
    else if (e.key === 'End') n = YEARS[YEARS.length - 1];
    if (n !== null) {
      e.preventDefault();
      setYear(n);
      const el = document.getElementById('lv-tab-' + n);
      if (el) el.focus();
    }
  }

  const vars = {
    '--lv-bg': brand.backgroundColor,
    '--lv-text': brand.primaryColor,
    '--lv-accent': brand.accentColor,
    '--lv-muted': brand.neutralColor,
    '--lv-radius': brand.radius,
    '--lv-body': brand.fontBody,
    '--lv-heading': brand.fontHeading,
    '--lv-surface': 'color-mix(in srgb, ' + brand.primaryColor + ' 5%, ' + brand.backgroundColor + ')',
    '--lv-line': 'rgba(255,255,255,0.1)',
    '--lv-line-strong': 'rgba(255,255,255,0.2)',
    '--lv-err': 'hsl(6 78% 76%)',
    '--lv-err-border': 'hsl(6 60% 62%)',
  };

  const fe = (errors && errors.fields) || {};
  const endLive = calc.state === 'invalid' ? 'End date is earlier than the start date.' : '';
  const typeErr = fe.type || '';
  const startErr = fe.start || (calc.state === 'invalid' ? 'Start date must be on or before the end date.' : '');
  const endErr = fe.end || endLive;

  function FieldError(props) {
    if (!props.msg || !props.msg.trim()) return null;
    return (
      <p id={props.id} className="lv-fielderr">
        <Icons.AlertCircle className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
        <span>{props.msg}</span>
      </p>
    );
  }

  function StatusChip(props) {
    const s = props.status;
    const Ico = s === 'Approved' ? Icons.CheckCircle : s === 'Submitted' ? Icons.Clock : Icons.X;
    return (
      <span className={'lv-chip lv-chip-' + s}>
        <Ico className="w-4 h-4" aria-hidden="true" />
        {s}
      </span>
    );
  }

  const typeName = (id) => (LV_TYPES.find((t) => t.id === id) || {}).name;

  return (
    <div className="lv w-full max-w-6xl mx-auto flex flex-col gap-12" style={vars}>
      <style>{LV_CSS}</style>

      {/* Row 1 */}
      <header data-wf="b-0-0">
        <p className="lv-eyebrow" style={{ margin: 0 }}>Time away · 2026 leave year</p>
        <h1 className="lv-head" style={{ fontSize: 40, lineHeight: 1.15, marginTop: 8 }}>Leave</h1>
        <div aria-hidden="true" style={{ width: 64, height: 1, background: 'var(--lv-accent)', margin: '16px 0' }} />
        <p className="lv-muted" style={{ margin: 0, maxWidth: 560 }}>
          Request time off, see what is left in each balance, and follow every decision from {LV_MANAGER}. Times and dates are in company time.
        </p>
      </header>

      {/* Row 2 */}
      <section data-wf="b-1-0" aria-labelledby="lv-bal-h">
        <h2 id="lv-bal-h" className="lv-head" style={{ fontSize: 24, marginBottom: 16 }}>My leave balances</h2>
        <div className="lv-panel">
          <div className="hidden sm:block">
            <table className="lv-table">
              <thead>
                <tr>
                  <th scope="col" data-wf="i-1-0-0">Leave type</th>
                  <th scope="col" className="r" data-wf="i-1-0-1">Entitlement</th>
                  <th scope="col" className="r" data-wf="i-1-0-2">Taken</th>
                  <th scope="col" className="r" data-wf="i-1-0-3">Pending</th>
                  <th scope="col" className="r" data-wf="i-1-0-4">Remaining</th>
                </tr>
              </thead>
              <tbody>
                {balances.map((b) => {
                  const ent = b.type.entitlement || 1;
                  return (
                    <tr key={b.type.id}>
                      <td>
                        <div style={{ fontWeight: 500 }}>{b.type.name}</div>
                        <div className="lv-muted" style={{ fontSize: 13 }}>{b.type.unpaid ? 'Unpaid · no balance check' : 'Paid'}</div>
                        {!b.type.unpaid && (
                          <div className="lv-meter" aria-hidden="true">
                            <div style={{ width: (b.taken / ent) * 100 + '%', background: 'var(--lv-accent)' }} />
                            <div style={{ width: (b.pending / ent) * 100 + '%', background: 'color-mix(in srgb, var(--lv-accent) 45%, transparent)' }} />
                          </div>
                        )}
                      </td>
                      <td className="r lv-num">{b.type.unpaid ? '—' : lvNum(b.type.entitlement)}</td>
                      <td className="r lv-num">{lvNum(b.taken)}</td>
                      <td className="r lv-num">{lvNum(b.pending)}</td>
                      <td className="r lv-num">
                        {b.type.unpaid ? (
                          <span className="lv-muted">No cap</span>
                        ) : (
                          <>
                            <span className="lv-head lv-accent" style={{ fontSize: 28, lineHeight: 1.1 }}>{lvNum(b.remaining)}</span>
                            <div className="lv-muted" style={{ fontSize: 13 }}>{lvNum(b.available)} available to request</div>
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <ul className="sm:hidden" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            {balances.map((b, i) => (
              <li key={b.type.id} style={{ padding: 16, borderTop: i === 0 ? 0 : '1px solid var(--lv-line)' }}>
                <div className="flex items-baseline justify-between gap-4">
                  <div style={{ fontWeight: 500 }}>{b.type.name}</div>
                  <div className="lv-num">
                    {b.type.unpaid ? (
                      <span className="lv-muted">No cap</span>
                    ) : (
                      <>
                        <span className="lv-head lv-accent" style={{ fontSize: 28 }}>{lvNum(b.remaining)}</span>
                        <span className="lv-muted" style={{ fontSize: 13 }}> remaining</span>
                      </>
                    )}
                  </div>
                </div>
                <dl className="grid grid-cols-3 gap-4 lv-num" style={{ margin: '16px 0 0' }}>
                  <div><dt className="lv-eyebrow">Entitled</dt><dd style={{ margin: 0 }}>{b.type.unpaid ? '—' : lvNum(b.type.entitlement)}</dd></div>
                  <div><dt className="lv-eyebrow">Taken</dt><dd style={{ margin: 0 }}>{lvNum(b.taken)}</dd></div>
                  <div><dt className="lv-eyebrow">Pending</dt><dd style={{ margin: 0 }}>{lvNum(b.pending)}</dd></div>
                </dl>
                {!b.type.unpaid && <p className="lv-muted" style={{ fontSize: 13, margin: '12px 0 0' }}>{lvNum(b.available)} available to request</p>}
              </li>
            ))}
          </ul>
        </div>
        <p className="lv-muted" style={{ fontSize: 13, margin: '12px 0 0', maxWidth: 680 }}>
          Remaining is the entitlement minus approved days. Pending days are set aside until {LV_MANAGER} decides, and only move to taken on approval. Half-days count as 0.5.
        </p>
      </section>

      {/* Row 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <form id="lv-form" data-wf="b-2-0" className="lv-panel lg:col-span-7" style={{ padding: 24 }} onSubmit={onSubmit} noValidate aria-labelledby="lv-req-h">
          <h2 id="lv-req-h" className="lv-head" style={{ fontSize: 24, marginBottom: 4 }}>Request leave</h2>
          <p className="lv-muted" style={{ margin: '0 0 24px', fontSize: 14 }}>Goes to {LV_MANAGER} for a decision. You will see the outcome here and in your alerts.</p>

          {sent && (
            <div role="status" className="lv-ok lv-rise" style={{ marginBottom: 24 }}>
              <Icons.CheckCircle className="w-5 h-5 shrink-0 lv-accent" aria-hidden="true" />
              <div>
                <div style={{ fontWeight: 600 }}>Request <span className="lv-num lv-accent">{sent.ref}</span> sent to {LV_MANAGER}</div>
                <div className="lv-muted" style={{ fontSize: 14 }}>
                  {sent.type} · {sent.range} · {lvNum(sent.days)} {lvUnit(sent.days)} · Status: Submitted. It is now the top row of your leave history.
                </div>
              </div>
            </div>
          )}

          {errors && errors.messages.length > 0 && (
            <div ref={errRef} tabIndex={-1} role="alert" className="lv-alert lv-rise" style={{ marginBottom: 24 }}>
              <Icons.AlertCircle className="w-5 h-5 shrink-0" style={{ color: 'var(--lv-err)' }} aria-hidden="true" />
              <div>
                <div style={{ fontWeight: 600 }}>Your request has not been sent</div>
                <ul style={{ margin: '4px 0 0', paddingLeft: 16, fontSize: 14 }}>
                  {errors.messages.map((m, i) => <li key={i}>{m}</li>)}
                </ul>
                <div className="lv-muted" style={{ fontSize: 13, marginTop: 8 }}>Everything you entered is still here.</div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="sm:col-span-2">
              <label className="lv-label" htmlFor="lv-type">Leave type</label>
              <select id="lv-type" data-wf="i-2-0-0" className="lv-field" value={form.typeId}
                aria-invalid={typeErr ? 'true' : 'false'} aria-describedby={typeErr ? 'lv-type-err' : undefined}
                onChange={(e) => update('typeId', e.target.value)}>
                <option value="">Choose a leave type</option>
                {activeTypes.map((t) => <option key={t.id} value={t.id}>{t.name}{t.unpaid ? ' (unpaid, no balance check)' : ''}</option>)}
              </select>
              <FieldError id="lv-type-err" msg={typeErr} />
            </div>
            <div>
              <label className="lv-label" htmlFor="lv-start">Start date</label>
              <input id="lv-start" data-wf="i-2-0-1" type="date" className="lv-field lv-num" value={form.start}
                aria-invalid={startErr ? 'true' : 'false'} aria-describedby={startErr.trim() ? 'lv-start-err' : undefined}
                onChange={(e) => update('start', e.target.value)} />
              <FieldError id="lv-start-err" msg={startErr} />
            </div>
            <div>
              <label className="lv-label" htmlFor="lv-end">End date</label>
              <input id="lv-end" data-wf="i-2-0-2" type="date" className="lv-field lv-num" value={form.end}
                aria-invalid={endErr ? 'true' : 'false'} aria-describedby={endErr.trim() ? 'lv-end-err' : undefined}
                onChange={(e) => update('end', e.target.value)} />
              <FieldError id="lv-end-err" msg={endErr} />
            </div>
            <div className="sm:col-span-2">
              <label className="lv-label" htmlFor="lv-half">Half-day</label>
              <select id="lv-half" data-wf="i-2-0-3" className="lv-field" value={form.half} disabled={!singleDay}
                aria-describedby="lv-half-hint" onChange={(e) => update('half', e.target.value)}>
                <option value="">Full day</option>
                <option value="first">First half (morning)</option>
                <option value="second">Second half (afternoon)</option>
              </select>
              <p id="lv-half-hint" className="lv-hint">
                {singleDay ? 'Take 0.5 day by choosing a half. Half a day is the smallest amount you can request.' : 'Half-days are for a single day. Set the start and end date to the same day to choose one.'}
              </p>
            </div>
            <div className="sm:col-span-2">
              <label className="lv-label" htmlFor="lv-reason">Reason <span style={{ textTransform: 'none', letterSpacing: 0 }}>(optional)</span></label>
              <textarea id="lv-reason" data-wf="i-2-0-4" className="lv-field" value={form.reason} rows={3}
                aria-describedby="lv-reason-hint" onChange={(e) => update('reason', e.target.value)}
                placeholder="For example: family trip, moving house" />
              <p id="lv-reason-hint" className="lv-hint">Keep it brief. Please do not include health details, even for sick leave.</p>
            </div>
          </div>
        </form>

        <aside data-wf="b-2-1" className="lv-panel lg:col-span-5" style={{ padding: 24, borderTop: '1px solid var(--lv-accent)' }} aria-labelledby="lv-count-h" aria-live="polite">
          <h2 id="lv-count-h" className="lv-eyebrow" style={{ margin: 0 }}>Day count</h2>
          {calc.state === 'ok' ? (
            <div>
              <div style={{ margin: '16px 0 4px' }} className="lv-num">
                <span className="lv-head lv-accent" style={{ fontSize: 56, lineHeight: 1 }}>{lvNum(calc.days)}</span>
                <span style={{ fontSize: 18, marginLeft: 8 }}>{calc.days === 1 ? 'working day' : calc.days === 0.5 ? 'working day (half)' : 'working days'}</span>
              </div>
              {form.half && <p className="lv-muted" style={{ margin: 0, fontSize: 14 }}>Half-day: {form.half === 'first' ? 'first half (morning)' : 'second half (afternoon)'} of {lvShort(form.start)}.</p>}
              {calc.excluded.length > 0 ? (
                <ul style={{ listStyle: 'none', margin: '16px 0 0', padding: 0, fontSize: 14 }}>
                  {calc.excluded.slice(0, 6).map((x) => (
                    <li key={x.iso} className="flex gap-3" style={{ padding: '8px 0', borderTop: '1px solid var(--lv-line)' }}>
                      <span className="lv-num" style={{ minWidth: 72, fontWeight: 500 }}>{lvShort(x.iso)}</span>
                      <span className="lv-muted">Excluded: {x.reason}</span>
                    </li>
                  ))}
                  {calc.excluded.length > 6 && (
                    <li className="lv-muted" style={{ padding: '8px 0', borderTop: '1px solid var(--lv-line)' }}>and {calc.excluded.length - 6} more non-working days</li>
                  )}
                </ul>
              ) : (
                <p className="lv-muted" style={{ margin: '16px 0 0', fontSize: 14 }}>No weekends or public holidays in this range.</p>
              )}
              <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--lv-line-strong)' }} className="lv-num">
                {selType && selType.unpaid ? (
                  <p style={{ margin: 0, fontSize: 14 }}>Unpaid leave is not checked against a balance.</p>
                ) : selBal ? (
                  <>
                    <div className="flex justify-between" style={{ fontSize: 14 }}>
                      <span className="lv-muted">Available now</span><span>{lvNum(selBal.available)} {lvUnit(selBal.available)}</span>
                    </div>
                    <div className="flex justify-between" style={{ fontSize: 14, marginTop: 4 }}>
                      <span className="lv-muted">This request</span><span>− {lvNum(calc.days)} {lvUnit(calc.days)}</span>
                    </div>
                    <div className="flex justify-between items-baseline" style={{ marginTop: 12 }}>
                      <span style={{ fontWeight: 600 }}>Balance after</span>
                      <span className="lv-head" style={{ fontSize: 24, color: selBal.available - calc.days < 0 ? 'var(--lv-err)' : 'var(--lv-accent)' }}>
                        {lvNum(selBal.available - calc.days)} {lvUnit(selBal.available - calc.days)}
                      </span>
                    </div>
                    {selBal.available - calc.days < 0 && (
                      <p className="lv-fielderr" style={{ marginTop: 12 }}>
                        <Icons.AlertCircle className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
                        <span>This is {lvNum(calc.days - selBal.available)} {lvUnit(calc.days - selBal.available)} more than you have available, so it will be refused.</span>
                      </p>
                    )}
                  </>
                ) : (
                  <p className="lv-muted" style={{ margin: 0, fontSize: 14 }}>Choose a leave type to see your balance after this request.</p>
                )}
              </div>
            </div>
          ) : (
            <div style={{ marginTop: 16 }}>
              <p className="lv-head" style={{ fontSize: 22, margin: '0 0 8px' }}>
                {calc.state === 'invalid' ? 'The dates run backwards' : calc.state === 'toolong' ? 'That range is too long' : 'Pick your dates'}
              </p>
              <p className="lv-muted" style={{ margin: 0, fontSize: 14 }}>
                {calc.state === 'invalid'
                  ? 'The end date is earlier than the start date. Move one of them and the count appears here.'
                  : calc.state === 'toolong'
                  ? 'Requests cover up to a year. Split this one into shorter periods.'
                  : 'Choose a start and end date. Weekends and company holidays are taken out for you, and your balance after the request shows here.'}
              </p>
            </div>
          )}
        </aside>
      </div>

      {/* Row 4 */}
      <div className="grid grid-cols-1 lg:grid-cols-3" style={{ marginTop: -24 }}>
        <button type="submit" form="lv-form" data-wf="b-3-0" className="lv-btn lv-btn-primary w-full">
          <Icons.ArrowRight className="w-4 h-4" aria-hidden="true" />
          Submit leave request
        </button>
      </div>

      {/* Row 5 + 6 */}
      <section aria-label="Leave history" className="flex flex-col gap-6">
        <div data-wf="b-4-0" role="group" aria-label="Leave history filters" className="lv-panel flex flex-col sm:flex-row sm:items-end gap-4" style={{ padding: 16 }}>
          <div className="flex items-center gap-2 lv-eyebrow sm:pb-3" style={{ minWidth: 120 }}>
            <Icons.Filter className="w-4 h-4" aria-hidden="true" />
            <span>Filter history</span>
          </div>
          <div className="flex-1">
            <label className="lv-label" htmlFor="lv-f-type">Leave type</label>
            <select id="lv-f-type" data-wf="i-4-0-0" className="lv-field" value={fType} onChange={(e) => setFType(e.target.value)}>
              <option value="all">All leave types</option>
              {activeTypes.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
          <div className="flex-1">
            <label className="lv-label" htmlFor="lv-f-status">Status</label>
            <select id="lv-f-status" data-wf="i-4-0-1" className="lv-field" value={fStatus} onChange={(e) => setFStatus(e.target.value)}>
              <option value="all">All statuses</option>
              <option value="Submitted">Submitted</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        <div data-wf="b-5-0">
          <div className="flex items-baseline justify-between gap-4" style={{ marginBottom: 16 }}>
            <h2 id="lv-hist-h" className="lv-head" style={{ fontSize: 24 }}>My leave history</h2>
            <p className="lv-muted lv-num" style={{ margin: 0, fontSize: 13 }} aria-live="polite">Showing {filtered.length} of {requests.length} requests, most recent first</p>
          </div>

          {filtered.length === 0 ? (
            <div className="lv-panel" style={{ padding: 48, textAlign: 'center' }}>
              <Icons.Calendar className="w-6 h-6 lv-accent" style={{ margin: '0 auto 16px' }} aria-hidden="true" />
              <p className="lv-head" style={{ fontSize: 22, margin: '0 0 8px' }}>No requests match those filters</p>
              <p className="lv-muted" style={{ margin: '0 auto 24px', maxWidth: 420, fontSize: 14 }}>
                You have {requests.length} requests in total, but none are {fType !== 'all' ? typeName(fType) + ' leave' : 'in that group'}{fStatus !== 'all' ? ' with the status ' + fStatus : ''}.
              </p>
              <button type="button" className="lv-btn lv-btn-quiet" onClick={() => { setFType('all'); setFStatus('all'); }}>Show all requests</button>
            </div>
          ) : (
            <div className="lv-panel">
              <div className="hidden lg:block">
                <table className="lv-table" aria-labelledby="lv-hist-h">
                  <thead>
                    <tr>
                      <th scope="col" data-wf="i-5-0-0">Leave type</th>
                      <th scope="col" data-wf="i-5-0-1">Dates</th>
                      <th scope="col" className="r" data-wf="i-5-0-2">Days</th>
                      <th scope="col" data-wf="i-5-0-3">Status</th>
                      <th scope="col" data-wf="i-5-0-4">Decision date</th>
                      <th scope="col" data-wf="i-5-0-5">Manager comment</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((r) => (
                      <tr key={r.id} className={r.id === newId ? 'lv-new' : ''}>
                        <td>
                          <div style={{ fontWeight: 500 }}>{typeName(r.typeId)}</div>
                          <div className="lv-num lv-accent" style={{ fontSize: 13, letterSpacing: '.04em' }}>{r.ref}</div>
                        </td>
                        <td>{lvRange(r.start, r.end, r.half)}</td>
                        <td className="r">{lvNum(r.days)}</td>
                        <td><StatusChip status={r.status} /></td>
                        <td>{r.decidedAt ? lvDate(r.decidedAt) : <span className="lv-muted">Awaiting decision</span>}</td>
                        <td style={{ maxWidth: 280 }}>{r.comment ? r.comment : <span className="lv-muted">—</span>}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <ul className="lg:hidden" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                {filtered.map((r, i) => (
                  <li key={r.id} className={r.id === newId ? 'lv-new' : ''} style={{ padding: 16, borderTop: i === 0 ? 0 : '1px solid var(--lv-line)' }}>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div style={{ fontWeight: 500 }}>{typeName(r.typeId)}</div>
                        <div className="lv-num lv-accent" style={{ fontSize: 13, letterSpacing: '.04em' }}>{r.ref}</div>
                      </div>
                      <StatusChip status={r.status} />
                    </div>
                    <p className="lv-num" style={{ margin: '12px 0 0' }}>{lvRange(r.start, r.end, r.half)} · {lvNum(r.days)} {lvUnit(r.days)}</p>
                    <p className="lv-muted lv-num" style={{ margin: '4px 0 0', fontSize: 13 }}>
                      {r.decidedAt ? 'Decided ' + lvDate(r.decidedAt) : 'Awaiting decision from ' + LV_MANAGER}
                    </p>
                    {r.comment && <p style={{ margin: '8px 0 0', fontSize: 14 }}>“{r.comment}”</p>}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      {/* Row 7 + 8 */}
      <section aria-labelledby="lv-hol-h">
        <div data-wf="b-6-0">
          <h2 id="lv-hol-h" className="lv-head" style={{ fontSize: 24, marginBottom: 16 }}>Company holidays</h2>
          <div role="tablist" aria-label="Holiday calendar year" className="lv-tablist">
            {YEARS.map((y) => (
              <button key={y} id={'lv-tab-' + y} type="button" role="tab" data-wf={'i-6-0-' + YEARS.indexOf(y)}
                className="lv-tab lv-num" aria-selected={year === y} aria-controls="lv-hol-panel"
                tabIndex={year === y ? 0 : -1} onClick={() => setYear(y)} onKeyDown={(e) => onTabKey(e, y)}>
                {y}
              </button>
            ))}
          </div>
        </div>

        <div data-wf="b-7-0" id="lv-hol-panel" role="tabpanel" aria-labelledby={'lv-tab-' + year} style={{ marginTop: 24 }}>
          <div className="flex items-baseline justify-between gap-4 flex-wrap" style={{ marginBottom: 16 }}>
            <h3 id="lv-hol-t" className="lv-head" style={{ fontSize: 20 }}>Holidays {year}</h3>
            <p className="lv-muted" style={{ margin: 0, fontSize: 13 }}>One shared calendar for everyone. These days are left out of your leave count.</p>
          </div>
          {yearRows.length === 0 ? (
            <div className="lv-panel" style={{ padding: 48, textAlign: 'center' }}>
              <Icons.Calendar className="w-6 h-6 lv-accent" style={{ margin: '0 auto 16px' }} aria-hidden="true" />
              <p className="lv-head" style={{ fontSize: 22, margin: '0 0 8px' }}>No holidays set for {year} yet</p>
              <p className="lv-muted" style={{ margin: 0, fontSize: 14 }}>HR publishes the calendar before the year begins.</p>
            </div>
          ) : (
            <div className="lv-panel">
              <table className="lv-table" aria-labelledby="lv-hol-t">
                <thead>
                  <tr>
                    <th scope="col" data-wf="i-7-0-0">Date</th>
                    <th scope="col" data-wf="i-7-0-1">Day of week</th>
                    <th scope="col" data-wf="i-7-0-2">Holiday name</th>
                  </tr>
                </thead>
                <tbody>
                  {yearRows.map((h) => {
                    const past = year === 2026 ? h.date < LV_TODAY : year < 2026;
                    const isNext = nextHoliday && nextHoliday.date === h.date;
                    return (
                      <tr key={h.date} style={{ color: past ? 'var(--lv-muted)' : undefined }}>
                        <td className="lv-num" style={{ whiteSpace: 'nowrap' }}>{lvDate(h.date)}</td>
                        <td>{LV_DAYS_LONG[lvParse(h.date).getUTCDay()]}</td>
                        <td>
                          <span>{h.name}</span>
                          {isNext && <span className="lv-chip lv-chip-Approved" style={{ marginLeft: 12 }}><Icons.Calendar className="w-4 h-4" aria-hidden="true" />Next holiday</span>}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
