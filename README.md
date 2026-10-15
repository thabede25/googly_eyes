# 🫐 Bluey — Googly Eyes Companion (Windows & Android)

A lively blueberry character who lives under your screen, points at things with his own cursor, chats with you, and automatically captures meeting notes with speaker diarization.

Adapted from the original concept and redesigned for **Windows 11 / 10** and **Android phones**, with full cross-platform web support.

![Bluey Preview](/public/icon-512.svg)

---

## ⚡ Quick Start (Run in 1 Minute)

### Prerequisites
- **Node.js 18+ or 22** installed on your system ([Download Node.js](https://nodejs.org/)).

### On Windows
Just double-click **`start-windows.bat`** or run in PowerShell / Command Prompt:
```cmd
npm install
npm run dev
```
Open **`http://localhost:3000`** in your browser.

### On Android / Linux / Mac
```bash
npm install
npm run dev
```
Then visit **`http://localhost:3000`** (or your PC's local IP address like `http://192.168.1.X:3000` from your Android phone on the same Wi-Fi).

---

## 📱 How to Install on Android Phone

### Method 1: Progressive Web App (Instant 1-Click Install - Recommended)
1. Open the app URL (`http://<your-pc-ip>:3000` or the hosted URL) in **Chrome** or **Brave** on your Android phone.
2. Tap the **three dots menu (⋮)** in the top right corner.
3. Tap **"Install App"** (or **"Add to Home screen"**).
4. Bluey will be added to your Android app drawer with his custom blueberry icon, running fullscreen without browser bars, with full touch and microphone access!

### Method 2: Android APK with Capacitor (Native App)
If you want to compile a native `.apk`:
```bash
# 1. Install Capacitor
npm install @capacitor/core @capacitor/cli @capacitor/android

# 2. Initialize Capacitor
npx cap init "Bluey" "com.bluey.googlyeyes" --web-dir dist

# 3. Build the web app
npm run build

# 4. Add Android platform & open in Android Studio
npx cap add android
npx cap copy
npx cap open android
```
In **Android Studio**, click **Build > Build Bundle(s) / APK(s) > Build APK(s)**, then install on your device via USB (`adb install app-debug.apk`).

---

## 🪟 How to Install on Windows PC

### Method 1: Desktop PWA App (via Edge or Chrome)
1. Open `http://localhost:3000` in **Microsoft Edge** or **Google Chrome**.
2. Look at the address bar and click the **"App Available - Install Bluey"** icon (or click Menu `...` > **Apps > Install this site as an app**).
3. Check **"Pin to taskbar"** and **"Create Desktop shortcut"**.
4. Bluey now opens like a native Windows application with its own window, taskbar icon, and tray integration!

### Method 2: 1-Click Desktop Shortcut
Right-click on **`start-windows.bat`** > **Send to > Desktop (create shortcut)**. You can now launch Bluey with a single click anytime.

---

## 🎮 How to Interact with Bluey

### Character Interactions on Android Phone:
- **Tap & Hold Bluey's Face**: Mic turns on, Bluey listens attentively. Release your finger to ask your question; Bluey chirps and his answer appears in a speech bubble!
- **Double Tap Bluey**: Toggles between awake (listening / following mode) and sleep (peaceful slumber with floating Zs).
- **Touch & Drag**: Bluey's eyes and head smoothly follow your finger with realistic damped spring physics.
- **Cheer Him Up**: Double-tapping or asking him questions makes his cheeks blush rosy pink!

### Windows PC Desktop Hotkeys:
| Hotkey | Action |
| --- | --- |
| **`Alt + Space`** | Wake Bluey up or put him to sleep |
| **`Ctrl + Alt + F`** | Toggle Follow Mouse on/off |
| **`Ctrl + Alt + P`** | Fly cursor to mouse position and point there |
| **`Ctrl + Alt + D`** | Dock Bluey at the bottom of the screen |
| **`Ctrl + Alt + T`** | Talk Test (Bluey bounces with happy chirps) |
| **`Ctrl + Alt + S`** | **Emergency Stop**: Immediately halts any automated actions |

---

## 🎙️ Meeting Notes & Sessions

While you use your PC, Bluey records your discussions in **5-minute audio chunks**:
- **Diarization**: Distinguishes between speakers (`Speaker 1`, `Speaker 2`, `Bluey`).
- **Markdown Notes**: Summarizes key decisions and generates an action checklist.
- **Copy Prompt for Agent**: Generates a ready-to-run prompt referencing `notes.md` and `session.json` for external LLM agents.
- **Export**: Download `notes.md` directly with one click.

---

## 🛡️ Built-in Guardrails for Computer Control

Bluey comes equipped with strict safety constraints:
1. **Never acts unprompted**: Only initiates actions when explicitly commanded.
2. **Confirms destructive actions**: Asks verbally before irreversible operations.
3. **Password & Form Protection**: Automatically ignores password, PIN, and sensitive credential fields.
4. **Emergency Stop (`Ctrl + Alt + S`)**: Instant kill-switch halts all cursor movements and key automation.

---

## 🛠️ Project Structure

```
├── public/                 # PWA icons, manifest.json
│   ├── icon-192.svg
│   ├── icon-512.svg
│   └── manifest.json
├── src/
│   ├── components/
│   │   ├── AndroidPhoneView.tsx      # Android phone frame, gestures, speech
│   │   ├── WindowsDesktopView.tsx    # Windows 11 desktop, taskbar, system tray
│   │   ├── MacDesktopSimulation.tsx  # Mac legacy desktop simulation
│   │   ├── FaceCanvas.tsx            # Damped spring math, vector eyelids & eyes
│   │   ├── SessionDrawer.tsx         # Meeting transcripts & audio player
│   │   ├── ComputerControlModal.tsx  # Guardrails & automation audit log
│   │   └── InstallGuideModal.tsx     # In-app setup & installation guide
│   ├── utils/
│   │   ├── audio.ts                  # Web Audio synthesizer for cartoon chirps
│   │   └── spring.ts                 # Damped spring physics engine
│   ├── types.ts                      # Shared types & color palette
│   ├── App.tsx                       # Main orchestrator & dual mode view
│   ├── main.tsx                      # App entry point
│   └── index.css                     # Tailwind CSS v4 styling
├── package.json                      # Scripts and dependencies
├── vite.config.ts                    # Vite build configuration
├── start-windows.bat                 # 1-click Windows starter
├── start-unix.sh                     # 1-click Unix/Mac starter
└── README.md                         # Documentation
```

---

## 📄 License

Public domain under [the Unlicense](LICENSE). Feel free to use, modify, and build upon it!
