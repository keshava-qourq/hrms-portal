// @ts-nocheck -- generated from the approved design under its JS runtime contract; not hand-written TypeScript.

import React from "react";

import { brand } from "@/lib/brand";
import { useNavigate } from "@/lib/navigate";
import { apiFetch, setSessionToken } from "@/lib/api";

// POST /api/auth/login returns the session token in its body: the API and this app
// are on different origins once deployed, so a cookie would be dropped.
type LoginResponse = {
  session_token?: string;
  token?: string;
  access_token?: string;
};

const PRODUCT = "HRMS portal";
const SCREEN = "Sign In";
const HAIRLINE = "1px solid rgba(255,255,255,0.10)";

export default function Screen() {
  const navigate = useNavigate();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [signInError, setSignInError] = React.useState("");
  const [busy, setBusy] = React.useState(false);

  async function onSignIn(e) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setSignInError("");
    try {
      const data = await apiFetch<LoginResponse>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      const token = data.session_token || data.token || data.access_token || "";
      if (token) setSessionToken(token);
      navigate("home");
    } catch (err) {
      // Shown verbatim: the API writes the generic failure and the deactivated-account
      // message, and the screen must never say which of the two applies to an email.
      setSignInError(err instanceof Error ? err.message : "Sign in failed. Try again.");
    } finally {
      setBusy(false);
    }
  }

  const field = {
    border: HAIRLINE,
    borderRadius: brand.radius,
    height: 46,
    backgroundColor: "rgba(0,0,0,0.25)",
    color: brand.primaryColor,
    outlineColor: brand.accentColor,
  };
  const label = { color: brand.neutralColor, letterSpacing: "0.18em" };
  const focusRing = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";

  return (
    <div
      className="flex min-h-screen items-center justify-center px-6 py-10"
      style={{ color: brand.primaryColor, fontFamily: brand.fontBody }}
    >
      <main
        className="w-full max-w-md p-6 sm:p-10"
        style={{
          backgroundColor: "rgba(255,255,255,0.04)",
          border: HAIRLINE,
          borderRadius: brand.radius,
        }}
      >
        <h1 className="text-3xl" style={{ fontFamily: brand.fontHeading }}>
          {PRODUCT}
        </h1>
        <div
          aria-hidden
          className="mt-3 h-px w-12"
          style={{ backgroundColor: brand.accentColor }}
        />
        <p className="mt-3 text-xs uppercase" style={label}>
          {SCREEN}
        </p>

        <form
          data-wf="b-1-0"
          id="vl-signin-form"
          aria-labelledby="vl-signin-title"
          className="mt-8 space-y-5"
          onSubmit={onSignIn}
        >
          <h2 id="vl-signin-title" className="text-xl" style={{ fontFamily: brand.fontHeading }}>
            Sign in with your work email
          </h2>
          <div className="space-y-2">
            <label htmlFor="vl-email" className="block text-xs uppercase" style={label}>
              Work email
            </label>
            <input
              data-wf="i-1-0-0"
              id="vl-email"
              type="email"
              autoComplete="username"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={"w-full px-3 text-sm " + focusRing}
              style={field}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="vl-password" className="block text-xs uppercase" style={label}>
              Password
            </label>
            <input
              data-wf="i-1-0-1"
              id="vl-password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={"w-full px-3 text-sm " + focusRing}
              style={field}
            />
          </div>
          {signInError ? (
            <p role="alert" className="text-sm" style={{ color: "hsl(6 78% 76%)" }}>
              {signInError}
            </p>
          ) : null}
          <button
            data-wf="b-2-0"
            type="submit"
            disabled={busy}
            aria-busy={busy}
            className={
              "h-12 w-full text-xs font-bold uppercase tracking-[0.25em] transition-opacity hover:opacity-90 " +
              focusRing
            }
            style={{
              backgroundColor: brand.accentColor,
              color: brand.backgroundColor,
              borderRadius: brand.radius,
              outlineColor: brand.primaryColor,
            }}
          >
            Sign in
          </button>
        </form>
      </main>
    </div>
  );
}
