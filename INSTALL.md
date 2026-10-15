# Bluey Installation Guide

Step-by-step instructions to get Bluey running on **Windows**, **Android**, and the **Web**.

---

## 🚀 Option 1: Run on Windows in 1 Minute

### Method A: Quick Start via Batch File
1. Download or clone this repository.
2. Ensure you have [Node.js](https://nodejs.org/) installed (v18 or v22).
3. Double-click **`start-windows.bat`**.
4. That's it! It will automatically install packages, start the dev server, and open your browser at `http://localhost:3000`.

### Method B: Install as a Native Windows App (PWA)
1. In Microsoft Edge or Google Chrome, navigate to `http://localhost:3000`.
2. Click the **Install** icon in the right side of the URL bar (looks like a screen with a down arrow).
3. Click **Install**.
4. Check **"Pin to Taskbar"** and **"Start menu shortcut"**.
5. Bluey now runs inside its own frameless window just like a regular Windows software executable!

---

## 📱 Option 2: Install on Android Phone

### Method A: Install as a Fullscreen Android App (PWA)
1. On your Android phone, connect to the same Wi-Fi network as your computer (or use the hosted URL).
2. Open **Chrome** or **Brave** and navigate to your PC's IP address (e.g., `http://192.168.1.105:3000`).
3. Tap the **Three Dots Menu (⋮)** in the top right.
4. Tap **"Install app"** or **"Add to Home screen"**.
5. Bluey will now appear on your home screen with his blueberry app icon!
6. When opened from your home screen, it runs completely standalone (no URL bar, full screen, responsive landscape/portrait orientation).

### Method B: Build an Android APK with Capacitor
For developers who want a `.apk` file:
```bash
npm install @capacitor/core @capacitor/cli @capacitor/android
npx cap init "Bluey" "com.bluey.googlyeyes" --web-dir dist
npm run build
npx cap add android
npx cap open android
```
In Android Studio:
1. Select **Build > Build Bundle(s) / APK(s) > Build APK(s)**.
2. Locate `app-debug.apk` in `android/app/build/outputs/apk/debug/`.
3. Transfer to your Android phone or run `adb install app-debug.apk`.

---

## ⌨️ Windows Hotkeys Cheatsheet

Once running on your Windows PC, you can use these shortcuts anywhere:

- **`Alt + Space`**: Toggle between awake (listening) and asleep (resting).
- **`Ctrl + Alt + F`**: Toggle follow mouse (Bluey's big cursor tracks your pointer).
- **`Ctrl + Alt + P`**: Fly to your current mouse position and point there.
- **`Ctrl + Alt + D`**: Send Bluey home to dock at the bottom edge of the screen.
- **`Ctrl + Alt + T`**: Talk bounce test (happy chirps and hop animation).
- **`Ctrl + Alt + S`**: **Emergency Stop** (immediately halts all PC automated actions).

---

## ❓ Troubleshooting

- **Node.js not recognized?**
  Download and install Node.js from [nodejs.org](https://nodejs.org/). Make sure to check the box "Add to PATH" during installation.
- **Port 3000 already in use?**
  You can run on a different port:
  `npx vite --port 3001`
- **Microphone not working on Android?**
  Ensure you grant microphone permission in Chrome when prompted.
