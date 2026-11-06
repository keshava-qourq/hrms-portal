import { expect, test, type Page } from "@playwright/test";

// US-016-3 e2e: the weekly timesheet grid. The API is stubbed with a small stateful
// week store that applies the same rules as the server (24h daily maximum, no negatives).

const PERMS = ["profile.own", "timesheet.own", "leave.own", "holidays.view", "approvals.track"];
const PROJECTS = [
  { id: "p-a", code: "ALPHA", name: "Alpha Build", status: "active", pickable: true },
  { id: "p-b", code: "BRAVO", name: "Bravo Run", status: "active", pickable: true },
];

type Entry = { project_id: string; work_date: string; hours: number };

function addDaysIso(iso: string, n: number) {
  const d = new Date(iso + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

function weekBody(week: string, entries: Entry[], status: string) {
  const by_project: Record<string, number> = {};
  const by_day: Record<string, number> = {};
  let total = 0;
  for (const e of entries) {
    by_project[e.project_id] = (by_project[e.project_id] ?? 0) + e.hours;
    by_day[e.work_date] = (by_day[e.work_date] ?? 0) + e.hours;
    total += e.hours;
  }
  return {
    week_start: week,
    week_end: addDaysIso(week, 6),
    status,
    editable: status === "draft",
    timesheet_id: entries.length ? "ts-" + week : null,
    projects: PROJECTS,
    entries,
    totals: { by_project, by_day, week: total },
  };
}

async function setup(page: Page, seed: Record<string, { status: string; entries: Entry[] }> = {}) {
  const store: Record<string, { status: string; entries: Entry[] }> = { ...seed };
  const puts: unknown[] = [];

  await page.addInitScript(() => localStorage.setItem("session_token", "e2e-token"));
  await page.route("**/api/me", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        user_id: "00000000-0000-0000-0000-000000000001",
        email: "erin@example.com",
        display_name: "Erin Employee",
        roles: ["EMPLOYEE"],
        permissions: PERMS,
        must_change_password: false,
        is_active: true,
        employee_id: "e-1",
      }),
    }),
  );

  await page.route("**/api/timesheets/week/**", async (route) => {
    const req = route.request();
    const path = new URL(req.url()).pathname;
    const week = path.split("/week/")[1].split("/")[0];
    const cur = store[week] ?? { status: "draft", entries: [] };
    if (req.method() === "PUT") {
      const body = JSON.parse(req.postData() || "{}") as { entries: Entry[] };
      puts.push(body);
      const merged = new Map(cur.entries.map((e) => [e.project_id + "|" + e.work_date, e]));
      for (const e of body.entries) merged.set(e.project_id + "|" + e.work_date, e);
      for (let i = 0; i < body.entries.length; i++) {
        const e = body.entries[i];
        if (typeof e.hours !== "number" || e.hours < 0) {
          return route.fulfill({
            status: 422,
            contentType: "application/json",
            body: JSON.stringify({
              detail: [{ loc: ["body", "entries", i, "hours"], msg: "Hours must be zero or more" }],
            }),
          });
        }
      }
      const day: Record<string, number> = {};
      for (const e of merged.values()) day[e.work_date] = (day[e.work_date] ?? 0) + e.hours;
      for (let i = 0; i < body.entries.length; i++) {
        if (day[body.entries[i].work_date] > 24) {
          return route.fulfill({
            status: 422,
            contentType: "application/json",
            body: JSON.stringify({
              detail: [
                { loc: ["body", "entries", i, "hours"], msg: "Daily maximum is 24 hours" },
              ],
            }),
          });
        }
      }
      const next = [...merged.values()].filter((e) => e.hours > 0);
      store[week] = { status: cur.status, entries: next };
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(weekBody(week, next, cur.status)),
      });
    }
    return route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(weekBody(week, cur.entries, cur.status)),
    });
  });
  return { store, puts };
}

function mondayOfToday(): string {
  const d = new Date();
  const iso = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dow = (iso.getUTCDay() + 6) % 7;
  iso.setUTCDate(iso.getUTCDate() - dow);
  return iso.toISOString().slice(0, 10);
}

const THIS = mondayOfToday();
const NEXT = addDaysIso(THIS, 7);
const PREV = addDaysIso(THIS, -7);

const cell = (page: Page, code: string, offset: number) =>
  page.locator(`input.ts-cell[aria-label^="${code} "]`).nth(offset);

test("[AC-056] grid shows each assigned project as a row, Mon–Sun columns and row/day/week totals", async ({
  page,
}) => {
  await setup(page, {
    [THIS]: {
      status: "draft",
      entries: [
        { project_id: "p-a", work_date: THIS, hours: 3 },
        { project_id: "p-a", work_date: addDaysIso(THIS, 1), hours: 2 },
        { project_id: "p-b", work_date: THIS, hours: 4 },
      ],
    },
  });
  await page.goto("/timesheet");
  await expect(page.getByRole("heading", { name: "My Timesheet" })).toBeVisible();
  await expect(page.locator("tbody tr")).toHaveCount(2);
  await expect(page.locator("tbody tr", { hasText: "ALPHA" })).toHaveCount(1);
  await expect(page.locator("tbody tr", { hasText: "BRAVO" })).toHaveCount(1);
  const heads = page.locator("thead th");
  await expect(heads).toHaveCount(9); // Project + 7 days + Total
  for (const [i, day] of ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].entries()) {
    await expect(heads.nth(i + 1)).toContainText(day);
  }
  await expect(page.getByTestId("row-total-p-a")).toHaveText("5");
  await expect(page.getByTestId("row-total-p-b")).toHaveText("4");
  await expect(page.getByTestId("day-total-" + THIS)).toHaveText("7");
  await expect(page.getByTestId("day-total-" + addDaysIso(THIS, 1))).toHaveText("2");
  await expect(page.getByTestId("week-total")).toHaveText("9");
});

test("[AC-057] editing a cell and clicking Save draft recalculates totals and persists after reload", async ({
  page,
}) => {
  const { puts } = await setup(page);
  await page.goto("/timesheet");
  await expect(page.locator("tbody tr")).toHaveCount(2);
  await cell(page, "ALPHA", 0).fill("7.5");
  await cell(page, "BRAVO", 0).fill("0.5");
  await page.getByRole("button", { name: "Save draft" }).click();
  await expect(page.getByText("Draft saved.")).toBeVisible();
  expect(puts).toHaveLength(1);
  await expect(page.getByTestId("row-total-p-a")).toHaveText("7.5");
  await expect(page.getByTestId("day-total-" + THIS)).toHaveText("8");
  await expect(page.getByTestId("week-total")).toHaveText("8");

  await page.reload();
  await expect(cell(page, "ALPHA", 0)).toHaveValue("7.5");
  await expect(page.getByTestId("week-total")).toHaveText("8");
});

test("[AC-058] Previous and Next week show that week's entries and status; an empty week is a blank draft", async ({
  page,
}) => {
  await setup(page, {
    [PREV]: {
      status: "approved",
      entries: [{ project_id: "p-a", work_date: PREV, hours: 6 }],
    },
    [NEXT]: {
      status: "submitted",
      entries: [{ project_id: "p-b", work_date: NEXT, hours: 2 }],
    },
  });
  await page.goto("/timesheet");
  await expect(page.getByText("Draft", { exact: true })).toBeVisible();
  await expect(page.getByTestId("week-total")).toHaveText("0");
  await expect(cell(page, "ALPHA", 0)).toHaveValue("");

  await page.getByRole("button", { name: /Previous week/ }).click();
  await expect(page.getByText("Approved", { exact: true })).toBeVisible();
  await expect(page.getByTestId("week-total")).toHaveText("6");
  await expect(cell(page, "ALPHA", 0)).toHaveValue("6");

  await page.getByRole("button", { name: /Next week/ }).click();
  await page.getByRole("button", { name: /Next week/ }).click();
  await expect(page.getByText("Submitted", { exact: true })).toBeVisible();
  await expect(page.getByTestId("week-total")).toHaveText("2");

  await page.getByRole("button", { name: /Next week/ }).click();
  await expect(page.getByText("Draft", { exact: true })).toBeVisible();
  await expect(page.getByTestId("week-total")).toHaveText("0");
  await expect(cell(page, "BRAVO", 0)).toHaveValue("");
});

test("[AC-055] a negative value is flagged inline with a message and is not saved", async ({
  page,
}) => {
  const { puts, store } = await setup(page);
  await page.goto("/timesheet");
  await expect(page.locator("tbody tr")).toHaveCount(2);
  await cell(page, "ALPHA", 0).fill("-3");
  await page.getByRole("button", { name: "Save draft" }).click();
  await expect(cell(page, "ALPHA", 0)).toHaveAttribute("aria-invalid", "true");
  await expect(page.getByText("Enter hours as a number, zero or more.")).toBeVisible();
  await expect(page.getByRole("alert").first()).toContainText("Nothing was saved");
  expect(puts).toHaveLength(0);
  expect(store[THIS]).toBeUndefined();
});

test("[AC-054] a day total above 24 is flagged inline with a message and is not saved", async ({
  page,
}) => {
  const { store } = await setup(page, {
    [THIS]: { status: "draft", entries: [{ project_id: "p-a", work_date: THIS, hours: 8 }] },
  });
  await page.goto("/timesheet");
  await expect(page.getByTestId("week-total")).toHaveText("8");
  await cell(page, "BRAVO", 0).fill("17");
  await page.getByRole("button", { name: "Save draft" }).click();
  await expect(page.getByRole("alert").first()).toContainText(/daily maximum/i);
  await expect(cell(page, "BRAVO", 0)).toHaveAttribute("aria-invalid", "true");
  expect(store[THIS].entries).toHaveLength(1);
  expect(store[THIS].entries[0].hours).toBe(8);
});
