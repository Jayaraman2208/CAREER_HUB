import { useState } from "react";
import { getNotes } from "../lib/db";
import { Badge, Card, SectionTitle } from "../components/ui";
import { cn } from "../utils/cn";

export default function Notes() {
  const all = getNotes();
  const [type, setType] = useState<"All" | "Product" | "Service">("All");
  const list = all.filter((n) => type === "All" || n.type === type);

  return (
    <div>
      <SectionTitle
        title="Study Notes"
        subtitle="Company-specific preparation strategies and key focus areas."
      />

      <div className="mb-5 flex gap-2">
        {(["All", "Product", "Service"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setType(t)}
            className={cn(
              "rounded-lg px-3 py-1.5 text-sm font-medium transition",
              type === t
                ? "bg-cyan-500/20 text-cyan-300"
                : "text-slate-400 hover:bg-white/5",
            )}
          >
            {t} {t !== "All" && "Companies"}
          </button>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {list.map((n) => (
          <Card key={n.id}>
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">{n.company}</h3>
              <Badge color={n.type === "Product" ? "violet" : "cyan"}>
                {n.type}
              </Badge>
            </div>
            <p className="text-sm leading-relaxed text-slate-300">
              {n.strategy}
            </p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {n.topics.map((t) => (
                <span
                  key={t}
                  className="rounded-md bg-white/5 px-2 py-1 text-xs text-slate-400"
                >
                  {t}
                </span>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
