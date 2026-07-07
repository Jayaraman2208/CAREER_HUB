import { Link } from "react-router-dom";
import { Button } from "../components/ui";

const FEATURES = [
  { icon: "💻", title: "Coding Arena", desc: "12+ curated problems with real online-compiler judging across 5 languages." },
  { icon: "🧠", title: "Aptitude Trainer", desc: "Quant, logical & verbal questions — each with multiple solving methods & shortcuts." },
  { icon: "🎤", title: "AI Mock Interview", desc: "Company-wise technical, behavioral & HR questions with model answers." },
  { icon: "⚡", title: "Online Compiler", desc: "Run Python, JavaScript, C, C++ & Java with custom input — instantly." },
  { icon: "📄", title: "Resume Builder", desc: "Live-preview resume builder you can print or export to PDF." },
  { icon: "🔒", title: "Secure & Local", desc: "PBKDF2-hashed passwords. All your data is stored on your own machine." },
];

export default function Landing() {
  return (
    <div className="grid-bg min-h-screen">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-indigo-500 text-lg font-black text-white">
            A
          </div>
          <span className="text-lg font-bold text-white">AI Career Hub</span>
        </div>
        <div className="flex gap-3">
          <Link to="/login">
            <Button variant="outline">Login</Button>
          </Link>
          <Link to="/register">
            <Button>Get Started</Button>
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 pb-20 pt-16 text-center">
        <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-500/10 px-4 py-1.5 text-sm text-cyan-300">
          🚀 Your local-first placement preparation platform
        </div>
        <h1 className="mx-auto max-w-3xl text-4xl font-black leading-tight tracking-tight text-white sm:text-6xl">
          Crack your{" "}
          <span className="bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent neon-text">
            dream placement
          </span>{" "}
          with one platform
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400">
          Practice coding with a real online compiler, master aptitude with
          multiple methods, ace mock interviews, and build your resume — all
          running locally with secure, private data storage.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link to="/register">
            <Button className="px-8 py-3 text-base">Start Practicing Free →</Button>
          </Link>
          <Link to="/login">
            <Button variant="outline" className="px-8 py-3 text-base">
              I have an account
            </Button>
          </Link>
        </div>
        <p className="mt-4 text-xs text-slate-500">
          Admin demo: <span className="text-slate-300">admin / Admin@2208</span>
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="glass rounded-2xl p-6 transition hover:border-cyan-400/30 hover:shadow-xl hover:shadow-cyan-500/5"
            >
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 text-2xl">
                {f.icon}
              </div>
              <h3 className="mb-2 text-lg font-bold text-white">{f.title}</h3>
              <p className="text-sm text-slate-400">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-white/10 py-8 text-center text-sm text-slate-500">
        AI Career Hub · Local Edition · Built with React, Vite & Tailwind ·
        Secure by design (CIA triad)
      </footer>
    </div>
  );
}
