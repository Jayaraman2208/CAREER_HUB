// Online compiler integration using the free public Piston API (emkc.org).
// Code is sent to the engine, executed in a sandbox, and stdout is returned so
// we can match it against expected output for grading.

export interface LangConfig {
  id: string;
  label: string;
  pistonLang: string;
  version: string;
  filename: string;
  monacoId: string;
}

export const LANGUAGES: LangConfig[] = [
  { id: "python", label: "Python 3", pistonLang: "python", version: "3.10.0", filename: "main.py", monacoId: "python" },
  { id: "javascript", label: "JavaScript (Node)", pistonLang: "javascript", version: "18.15.0", filename: "main.js", monacoId: "javascript" },
  { id: "cpp", label: "C++", pistonLang: "c++", version: "10.2.0", filename: "main.cpp", monacoId: "cpp" },
  { id: "c", label: "C", pistonLang: "c", version: "10.2.0", filename: "main.c", monacoId: "c" },
  { id: "java", label: "Java", pistonLang: "java", version: "15.0.2", filename: "Main.java", monacoId: "java" },
];

const ENDPOINT = "https://emkc.org/api/v2/piston/execute";

export interface RunResult {
  stdout: string;
  stderr: string;
  output: string;
  code: number | null;
  ok: boolean;
  error?: string;
}

export async function runCode(
  languageId: string,
  source: string,
  stdin = "",
): Promise<RunResult> {
  const lang = LANGUAGES.find((l) => l.id === languageId) ?? LANGUAGES[0];
  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        language: lang.pistonLang,
        version: lang.version,
        files: [{ name: lang.filename, content: source }],
        stdin,
        compile_timeout: 10000,
        run_timeout: 5000,
      }),
    });
    if (!res.ok) {
      const text = await res.text();
      return {
        stdout: "",
        stderr: "",
        output: "",
        code: null,
        ok: false,
        error: `Compiler service error (${res.status}). ${text.slice(0, 120)}`,
      };
    }
    const data = await res.json();
    const run = data.run ?? {};
    const compile = data.compile ?? {};
    const compileErr = compile.stderr ? compile.stderr : "";
    return {
      stdout: run.stdout ?? "",
      stderr: (compileErr ? compileErr + "\n" : "") + (run.stderr ?? ""),
      output: run.output ?? "",
      code: run.code ?? null,
      ok: true,
    };
  } catch (e) {
    return {
      stdout: "",
      stderr: "",
      output: "",
      code: null,
      ok: false,
      error:
        "Network error reaching the online compiler. Check your internet connection (the compiler needs network access).",
    };
  }
}

export function normalizeOutput(s: string): string {
  return s
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((l) => l.replace(/\s+$/g, ""))
    .join("\n")
    .replace(/\n+$/g, "")
    .trim();
}

export interface JudgeCase {
  index: number;
  passed: boolean;
  input: string;
  expected: string;
  got: string;
  hidden: boolean;
  error?: string;
}

export async function judge(
  languageId: string,
  source: string,
  tests: { input: string; expected: string; hidden: boolean }[],
): Promise<{ cases: JudgeCase[]; passed: number; total: number; accepted: boolean }> {
  const cases: JudgeCase[] = [];
  for (let i = 0; i < tests.length; i++) {
    const t = tests[i];
    const r = await runCode(languageId, source, t.input);
    const got = normalizeOutput(r.stdout);
    const expected = normalizeOutput(t.expected);
    const hadError = !r.ok || (r.code !== 0 && r.code !== null) || (!!r.stderr && got === "");
    const passed = !hadError && got === expected;
    cases.push({
      index: i,
      passed,
      input: t.input,
      expected: t.expected,
      got: r.ok ? r.stdout : "",
      hidden: t.hidden,
      error: r.error || (r.stderr && !passed ? r.stderr : undefined),
    });
  }
  const passedCount = cases.filter((c) => c.passed).length;
  return {
    cases,
    passed: passedCount,
    total: tests.length,
    accepted: passedCount === tests.length,
  };
}
