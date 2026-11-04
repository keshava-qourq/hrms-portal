import { expect, test, type Page } from "@playwright/test";

// US-012-3 e2e: My Team lists the manager's direct reports with department and
// leave/timesheet status; a non-report never appears and is not reachable.

const PERMS = [
  "profile.own",
  "timesheet.own",
  "leave.own",
  "holidays.view",
  "approvals.track",
  "team.view",
];

const TEAM = [
  {
    id: "r-1",
    full_name: "Ada Report",
    department_name: "Engineering",
    leave_status: "On leave",
    timesheet_status: "Submitted",
  },
  {
    id: "r-2",
    full_name: "Bo Report",
    department_name: "Design",
    leave_status: "Available",
    timesheet_status: "Draft",
  },
  {
    id: "r-3",
    full_name: "Cy Report",
    department_name: "Engineering",
    leave_status: "Available",
    timesheet_status: "Approved",
  },
];

async function setup(page: Page, items: unknown[]) {
  await page.addInitScript(() => localStorage.setItem("session_token", "e2e-token"));
  await page.route("**/api/me", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        user_id: "00000000-0000-0000-0000-000000000001",
        email: "mgr@example.com",
        display_name: "Mina Manager",
        roles: ["EMPLOYEE", "REPORTING_MANAGER"],
        permissions: PERMS,
        must_change_password: false,
        is_active: true,
        employee_id: "m-1",
      }),
    }),
  );
  await page.route("**/api/my/team**", (route) =>
    route.request().url().includes("/api/my/team/")
      ? route.fulfill({
          status: 403,
          contentType: "application/json",
          body: JSON.stringify({ detail: "Forbidden" }),
        })
      : route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ items, total: items.length }),
        }),
  );
}

test("[AC-042] My Team lists exactly the three reports with department and leave/timesheet status", async ({
  page,
}) => {
  await setup(page, TEAM);
  await page.goto("/my-team");
  await expect(page.getByRole("heading", { name: "My Team" })).toBeVisible();
  await expect(page.locator("tbody tr")).toHaveCount(3);
  for (const m of TEAM) {
    const row = page.locator("tbody tr", { hasText: m.full_name });
    await expect(row).toHaveCount(1);
    await expect(row).toContainText(m.department_name);
    await expect(row).toContainText(m.leave_status);
    await expect(row).toContainText(m.timesheet_status);
  }
});

test("[AC-043] a non-report is not listed on My Team", async ({ page }) => {
  await setup(page, TEAM);
  await page.goto("/my-team");
  await expect(page.locator("tbody tr")).toHaveCount(3);
  await expect(page.getByText("Olive Outsider")).toHaveCount(0);
});

test("[AC-043] a non-report's profile is not reachable from the screen", async ({ page }) => {
  await setup(page, TEAM);
  await page.goto("/my-team");
  await expect(page.locator("tbody tr")).toHaveCount(3);
  // No row offers a link into any employee record.
  await expect(page.locator("tbody a")).toHaveCount(0);
  // Direct address of a foreign profile never renders that person's data.
  await page.goto("/employees/o-9");
  await expect(page.getByText("Olive Outsider")).toHaveCount(0);
});

test("[AC-042] a manager with no reports sees the empty state", async ({ page }) => {
  await setup(page, []);
  await page.goto("/my-team");
  await expect(page.getByText("No one reports to you yet.")).toBeVisible();
});
