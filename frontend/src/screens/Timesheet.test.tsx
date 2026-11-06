import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { addDays, addWeeks, format, parseISO, startOfWeek } from "date-fns";
import { beforeEach, describe, expect, it, vi } from "vitest";

import Timesheet from "@/screens/Timesheet";
import { apiFetch } from "@/lib/api";

vi.mock("@/lib/api", () => ({ apiFetch: vi.fn() }));
const mockFetch = vi.mocked(apiFetch);

const ISO = "yyyy-MM-dd";
const MON = format(startOfWeek(new Date(), { weekStartsOn: 1 }), ISO);
const TODAY = format(new Date(), ISO);
const col = (d: string) => format(parseISO(d), "EEE d MMM");

const PA = { id: "pa", code: "PA", name: "Project A", status: "active", pickable: true };
const PC = { id: "pc", code: "PC", name: "Closed", status: "closed", pickable: false };

function week(over: Record<string, unknown> = {}) {
  const ws = (over.week_start as string) ?? MON;
  return {
    week_start: ws,
    week_end: format(addDays(parseISO(ws), 6), ISO),
    status: "draft",
    editable: true,
    timesheet_id: null,
    projects: [PA, PC],
    entries: [{ project_id: "pc", work_date: ws, hours: 2 }],
    totals: { by_project: {}, by_day: {}, week: 2 },
    ...over,
  };
}

function renderIt() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={client}>
      <Timesheet />
    </QueryClientProvider>,
  );
}

beforeEach(() => mockFetch.mockReset());

describe("Timesheet grid", () => {
  it("[AC-056] loads the current week and shows row, day and week totals", async () => {
    mockFetch.mockResolvedValue(
      week({
        entries: [
          { project_id: "pa", work_date: MON, hours: 3 },
          { project_id: "pc", work_date: MON, hours: 2 },
        ],
      }),
    );
    renderIt();
    expect(await screen.findByText("Project A")).toBeInTheDocument();
    expect(mockFetch).toHaveBeenCalledWith(`/api/timesheets/week/${MON}`);
    expect(screen.getByTestId("row-total-pa")).toHaveTextContent("3");
    expect(screen.getByTestId("day-total-" + MON)).toHaveTextContent("5");
    expect(screen.getByTestId("week-total")).toHaveTextContent("5");
  });

  it("[AC-053] only pickable projects are editable; closed ones are read-only", async () => {
    mockFetch.mockResolvedValue(week());
    renderIt();
    await screen.findByText("Project A");
    expect(screen.getByLabelText(`PA ${col(MON)}`)).not.toHaveAttribute("readonly");
    expect(screen.getByLabelText(`PC ${col(MON)}`)).toHaveAttribute("readonly");
  });

  it("[AC-053] shows the empty state when there are no projects", async () => {
    mockFetch.mockResolvedValue(week({ projects: [], entries: [] }));
    renderIt();
    expect(await screen.findByText("No projects yet")).toBeInTheDocument();
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
  });

  it("[AC-052] saves 7.5 via PUT, keeps it under today and shows Draft", async () => {
    mockFetch.mockResolvedValueOnce(week());
    renderIt();
    const input = await screen.findByLabelText(`PA ${col(TODAY)}`);
    mockFetch.mockResolvedValueOnce(
      week({
        entries: [{ project_id: "pa", work_date: TODAY, hours: 7.5 }],
        totals: { by_project: {}, by_day: {}, week: 7.5 },
      }),
    );
    await userEvent.type(input, "7.5");
    await userEvent.click(screen.getByRole("button", { name: "Save draft" }));
    await waitFor(() =>
      expect(mockFetch).toHaveBeenCalledWith(`/api/timesheets/week/${MON}/entries`, {
        method: "PUT",
        body: JSON.stringify({
          entries: [{ project_id: "pa", work_date: TODAY, hours: 7.5 }],
        }),
      }),
    );
    await waitFor(() => expect(screen.getByLabelText(`PA ${col(TODAY)}`)).toHaveValue("7.5"));
    expect(screen.getByText("Draft")).toBeInTheDocument();
    expect(screen.getByTestId("week-total")).toHaveTextContent("7.5");
  });

  it("[AC-058] next week loads that week; locked weeks are read-only", async () => {
    const next = format(addWeeks(parseISO(MON), 1), ISO);
    mockFetch.mockImplementation(async (path?: string) =>
      String(path).endsWith(next)
        ? week({ week_start: next, status: "approved", editable: false })
        : week(),
    );
    renderIt();
    await screen.findByText("Project A");
    await userEvent.click(screen.getByRole("button", { name: /Next week/ }));
    await waitFor(() => expect(mockFetch).toHaveBeenCalledWith(`/api/timesheets/week/${next}`));
    expect(await screen.findByText("Approved")).toBeInTheDocument();
    expect(screen.getByLabelText(`PA ${col(next)}`)).toHaveAttribute("readonly");
    expect(screen.getByRole("button", { name: "Save draft" })).toBeDisabled();
  });

  it("[AC-054] a 422 daily maximum shows the server message, flags the day, keeps values", async () => {
    mockFetch.mockResolvedValueOnce(week());
    renderIt();
    const input = await screen.findByLabelText(`PA ${col(TODAY)}`);
    mockFetch.mockRejectedValueOnce(
      Object.assign(new Error("x"), {
        status: 422,
        detail: [{ loc: ["body", "entries", 0, "hours"], msg: "Daily maximum is 24 hours" }],
      }),
    );
    await userEvent.type(input, "20");
    await userEvent.click(screen.getByRole("button", { name: "Save draft" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Daily maximum is 24 hours");
    expect(screen.getByLabelText(`PA ${col(TODAY)}`)).toHaveValue("20");
    expect(screen.getByLabelText(`PA ${col(TODAY)}`)).toHaveAttribute("aria-invalid", "true");
  });

  it("[AC-055] a negative value is flagged client-side and nothing is sent", async () => {
    mockFetch.mockResolvedValueOnce(week());
    renderIt();
    const input = await screen.findByLabelText(`PA ${col(TODAY)}`);
    await userEvent.type(input, "-3");
    await userEvent.click(screen.getByRole("button", { name: "Save draft" }));
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByText(/Enter hours as a number/)).toBeInTheDocument();
    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(within(screen.getByRole("table")).getByLabelText(`PA ${col(TODAY)}`)).toBe(input);
  });
});
