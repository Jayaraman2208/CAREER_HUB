import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getProblem, addSubmission, upsertUser } from "../lib/db";
import { LANGUAGES, judge, runCode, type JudgeCase } from "../lib/piston";
import { Badge, Button, Card, diffColor } from "../components/ui";
import CodeEditor from "../components/CodeEditor";
import { randomToken } from "../lib/security";
import { cn } from "../utils/cn";

function genericStarter(langId: string): string {
  if (langId === "cpp")
    return "#include <bits/stdc++.h>\nusing namespace std;\nint main(){\n    // read from cin, write to cout\n    return 0;\n}\n";
  if (langId === "c")
    return "#include <stdio.h>\nint main(){\n    // read with scanf, print with printf\n    return 0;\n}\n";
  if (langId === "java")
    return "import java.util.*;\npublic class Main {\n    public static void main(String[] args){\n        Scanner sc = new Scanner(System.in);\n        // your code here\n    }\n}\n";
  return "";
}

export default function ProblemDetail() {
  const { id } = useParams();
  const { user, refresh } = useAuth();
  const problem = id ? getProblem(id) : undefined;

  const [langId, setLangId] = useState("python");
  const [code, setCode] = useState(problem?.starter.python ?? "");
  const [running, setRunning] = useState(false);
  const [cases, setCases] = useState<JudgeCase[] | null>(null);
  const [verdict, setVerdict] = useState<string>("");
  const [consoleOut, setConsoleOut] = useState<string>("");
  const [tab, setTab] = useState<"tests" | "console">("tests");

  if (!problem)
    return (
      <div className="py-20 text-center">
        <p className="text-slate-400">Problem not found.</p>
        <Link to="/app/coding" className="text-cyan-400 hover:underline">
          ← Back to arena
        </Link>
      </div>
    );

  function changeLang(newLang: string) {
    setLangId(newLang);
    if (newLang === "python") setCode(problem!.starter.python);
    else if (newLang === "javascript") setCode(problem!.starter.javascript);
    else setCode(genericStarter(newLang));
    setCases(null);
    setVerdict("");
  }

  async function handleRun() {
    setRunning(true);
    setVerdict("");
    setTab("console");
    const sample = problem!.tests.find((t) => !t.hidden) ?? problem!.tests[0];
    const r = await runCode(langId, code, sample.input);
    setRunning(false);
    if (!r.ok) {
      setConsoleOut("⚠️ " + (r.error ?? "Execution failed."));
      return;
    }
    setConsoleOut(
      `▶ Input:\n${sample.input}\n\n📤 Output:\n${r.stdout || "(no output)"}${
        r.stderr ? `\n\n🛑 Errors:\n${r.stderr}` : ""
      }`,
    );
  }

  async function handleSubmit() {
    setRunning(true);
    setVerdict("");
    setTab("tests");
    const result = await judge(langId, code, problem!.tests);
    setRunning(false);
    setCases(result.cases);

    const status = result.accepted
      ? "Accepted"
      : result.cases.some((c) => c.error)
        ? "Error"
        : "Wrong Answer";

    if (user) {
      addSubmission({
        id: "s-" + randomToken(6),
        userId: user.id,
        problemId: problem!.id,
        language: langId,
        code,
        status,
        passed: result.passed,
        total: result.total,
        at: Date.now(),
      });

      if (result.accepted && !user.solved.includes(problem!.id)) {
        user.solved.push(problem!.id);
        user.coins += problem!.reward;
        upsertUser(user);
        refresh();
      }
    }

    setVerdict(
      result.accepted
        ? `✅ Accepted! All ${result.total} test cases passed.${
            user && !user.solved.includes(problem!.id) ? "" : ""
          }`
        : `❌ ${status}: ${result.passed}/${result.total} test cases passed.`,
    );
  }

  return (
    <div>
      <Link
        to="/app/coding"
        className="mb-4 inline-block text-sm text-slate-400 hover:text-cyan-400"
      >
        ← Back to arena
      </Link>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Description */}
        <Card className="lg:max-h-[80vh] lg:overflow-y-auto">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <h1 className="text-xl font-bold text-white">{problem.title}</h1>
            <Badge color={diffColor(problem.difficulty)}>
              {problem.difficulty}
            </Badge>
            <Badge color="cyan">{problem.category}</Badge>
            <span className="text-sm text-amber-400">🪙 {problem.reward}</span>
          </div>
          <div className="mb-4 flex flex-wrap gap-1.5">
            {problem.companies.map((c) => (
              <span
                key={c}
                className="rounded-md bg-white/5 px-2 py-0.5 text-xs text-slate-400"
              >
                {c}
              </span>
            ))}
          </div>

          <p className="text-sm leading-relaxed text-slate-300">
            {problem.description}
          </p>

          <h3 className="mt-5 mb-1 text-sm font-semibold text-cyan-400">
            Input Format
          </h3>
          <p className="text-sm text-slate-400">{problem.inputFormat}</p>

          <h3 className="mt-4 mb-1 text-sm font-semibold text-cyan-400">
            Output Format
          </h3>
          <p className="text-sm text-slate-400">{problem.outputFormat}</p>

          <h3 className="mt-5 mb-2 text-sm font-semibold text-cyan-400">
            Examples
          </h3>
          {problem.examples.map((ex, i) => (
            <div
              key={i}
              className="mb-3 rounded-xl border border-white/10 bg-black/30 p-3 font-mono text-xs"
            >
              <div className="text-slate-500">Input:</div>
              <pre className="whitespace-pre-wrap text-slate-200">{ex.input}</pre>
              <div className="mt-2 text-slate-500">Output:</div>
              <pre className="whitespace-pre-wrap text-emerald-300">
                {ex.output}
              </pre>
              {ex.explanation && (
                <div className="mt-2 text-slate-400">💡 {ex.explanation}</div>
              )}
            </div>
          ))}

          <h3 className="mt-4 mb-2 text-sm font-semibold text-cyan-400">
            Constraints
          </h3>
          <ul className="list-inside list-disc text-sm text-slate-400">
            {problem.constraints.map((c, i) => (
              <li key={i} className="font-mono text-xs">
                {c}
              </li>
            ))}
          </ul>
        </Card>

        {/* Editor */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <select
              value={langId}
              onChange={(e) => changeLang(e.target.value)}
              className="rounded-xl border border-white/10 bg-[#0a0c16] px-3 py-2 text-sm text-slate-100 outline-none"
            >
              {LANGUAGES.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.label}
                </option>
              ))}
            </select>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleRun} disabled={running}>
                {running ? "Running…" : "▶ Run"}
              </Button>
              <Button variant="success" onClick={handleSubmit} disabled={running}>
                {running ? "Judging…" : "✓ Submit"}
              </Button>
            </div>
          </div>

          <CodeEditor value={code} onChange={setCode} height="360px" />

          {verdict && (
            <div
              className={cn(
                "mt-3 rounded-xl px-4 py-3 text-sm font-medium",
                verdict.startsWith("✅")
                  ? "bg-emerald-500/10 text-emerald-300"
                  : "bg-rose-500/10 text-rose-300",
              )}
            >
              {verdict}
            </div>
          )}

          <div className="mt-3">
            <div className="mb-2 flex gap-2">
              <button
                onClick={() => setTab("tests")}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-xs font-medium",
                  tab === "tests"
                    ? "bg-white/10 text-white"
                    : "text-slate-400",
                )}
              >
                Test Results
              </button>
              <button
                onClick={() => setTab("console")}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-xs font-medium",
                  tab === "console"
                    ? "bg-white/10 text-white"
                    : "text-slate-400",
                )}
              >
                Console
              </button>
            </div>

            {tab === "console" ? (
              <pre className="min-h-[120px] whitespace-pre-wrap rounded-xl border border-white/10 bg-black/40 p-4 font-mono text-xs text-slate-300">
                {consoleOut || "Click ▶ Run to execute with a sample input."}
              </pre>
            ) : (
              <div className="space-y-2">
                {!cases && (
                  <p className="rounded-xl border border-white/10 bg-black/30 p-4 text-xs text-slate-500">
                    Click ✓ Submit to run all test cases through the online
                    compiler.
                  </p>
                )}
                {cases?.map((c) => (
                  <div
                    key={c.index}
                    className={cn(
                      "rounded-xl border p-3 text-xs",
                      c.passed
                        ? "border-emerald-400/20 bg-emerald-500/5"
                        : "border-rose-400/20 bg-rose-500/5",
                    )}
                  >
                    <div className="mb-1 flex items-center justify-between">
                      <span className="font-semibold text-slate-200">
                        Test #{c.index + 1} {c.hidden && "🔒"}
                      </span>
                      <span
                        className={
                          c.passed ? "text-emerald-400" : "text-rose-400"
                        }
                      >
                        {c.passed ? "PASSED" : "FAILED"}
                      </span>
                    </div>
                    {!c.hidden && (
                      <div className="font-mono text-slate-400">
                        <div>in: {c.input.replace(/\n/g, " ⏎ ")}</div>
                        <div>expected: {c.expected.replace(/\n/g, " ⏎ ")}</div>
                        {!c.passed && (
                          <div className="text-rose-300">
                            got: {c.got.replace(/\n/g, " ⏎ ") || "(empty)"}
                          </div>
                        )}
                      </div>
                    )}
                    {c.error && (
                      <div className="mt-1 font-mono text-rose-300">
                        {c.error.slice(0, 200)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
