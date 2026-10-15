#!/usr/bin/env bash
set -e

echo "========================================================"
echo "  Starting Bluey (Windows & Android Companion)"
echo "========================================================"

if ! command -v node >/dev/null 2>&1; then
    echo "[ERROR] Node.js is not installed. Please install Node 18+ from https://nodejs.org"
    exit 1
fi

if [ ! -d "node_modules" ]; then
    echo "Installing packages..."
    npm install
fi

echo "Starting on http://localhost:3000 ..."
npm run dev
