import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button, Input } from "../components/ui";
import { passwordStrength } from "../lib/security";

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid-bg flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <Link
          to="/"
          className="mb-6 flex items-center justify-center gap-2 text-white"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-indigo-500 text-lg font-black">
            A
          </div>
          <span className="text-lg font-bold">AI Career Hub</span>
        </Link>
        <div className="glass rounded-2xl p-7">{children}</div>
      </div>
    </div>
  );
}

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const err = await login(username, password);
    setBusy(false);
    if (err) setError(err);
    else navigate("/app");
  }

  return (
    <Shell>
      <h1 className="mb-1 text-2xl font-bold text-white">Welcome back</h1>
      <p className="mb-6 text-sm text-slate-400">
        Login to continue your preparation.
      </p>
      <form onSubmit={submit} className="space-y-4">
        <Input
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="your_username"
          autoComplete="username"
        />
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          autoComplete="current-password"
        />
        {error && (
          <div className="rounded-lg bg-rose-500/10 px-3 py-2 text-sm text-rose-300">
            {error}
          </div>
        )}
        <Button type="submit" className="w-full" disabled={busy}>
          {busy ? "Verifying…" : "Login"}
        </Button>
      </form>
      <p className="mt-5 text-center text-sm text-slate-400">
        No account?{" "}
        <Link to="/register" className="text-cyan-400 hover:underline">
          Register
        </Link>
      </p>
    </Shell>
  );
}

export function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const strength = passwordStrength(form.password);

  function set(k: string, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const err = await register(form);
    setBusy(false);
    if (err) setError(err);
    else navigate("/app");
  }

  return (
    <Shell>
      <h1 className="mb-1 text-2xl font-bold text-white">Create your account</h1>
      <p className="mb-6 text-sm text-slate-400">
        Start your placement journey today.
      </p>
      <form onSubmit={submit} className="space-y-4">
        <Input
          label="Full name"
          value={form.fullName}
          onChange={(e) => set("fullName", e.target.value)}
          placeholder="Jane Doe"
        />
        <Input
          label="Username"
          value={form.username}
          onChange={(e) => set("username", e.target.value)}
          placeholder="jane_doe"
        />
        <Input
          label="Email"
          type="email"
          value={form.email}
          onChange={(e) => set("email", e.target.value)}
          placeholder="jane@example.com"
        />
        <div>
          <Input
            label="Password"
            type="password"
            value={form.password}
            onChange={(e) => set("password", e.target.value)}
            placeholder="At least 8 characters"
          />
          {form.password && (
            <div className="mt-2">
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                <div
                  className={
                    "h-full transition-all " +
                    (strength.score <= 1
                      ? "w-1/5 bg-rose-500"
                      : strength.score <= 3
                        ? "w-3/5 bg-amber-500"
                        : "w-full bg-emerald-500")
                  }
                />
              </div>
              <div className="mt-1 text-xs text-slate-400">
                Strength: <span className="text-slate-200">{strength.label}</span>
                {strength.issues.length > 0 &&
                  ` · Needs: ${strength.issues.join(", ")}`}
              </div>
            </div>
          )}
        </div>
        {error && (
          <div className="rounded-lg bg-rose-500/10 px-3 py-2 text-sm text-rose-300">
            {error}
          </div>
        )}
        <Button type="submit" className="w-full" disabled={busy}>
          {busy ? "Creating…" : "Create account"}
        </Button>
      </form>
      <p className="mt-5 text-center text-sm text-slate-400">
        Already registered?{" "}
        <Link to="/login" className="text-cyan-400 hover:underline">
          Login
        </Link>
      </p>
    </Shell>
  );
}
