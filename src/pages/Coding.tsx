import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getProblems } from "../lib/db";
import { Badge, Card, SectionTitle, diffColor } from "../components/ui";
import { cn } from "../utils/cn";

export default function Coding() {
  const { user } = useAuth();
  const problems = getProblems();
  const [diff, setDiff] = useState("All");
  const [q, setQ] = useState("");

  const categories = useMemo(
    () => ["All", "Easy", "Medium", "Hard"],
    [],
  );

  const filtered = problems.filter((p) => {
    const matchDiff = diff === "All" || p.difficulty === diff;
    const matchQ =
      !q ||
      p.title.toLowerCase().includes(q.toLowerCase()) ||
      p.companies.join(" ").toLowerCase().includes(q.toLowerCase());
    return matchDiff && matchQ;
  });

  return (
    <div>
      <SectionTitle
        title="Coding Arena"
        subtitle="Solve problems judged by a real online compiler across 5 languages."
      />

      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div className="flex gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setDiff(c)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-sm font-medium transition",
                diff === c
                  ? "bg-cyan-500/20 text-cyan-300"
                  : "text-slate-400 hover:bg-white/5",
              )}
            >
              {c}
            </button>
          ))}
        </div>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search problems or companies…"
          className="ml-auto w-full max-w-xs rounded-xl border border-white/10 bg-black/30 px-4 py-2 text-sm text-slate-100 outline-none focus:border-cyan-400/50 sm:w-auto"
        />
      </div>

      <Card className="overflow-hidden p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-left text-xs uppercase tracking-wide text-slate-500">
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Problem</th>
              <th className="hidden px-5 py-3 sm:table-cell">Category</th>
              <th className="hidden px-5 py-3 md:table-cell">Companies</th>
              <th className="px-5 py-3">Difficulty</th>
              <th className="px-5 py-3 text-right">Reward</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => {
              const solved = user?.solved.includes(p.id);
              return (
                <tr
                  key={p.id}
                  className="border-b border-white/5 transition hover:bg-white/[0.03]"
                >
                  <td className="px-5 py-3">
                    {solved ? (
                      <span className="text-emerald-400">✓</span>
                    ) : (
                      <span className="text-slate-600">○</span>
                    )}
                  </td>
                  <td className="px-5 py-3">
                    <Link
                      to={`/app/coding/${p.id}`}
                      className="font-medium text-slate-100 hover:text-cyan-400"
                    >
                      {p.title}
                    </Link>
                  </td>
                  <td className="hidden px-5 py-3 text-slate-400 sm:table-cell">
                    {p.category}
                  </td>
                  <td className="hidden px-5 py-3 md:table-cell">
                    <span className="text-xs text-slate-500">
                      {p.companies.slice(0, 2).join(", ")}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <Badge color={diffColor(p.difficulty)}>{p.difficulty}</Badge>
                  </td>
                  <td className="px-5 py-3 text-right text-amber-400">
                    🪙 {p.reward}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="py-10 text-center text-sm text-slate-500">
            No problems match your filter.
          </p>
        )}
      </Card>
    </div>
  );
}
