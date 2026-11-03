import { format, parseISO } from "date-fns";

/** The company's single timezone (NFR-017). Set at build time; one value for every screen. */
export const COMPANY_TIMEZONE: string =
  (import.meta.env.VITE_COMPANY_TIMEZONE as string | undefined) ?? "Europe/London";

export const DATE_FORMAT = "dd MMM yyyy";
export const DATE_TIME_FORMAT = "dd MMM yyyy, HH:mm";

const HAS_ZONE = /(Z|[+-]\d{2}:?\d{2})$/;

// Re-express an instant as the company's wall-clock time, in a Date whose local fields
// carry that wall-clock (so date-fns can format it).
function inCompanyZone(instant: Date): Date {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: COMPANY_TIMEZONE,
    hourCycle: "h23",
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  }).formatToParts(instant);
  const n = (t: string) => Number(parts.find((p) => p.type === t)?.value);
  return new Date(n("year"), n("month") - 1, n("day"), n("hour"), n("minute"), n("second"));
}

function toCompanyDate(value: string | Date): Date {
  if (value instanceof Date) return inCompanyZone(value);
  // A timestamptz carries a zone: convert. A bare local stamp is already company time.
  return HAS_ZONE.test(value) ? inCompanyZone(parseISO(value)) : parseISO(value);
}

/** Calendar date, e.g. "03 Nov 2026". A date-only string is shown as-is (no zone shift). */
export function formatDate(value: string | Date | null | undefined): string {
  if (!value) return "—";
  const d =
    typeof value === "string" && !value.includes("T") ? parseISO(value) : toCompanyDate(value);
  return format(d, DATE_FORMAT);
}

/** Timestamp in company time, e.g. "03 Nov 2026, 08:41". */
export function formatDateTime(value: string | Date | null | undefined): string {
  if (!value) return "—";
  return format(toCompanyDate(value), DATE_TIME_FORMAT);
}
