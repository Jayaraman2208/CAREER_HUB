import { useMemo, useState } from "react";
import { getInterview } from "../lib/db";
import { Badge, Button, Card, SectionTitle } from "../components/ui";
import { cn } from "../utils/cn";

export default function Interview() {
  const all = getInterview();
  const companies = useMemo(
    () => ["All", ...Array.from(new Set(all.map((q) => q.company)))],
    [all],
  );
  const [company, setCompany] = useState("All");
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const list = all.filter((q) => company === "All" || q.company === company);

  const catColor: Record<string, "cyan" | "violet" | "amber" | "green"> = {
    Technical: "cyan",
    Behavioral: "violet",
    HR: "amber",
    "System Design": "green",
  };

  return (
    <div>
      <SectionTitle
        title="AI Mock Interview"
        subtitle="Company-wise interview questions with model answers. Practice answering aloud, then reveal."
      />

      <div className="mb-5 flex flex-wrap gap-2">
        {companies.map((c) => (
          <button
            key={c}
            onClick={() => setCompany(c)}
            className={cn(
              "rounded-lg px-3 py-1.5 text-sm font-medium transition",
              company === c
                ? "bg-cyan-500/20 text-cyan-300"
                : "text-slate-400 hover:bg-white/5",
            )}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {list.map((q) => (
          <Card key={q.id}>
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <Badge color="slate">{q.company}</Badge>
              <Badge color={catColor[q.category]}>{q.category}</Badge>
              <span className="text-xs text-slate-500">{q.role}</span>
            </div>
            <h3 className="text-base font-semibold text-white">{q.question}</h3>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() =>
                setRevealed((r) => ({ ...r, [q.id]: !r[q.id] }))
              }
            >
              {revealed[q.id] ? "Hide model answer" : "💡 Reveal model answer"}
            </Button>
            {revealed[q.id] && (
              <div className="mt-3 rounded-xl border border-cyan-400/20 bg-cyan-500/5 p-4 text-sm leading-relaxed text-slate-300">
                {q.sampleAnswer}
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
