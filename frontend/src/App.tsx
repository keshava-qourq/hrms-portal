import { NavLink, Navigate, Outlet, Route, Routes } from "react-router-dom";

import { Icons } from "@/lib/icons";
import { getSessionToken } from "@/lib/api";
import SignIn from "@/screens/SignIn";
import Home from "@/screens/Home";
import Timesheet from "@/screens/Timesheet";
import Leave from "@/screens/Leave";
import Approvals from "@/screens/Approvals";
import Administration from "@/screens/Administration";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  [
    "flex items-center gap-2 rounded-[var(--brand-radius)] px-3 py-2 text-sm font-medium transition-colors",
    isActive ? "bg-[var(--brand-hover)] text-[var(--brand-fg)]" : "text-[var(--brand-fg-muted)]",
  ].join(" ");

// The app's menu, drawn around every screen except the ones routed outside it below.
function AppShellLayout() {
  // No session token means no signed-in user: every app screen sends you back to sign-in.
  if (!getSessionToken()) {
    return <Navigate to="/sign-in" replace />;
  }
  return (
    <div className="flex min-h-screen">
      <aside
        className="w-56 shrink-0 border-r p-4"
        style={{
          backgroundColor: "var(--brand-surface)",
          borderColor: "var(--brand-border)",
        }}
      >
        <p
          className="mb-4 px-3 text-sm font-semibold"
          style={{ fontFamily: "var(--brand-font-heading)" }}
        >
          {"HRMS Portal"}
        </p>
        <nav aria-label="App menu" className="flex flex-col gap-1">
          <NavLink to="/home" className={navLinkClass}>
            <Icons.Home size={16} />
            {"Home"}
          </NavLink>
          <NavLink to="/timesheet" className={navLinkClass}>
            <Icons.Check size={16} />
            {"My Timesheet"}
          </NavLink>
          <NavLink to="/leave" className={navLinkClass}>
            {"Leave"}
          </NavLink>
          <NavLink to="/approvals" className={navLinkClass}>
            <Icons.User size={16} />
            {"Team & Approvals"}
          </NavLink>
          <NavLink to="/administration" className={navLinkClass}>
            <Icons.Settings size={16} />
            {"Administration"}
          </NavLink>
        </nav>
      </aside>
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<AppShellLayout />}>
        <Route path="/home" element={<Home />} />
        <Route path="/timesheet" element={<Timesheet />} />
        <Route path="/leave" element={<Leave />} />
        <Route path="/approvals" element={<Approvals />} />
        <Route path="/administration" element={<Administration />} />
      </Route>
      <Route path="/sign-in" element={<SignIn />} />
      <Route path="*" element={<Navigate to="/sign-in" replace />} />
    </Routes>
  );
}
