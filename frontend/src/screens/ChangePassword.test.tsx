import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";

import App from "@/App";
import { clearSessionToken, getSessionToken, setSessionToken } from "@/lib/api";
import { getMustChange, setMustChange } from "@/lib/mustChange";

afterEach(() => {
  vi.unstubAllGlobals();
  clearSessionToken();
  setMustChange(false);
});

describe("forced password change", () => {
  it("[AC-021] sign-in tells users to contact an administrator, with no reset link", () => {
    render(
      <MemoryRouter initialEntries={["/sign-in"]}>
        <App />
      </MemoryRouter>,
    );
    expect(screen.getByText(/contact an administrator/i)).toBeInTheDocument();
    expect(screen.queryByText(/forgot/i)).not.toBeInTheDocument();
  });

  it("[AC-023] must_change_password login stores the token and routes to change-password", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ token: "tok", must_change_password: true }),
      }),
    );
    render(
      <MemoryRouter initialEntries={["/sign-in"]}>
        <App />
      </MemoryRouter>,
    );
    await userEvent.type(screen.getByLabelText("Work email"), "a@b.co");
    await userEvent.type(screen.getByLabelText("Password"), "pw");
    await userEvent.click(screen.getByRole("button", { name: "Sign in" }));
    expect(await screen.findByLabelText("Confirm new password")).toBeInTheDocument();
    expect(getSessionToken()).toBe("tok");
  });

  it("[AC-023] other routes redirect to change-password while the flag is set", async () => {
    setSessionToken("t");
    setMustChange(true);
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: true, status: 200, json: async () => ({}) }),
    );
    render(
      <MemoryRouter initialEntries={["/leave"]}>
        <App />
      </MemoryRouter>,
    );
    expect(await screen.findByLabelText("Current password")).toBeInTheDocument();
  });

  it("[AC-023] changing the password calls the API and goes home", async () => {
    setSessionToken("t");
    setMustChange(true);
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 200, json: async () => ({}) });
    vi.stubGlobal("fetch", fetchMock);
    render(
      <MemoryRouter initialEntries={["/change-password"]}>
        <App />
      </MemoryRouter>,
    );
    await userEvent.type(await screen.findByLabelText("Current password"), "old");
    await userEvent.type(screen.getByLabelText("New password"), "newpass1");
    await userEvent.type(screen.getByLabelText("Confirm new password"), "newpass1");
    await userEvent.click(screen.getByRole("button", { name: "Change password" }));
    await waitFor(() => expect(getMustChange()).toBe(false));
    expect(
      fetchMock.mock.calls.some(([u]) => String(u).endsWith("/api/auth/change-password")),
    ).toBe(true);
    expect((await screen.findAllByText("Home")).length).toBeGreaterThan(0);
  });

  it("[AC-023] mismatched confirmation blocks submit", async () => {
    setSessionToken("t");
    setMustChange(true);
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 200, json: async () => ({}) });
    vi.stubGlobal("fetch", fetchMock);
    render(
      <MemoryRouter initialEntries={["/change-password"]}>
        <App />
      </MemoryRouter>,
    );
    await userEvent.type(await screen.findByLabelText("Current password"), "old");
    await userEvent.type(screen.getByLabelText("New password"), "a");
    await userEvent.type(screen.getByLabelText("Confirm new password"), "b");
    await userEvent.click(screen.getByRole("button", { name: "Change password" }));
    expect(await screen.findByText("Passwords do not match.")).toBeInTheDocument();
    expect(fetchMock.mock.calls.some(([u]) => String(u).includes("change-password"))).toBe(false);
  });
});
