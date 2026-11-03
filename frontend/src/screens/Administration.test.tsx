import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import App from "@/App";
import Administration from "@/screens/Administration";
import { clearSessionToken, setSessionToken } from "@/lib/api";

// A fetch stub that answers by URL + method. Each handler returns [status, body].
function stubApi(handlers: Record<string, (init?: RequestInit) => [number, unknown]>) {
  const fn = vi.fn((url: string, init?: RequestInit) => {
    const method = (init?.method ?? "GET").toUpperCase();
    for (const [key, handler] of Object.entries(handlers)) {
      const [m, pathEnd] = key.split(" ");
      if (m === method && url.endsWith(pathEnd)) {
        const [status, body] = handler(init);
        return Promise.resolve({ ok: status < 400, status, json: async () => body });
      }
    }
    return Promise.resolve({ ok: true, status: 200, json: async () => ({}) });
  });
  vi.stubGlobal("fetch", fn);
  return fn;
}

function renderAdmin() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter initialEntries={["/administration"]}>
        <Administration />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

const EMPLOYEES = {
  items: [
    { id: "emp-1", full_name: "Helena Brandt", employee_number: "E-1000", status: "Active" },
    { id: "emp-2", full_name: "Jun Watanabe", employee_number: "E-1008", status: "Active" },
  ],
};

beforeEach(() => setSessionToken("t"));
afterEach(() => {
  vi.unstubAllGlobals();
  clearSessionToken();
});

describe("Administration · Users & roles", () => {
  it("[AC-005] creates a user via POST /api/admin/users with email, employee and roles, then shows the new active account", async () => {
    const fetchMock = stubApi({
      "GET /api/me": () => [
        200,
        { user_id: "u", email: "admin@co", display_name: "Admin", roles: ["SYSTEM_ADMIN"] },
      ],
      "GET /api/employees": () => [200, EMPLOYEES],
      "POST /api/admin/users": () => [
        200,
        {
          user_id: "new-1",
          email: "jun.watanabe@ashgrove.co",
          is_active: true,
          roles: ["EMPLOYEE", "HR_ADMIN"],
        },
      ],
    });
    renderAdmin();

    // Wait for the linked-employee directory to load into the picker.
    await screen.findByRole("option", { name: /Jun Watanabe/ });

    await userEvent.type(screen.getByLabelText("Email"), "jun.watanabe@ashgrove.co");
    await userEvent.selectOptions(screen.getByLabelText("Linked employee"), "emp-2");
    // Multiple role checkboxes: Employee is default, add HR Admin.
    await userEvent.click(screen.getByLabelText("HR Admin"));
    await userEvent.click(screen.getByRole("button", { name: "Save user" }));

    const postCall = fetchMock.mock.calls.find(
      ([url, init]) => url.endsWith("/api/admin/users") && init?.method === "POST",
    );
    expect(postCall).toBeTruthy();
    const body = JSON.parse((postCall![1] as RequestInit).body as string);
    expect(body).toEqual({
      email: "jun.watanabe@ashgrove.co",
      employee_id: "emp-2",
      role_codes: ["Employee", "HR Admin"].map((n) => (n === "Employee" ? "EMPLOYEE" : "HR_ADMIN")),
    });

    // The new active account appears in the table.
    const table = await screen.findByRole("table");
    await within(table).findByText("jun.watanabe@ashgrove.co");
    expect(within(table).getByText("Active")).toBeInTheDocument();
  });

  it("[AC-008] hides the Users & roles and Audit tabs from a signed-in user without System Admin", async () => {
    stubApi({
      "GET /api/me": () => [
        200,
        { user_id: "u", email: "hr@co", display_name: "HR", roles: ["HR_ADMIN"] },
      ],
      "GET /api/employees": () => [200, EMPLOYEES],
    });
    renderAdmin();

    // Wait for an HR-only tab to confirm the role-driven tablist has rendered.
    await screen.findByRole("tab", { name: "Employees" });
    expect(screen.queryByRole("tab", { name: "Users & roles" })).not.toBeInTheDocument();
    expect(screen.queryByRole("tab", { name: "Audit log" })).not.toBeInTheDocument();
  });

  it("[AC-008] shows the Users & roles and Audit tabs to a System Admin", async () => {
    stubApi({
      "GET /api/me": () => [
        200,
        { user_id: "u", email: "admin@co", display_name: "Admin", roles: ["SYSTEM_ADMIN"] },
      ],
      "GET /api/employees": () => [200, EMPLOYEES],
    });
    renderAdmin();

    expect(await screen.findByRole("tab", { name: "Users & roles" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Audit log" })).toBeInTheDocument();
  });
});

describe("Account creation is admin-only (no self-registration)", () => {
  it("[AC-006] redirects an unauthenticated registration URL to the sign-in page", async () => {
    clearSessionToken();
    render(
      <MemoryRouter initialEntries={["/register"]}>
        <App />
      </MemoryRouter>,
    );
    await waitFor(() => expect(screen.getByLabelText("Work email")).toBeInTheDocument());
    expect(screen.queryByText("Administration")).not.toBeInTheDocument();
  });
});
