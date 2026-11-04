import { expect, test, type Page } from "@playwright/test";

// US-006: administrator-issued reset is the only reset path (AC-021) and an
// account signing in with a one-time password must set a new one first (AC-023).

test("[AC-021] sign-in tells the user to contact an administrator and offers no self-service reset", async ({
  page,
}) => {
  await page.goto("/sign-in");
  await expect(page.getByText(/contact an administrator/i)).toBeVisible();
  await expect(
    page.getByRole("link", { name: /forgot|reset|email me|send.*link/i }),
  ).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: /forgot|reset|email me|send.*link/i }),
  ).toHaveCount(0);
});

async function mockForcedChange(page: Page) {
  let changed = false;
  const me = () => ({
    user_id: "00000000-0000-0000-0000-000000000002",
    email: "reset@example.com",
    display_name: "Reset User",
    roles: ["EMPLOYEE"],
    permissions: ["profile.own", "timesheet.own", "leave.own", "holidays.view", "approvals.track"],
    must_change_password: !changed,
    is_active: true,
  });
  await page.route("**/api/auth/login", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        session_token: "e2e-otp-token",
        user_id: "00000000-0000-0000-0000-000000000002",
        display_name: "Reset User",
        roles: ["EMPLOYEE"],
        must_change_password: !changed,
      }),
    }),
  );
  await page.route("**/api/me", (route) =>
    route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(me()) }),
  );
  await page.route("**/api/auth/change-password", (route) => {
    changed = true;
    return route.fulfill({ status: 204 });
  });
  // Every other API route is refused until the password is changed.
  await page.route(/\/api\/(?!me|auth\/)/, (route) =>
    changed
      ? route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ items: [], total: 0 }),
        })
      : route.fulfill({
          status: 403,
          contentType: "application/json",
          body: JSON.stringify({ detail: "Password change required" }),
        }),
  );
}

test("[AC-023] one-time password sign-in is forced to change password before any other screen", async ({
  page,
}) => {
  await mockForcedChange(page);
  await page.goto("/sign-in");
  await page.fill("#vl-email", "reset@example.com");
  await page.fill("#vl-password", "one-time-pass");
  await page.locator("#vl-signin-form button[type='submit']").click();

  await expect(page).toHaveURL(/\/change-password$/);
  await expect(page.getByRole("heading", { name: "Set a new password" })).toBeVisible();

  // Direct navigation to other screens bounces back to the change screen.
  for (const path of ["/home", "/timesheet", "/leave"]) {
    await page.goto(path);
    await expect(page).toHaveURL(/\/change-password$/);
  }

  // Mismatched confirmation is refused client-side.
  await page.fill("#cp-current_password", "one-time-pass");
  await page.fill("#cp-new_password", "a-brand-new-password-1");
  await page.fill("#cp-confirm_password", "different-password-22");
  await page.getByRole("button", { name: "Change password" }).click();
  await expect(page.getByText("Passwords do not match.")).toBeVisible();
  await expect(page).toHaveURL(/\/change-password$/);

  // Matching values succeed and release the user to the app.
  await page.fill("#cp-confirm_password", "a-brand-new-password-1");
  await page.getByRole("button", { name: "Change password" }).click();
  await expect(page).toHaveURL(/\/home$/);
  await page.goto("/timesheet");
  await expect(page).toHaveURL(/\/timesheet$/);
});
