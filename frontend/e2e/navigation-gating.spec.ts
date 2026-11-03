import { expect, test, type Page } from "@playwright/test";

const EMPLOYEE_PERMS = ["profile.own", "timesheet.own", "leave.own", "holidays.view", "approvals.track"];

async function signInAs(page: Page, roles: string[], permissions: string[]) {
  await page.addInitScript(() => localStorage.setItem("session_token", "e2e-token"));
  await page.route("**/api/me", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        user_id: "00000000-0000-0000-0000-000000000001",
        email: "e2e@example.com",
        display_name: "E2E User",
        roles,
        permissions,
        must_change_password: false,
        is_active: true,
      }),
    }),
  );
  // Server refuses admin/PM/HR data for users without the permission; no record payload.
  await page.route("**/api/admin/**", (route) =>
    permissions.includes("users.manage")
      ? route.continue()
      : route.fulfill({ status: 403, contentType: "application/json", body: JSON.stringify({ detail: "Forbidden" }) }),
  );
}

test("[AC-010] multi-role user sees both the employee and the manager/admin menus", async ({ page }) => {
  await signInAs(
    page,
    ["EMPLOYEE", "REPORTING_MANAGER", "SYSTEM_ADMIN"],
    [...EMPLOYEE_PERMS, "team.view", "team.approve", "team.reports", "users.manage", "roles.assign"],
  );
  await page.goto("/home");
  const menu = page.getByRole("navigation", { name: "App menu" });
  await expect(menu.getByRole("link", { name: "My Timesheet" })).toBeVisible();
  await expect(menu.getByRole("link", { name: "Team & Approvals" })).toBeVisible();
  await expect(menu.getByRole("link", { name: "Administration" })).toBeVisible();
});

test("[AC-011] Employee-only user sees neither Team & Approvals nor Administration menus", async ({ page }) => {
  await signInAs(page, ["EMPLOYEE"], EMPLOYEE_PERMS);
  await page.goto("/home");
  const menu = page.getByRole("navigation", { name: "App menu" });
  await expect(menu.getByRole("link", { name: "My Timesheet" })).toBeVisible();
  await expect(menu.getByRole("link", { name: "Team & Approvals" })).toHaveCount(0);
  await expect(menu.getByRole("link", { name: "Administration" })).toHaveCount(0);
});

for (const path of ["/administration", "/approvals"]) {
  test(`[AC-011] Employee-only user cannot reach ${path} by direct address`, async ({ page }) => {
    await signInAs(page, ["EMPLOYEE"], EMPLOYEE_PERMS);
    await page.goto(path);
    // Either redirected away or shown a refusal; the restricted screen must not render.
    await expect(page).not.toHaveURL(new RegExp(`${path}$`));
  });
}
