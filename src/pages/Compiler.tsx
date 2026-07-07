import { useState } from "react";
import { LANGUAGES, runCode } from "../lib/piston";
import { Button, Card, SectionTitle } from "../components/ui";
import CodeEditor from "../components/CodeEditor";

const SAMPLES: Record<string, string> = {
  python: 'name = input()\nprint(f"Hello, {name}!")\n',
  javascript:
    "const name = require('fs').readFileSync(0,'utf8').trim();\nconsole.log(`Hello, ${name}!`);\n",
  cpp: '#include <bits/stdc++.h>\nusing namespace std;\nint main(){\n    string name; getline(cin, name);\n    cout << "Hello, " << name << "!" << endl;\n    return 0;\n}\n',
  c: '#include <stdio.h>\nint main(){\n    char name[100];\n    scanf("%99s", name);\n    printf("Hello, %s!\\n", name);\n    return 0;\n}\n',
  java: 'import java.util.*;\npublic class Main {\n    public static void main(String[] args){\n        Scanner sc = new Scanner(System.in);\n        String name = sc.nextLine();\n        System.out.println("Hello, " + name + "!");\n    }\n}\n',
};

export default function Compiler() {
  const [langId, setLangId] = useState("python");
  const [code, setCode] = useState(SAMPLES.python);
  const [stdin, setStdin] = useState("World");
  const [output, setOutput] = useState("");
  const [running, setRunning] = useState(false);
  const [meta, setMeta] = useState("");

  function changeLang(id: string) {
    setLangId(id);
    setCode(SAMPLES[id] ?? "");
    setOutput("");
    setMeta("");
  }

  async function run() {
    setRunning(true);
    setOutput("");
    setMeta("Executing on the online compiler…");
    const r = await runCode(langId, code, stdin);
    setRunning(false);
    if (!r.ok) {
      setMeta("");
      setOutput("⚠️ " + (r.error ?? "Execution failed."));
      return;
    }
    setMeta(`Exit code: ${r.code ?? "n/a"}`);
    setOutput(
      (r.stdout || "(no output)") +
        (r.stderr ? `\n\n--- stderr ---\n${r.stderr}` : ""),
    );
  }

  return (
    <div>
      <SectionTitle
        title="Online Compiler"
        subtitle="Write and run code in 5 languages using a free online execution engine."
      />

      <div className="mb-3 flex flex-wrap items-center gap-3">
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
        <Button onClick={run} disabled={running} className="ml-auto">
          {running ? "Running…" : "▶ Run Code"}
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <CodeEditor value={code} onChange={setCode} height="400px" />
        </div>
        <div className="space-y-4">
          <Card>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Standard Input (stdin)
            </label>
            <textarea
              value={stdin}
              onChange={(e) => setStdin(e.target.value)}
              rows={4}
              className="code-editor w-full resize-none rounded-xl border border-white/10 bg-black/40 p-3 text-sm text-slate-100 outline-none focus:border-cyan-400/50"
              placeholder="Input passed to your program…"
            />
          </Card>
          <Card>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium text-slate-300">Output</span>
              {meta && <span className="text-xs text-slate-500">{meta}</span>}
            </div>
            <pre className="min-h-[200px] whitespace-pre-wrap rounded-xl border border-white/10 bg-black/40 p-3 font-mono text-xs text-emerald-200">
              {output || "Output will appear here after you run your code."}
            </pre>
          </Card>
        </div>
      </div>
    </div>
  );
}
