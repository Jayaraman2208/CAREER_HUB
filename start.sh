#!/usr/bin/env bash
# ============================================================
#   AI Career Hub - One-Click Launcher (macOS / Linux)
#   Run with:  bash start.sh   (or ./start.sh after chmod +x)
# ============================================================

set -e

echo ""
echo "============================================================"
echo "   AI CAREER HUB - Starting up..."
echo "============================================================"
echo ""

# Check Node.js
if ! command -v node >/dev/null 2>&1; then
  echo "[ERROR] Node.js is not installed."
  echo "Please install Node.js 18+ from https://nodejs.org"
  exit 1
fi

# Install dependencies only the first time
if [ ! -d "node_modules" ]; then
  echo "[1/2] Installing dependencies for the first time..."
  npm install
else
  echo "[1/2] Dependencies already installed. Skipping."
fi

echo ""
echo "[2/2] Launching the app at http://localhost:5173"
echo "Press Ctrl+C to stop."
echo ""

# Try to open the browser automatically (works on macOS and most Linux)
( sleep 3
  if command -v open >/dev/null 2>&1; then open http://localhost:5173
  elif command -v xdg-open >/dev/null 2>&1; then xdg-open http://localhost:5173
  fi ) &

npm run dev
