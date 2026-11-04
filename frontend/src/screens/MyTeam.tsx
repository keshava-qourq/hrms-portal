import { useQuery } from "@tanstack/react-query";

import { apiFetch } from "@/lib/api";
import { brand } from "@/lib/brand";

type Member = {
  id: string;
  full_name: string;
  department_name?: string | null;
  leave_status?: string | null;
  timesheet_status?: string | null;
};

const cell = { padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.1)" };

export default function Screen() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["my-team"],
    queryFn: async () => (await apiFetch<{ items: Member[] }>("/api/my/team")).items ?? [],
  });

  return (
    <div className="mx-auto max-w-5xl p-6" style={{ fontFamily: brand.fontBody }}>
      <h1 className="mb-6 text-3xl" style={{ fontFamily: brand.fontHeading }}>
        My Team
      </h1>
      {isLoading ? (
        <p>Loading your team…</p>
      ) : isError ? (
        <p role="alert">Your team could not be loaded. Try again later.</p>
      ) : !data || data.length === 0 ? (
        <p>No one reports to you yet.</p>
      ) : (
        <table className="w-full text-left text-sm">
          <thead>
            <tr>
              <th style={cell}>Name</th>
              <th style={cell}>Department</th>
              <th style={cell}>Leave status</th>
              <th style={cell}>Timesheet status</th>
            </tr>
          </thead>
          <tbody>
            {data.map((m) => (
              <tr key={m.id}>
                <td style={cell}>{m.full_name}</td>
                <td style={cell}>{m.department_name || "—"}</td>
                <td style={cell}>{m.leave_status || "—"}</td>
                <td style={cell}>{m.timesheet_status || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
