// Local-first database layer. All data lives in the browser's localStorage on
// THIS machine — nothing is sent to any server except code sent to the chosen
// online compiler for execution. Provides Availability (offline) + a backup/
// restore mechanism, and Integrity (namespaced, validated writes).

import {
  PROBLEMS,
  APTITUDE,
  INTERVIEW,
  NOTES,
  SEED_VERSION,
  type Problem,
  type AptQuestion,
  type InterviewQ,
  type Note,
} from "./seed";

const NS = "aich:"; // namespace to avoid collisions

const KEYS = {
  users: NS + "users",
  session: NS + "session",
  problems: NS + "problems",
  aptitude: NS + "aptitude",
  interview: NS + "interview",
  notes: NS + "notes",
  submissions: NS + "submissions",
  aptAttempts: NS + "aptAttempts",
  seedVersion: NS + "seedVersion",
};

export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  salt: string;
  passwordHash: string;
  role: "user" | "admin";
  createdAt: number;
  coins: number;
  solved: string[]; // problem ids solved
  aptCorrect: string[]; // aptitude ids answered correctly
  streak: number;
  lastActive: number;
  plan: "Free" | "Pro" | "Premium";
}

export interface Submission {
  id: string;
  userId: string;
  problemId: string;
  language: string;
  code: string;
  status: "Accepted" | "Wrong Answer" | "Error";
  passed: number;
  total: number;
  at: number;
}

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

// Seed content on first run or when the seed version changes.
export function initDB(): void {
  const v = read<number>(KEYS.seedVersion, 0);
  if (v < SEED_VERSION) {
    write(KEYS.problems, PROBLEMS);
    write(KEYS.aptitude, APTITUDE);
    write(KEYS.interview, INTERVIEW);
    write(KEYS.notes, NOTES);
    write(KEYS.seedVersion, SEED_VERSION);
  }
  if (!localStorage.getItem(KEYS.users)) write(KEYS.users, []);
  if (!localStorage.getItem(KEYS.submissions)) write(KEYS.submissions, []);
}

// ---- Users ----
export const getUsers = () => read<User[]>(KEYS.users, []);
export const saveUsers = (u: User[]) => write(KEYS.users, u);
export function getUserById(id: string): User | undefined {
  return getUsers().find((u) => u.id === id);
}
export function getUserByName(name: string): User | undefined {
  return getUsers().find(
    (u) => u.username.toLowerCase() === name.toLowerCase(),
  );
}
export function upsertUser(user: User): void {
  const users = getUsers();
  const idx = users.findIndex((u) => u.id === user.id);
  if (idx >= 0) users[idx] = user;
  else users.push(user);
  saveUsers(users);
}
export function deleteUser(id: string): void {
  saveUsers(getUsers().filter((u) => u.id !== id));
}

// ---- Session ----
export const getSession = () => read<{ userId: string; token: string } | null>(KEYS.session, null);
export const setSession = (s: { userId: string; token: string } | null) =>
  s ? write(KEYS.session, s) : localStorage.removeItem(KEYS.session);

// ---- Content ----
export const getProblems = () => read<Problem[]>(KEYS.problems, PROBLEMS);
export const saveProblems = (p: Problem[]) => write(KEYS.problems, p);
export const getProblem = (id: string) => getProblems().find((p) => p.id === id);

export const getAptitude = () => read<AptQuestion[]>(KEYS.aptitude, APTITUDE);
export const saveAptitude = (a: AptQuestion[]) => write(KEYS.aptitude, a);

export const getInterview = () => read<InterviewQ[]>(KEYS.interview, INTERVIEW);
export const getNotes = () => read<Note[]>(KEYS.notes, NOTES);

// ---- Submissions ----
export const getSubmissions = () => read<Submission[]>(KEYS.submissions, []);
export function addSubmission(s: Submission): void {
  const subs = getSubmissions();
  subs.unshift(s);
  write(KEYS.submissions, subs.slice(0, 500));
}
export const getUserSubmissions = (userId: string) =>
  getSubmissions().filter((s) => s.userId === userId);

// ---- Backup / Restore (Availability) ----
export function exportData(): string {
  const dump: Record<string, unknown> = {};
  Object.values(KEYS).forEach((k) => {
    const v = localStorage.getItem(k);
    if (v) dump[k] = JSON.parse(v);
  });
  return JSON.stringify({ exportedAt: Date.now(), data: dump }, null, 2);
}
export function importData(json: string): boolean {
  try {
    const parsed = JSON.parse(json);
    const data = parsed.data as Record<string, unknown>;
    Object.entries(data).forEach(([k, v]) => {
      if (Object.values(KEYS).includes(k)) write(k, v);
    });
    return true;
  } catch {
    return false;
  }
}

export function resetAll(): void {
  Object.values(KEYS).forEach((k) => localStorage.removeItem(k));
  initDB();
}

export { KEYS };
