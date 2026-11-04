import { useEffect } from "react";
import { NavLink, Navigate, Outlet, Route, Routes, useNavigate } from "react-router-dom";
import { QueryClient, QueryClientProvider, useQuery, useQueryClient } from "@tanstack/react-query";
import { getMustChange, isPasswordChangeRequired, setMustChange } from "@/lib/mustChange";
import ChangePassword from "@/screens/ChangePassword";

import { Icons } from "@/lib/icons";
import { apiFetch, clearSessionToken, getSessionToken, setSessionExpiredHandler } from "@/lib/api";
import SignIn from "@/screens/SignIn";
import Home from "@/screens/Home";
import Timesheet from "@/screens/Timesheet";
import Leave from "@/screens/Leave";
import Approvals from "@/screens/Approvals";
import MyTeam from "@/screens/MyTeam";
import Administration from "@/screens/Administration";
import Profile from "@/screens/Profile";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  [
    "flex items-center gap-2 rounded-[var(--brand-radius)] px-3 py-2 text-sm font-medium transition-colors",
    isActive ? "bg-[var(--brand-hover)] text-[var(--brand-fg)]" : "text-[var(--brand-fg-muted)]",
  ].join(" ");

// The app's menu, drawn around every screen except the ones routed outside it below.
function AppShellLayout() {
  const navigate = useNavigate();
  const client = useQueryClient();
  const hasToken = !!getSessionToken();

  // The flag comes from login, from GET /api/me, or from a 403 "Password change required".
  const { data: me } = useQuery({
    queryKey: ["me"],
    queryFn: async () =>
      (await apiFetch<{ must_change_password?: boolean; permissions?: string[] } | undefined>(
        "/api/me",
      )) ?? null,
    enabled: hasToken,
  });
  if (me && me.must_change_password) setMustChange(true);
  useEffect(() => {
    return client.getQueryCache().subscribe((event) => {
      if (event.type === "updated" && event.action.type === "error") {
        if (isPasswordChangeRequired(event.action.error)) {
          setMustChange(true);
          navigate("/change-password", { replace: true });
        }
      }
    });
  }, [client, navigate]);

  // Back/forward and bfcache restores can show a stale protected page: re-check the token.
  useEffect(() => {
    const recheck = () => {
      if (!getSessionToken()) {
        client.clear();
        navigate("/sign-in", { replace: true });
      }
    };
    window.addEventListener("popstate", recheck);
    window.addEventListener("pageshow", recheck);
    return () => {
      window.removeEventListener("popstate", recheck);
      window.removeEventListener("pageshow", recheck);
    };
  }, [client, navigate]);

  const signOut = async () => {
    try {
      await apiFetch("/api/auth/logout", { method: "POST" });
    } catch {
      // The session is ended locally either way.
    }
    clearSessionToken();
    setMustChange(false);
    client.clear();
    navigate("/sign-in", { replace: true });
  };

  // No session token means no signed-in user: every app screen sends you back to sign-in.
  if (!hasToken) {
    return <Navigate to="/sign-in" replace />;
  }
  if (getMustChange()) {
    return <Navigate to="/change-password" replace />;
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
          <NavLink to="/profile" className={navLinkClass}>
            {"My Profile"}
          </NavLink>
          {me?.permissions?.includes("team.view") ? (
            <NavLink to="/my-team" className={navLinkClass}>
              {"My Team"}
            </NavLink>
          ) : null}
          <NavLink to="/approvals" className={navLinkClass}>
            <Icons.User size={16} />
            {"Team & Approvals"}
          </NavLink>
          <NavLink to="/administration" className={navLinkClass}>
            <Icons.Settings size={16} />
            {"Administration"}
          </NavLink>
        </nav>
        <button
          type="button"
          onClick={signOut}
          className="mt-4 w-full rounded-[var(--brand-radius)] px-3 py-2 text-left text-sm font-medium"
          style={{ color: "var(--brand-fg-muted)" }}
        >
          {"Sign out"}
        </button>
      </aside>
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppRoutes />
    </QueryClientProvider>
  );
}

function AppRoutes() {
  const navigate = useNavigate();
  const client = useQueryClient();
  useEffect(() => {
    setSessionExpiredHandler(() => {
      client.clear();
      navigate("/sign-in", { replace: true });
    });
    return () => setSessionExpiredHandler(null);
  }, [client, navigate]);
  return (
    <Routes>
      <Route element={<AppShellLayout />}>
        <Route path="/home" element={<Home />} />
        <Route path="/timesheet" element={<Timesheet />} />
        <Route path="/leave" element={<Leave />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/my-team" element={<MyTeam />} />
        <Route path="/approvals" element={<Approvals />} />
        <Route path="/administration" element={<Administration />} />
      </Route>
      <Route
        path="/change-password"
        element={getSessionToken() ? <ChangePassword /> : <Navigate to="/sign-in" replace />}
      />
      <Route path="/sign-in" element={<SignIn />} />
      <Route path="*" element={<Navigate to="/sign-in" replace />} />
    </Routes>
  );
}
