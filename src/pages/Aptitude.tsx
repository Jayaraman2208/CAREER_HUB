import { useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getAptitude, upsertUser } from "../lib/db";
import { Badge, Button, Card, SectionTitle, diffColor } from "../components/ui";
import { cn } from "../utils/cn";

export default function Aptitude() {
  const { user, refresh } = useAuth();
  const all = getAptitude();
  const categories = useMemo(
    () => ["All", ...Array.from(new Set(all.map((q) => q.category)))],
    [all],
  );
  const [cat, setCat] = useState("All");
  const list = all.filter((q) => cat === "All" || q.category === cat);

  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [showMethods, setShowMethods] = useState(false);

  const q = list[idx];

  function pick(i: number) {
    if (revealed) return;
    setSelected(i);
    setRevealed(true);
    if (user && i === q.answerIndex && !user.aptCorrect.includes(q.id)) {
      user.aptCorrect.push(q.id);
      user.coins += 10;
      upsertUser(user);
      refresh();
    }
  }

  function go(delta: number) {
    const next = Math.min(Math.max(idx + delta, 0), list.length - 1);
    setIdx(next);
    setSelected(null);
    setRevealed(false);
    setShowMethods(false);
  }

  function changeCat(c: string) {
    setCat(c);
    setIdx(0);
    setSelected(null);
    setRevealed(false);
    setShowMethods(false);
  }

  if (!q)
    return (
      <div>
        <SectionTitle title="Aptitude Trainer" />
        <p className="text-slate-400">No questions in this category.</p>
      </div>
    );

  return (
    <div>
      <SectionTitle
        title="Aptitude Trainer"
        subtitle="Every question comes with multiple solving methods and shortcuts."
      />

      <div className="mb-5 flex flex-wrap gap-2">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => changeCat(c)}
            className={cn(
              "rounded-lg px-3 py-1.5 text-sm font-medium transition",
              cat === c
                ? "bg-cyan-500/20 text-cyan-300"
                : "text-slate-400 hover:bg-white/5",
            )}
          >
            {c}
          </button>
        ))}
      </div>

      <Card>
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge color="violet">{q.topic}</Badge>
            <Badge color={diffColor(q.difficulty)}>{q.difficulty}</Badge>
          </div>
          <span className="text-sm text-slate-500">
            {idx + 1} / {list.length}
          </span>
        </div>

        <h2 className="mb-5 text-lg font-semibold text-white">{q.question}</h2>

        <div className="grid gap-3 sm:grid-cols-2">
          {q.options.map((opt, i) => {
            const isCorrect = i === q.answerIndex;
            const state = !revealed
              ? "idle"
              : isCorrect
                ? "correct"
                : i === selected
                  ? "wrong"
                  : "idle";
            return (
              <button
                key={i}
                onClick={() => pick(i)}
                disabled={revealed}
                className={cn(
                  "flex items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition",
                  state === "idle" &&
                    "border-white/10 bg-white/[0.02] hover:border-cyan-400/40 hover:bg-white/5",
                  state === "correct" &&
                    "border-emerald-400/40 bg-emerald-500/10 text-emerald-200",
                  state === "wrong" &&
                    "border-rose-400/40 bg-rose-500/10 text-rose-200",
                )}
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-md bg-white/10 text-xs font-bold">
                  {String.fromCharCode(65 + i)}
                </span>
                {opt}
                {state === "correct" && <span className="ml-auto">✓</span>}
                {state === "wrong" && <span className="ml-auto">✗</span>}
              </button>
            );
          })}
        </div>

        {revealed && (
          <div className="mt-5">
            <div
              className={cn(
                "rounded-xl px-4 py-3 text-sm font-medium",
                selected === q.answerIndex
                  ? "bg-emerald-500/10 text-emerald-300"
                  : "bg-rose-500/10 text-rose-300",
              )}
            >
              {selected === q.answerIndex
                ? "🎉 Correct! +10 coins"
                : `Not quite. Correct answer: ${String.fromCharCode(
                    65 + q.answerIndex,
                  )}`}
            </div>

            <button
              onClick={() => setShowMethods((s) => !s)}
              className="mt-4 text-sm font-medium text-cyan-400 hover:underline"
            >
              {showMethods ? "▾ Hide" : "▸ Show"} solving methods (
              {q.methods.length})
            </button>

            {showMethods && (
              <div className="mt-3 space-y-3">
                {q.methods.map((m, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-white/10 bg-black/30 p-4"
                  >
                    <div className="mb-1 text-sm font-semibold text-cyan-300">
                      Method {i + 1}: {m.name}
                    </div>
                    <p className="text-sm text-slate-300">{m.steps}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="mt-6 flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => go(-1)}
            disabled={idx === 0}
          >
            ← Previous
          </Button>
          <Button onClick={() => go(1)} disabled={idx === list.length - 1}>
            Next →
          </Button>
        </div>
      </Card>
    </div>
  );
}
