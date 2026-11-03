import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";

import App from "@/App";
import { clearSessionToken, getSessionToken } from "@/lib/api";

function reply(status: number, body: unknown) {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({
      ok: status < 400,
      status,
      json: async () => body,
    }),
  );
}

async function submit() {
  render(
    <MemoryRouter initialEntries={["/sign-in"]}>
      <App />
    </MemoryRouter>,
  );
  await userEvent.type(screen.getByLabelText("Work email"), "a@b.co");
  await userEvent.type(screen.getByLabelText("Password"), "pw");
  await userEvent.click(screen.getByRole("button", { name: "Sign in" }));
}

afterEach(() => {
  vi.unstubAllGlobals();
  clearSessionToken();
});

describe("SignIn", () => {
  it("[AC-001] stores the token and navigates home on success", async () => {
    reply(200, {
      token: "tok-1",
      user_id: "u",
      display_name: "A",
      roles: [],
      must_change_password: false,
    });
    await submit();
    await waitFor(() => expect(getSessionToken()).toBe("tok-1"));
    const [url, init] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(url).toMatch(/[^/]\/api\/auth\/login$/);
    expect(init.method).toBe("POST");
    expect(await screen.findAllByText("Home")).not.toHaveLength(0);
  });

  it("[AC-002] shows the generic message from the API", async () => {
    reply(401, { detail: "Email or password is incorrect" });
    await submit();
    expect(await screen.findByRole("alert")).toHaveTextContent("Email or password is incorrect");
    expect(getSessionToken()).toBeNull();
  });

  it("[AC-003] shows the deactivated-account message from the API", async () => {
    reply(403, { detail: "Your account is deactivated. Contact an administrator." });
    await submit();
    expect(await screen.findByRole("alert")).toHaveTextContent("Contact an administrator");
  });
});
