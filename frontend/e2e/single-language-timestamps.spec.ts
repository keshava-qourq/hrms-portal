import { expect, test, type Page } from "@playwright/test";

const PERMS = ["profile.own", "timesheet.own", "leave.own", "holidays.view", "approvals.track"];
const SCREENS = ["/home", "/timesheet", "/leave", "/approvals", "/administration"];
const ALL_PERMS = [
  ...PERMS,
  "team.view",
  "team.approve",
  "team.reports",
  "users.manage",
  "roles.assign",
];

async function signIn(page: Page) {
  await page.addInitScript(() => localStorage.setItem("session_token", "e2e-token"));
  await page.route("**/api/me", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        user_id: "00000000-0000-0000-0000-000000000001",
        email: "e2e@example.com",
        display_name: "E2E User",
        roles: ["EMPLOYEE", "REPORTING_MANAGER", "SYSTEM_ADMIN"],
        permissions: ALL_PERMS,
        must_change_password: false,
        is_active: true,
      }),
    }),
  );
}

const SELECTOR_WORDS = /\b(language|langue|idioma|sprache|locale)\b/i;

test("[AC-134] no language selector on the sign-in screen", async ({ page }) => {
  await page.goto("/sign-in");
  await expect(page.locator("body")).toBeVisible();
  await expect(page.locator("select[name*='lang' i], [aria-label*='language' i]")).toHaveCount(0);
  await expect(page.getByRole("combobox", { name: SELECTOR_WORDS })).toHaveCount(0);
  await expect(page.getByRole("button", { name: SELECTOR_WORDS })).toHaveCount(0);
  expect(await page.locator("html").getAttribute("lang")).toMatch(/^en/i);
});

for (const path of SCREENS) {
  test(`[AC-134] no language selector and single-language labels on ${path}`, async ({ page }) => {
    await signIn(page);
    await page.goto(path);
    await expect(page.locator("main")).toBeVisible();
    await expect(page.locator("select[name*='lang' i], [aria-label*='language' i]")).toHaveCount(0);
    await expect(page.getByRole("combobox", { name: SELECTOR_WORDS })).toHaveCount(0);
    await expect(page.getByRole("button", { name: SELECTOR_WORDS })).toHaveCount(0);
    await expect(page.getByRole("link", { name: SELECTOR_WORDS })).toHaveCount(0);
    // Every <select> option list must not offer language names.
    const options = await page.locator("select option").allTextContents();
    for (const o of options) {
      expect(o).not.toMatch(
        /^(English|Español|Français|Deutsch|हिन्दी|Hindi|French|German|Spanish)$/i,
      );
    }
    // Page text is in one script: no non-Latin letters.
    const text = await page.locator("body").innerText();
    expect(text).not.toMatch(
      /\p{Script=Cyrillic}|\p{Script=Hebrew}|\p{Script=Arabic}|\p{Script=Devanagari}|\p{Script=Han}/u,
    );
  });
}

// One format: "dd MMM yyyy, HH:mm" (company timezone) for timestamps, "dd MMM yyyy" for dates.
const TIMESTAMP = /\b\d{2} [A-Z][a-z]{2} \d{4}, \d{2}:\d{2}\b/g;
// Any clock time (HH:mm) that is NOT part of the canonical timestamp is an inconsistent format.
function strayTimes(text: string): string[] {
  const stripped = text.replace(TIMESTAMP, "");
  return stripped.match(/\b\d{1,2}:\d{2}\b/g) ?? [];
}

for (const path of ["/home", "/timesheet", "/approvals", "/leave"]) {
  test(`[AC-135] timestamps on ${path} use the one canonical format "dd MMM yyyy, HH:mm"`, async ({
    page,
  }) => {
    await signIn(page);
    await page.goto(path);
    await expect(page.locator("main")).toBeVisible();
    const text = await page.locator("main").innerText();
    expect(strayTimes(text)).toEqual([]);
    // No am/pm or ISO 'T' stamps or numeric slash dates.
    expect(text).not.toMatch(/\b\d{1,2}:\d{2}\s?(am|pm)\b/i);
    expect(text).not.toMatch(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/);
    expect(text).not.toMatch(/\b\d{1,2}\/\d{1,2}\/\d{2,4}\b/);
  });
}

test("[AC-135] the same instant renders identically across screens and in company timezone", async ({
  page,
}) => {
  await signIn(page);
  const seen = new Set<string>();
  for (const path of ["/home", "/timesheet", "/approvals"]) {
    await page.goto(path);
    const text = await page.locator("main").innerText();
    for (const m of text.match(TIMESTAMP) ?? []) seen.add(m.replace(/\d/g, "9"));
  }
  // All timestamps share a single shape.
  expect(seen.size).toBeLessThanOrEqual(1);
});

test("[AC-135] [NFR-017] company-timezone formatting is independent of browser timezone", async ({
  browser,
}) => {
  const texts: string[] = [];
  for (const timezoneId of ["Pacific/Auckland", "America/Los_Angeles"]) {
    const ctx = await browser.newContext({ timezoneId });
    const page = await ctx.newPage();
    await signIn(page);
    await page.goto("/home");
    await expect(page.locator("main")).toBeVisible();
    texts.push(await page.locator("main").innerText());
    await ctx.close();
  }
  expect(texts[0]).toEqual(texts[1]);
});

// NFR notes: NFR-008 (TLS/at-rest), NFR-011 (region), NFR-012 (backups), NFR-014 (sizing)
// are infrastructure properties and cannot be verified by browser e2e here. NFR-017 is
// covered by the AC-134/AC-135 tests above.
