import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { cn } from "../utils/cn";

const NAV = [
  { to: "/app", label: "Dashboard", icon: "🏠", end: true },
  { to: "/app/coding", label: "Coding Arena", icon: "💻" },
  { to: "/app/aptitude", label: "Aptitude", icon: "🧠" },
  { to: "/app/interview", label: "AI Interview", icon: "🎤" },
  { to: "/app/compiler", label: "Compiler", icon: "⚡" },
  { to: "/app/resume", label: "Resume Builder", icon: "📄" },
  { to: "/app/notes", label: "Study Notes", icon: "📖" },
  { to: "/app/leaderboard", label: "Leaderboard", icon: "🏆" },
  { to: "/app/pricing", label: "Subscription", icon: "💎" },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const nav = [...NAV];
  if (user?.role === "admin")
    nav.push({ to: "/app/admin", label: "Admin Panel", icon: "👑" });

  return (
    <div className="grid-bg flex min-h-screen text-slate-200">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-white/10 bg-[#0a0c18]/95 backdrop-blur-xl transition-transform lg:static lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center gap-2 px-5 py-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-indigo-500 text-lg font-black text-white">
            A
          </div>
          <div>
            <div className="text-sm font-bold text-white">AI Career Hub</div>
            <div className="text-[10px] uppercase tracking-widest text-cyan-400">
              Local Edition
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={(item as { end?: boolean }).end}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                  isActive
                    ? "bg-gradient-to-r from-cyan-500/20 to-indigo-500/10 text-white shadow-inner"
                    : "text-slate-400 hover:bg-white/5 hover:text-white",
                )
              }
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-white/10 p-3">
          <div className="mb-2 flex items-center gap-3 rounded-xl bg-white/5 px-3 py-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 text-sm font-bold text-white">
              {user?.fullName?.[0]?.toUpperCase() ?? "U"}
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-semibold text-white">
                {user?.fullName}
              </div>
              <div className="text-xs text-amber-400">🪙 {user?.coins ?? 0}</div>
            </div>
          </div>
          <button
            onClick={() => {
              logout();
              navigate("/");
            }}
            className="w-full rounded-xl px-3 py-2 text-left text-sm text-rose-300 transition hover:bg-rose-500/10"
          >
            ⏻ Logout
          </button>
        </div>
      </aside>

      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/60 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-white/10 bg-[#07080f]/80 px-4 py-3 backdrop-blur-xl lg:hidden">
          <button
            onClick={() => setOpen(true)}
            className="rounded-lg border border-white/10 p-2 text-slate-300"
          >
            ☰
          </button>
          <span className="font-bold text-white">AI Career Hub</span>
          <span className="text-amber-400">🪙 {user?.coins ?? 0}</span>
        </header>
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
