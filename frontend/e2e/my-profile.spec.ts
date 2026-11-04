import { expect, test, type Page } from "@playwright/test";

// US-008-3 e2e: My Profile shows identity fields, restricted fields are
// read-only, and an editable field saves with on-screen confirmation.

const PERMS = ["profile.own", "timesheet.own", "leave.own", "holidays.view", "approvals.track"];
const EMP_ID = "e-1";

async function setup(page: Page) {
  const employee = {
    id: EMP_ID,
    employee_number: "E1234",
    full_name: "Erin Employee",
    work_email: "erin@example.com",
    mobile_number: "111",
    personal_contact: null as string | null,
    department_id: "d-1",
    reporting_manager_id: "m-1",
    start_date: "2024-01-01",
    end_date: null,
    is_active: true,
    department_name: "Engineering",
    reporting_manager_name: "Dana Manager",
  };
  const manager = { ...employee, id: "m-1", full_name: "Dana Manager", reporting_manager_id: null };
  const patches: Array<Record<string, unknown>> = [];

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
        employee_id: EMP_ID,
      }),
    }),
  );
  await page.route("**/api/departments**", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify([
        { id: "d-1", name: "Engineering", created_at: "2026-01-01T00:00:00Z" },
      ]),
    }),
  );
  await page.route("**/api/employees/*", async (route) => {
    const req = route.request();
    const id = new URL(req.url()).pathname.split("/").pop();
    if (req.method() === "PATCH") {
      const body = JSON.parse(req.postData() || "{}");
      patches.push(body);
      Object.assign(employee, body);
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(employee),
      });
    }
    return route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(id === "m-1" ? manager : employee),
    });
  });
  return patches;
}

test("[AC-029] My Profile displays name, employee ID, department, manager, work email and contact details", async ({
  page,
}) => {
  await setup(page);
  await page.goto("/profile");
  await expect(page.getByRole("heading", { name: "My Profile" })).toBeVisible();
  await expect(page.locator("[id='pf-Name']")).toHaveValue("Erin Employee");
  await expect(page.locator("[id='pf-Employee ID']")).toHaveValue("E1234");
  await expect(page.locator("[id='pf-Department']")).toHaveValue("Engineering");
  await expect(page.locator("[id='pf-Reporting manager']")).toHaveValue("Dana Manager");
  await expect(page.locator("[id='pf-Work email']")).toHaveValue("erin@example.com");
  await expect(page.locator("#pf-mobile_number")).toHaveValue("111");
  await expect(page.locator("#pf-personal_contact")).toBeVisible();
});

test("[AC-031] department, reporting manager and employee ID are read-only", async ({ page }) => {
  await setup(page);
  await page.goto("/profile");
  for (const label of ["Employee ID", "Department", "Reporting manager"]) {
    await expect(page.locator(`[id='pf-${label}']`)).toHaveAttribute("readonly", "");
  }
});

test("[AC-030] changing the mobile number saves, sends only editable fields and confirms on screen", async ({
  page,
}) => {
  const patches = await setup(page);
  await page.goto("/profile");
  await page.fill("#pf-mobile_number", "+1 555 0100");
  await page.getByRole("button", { name: "Save changes" }).click();
  await expect(page.getByText("Your contact details were saved.")).toBeVisible();
  expect(patches).toHaveLength(1);
  expect(patches[0].mobile_number).toBe("+1 555 0100");
  expect(Object.keys(patches[0]).sort()).toEqual(["mobile_number", "personal_contact"]);
});
