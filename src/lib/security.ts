// Security utilities implementing the CIA triad for a local-first application.
// Confidentiality: PBKDF2-SHA256 password hashing with per-user random salt.
// Integrity:        input validation/sanitization + tamper-evident data checks.
// Availability:     deterministic, dependency-free routines that always run locally.

const enc = new TextEncoder();

function bufToHex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function randomSalt(bytes = 16): string {
  const arr = new Uint8Array(bytes);
  crypto.getRandomValues(arr);
  return Array.from(arr)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// PBKDF2-SHA256, 120k iterations. Returns hex digest.
export async function hashPassword(password: string, salt: string): Promise<string> {
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveBits"],
  );
  const bits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: enc.encode(salt),
      iterations: 120000,
      hash: "SHA-256",
    },
    keyMaterial,
    256,
  );
  return bufToHex(bits);
}

// Constant-time string comparison to prevent timing attacks.
export function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

// SHA-256 checksum used for integrity verification of stored datasets.
export async function checksum(data: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", enc.encode(data));
  return bufToHex(digest);
}

export function randomToken(bytes = 32): string {
  const arr = new Uint8Array(bytes);
  crypto.getRandomValues(arr);
  return Array.from(arr)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// ---- Input validation / sanitization (Integrity) ----

export function sanitizeText(input: string): string {
  // Strip control chars and trim. Used before persisting user-supplied text.
  return input.replace(/[\u0000-\u001F\u007F]/g, "").trim();
}

export function validateUsername(name: string): string | null {
  const v = name.trim();
  if (v.length < 3) return "Username must be at least 3 characters.";
  if (v.length > 24) return "Username must be under 24 characters.";
  if (!/^[a-zA-Z0-9_.]+$/.test(v))
    return "Only letters, numbers, dot and underscore allowed.";
  return null;
}

export function validateEmail(email: string): string | null {
  const v = email.trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return "Enter a valid email address.";
  return null;
}

export function passwordStrength(pw: string): {
  score: number;
  label: string;
  issues: string[];
} {
  const issues: string[] = [];
  if (pw.length < 8) issues.push("At least 8 characters");
  if (!/[a-z]/.test(pw)) issues.push("A lowercase letter");
  if (!/[A-Z]/.test(pw)) issues.push("An uppercase letter");
  if (!/[0-9]/.test(pw)) issues.push("A number");
  if (!/[^a-zA-Z0-9]/.test(pw)) issues.push("A symbol");
  const score = 5 - issues.length;
  const label =
    score <= 1 ? "Weak" : score <= 3 ? "Fair" : score === 4 ? "Strong" : "Excellent";
  return { score, label, issues };
}
