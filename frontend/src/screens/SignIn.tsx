// @ts-nocheck -- generated from the approved design under its JS runtime contract; not hand-written TypeScript.
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";

import { brand } from "@/lib/brand";
import { useNavigate } from "@/lib/navigate";

const PRODUCT = "HRMS portal";
const SCREEN = "Sign In";
const HAIRLINE = "1px solid rgba(255,255,255,0.10)";

export default function Screen() {
  const navigate = useNavigate();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [otp, setOtp] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const field = { border: HAIRLINE, borderRadius: brand.radius, height: 46, backgroundColor: "rgba(0,0,0,0.25)", color: brand.primaryColor, outlineColor: brand.accentColor };
  const label = { color: brand.neutralColor, letterSpacing: "0.18em" };
  const focusRing = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";

  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-10" style={{ color: brand.primaryColor, fontFamily: brand.fontBody }}>
      <main className="w-full max-w-4xl p-6 sm:p-10" style={{ backgroundColor: "rgba(255,255,255,0.04)", border: HAIRLINE, borderRadius: brand.radius }}>
        <h1 className="text-3xl" style={{ fontFamily: brand.fontHeading }}>{PRODUCT}</h1>
        <div aria-hidden className="mt-3 h-px w-12" style={{ backgroundColor: brand.accentColor }} />
        <p className="mt-3 text-xs uppercase" style={label}>{SCREEN}</p>

        <div className="mt-8 grid grid-cols-1 gap-x-12 gap-y-6 md:grid-cols-2">
          <form
            data-wf="b-1-0"
            id="vl-signin-form"
            aria-labelledby="vl-signin-title"
            className="order-1 space-y-5 md:order-none"
            onSubmit={(e) => e.preventDefault()}
          >
            <h2 id="vl-signin-title" className="text-xl" style={{ fontFamily: brand.fontHeading }}>Sign in with your work email</h2>
            <div className="space-y-2">
              <label htmlFor="vl-email" className="block text-xs uppercase" style={label}>Work email</label>
              <input data-wf="i-1-0-0" id="vl-email" type="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} className={"w-full px-3 text-sm " + focusRing} style={field} />
            </div>
            <div className="space-y-2">
              <label htmlFor="vl-password" className="block text-xs uppercase" style={label}>Password</label>
              <input data-wf="i-1-0-1" id="vl-password" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} className={"w-full px-3 text-sm " + focusRing} style={field} />
            </div>
          </form>

          <div className="order-2 md:order-none md:row-start-2 md:col-start-1">
            <button
              data-wf="b-2-0"
              type="submit"
              form="vl-signin-form"
              onClick={() => navigate('home')}
              className={"h-12 w-full text-xs font-bold uppercase tracking-[0.25em] transition-opacity hover:opacity-90 " + focusRing}
              style={{ backgroundColor: brand.accentColor, color: brand.backgroundColor, borderRadius: brand.radius, outlineColor: brand.primaryColor }}
            >
              Sign in
            </button>
          </div>

          <form
            data-wf="b-1-1"
            id="vl-reset-form"
            aria-labelledby="vl-reset-title"
            className="order-3 space-y-5 md:order-none md:row-start-1 md:col-start-2"
            onSubmit={(e) => e.preventDefault()}
          >
            <h2 id="vl-reset-title" className="text-xl" style={{ fontFamily: brand.fontHeading }}>Set a new password (required after an administrator reset)</h2>
            <div className="space-y-2">
              <label htmlFor="vl-otp" className="block text-xs uppercase" style={label}>One-time password</label>
              <input data-wf="i-1-1-0" id="vl-otp" type="password" autoComplete="one-time-code" required value={otp} onChange={(e) => setOtp(e.target.value)} className={"w-full px-3 text-sm " + focusRing} style={field} />
            </div>
            <div className="space-y-2">
              <label htmlFor="vl-new-password" className="block text-xs uppercase" style={label}>New password</label>
              <input data-wf="i-1-1-1" id="vl-new-password" type="password" autoComplete="new-password" required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className={"w-full px-3 text-sm " + focusRing} style={field} />
            </div>
            <div className="space-y-2">
              <label htmlFor="vl-confirm-password" className="block text-xs uppercase" style={label}>Confirm new password</label>
              <input data-wf="i-1-1-2" id="vl-confirm-password" type="password" autoComplete="new-password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={"w-full px-3 text-sm " + focusRing} style={field} />
            </div>
          </form>

          <div className="order-4 md:order-none md:row-start-2 md:col-start-2">
            <button
              data-wf="b-2-1"
              type="submit"
              form="vl-reset-form"
              onClick={() => navigate('home')}
              className={"h-12 w-full text-xs font-bold uppercase tracking-[0.25em] transition-opacity hover:opacity-90 " + focusRing}
              style={{ backgroundColor: "transparent", color: brand.accentColor, border: "1px solid " + brand.accentColor, borderRadius: brand.radius, outlineColor: brand.primaryColor }}
            >
              Set new password and continue
            </button>
          </div>
        </div>

        <p className="mt-8 text-xs uppercase" style={label}>
          No account? <button type="button" className={"underline underline-offset-4 " + focusRing} style={{ color: brand.accentColor, outlineColor: brand.accentColor }}>Request an invitation</button>
        </p>
      </main>
    </div>
  );
}
