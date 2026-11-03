import { expect, test, type Page } from "@playwright/test";

// US-009-3 e2e: creating an employee through the Employees tab shows inline
// validation for a missing mandatory field, then succeeds and the new record
// appears in the directory. The Employees tab lives under Administration and is
// gated on the HR Admin role.

const HR_PERMS = [
  "profile.own",
  "timesheet.own",
  "leave.own",
  "holidays.view",
  "approvals.track",
  "employees.manage",
  "departments.manage",
];

const DEPARTMENTS = [{ id: "d-1", name: "Engineering", created_at: "2026-01-01T00:00:00Z" }];

// An existing employee so the "Reporting manager" select is not empty.
const SEED_MANAGER = {
  id: "m-1",
  employee_number: "E0001",
  full_name: "Dana Manager",
  work_email: "dana@example.com",
  mobile_number: null,
  personal_contact: null,
  department_id: "d-1",
  reporting_manager_id: null,
  start_date: "2024-01-01",
  end_date: null,
  is_active: true,
};

async function signInAsHrAdmin(page: Page) {
  // A live, mutable directory the GET returns and the POST appends to.
  const directory = [{ ...SEED_MANAGER }];

  await page.addInitScript(() => localStorage.setItem("session_token", "e2e-token"));

  await page.route("**/api/me", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        user_id: "00000000-0000-0000-0000-000000000001",
        email: "hr@example.com",
        display_name: "HR Admin",
        roles: ["HR_ADMIN", "SYSTEM_ADMIN"],
        permissions: [...HR_PERMS, "users.manage", "roles.assign", "audit.view"],
        must_change_password: false,
        is_active: true,
      }),
    }),
  );

  await page.route("**/api/departments**", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ items: DEPARTMENTS, total: DEPARTMENTS.length }),
    }),
  );

  await page.route("**/api/employees**", async (route) => {
    const request = route.request();
    if (request.method() === "POST") {
      const body = JSON.parse(request.postData() || "{}");
      const created = {
        id: "new-" + directory.length,
        employee_number: body.employee_number,
        full_name: body.full_name,
        work_email: String(body.work_email || "").toLowerCase(),
        mobile_number: null,
        personal_contact: null,
        department_id: body.department_id,
        reporting_manager_id: body.reporting_manager_id,
        start_date: body.start_date,
        end_date: null,
        is_active: true,
      };
      directory.push(created);
      return route.fulfill({
        status: 201,
        contentType: "application/json",
        body: JSON.stringify(created),
      });
    }
    return route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ items: directory, total: directory.length }),
    });
  });

  // Other admin reads this screen makes should not hang the page.
  await page.route("**/api/admin/**", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ items: [], total: 0 }),
    }),
  );
}

async function openEmployeesTab(page: Page) {
  await page.goto("/administration");
  const tab = page.getByRole("tab", { name: "Employees" });
  await expect(tab).toBeVisible();
  await tab.click();
  await expect(page.getByRole("heading", { name: "Employee record" })).toBeVisible();
}

test("[US-009-3] missing mandatory field shows inline validation, then create succeeds and appears in the directory", async ({
  page,
}) => {
  await signInAsHrAdmin(page);
  await openEmployeesTab(page);

  const number = "N9001";
  const name = "New Hire Nadia";

  // Submit with Full name left blank: the form must refuse and flag the field inline.
  await page.fill("#emp-employee_number", number);
  await page.fill("#emp-work_email", "nadia@example.com");
  await page.selectOption("#emp-department_id", "d-1");
  await page.selectOption("#emp-reporting_manager_id", "m-1");
  await page.fill("#emp-start_date", "2026-02-01");
  await page.getByRole("button", { name: "Save employee" }).click();

  await expect(page.getByText("Full name is required.")).toBeVisible();
  // The record must not have been added while a field was missing.
  await expect(page.getByRole("button", { name: name })).toHaveCount(0);

  // Supply the missing field and submit again: now it succeeds.
  await page.fill("#emp-full_name", name);
  await page.getByRole("button", { name: "Save employee" }).click();

  // Inline error clears and the new employee is in the directory list.
  await expect(page.getByText("Full name is required.")).toHaveCount(0);
  await expect(page.getByRole("button", { name: name })).toBeVisible();
  await expect(page.getByText(number)).toBeVisible();
});
