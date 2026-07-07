import { useAuth } from "../context/AuthContext";
import { getUsers } from "../lib/db";
import { Card, SectionTitle, Badge } from "../components/ui";
import { cn } from "../utils/cn";

export default function Leaderboard() {
  const { user } = useAuth();
  const ranked = getUsers()
    .filter((u) => u.role !== "admin")
    .sort(
      (a, b) =>
        b.coins - a.coins ||
        b.solved.length - a.solved.length ||
        b.aptCorrect.length - a.aptCorrect.length,
    );

  const medal = (i: number) =>
    i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`;

  return (
    <div>
      <SectionTitle
        title="Leaderboard"
        subtitle="Compete with everyone on this machine. Earn coins by solving problems and aptitude."
      />

      <Card className="p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-left text-xs uppercase tracking-wide text-slate-500">
              <th className="px-5 py-3">Rank</th>
              <th className="px-5 py-3">User</th>
              <th className="px-5 py-3 text-right">Solved</th>
              <th className="hidden px-5 py-3 text-right sm:table-cell">
                Aptitude
              </th>
              <th className="hidden px-5 py-3 text-right sm:table-cell">
                Streak
              </th>
              <th className="px-5 py-3 text-right">Coins</th>
            </tr>
          </thead>
          <tbody>
            {ranked.map((u, i) => (
              <tr
                key={u.id}
                className={cn(
                  "border-b border-white/5",
                  u.id === user?.id && "bg-cyan-500/5",
                )}
              >
                <td className="px-5 py-3 text-lg">{medal(i)}</td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 text-xs font-bold text-white">
                      {u.fullName[0]?.toUpperCase()}
                    </div>
                    <div>
                      <div className="font-medium text-slate-100">
                        {u.fullName}
                        {u.id === user?.id && (
                          <span className="ml-2 text-xs text-cyan-400">You</span>
                        )}
                      </div>
                      <div className="text-xs text-slate-500">
                        @{u.username}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3 text-right text-slate-300">
                  {u.solved.length}
                </td>
                <td className="hidden px-5 py-3 text-right text-slate-300 sm:table-cell">
                  {u.aptCorrect.length}
                </td>
                <td className="hidden px-5 py-3 text-right sm:table-cell">
                  <Badge color="amber">{u.streak}🔥</Badge>
                </td>
                <td className="px-5 py-3 text-right font-bold text-amber-400">
                  🪙 {u.coins}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {ranked.length === 0 && (
          <p className="py-10 text-center text-sm text-slate-500">
            No users yet. Be the first to register!
          </p>
        )}
      </Card>
    </div>
  );
}
