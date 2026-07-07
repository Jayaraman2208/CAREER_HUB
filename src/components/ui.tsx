import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "../utils/cn";

export function Button({
  children,
  variant = "primary",
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "outline" | "danger" | "success";
}) {
  const variants: Record<string, string> = {
    primary:
      "bg-gradient-to-r from-cyan-500 to-indigo-500 text-white hover:from-cyan-400 hover:to-indigo-400 shadow-lg shadow-cyan-500/20",
    success:
      "bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-400 hover:to-teal-400 shadow-lg shadow-emerald-500/20",
    danger:
      "bg-gradient-to-r from-rose-500 to-red-500 text-white hover:from-rose-400 hover:to-red-400",
    outline:
      "border border-white/15 text-slate-200 hover:bg-white/5",
    ghost: "text-slate-300 hover:bg-white/5",
  };
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-50",
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function Card({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("glass rounded-2xl p-5", className)}>{children}</div>
  );
}

export function Badge({
  children,
  color = "slate",
}: {
  children: ReactNode;
  color?: "slate" | "green" | "amber" | "red" | "cyan" | "violet";
}) {
  const colors: Record<string, string> = {
    slate: "bg-slate-500/15 text-slate-300 border-slate-400/20",
    green: "bg-emerald-500/15 text-emerald-300 border-emerald-400/20",
    amber: "bg-amber-500/15 text-amber-300 border-amber-400/20",
    red: "bg-rose-500/15 text-rose-300 border-rose-400/20",
    cyan: "bg-cyan-500/15 text-cyan-300 border-cyan-400/20",
    violet: "bg-violet-500/15 text-violet-300 border-violet-400/20",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        colors[color],
      )}
    >
      {children}
    </span>
  );
}

export function diffColor(d: string): "green" | "amber" | "red" {
  return d === "Easy" ? "green" : d === "Medium" ? "amber" : "red";
}

export function Input({
  label,
  error,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
}) {
  return (
    <label className="block">
      {label && (
        <span className="mb-1.5 block text-sm font-medium text-slate-300">
          {label}
        </span>
      )}
      <input
        className={cn(
          "w-full rounded-xl border border-white/10 bg-black/30 px-4 py-2.5 text-sm text-slate-100 outline-none transition focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20",
          error && "border-rose-400/50",
        )}
        {...props}
      />
      {error && <span className="mt-1 block text-xs text-rose-400">{error}</span>}
    </label>
  );
}

export function Stat({
  label,
  value,
  icon,
}: {
  label: string;
  value: ReactNode;
  icon: string;
}) {
  return (
    <Card className="flex items-center gap-4">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 text-2xl">
        {icon}
      </div>
      <div>
        <div className="text-2xl font-bold text-white">{value}</div>
        <div className="text-xs text-slate-400">{label}</div>
      </div>
    </Card>
  );
}

export function SectionTitle({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
        {title}
      </h1>
      {subtitle && <p className="mt-1 text-slate-400">{subtitle}</p>}
    </div>
  );
}
