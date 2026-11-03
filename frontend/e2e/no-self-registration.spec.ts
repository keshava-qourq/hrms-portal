import { expect, test } from "@playwright/test";

// US-002 AC-006: accounts are created by a System Admin only. No self-service
// registration exists. Any path a visitor might guess for signing up or creating
// an account, when reached unauthenticated, must land on sign-in and expose no
// form that lets a visitor register or create an account.

const REGISTRATION_WORDS =
  /\b(register|registration|sign\s?up|create account|create an account|new account|get started)\b/i;

const GUESSED_PATHS = [
  "/register",
  "/registration",
  "/signup",
  "/sign-up",
  "/create-account",
  "/account/new",
  "/admin/users/new",
  "/administration/users/new",
  "/users/new",
];

for (const path of GUESSED_PATHS) {
  test(`[AC-006] visiting ${path} unauthenticated redirects to sign-in with no registration form`, async ({
    page,
  }) => {
    await page.goto(path);
    // Unauthenticated: must end up on the sign-in screen, never on a sign-up page.
    await expect(page).toHaveURL(/\/sign-in$/);

    // The sign-in screen must offer no way to self-register.
    await expect(page.getByRole("link", { name: REGISTRATION_WORDS })).toHaveCount(0);
    await expect(page.getByRole("button", { name: REGISTRATION_WORDS })).toHaveCount(0);
    await expect(page.getByRole("heading", { name: REGISTRATION_WORDS })).toHaveCount(0);

    // No confirm-password / repeat-password field, the hallmark of a registration form.
    await expect(
      page.locator(
        "input[name*='confirm' i], input[name*='repeat' i], input[placeholder*='confirm password' i]",
      ),
    ).toHaveCount(0);
  });
}

test("[AC-006] the sign-in screen itself exposes no self-registration affordance", async ({
  page,
}) => {
  await page.goto("/sign-in");
  await expect(page.locator("body")).toBeVisible();
  const body = (await page.locator("body").innerText()).toLowerCase();
  expect(body).not.toMatch(REGISTRATION_WORDS);
  // Exactly one password field (sign-in), not the two a registration form carries.
  await expect(page.locator("input[type='password']")).toHaveCount(1);
});
