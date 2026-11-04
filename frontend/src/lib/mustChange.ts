import { ApiError } from "@/lib/api";

// Set when the API says this account must replace its one-time password first.
const KEY = "must_change_password";

export function getMustChange(): boolean {
  try {
    return localStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
}

export function setMustChange(value: boolean): void {
  try {
    if (value) localStorage.setItem(KEY, "1");
    else localStorage.removeItem(KEY);
  } catch {
    // Storage unavailable: the server still enforces the change.
  }
}

export function isPasswordChangeRequired(err: unknown): boolean {
  return (
    err instanceof ApiError && err.status === 403 && /password change required/i.test(err.message)
  );
}
