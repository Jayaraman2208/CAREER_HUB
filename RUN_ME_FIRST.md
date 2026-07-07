# ▶️ How to Run AI Career Hub in VS Code

You only need **Node.js 18+** installed. Get it free from <https://nodejs.org>
(pick the "LTS" version) if you don't have it.

---

## ✅ Option 1 — The 2-command way (recommended)

1. Open this project folder in **VS Code**.
2. Open the terminal: menu **Terminal → New Terminal** (or press `` Ctrl + ` ``).
3. Type these two commands:

```bash
npm install
npm run dev
```

4. Hold **Ctrl** and click the `http://localhost:5173` link that appears in the
   terminal. The app opens in your browser. Done! 🎉

> After the first time, you can skip `npm install` and just run `npm run dev`.

---

## ✅ Option 2 — One-click (no typing)

- **Windows:** double-click **`start.bat`**
- **macOS / Linux:** run `bash start.sh` in the terminal

These scripts auto-install dependencies (first run only) and open your browser
for you.

---

## ✅ Option 3 — VS Code "Run Task" button

1. Press `Ctrl + Shift + P` → type **"Run Task"** → press Enter.
2. Choose **"Start app (dev server)"**.

(The first time, run the **"Install dependencies"** task once.)

---

## 🔑 Logging in

- Create your own account with the **Get Started** button, **or**
- Use the built-in admin account:
  - **Username:** `admin`
  - **Password:** `Admin@2208`

---

## 📦 Want to deploy / share it?

```bash
npm run build
```

This creates a single self-contained file at **`dist/index.html`**.
Upload the `dist/` folder to **Netlify, Vercel, GitHub Pages**, or any static
host — or just open `dist/index.html` in a browser.

---

## ❓ Troubleshooting

| Problem | Fix |
| --- | --- |
| `npm: command not found` | Install Node.js from nodejs.org, then restart VS Code. |
| Port 5173 is busy | Stop the other app, or Vite will pick the next free port — read the terminal URL. |
| Code won't run / "Network error" in compiler | The online compiler needs internet access. Check your connection. |
| Page is blank | Make sure you opened the exact URL printed in the terminal. |

Enjoy! 🚀
