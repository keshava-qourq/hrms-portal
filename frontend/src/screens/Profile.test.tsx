import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import Profile from "@/screens/Profile";
import { clearSessionToken, setSessionToken } from "@/lib/api";

const EMP = {
  id: "emp-2",
  employee_number: "E-1001",
  full_name: "Priya Raman",
  work_email: "priya@ashgrove.co",
  mobile_number: "0700",
  personal_contact: "home",
  department_id: "d1",
  reporting_manager_id: "emp-1",
};

function stub(patch: [number, unknown] = [200, EMP]) {
  const fn = vi.fn((url: string, init?: RequestInit) => {
    const method = init?.method ?? "GET";
    let r: [number, unknown] = [200, {}];
    if (url.endsWith("/api/me")) r = [200, { employee_id: "emp-2" }];
    else if (url.endsWith("/api/departments")) r = [200, { items: [{ id: "d1", name: "Engineering" }] }];
    else if (url.endsWith("/api/employees/emp-1")) r = [200, { ...EMP, id: "emp-1", full_name: "Helena Brandt" }];
    else if (url.endsWith("/api/employees/emp-2")) r = method === "PATCH" ? patch : [200, EMP];
    return Promise.resolve({ ok: r[0] < 400, status: r[0], json: async () => r[1] });
  });
  vi.stubGlobal("fetch", fn);
  return fn;
}

function renderIt() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

beforeEach(() => setSessionToken("t"));
afterEach(() => {
  vi.unstubAllGlobals();
  clearSessionToken();
});

describe("My Profile", () => {
  it("[AC-029] shows my details", async () => {
    stub();
    renderIt();
    expect(await screen.findByDisplayValue("Priya Raman")).toBeInTheDocument();
    expect(screen.getByDisplayValue("E-1001")).toBeInTheDocument();
    expect(await screen.findByDisplayValue("Engineering")).toBeInTheDocument();
    expect(await screen.findByDisplayValue("Helena Brandt")).toBeInTheDocument();
    expect(screen.getByDisplayValue("priya@ashgrove.co")).toBeInTheDocument();
    expect(screen.getByDisplayValue("0700")).toBeInTheDocument();
  });

  it("[AC-031] identity fields are read-only", async () => {
    stub();
    renderIt();
    for (const l of ["Name", "Employee ID", "Department", "Reporting manager", "Work email"]) {
      expect(await screen.findByLabelText(l)).toHaveAttribute("readonly");
    }
  });

  it("[AC-030] saves only the two editable fields and confirms", async () => {
    const fn = stub();
    renderIt();
    const mobile = await screen.findByLabelText("Mobile number");
    await screen.findByDisplayValue("0700");
    await userEvent.clear(mobile);
    await userEvent.type(mobile, "0711");
    await userEvent.click(screen.getByRole("button", { name: "Save changes" }));
    expect(await screen.findByText("Your contact details were saved.")).toBeInTheDocument();
    const call = fn.mock.calls.find(([, i]) => i?.method === "PATCH")!;
    expect(JSON.parse(call[1]!.body as string)).toEqual({
      mobile_number: "0711",
      personal_contact: "home",
    });
  });

  it("[AC-030] shows the API error on failure", async () => {
    stub([422, { detail: "Mobile number too long" }]);
    renderIt();
    await screen.findByDisplayValue("0700");
    await userEvent.click(screen.getByRole("button", { name: "Save changes" }));
    await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent("Mobile number too long"));
  });
});
