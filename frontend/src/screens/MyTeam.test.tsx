import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import MyTeam from "@/screens/MyTeam";
import { clearSessionToken, setSessionToken } from "@/lib/api";

function stub(status: number, body: unknown) {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({ ok: status < 400, status, json: async () => body }),
  );
}

function renderIt() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={client}>
      <MyTeam />
    </QueryClientProvider>,
  );
}

beforeEach(() => setSessionToken("t"));
afterEach(() => {
  vi.unstubAllGlobals();
  clearSessionToken();
});

describe("My Team", () => {
  it("[AC-042] lists exactly the returned reports with department and statuses", async () => {
    stub(200, {
      items: ["A One", "B Two", "C Three"].map((n, i) => ({
        id: "e" + i,
        full_name: n,
        department_name: "Engineering",
        leave_status: "Approved",
        timesheet_status: "Submitted",
      })),
      total: 3,
    });
    renderIt();
    expect(await screen.findByText("A One")).toBeInTheDocument();
    expect(screen.getAllByRole("row")).toHaveLength(4);
    expect(screen.getAllByText("Engineering")).toHaveLength(3);
    expect(screen.getAllByText("Submitted")).toHaveLength(3);
  });

  it("[AC-043] renders no links, so no profile outside the list is reachable", async () => {
    stub(200, { items: [{ id: "e1", full_name: "A One", department_name: "Ops" }] });
    renderIt();
    await screen.findByText("A One");
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
    expect(screen.queryByText("Zed Outsider")).not.toBeInTheDocument();
  });

  it("[AC-042] shows the empty state", async () => {
    stub(200, { items: [], total: 0 });
    renderIt();
    expect(await screen.findByText("No one reports to you yet.")).toBeInTheDocument();
  });

  it("[AC-042] shows an error state", async () => {
    stub(500, { detail: "boom" });
    renderIt();
    expect(await screen.findByRole("alert")).toBeInTheDocument();
  });
});
