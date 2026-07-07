import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Card, SectionTitle, Stat, Badge, Button } from "../components/ui";
import {
  getProblems,
  getAptitude,
  getUserSubmissions,
} from "../lib/db";

const QUICK = [
  { to: "/app/coding", icon: "💻", title: "Solve Problems", desc: "Coding arena" },
  { to: "/app/aptitude", icon: "🧠", title: "Practice Aptitude", desc: "With methods" },
  { to: "/app/interview", icon: "🎤", title: "Mock Interview", desc: "Company-wise" },
  { to: "/app/compiler", icon: "⚡", title: "Open Compiler", desc: "5 languages" },
];

export default function Dashboard() {
  const { user } = useAuth();
  if (!user) return null;
  const problems = getProblems();
  const apt = getAptitude();
  const subs = getUserSubmissions(user.id);
  const accepted = subs.filter((s) => s.status === "Accepted").length;
  const solvedPct = Math.round((user.solved.length / problems.length) * 100);

  return (
    <div>
      <SectionTitle
        title={`Welcome back, ${user.fullName.split(" ")[0]} 👋`}
        subtitle="Here's your preparation snapshot."
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat label="Problems Solved" value={`${user.solved.length}/${problems.length}`} icon="✅" />
        <Stat label="Aptitude Correct" value={`${user.aptCorrect.length}/${apt.length}`} icon="🧠" />
        <Stat label="Coins Earned" value={user.coins} icon="🪙" />
        <Stat label="Day Streak" value={`${user.streak} 🔥`} icon="📅" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <h2 className="mb-4 text-lg font-bold text-white">Quick Actions</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {QUICK.map((q) => (
              <Link
                key={q.to}
                to={q.to}
                className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-4 transition hover:border-cyan-400/30 hover:bg-white/5"
              >
                <span className="text-2xl">{q.icon}</span>
                <div>
                  <div className="font-semibold text-white">{q.title}</div>
                  <div className="text-xs text-slate-400">{q.desc}</div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-6">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="text-slate-300">Coding Progress</span>
              <span className="text-cyan-400">{solvedPct}%</span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 transition-all"
                style={{ width: `${solvedPct}%` }}
              />
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="mb-4 text-lg font-bold text-white">Your Plan</h2>
          <div className="rounded-xl bg-gradient-to-br from-violet-500/15 to-fuchsia-500/10 p-4">
            <div className="text-2xl font-black text-white">{user.plan}</div>
            <p className="mt-1 text-sm text-slate-400">
              {user.plan === "Free"
                ? "Upgrade to unlock company-based training tracks."
                : "Thanks for being a premium member!"}
            </p>
            <Link to="/app/pricing">
              <Button className="mt-4 w-full">
                {user.plan === "Free" ? "Upgrade Now" : "Manage Plan"}
              </Button>
            </Link>
          </div>
          <div className="mt-4 text-sm text-slate-400">
            Total submissions:{" "}
            <span className="text-white">{subs.length}</span> · Accepted:{" "}
            <span className="text-emerald-400">{accepted}</span>
          </div>
        </Card>
      </div>

      <Card className="mt-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Recent Submissions</h2>
          <Link to="/app/coding" className="text-sm text-cyan-400 hover:underline">
            Go to arena →
          </Link>
        </div>
        {subs.length === 0 ? (
          <p className="py-6 text-center text-sm text-slate-500">
            No submissions yet. Solve your first problem to see it here!
          </p>
        ) : (
          <div className="space-y-2">
            {subs.slice(0, 5).map((s) => {
              const p = problems.find((x) => x.id === s.problemId);
              return (
                <div
                  key={s.id}
                  className="flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.02] px-4 py-2.5"
                >
                  <div className="text-sm text-slate-200">
                    {p?.title ?? s.problemId}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-500">{s.language}</span>
                    <Badge color={s.status === "Accepted" ? "green" : "red"}>
                      {s.status} ({s.passed}/{s.total})
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}
