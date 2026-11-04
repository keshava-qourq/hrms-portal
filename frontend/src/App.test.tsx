import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import App from "./App";
import { apiFetch, clearSessionToken, getSessionToken, setSessionToken } from "@/lib/api";

afterEach(() => clearSessionToken());

describe("App", () => {
  it("renders a screen inside the app shell and shows its menu", () => {
    setSessionToken("t");
    render(
      <MemoryRouter initialEntries={["/home"]}>
        <App />
      </MemoryRouter>,
    );
    // getAllByText, not getByText: the page may repeat its menu item's text.
    expect(screen.getAllByText("Home").length).toBeGreaterThan(0);
  });

  it("[AC-020] sign out calls logout, clears the token and returns to sign-in", async () => {
    setSessionToken("t");
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 204, json: async () => ({}) });
    vi.stubGlobal("fetch", fetchMock);
    render(
      <MemoryRouter initialEntries={["/home"]}>
        <App />
      </MemoryRouter>,
    );
    await userEvent.click(screen.getByRole("button", { name: "Sign out" }));
    expect(await screen.findByLabelText("Work email")).toBeInTheDocument();
    expect(getSessionToken()).toBeNull();
    expect(
      fetchMock.mock.calls.some(
        ([u, i]) => String(u).endsWith("/api/auth/logout") && i?.method === "POST",
      ),
    ).toBe(true);
    vi.unstubAllGlobals();
  });

  it("[AC-017] a 401 on any call ends the session and returns to sign-in", async () => {
    setSessionToken("t");
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: false, status: 401, json: async () => ({ detail: "x" }) }),
    );
    render(
      <MemoryRouter initialEntries={["/home"]}>
        <App />
      </MemoryRouter>,
    );
    await screen.findAllByText("Home");
    await expect(apiFetch("/api/me")).rejects.toThrow();
    expect(await screen.findByLabelText("Work email")).toBeInTheDocument();
    expect(getSessionToken()).toBeNull();
    vi.unstubAllGlobals();
  });

  it("[AC-004] redirects unauthenticated access to the sign-in screen", () => {
    render(
      <MemoryRouter initialEntries={["/home"]}>
        <App />
      </MemoryRouter>,
    );
    expect(screen.getByLabelText("Work email")).toBeInTheDocument();
    expect(screen.queryByText("My Timesheet")).not.toBeInTheDocument();
  });
});
