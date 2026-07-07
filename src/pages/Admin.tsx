import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  getUsers,
  deleteUser,
  upsertUser,
  getProblems,
  getAptitude,
  getSubmissions,
  saveAptitude,
  exportData,
  importData,
  resetAll,
} from "../lib/db";
import { Badge, Button, Card, Input, SectionTitle, Stat } from "../components/ui";
import { cn } from "../utils/cn";
import type { AptQuestion } from "../lib/seed";

type Tab = "overview" | "users" | "content" | "data";

export default function Admin() {
  const { user } = useAuth();
  const [tab, setTab] = useState<Tab>("overview");
  const [, force] = useState(0);
  const refresh = () => force((n) => n + 1);

  if (user?.role !== "admin")
    return (
      <div className="py-20 text-center text-slate-400">
        🔒 Access denied. Administrators only.
      </div>
    );

  const users = getUsers();
  const problems = getProblems();
  const apt = getAptitude();
  const subs = getSubmissions();

  return (
    <div>
      <SectionTitle
        title="Admin Panel 👑"
        subtitle="Manage users, content, and platform data."
      />

      <div className="mb-6 flex flex-wrap gap-2">
        {(
          [
            ["overview", "Overview"],
            ["users", "Users"],
            ["content", "Content"],
            ["data", "Data & Backup"],
          ] as [Tab, string][]
        ).map(([t, label]) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "rounded-lg px-4 py-2 text-sm font-medium transition",
              tab === t
                ? "bg-cyan-500/20 text-cyan-300"
                : "text-slate-400 hover:bg-white/5",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Stat label="Total Users" value={users.length} icon="👥" />
          <Stat label="Coding Problems" value={problems.length} icon="💻" />
          <Stat label="Aptitude Qs" value={apt.length} icon="🧠" />
          <Stat label="Submissions" value={subs.length} icon="📨" />
        </div>
      )}

      {tab === "users" && (
        <Card className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left text-xs uppercase tracking-wide text-slate-500">
                <th className="px-4 py-3">User</th>
                <th className="hidden px-4 py-3 sm:table-cell">Role</th>
                <th className="hidden px-4 py-3 md:table-cell">Plan</th>
                <th className="px-4 py-3 text-right">Coins</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-white/5">
                  <td className="px-4 py-3">
                    <div className="font-medium text-slate-100">
                      {u.fullName}
                    </div>
                    <div className="text-xs text-slate-500">{u.email}</div>
                  </td>
                  <td className="hidden px-4 py-3 sm:table-cell">
                    <Badge color={u.role === "admin" ? "violet" : "slate"}>
                      {u.role}
                    </Badge>
                  </td>
                  <td className="hidden px-4 py-3 md:table-cell">
                    <select
                      value={u.plan}
                      onChange={(e) => {
                        u.plan = e.target.value as typeof u.plan;
                        upsertUser(u);
                        refresh();
                      }}
                      className="rounded-lg border border-white/10 bg-black/30 px-2 py-1 text-xs text-slate-200 outline-none"
                    >
                      <option>Free</option>
                      <option>Pro</option>
                      <option>Premium</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 text-right text-amber-400">
                    🪙 {u.coins}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {u.id === user.id ? (
                      <span className="text-xs text-slate-600">—</span>
                    ) : (
                      <button
                        onClick={() => {
                          if (confirm(`Delete ${u.username}?`)) {
                            deleteUser(u.id);
                            refresh();
                          }
                        }}
                        className="text-xs text-rose-400 hover:underline"
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {tab === "content" && <ContentManager onChange={refresh} />}

      {tab === "data" && <DataManager onChange={refresh} />}
    </div>
  );
}

function ContentManager({ onChange }: { onChange: () => void }) {
  const apt = getAptitude();
  const [q, setQ] = useState({
    question: "",
    topic: "",
    category: "Quantitative",
    a: "",
    b: "",
    c: "",
    d: "",
    answer: 0,
    method: "",
  });

  function add() {
    if (!q.question.trim() || !q.a.trim()) {
      alert("Question and at least option A are required.");
      return;
    }
    const newQ: AptQuestion = {
      id: "apt-custom-" + Date.now(),
      category: q.category,
      topic: q.topic || "General",
      difficulty: "Medium",
      question: q.question.trim(),
      options: [q.a, q.b, q.c, q.d].filter((x) => x.trim()),
      answerIndex: q.answer,
      methods: q.method
        ? [{ name: "Solution", steps: q.method }]
        : [{ name: "Solution", steps: "Refer to the correct option." }],
    };
    saveAptitude([newQ, ...apt]);
    setQ({ ...q, question: "", a: "", b: "", c: "", d: "", method: "" });
    onChange();
    alert("Aptitude question added!");
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <h3 className="mb-4 text-lg font-bold text-white">
          Add Aptitude Question
        </h3>
        <div className="space-y-3">
          <Input
            label="Question"
            value={q.question}
            onChange={(e) => setQ({ ...q, question: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Topic"
              value={q.topic}
              onChange={(e) => setQ({ ...q, topic: e.target.value })}
            />
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-300">
                Category
              </span>
              <select
                value={q.category}
                onChange={(e) => setQ({ ...q, category: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-2.5 text-sm text-slate-100 outline-none"
              >
                <option>Quantitative</option>
                <option>Logical</option>
                <option>Verbal</option>
              </select>
            </label>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {(["a", "b", "c", "d"] as const).map((k, i) => (
              <Input
                key={k}
                label={`Option ${k.toUpperCase()}`}
                value={q[k]}
                onChange={(e) => setQ({ ...q, [k]: e.target.value })}
                placeholder={i >= 2 ? "(optional)" : ""}
              />
            ))}
          </div>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-300">
              Correct Answer
            </span>
            <select
              value={q.answer}
              onChange={(e) => setQ({ ...q, answer: Number(e.target.value) })}
              className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-2.5 text-sm text-slate-100 outline-none"
            >
              <option value={0}>A</option>
              <option value={1}>B</option>
              <option value={2}>C</option>
              <option value={3}>D</option>
            </select>
          </label>
          <Input
            label="Solving Method"
            value={q.method}
            onChange={(e) => setQ({ ...q, method: e.target.value })}
          />
          <Button className="w-full" onClick={add}>
            Add Question
          </Button>
        </div>
      </Card>

      <Card>
        <h3 className="mb-4 text-lg font-bold text-white">
          Existing Aptitude ({apt.length})
        </h3>
        <div className="max-h-[60vh] space-y-2 overflow-y-auto">
          {apt.map((a) => (
            <div
              key={a.id}
              className="rounded-xl border border-white/10 bg-black/20 px-3 py-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs text-cyan-400">{a.topic}</span>
                <button
                  onClick={() => {
                    saveAptitude(apt.filter((x) => x.id !== a.id));
                    onChange();
                  }}
                  className="text-xs text-rose-400 hover:underline"
                >
                  Delete
                </button>
              </div>
              <div className="text-sm text-slate-300">{a.question}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function DataManager({ onChange }: { onChange: () => void }) {
  const [importText, setImportText] = useState("");
  const [msg, setMsg] = useState("");

  function download() {
    const data = exportData();
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `careerhub-backup-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <h3 className="mb-2 text-lg font-bold text-white">
          📦 Backup (Availability)
        </h3>
        <p className="mb-4 text-sm text-slate-400">
          Export all platform data (users, content, submissions) as a JSON file
          stored on your machine.
        </p>
        <Button className="w-full" onClick={download}>
          Download Backup
        </Button>
      </Card>

      <Card>
        <h3 className="mb-2 text-lg font-bold text-white">♻️ Restore</h3>
        <textarea
          value={importText}
          onChange={(e) => setImportText(e.target.value)}
          rows={4}
          placeholder="Paste backup JSON here…"
          className="w-full resize-none rounded-xl border border-white/10 bg-black/30 p-3 text-xs text-slate-100 outline-none"
        />
        <Button
          className="mt-3 w-full"
          variant="outline"
          onClick={() => {
            if (importData(importText)) {
              setMsg("✅ Data restored successfully.");
              onChange();
            } else setMsg("❌ Invalid backup data.");
          }}
        >
          Restore Data
        </Button>
        {msg && <p className="mt-2 text-sm text-slate-300">{msg}</p>}
      </Card>

      <Card className="lg:col-span-2 border-rose-400/20">
        <h3 className="mb-2 text-lg font-bold text-rose-300">⚠️ Danger Zone</h3>
        <p className="mb-4 text-sm text-slate-400">
          Reset all data to factory defaults. This deletes every user and
          submission. The admin account will be recreated on next login.
        </p>
        <Button
          variant="danger"
          onClick={() => {
            if (
              confirm(
                "This will erase ALL data. Continue? You will be logged out.",
              )
            ) {
              resetAll();
              window.location.href = "/";
            }
          }}
        >
          Reset Everything
        </Button>
      </Card>
    </div>
  );
}
