import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  getSession,
  setSession,
  getUserById,
  getUserByName,
  upsertUser,
  getUsers,
  initDB,
  type User,
} from "../lib/db";
import {
  hashPassword,
  randomSalt,
  randomToken,
  safeEqual,
  sanitizeText,
  validateEmail,
  validateUsername,
} from "../lib/security";

// Admin bootstrap credentials (created on first run).
const ADMIN_USER = "admin";
const ADMIN_PASS = "Admin@2208";

interface AuthCtx {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<string | null>;
  register: (data: {
    username: string;
    email: string;
    fullName: string;
    password: string;
  }) => Promise<string | null>;
  logout: () => void;
  refresh: () => void;
}

const Ctx = createContext<AuthCtx>(null as unknown as AuthCtx);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  async function bootstrapAdmin() {
    if (getUsers().length === 0 && !getUserByName(ADMIN_USER)) {
      const salt = randomSalt();
      const passwordHash = await hashPassword(ADMIN_PASS, salt);
      upsertUser({
        id: "admin-" + randomToken(8),
        username: ADMIN_USER,
        email: "admin@careerhub.local",
        fullName: "Platform Administrator",
        salt,
        passwordHash,
        role: "admin",
        createdAt: Date.now(),
        coins: 0,
        solved: [],
        aptCorrect: [],
        streak: 0,
        lastActive: Date.now(),
        plan: "Premium",
      });
    }
  }

  useEffect(() => {
    initDB();
    bootstrapAdmin().then(() => {
      const session = getSession();
      if (session) {
        const u = getUserById(session.userId);
        if (u) setUser(u);
      }
      setLoading(false);
    });
  }, []);

  function refresh() {
    const session = getSession();
    if (session) {
      const u = getUserById(session.userId);
      setUser(u ?? null);
    }
  }

  async function login(username: string, password: string): Promise<string | null> {
    const u = getUserByName(sanitizeText(username));
    if (!u) return "Invalid username or password.";
    const hash = await hashPassword(password, u.salt);
    if (!safeEqual(hash, u.passwordHash)) return "Invalid username or password.";
    // update streak / activity
    const today = new Date().toDateString();
    const last = new Date(u.lastActive).toDateString();
    if (today !== last) {
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      u.streak = last === yesterday ? u.streak + 1 : 1;
    }
    u.lastActive = Date.now();
    upsertUser(u);
    setSession({ userId: u.id, token: randomToken() });
    setUser(u);
    return null;
  }

  async function register(data: {
    username: string;
    email: string;
    fullName: string;
    password: string;
  }): Promise<string | null> {
    const uErr = validateUsername(data.username);
    if (uErr) return uErr;
    const eErr = validateEmail(data.email);
    if (eErr) return eErr;
    if (data.password.length < 8) return "Password must be at least 8 characters.";
    if (getUserByName(data.username)) return "Username already taken.";
    if (getUsers().some((u) => u.email.toLowerCase() === data.email.toLowerCase()))
      return "Email already registered.";

    const salt = randomSalt();
    const passwordHash = await hashPassword(data.password, salt);
    const newUser: User = {
      id: "u-" + randomToken(8),
      username: sanitizeText(data.username),
      email: sanitizeText(data.email),
      fullName: sanitizeText(data.fullName) || data.username,
      salt,
      passwordHash,
      role: "user",
      createdAt: Date.now(),
      coins: 100,
      solved: [],
      aptCorrect: [],
      streak: 1,
      lastActive: Date.now(),
      plan: "Free",
    };
    upsertUser(newUser);
    setSession({ userId: newUser.id, token: randomToken() });
    setUser(newUser);
    return null;
  }

  function logout() {
    setSession(null);
    setUser(null);
  }

  return (
    <Ctx.Provider value={{ user, loading, login, register, logout, refresh }}>
      {children}
    </Ctx.Provider>
  );
}

export const useAuth = () => useContext(Ctx);
