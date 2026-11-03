import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import EmployeesTab from "@/screens/EmployeesTab";
import { clearSessionToken, setSessionToken } from "@/lib/api";

// A stateful fetch stub: GET /api/employees reflects records the POST/PATCH handlers
// write, so the directory shows what the contract would return after invalidation.
function makeApi() {
  const employees = [
    {
      id: "emp-1",
      employee_number: "E-1000",
      full_name: "Helena Brandt",
      work_email: "helena.brandt@ashgrove.co",
      department_id: "dept-1",
      reporting_manager_id: null,
      start_date: "2016-03-14",
    },
    {
      id: "emp-2",
      employee_number: "E-1001",
      full_name: "Priya Raman",
      work_email: "priya.raman@ashgrove.co",
      department_id: "dept-2",
      reporting_manager_id: "emp-1",
      start_date: "2019-06-03",
    },
    {
      id: "emp-3",
      employee_number: "E-1002",
      full_name: "Marcus Whitfield",
      work_email: "marcus.whitfield@ashgrove.co",
      department_id: "dept-1",
      reporting_manager_id: "emp-1",
      start_date: "2018-01-22",
    },
  ];
  const departments = [
    { id: "dept-1", name: "Engineering" },
    { id: "dept-2", name: "People & Culture" },
  ];
  let seq = 4;

  const fetchMock = vi.fn((url: string, init?: RequestInit) => {
    const method = (init?.method ?? "GET").toUpperCase();
    const body = init?.body ? JSON.parse(init.body as string) : undefined;

    if (url.endsWith("/api/departments") && method === "GET") {
      return Promise.resolve({ ok: true, status: 200, json: async () => ({ items: departments }) });
    }
    if (url.endsWith("/api/employees") && method === "GET") {
      return Promise.resolve({
        ok: true,
        status: 200,
        json: async () => ({ items: [...employees], total: employees.length }),
      });
    }
    if (url.endsWith("/api/employees") && method === "POST") {
      const created = { id: "emp-" + seq++, reporting_manager_id: null, ...body };
      employees.push(created);
      return Promise.resolve({ ok: true, status: 201, json: async () => created });
    }
    const patchMatch = url.match(/\/api\/employees\/(emp-\d+)$/);
    if (patchMatch && method === "PATCH") {
      const target = employees.find((e) => e.id === patchMatch[1])!;
      Object.assign(target, body);
      return Promise.resolve({ ok: true, status: 200, json: async () => ({ ...target }) });
    }
    return Promise.resolve({ ok: true, status: 200, json: async () => ({}) });
  });
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

function renderTab() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={client}>
      <EmployeesTab />
    </QueryClientProvider>,
  );
}

beforeEach(() => setSessionToken("t"));
afterEach(() => {
  vi.unstubAllGlobals();
  clearSessionToken();
});

describe("Administration · Employees tab", () => {
  it("[AC-032] creates a record and it appears in the directory from GET /api/employees", async () => {
    const fetchMock = makeApi();
    renderTab();

    await screen.findByRole("option", { name: "Engineering" });

    await userEvent.type(screen.getByLabelText("Full name"), "Jun Watanabe");
    await userEvent.type(screen.getByLabelText("Employee ID"), "E-1008");
    await userEvent.type(screen.getByLabelText("Work email"), "jun.watanabe@ashgrove.co");
    await userEvent.selectOptions(screen.getByLabelText("Department"), "dept-1");
    await userEvent.selectOptions(screen.getByLabelText("Reporting manager"), "emp-1");
    await userEvent.type(screen.getByLabelText("Start date"), "2023-05-08");
    await userEvent.click(screen.getByRole("button", { name: "Save employee" }));

    const postCall = fetchMock.mock.calls.find(
      ([url, init]) => url.endsWith("/api/employees") && init?.method === "POST",
    );
    expect(postCall).toBeTruthy();
    expect(JSON.parse((postCall![1] as RequestInit).body as string)).toEqual({
      employee_number: "E-1008",
      full_name: "Jun Watanabe",
      work_email: "jun.watanabe@ashgrove.co",
      department_id: "dept-1",
      reporting_manager_id: "emp-1",
      start_date: "2023-05-08",
    });

    const table = await screen.findByRole("table");
    await within(table).findByText("Jun Watanabe");
  });

  it("[AC-033] flags each missing mandatory field inline and blocks submit", async () => {
    const fetchMock = makeApi();
    renderTab();

    await screen.findByRole("option", { name: "Engineering" });
    await userEvent.click(screen.getByRole("button", { name: "Save employee" }));

    const alerts = await screen.findAllByRole("alert");
    const texts = alerts.map((a) => a.textContent);
    expect(texts).toEqual(
      expect.arrayContaining([
        expect.stringContaining("Full name is required."),
        expect.stringContaining("Employee ID is required."),
        expect.stringContaining("Work email is required."),
        expect.stringContaining("Department is required."),
        expect.stringContaining("Reporting manager is required."),
        expect.stringContaining("Start date is required."),
      ]),
    );
    expect(
      fetchMock.mock.calls.some(
        ([url, init]) => url.endsWith("/api/employees") && init?.method === "POST",
      ),
    ).toBe(false);
  });

  it("[AC-034] changing reporting manager persists via PATCH and the directory reflects it", async () => {
    const fetchMock = makeApi();
    renderTab();

    const table = await screen.findByRole("table");
    // Priya Raman currently reports to Helena Brandt (emp-1).
    const priyaRow = within(table).getByText("Priya Raman").closest("tr")!;
    expect(within(priyaRow).getByText("Helena Brandt")).toBeInTheDocument();

    await userEvent.click(within(table).getByRole("button", { name: "Priya Raman" }));

    // Change her reporting manager from Helena to Marcus (emp-3).
    await userEvent.selectOptions(screen.getByLabelText("Reporting manager"), "emp-3");
    await userEvent.click(screen.getByRole("button", { name: "Save changes" }));

    const patchCall = fetchMock.mock.calls.find(
      ([url, init]) => /\/api\/employees\/emp-2$/.test(url) && init?.method === "PATCH",
    );
    expect(patchCall).toBeTruthy();
    const patchBody = JSON.parse((patchCall![1] as RequestInit).body as string);
    expect(patchBody).toHaveProperty("reporting_manager_id", "emp-3");

    // After the refetch the directory shows the new manager.
    const refreshed = await screen.findByRole("table");
    const updatedRow = within(refreshed).getByText("Priya Raman").closest("tr")!;
    await waitFor(() =>
      expect(within(updatedRow).getByText("Marcus Whitfield")).toBeInTheDocument(),
    );
  });
});
