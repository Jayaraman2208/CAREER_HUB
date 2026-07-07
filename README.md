# 🚀 AI Career Hub — Local Edition

A complete, production-ready **placement preparation platform** that runs entirely
on your own machine. Practice coding with a **real online compiler**, train
aptitude with **multiple solving methods**, do **mock interviews**, build your
**resume**, and track progress on a **leaderboard** — all secured with proper
authentication and stored **locally in your browser** (your data never leaves
your machine, except code sent to the compiler for execution).

---

## ✨ Features

| Module | What it does |
| --- | --- |
| 🏠 Dashboard | Progress snapshot: solved, coins, streak, recent submissions |
| 💻 Coding Arena | 12+ problems, judged for real via the online compiler (Python, JS, C, C++, Java) |
| 🧠 Aptitude Trainer | Quant / Logical / Verbal questions, each with **multiple solving methods** |
| 🎤 AI Mock Interview | Company-wise technical, behavioral, HR & system-design questions with model answers |
| ⚡ Online Compiler | Run code in 5 languages with custom stdin |
| 📄 Resume Builder | Live-preview builder → print / save as PDF |
| 📖 Study Notes | Company-specific preparation strategies |
| 🏆 Leaderboard | Ranked by coins, problems solved & streak |
| 💎 Subscription | Free / Pro / Premium plans + enterprise packages |
| 👑 Admin Panel | Manage users, content, plans, and full data backup/restore |

---

## 🖥️ Run it in VS Code (simple commands)

> Requires **Node.js 18+**. Open this folder in VS Code, then open a terminal
> (`Ctrl + ~`) and run:

```bash
# 1. Install dependencies (first time only)
npm install

# 2. Start the development server
npm run dev
```

Open the printed URL (usually `http://localhost:5173`).

**Default admin account** (created automatically on first run):

```
username: admin
password: Admin@2208
```

Register your own user account from the **Get Started** button.

---

## 📦 Build & Deploy (host it anywhere)

```bash
# Produce a single self-contained file in dist/
npm run build

# Preview the production build locally
npm run preview
```

The build outputs **`dist/index.html`** — a single, fully self-contained file.
You can host it for free on any static host:

- **Netlify / Vercel / GitHub Pages / Cloudflare Pages** — just drop the `dist/`
  folder.
- Or simply open `dist/index.html` in a browser — it works offline (except live
  code execution, which needs internet).

---

## 🔒 Security — the CIA Triad

This project follows **secure coding** practices around the CIA triad:

- **Confidentiality** — passwords are never stored in plain text. They are hashed
  with **PBKDF2-SHA256** (120,000 iterations) and a unique random salt per user
  (see `src/lib/security.ts`). Login uses a **constant-time comparison** to
  prevent timing attacks.
- **Integrity** — all user input is **validated and sanitized** before being
  stored (username/email/password rules, control-character stripping). Data is
  namespaced in storage, and coding submissions are verified by running them
  against hidden test cases.
- **Availability** — the app is **local-first** and works offline. The admin
  panel provides **export / import / reset** so you can back up and restore all
  data at any time.

> Note: For a public multi-user production deployment, move authentication and
> data to a server-side database. This edition is designed for a **local /
> single-machine** experience as requested.

---

## 🧱 Tech Stack

- **React 19** + **TypeScript**
- **Vite 7** (single-file build) + **Tailwind CSS v4**
- **react-router-dom** (hash routing for static hosting)
- **Piston API** (free public online code execution engine)
- **localStorage** as the local database + **Web Crypto API** for hashing

---

## 📁 Project Structure

```
src/
├── App.tsx                 # Routing + protected routes
├── context/AuthContext.tsx # Secure auth (PBKDF2, sessions)
├── lib/
│   ├── security.ts         # CIA: hashing, validation, integrity
│   ├── db.ts               # Local database (localStorage) + backup
│   ├── seed.ts             # Problems, aptitude, interview, notes
│   └── piston.ts           # Online compiler + judging
├── components/             # Layout, UI kit, code editor
└── pages/                  # All feature pages
```

Enjoy building your career! 🎯
