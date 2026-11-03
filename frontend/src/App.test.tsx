import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it } from "vitest";

import App from "./App";
import { clearSessionToken, setSessionToken } from "@/lib/api";

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
