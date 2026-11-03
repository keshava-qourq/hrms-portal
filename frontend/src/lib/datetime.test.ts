import { describe, expect, it } from "vitest";

import { formatDate, formatDateTime } from "@/lib/datetime";

describe("datetime", () => {
  it("[AC-135] renders a timestamptz in the company timezone", () => {
    // Europe/London is UTC+0 in November, UTC+1 in July.
    expect(formatDateTime("2026-11-03T08:41:00Z")).toBe("03 Nov 2026, 08:41");
    expect(formatDateTime("2026-07-03T08:41:00Z")).toBe("03 Jul 2026, 09:41");
  });

  it("[AC-135] uses one format for bare stamps and dates", () => {
    expect(formatDateTime("2026-11-03T08:41")).toBe("03 Nov 2026, 08:41");
    expect(formatDate("2026-11-03")).toBe("03 Nov 2026");
    expect(formatDate(null)).toBe("—");
  });
});
