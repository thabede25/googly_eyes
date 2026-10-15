import React, { useState } from 'react';
import {
  X,
  Smartphone,
  Monitor,
  Download,
  Terminal,
  Copy,
  Check,
  Sparkles,
  Layers,
  ArrowRight,
  ExternalLink,
  BookOpen
} from 'lucide-react';
import { playChirp } from '../utils/audio';

interface InstallGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstallGuideModal: React.FC<InstallGuideModalProps> = ({ isOpen, onClose }) => {
  const [tab, setTab] = useState<'quick' | 'windows' | 'android' | 'hotkeys'>('quick');
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(id);
    playChirp('chirp');
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-[#1a1727] border border-white/15 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-white">
        
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-[#141220]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#6C86F5] to-[#A9BCFF] flex items-center justify-center text-xl shadow">
              🫐
            </div>
            <div>
              <h2 className="font-fredoka text-xl text-white">Installation & Setup Guide</h2>
              <p className="text-xs text-white/50">Run Bluey on Windows, Android, and the Web</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-white/10 text-white/50 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 p-2 bg-[#171424] border-b border-white/10 text-xs overflow-x-auto">
          <button
            onClick={() => setTab('quick')}
            className={`px-3.5 py-2 rounded-xl font-medium transition flex items-center gap-1.5 shrink-0 ${
              tab === 'quick' ? 'bg-[#4254D6] text-white shadow' : 'text-white/60 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            Quick Start (1 Min)
          </button>

          <button
            onClick={() => setTab('windows')}
            className={`px-3.5 py-2 rounded-xl font-medium transition flex items-center gap-1.5 shrink-0 ${
              tab === 'windows' ? 'bg-[#4254D6] text-white shadow' : 'text-white/60 hover:text-white'
            }`}
          >
            <Monitor className="w-3.5 h-3.5 text-[#A9BCFF]" />
            Windows PC Setup
          </button>

          <button
            onClick={() => setTab('android')}
            className={`px-3.5 py-2 rounded-xl font-medium transition flex items-center gap-1.5 shrink-0 ${
              tab === 'android' ? 'bg-[#4254D6] text-white shadow' : 'text-white/60 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5 text-[#5BE49B]" />
            Android Phone App
          </button>

          <button
            onClick={() => setTab('hotkeys')}
            className={`px-3.5 py-2 rounded-xl font-medium transition flex items-center gap-1.5 shrink-0 ${
              tab === 'hotkeys' ? 'bg-[#4254D6] text-white shadow' : 'text-white/60 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-rose-300" />
            Hotkeys & Gestures
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm">
          {/* Quick Start */}
          {tab === 'quick' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-[#2B2F8F]/40 to-[#6C86F5]/20 border border-[#6C86F5]/30">
                <h3 className="font-fredoka text-lg text-[#A9BCFF] mb-1">
                  Run Bluey in 3 simple steps
                </h3>
                <p className="text-xs text-white/70">
                  Runs directly on your computer or mobile browser with zero complicated compilation tools.
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white text-xs flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#6C86F5] text-white flex items-center justify-center text-[11px] font-bold">1</span>
                      Clone or Download Repository
                    </span>
                  </div>
                  <div className="flex items-center justify-between bg-[#100e19] px-3.5 py-2.5 rounded-xl border border-white/10 font-plex-mono text-xs">
                    <span className="text-white/80">git clone https://github.com/thabede25/googly_eyes.git</span>
                    <button
                      onClick={() => copyToClipboard('git clone https://github.com/thabede25/googly_eyes.git', 'clone')}
                      className="p-1 hover:text-[#A9BCFF] text-white/40 transition"
                      title="Copy"
                    >
                      {copiedCmd === 'clone' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white text-xs flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#6C86F5] text-white flex items-center justify-center text-[11px] font-bold">2</span>
                      Double Click or Run Development Server
                    </span>
                  </div>
                  <div className="text-xs text-white/60 mb-1">
                    On Windows, double-click <code className="text-[#A9BCFF]">start-windows.bat</code>. Or run:
                  </div>
                  <div className="flex items-center justify-between bg-[#100e19] px-3.5 py-2.5 rounded-xl border border-white/10 font-plex-mono text-xs">
                    <span className="text-white/80">npm install && npm run dev</span>
                    <button
                      onClick={() => copyToClipboard('npm install && npm run dev', 'npm')}
                      className="p-1 hover:text-[#A9BCFF] text-white/40 transition"
                      title="Copy"
                    >
                      {copiedCmd === 'npm' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white text-xs flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#6C86F5] text-white flex items-center justify-center text-[11px] font-bold">3</span>
                      Open in Browser
                    </span>
                  </div>
                  <div className="flex items-center justify-between bg-[#100e19] px-3.5 py-2.5 rounded-xl border border-white/10 font-plex-mono text-xs">
                    <span className="text-[#5BE49B]">http://localhost:3000</span>
                    <a
                      href="http://localhost:3000"
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-[#A9BCFF] hover:underline flex items-center gap-1"
                    >
                      Open <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Windows Setup */}
          {tab === 'windows' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#131d36]/60 border border-[#6C86F5]/30">
                <h3 className="font-fredoka text-lg text-[#A9BCFF] mb-1">
                  Windows 11 / 10 Native App Setup
                </h3>
                <p className="text-xs text-white/70">
                  Run Bluey in an independent, frameless desktop window with Windows taskbar shortcuts.
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                  <h4 className="font-bold text-white text-sm mb-1.5 flex items-center gap-2">
                    <span>🌟 Method 1: Install as a Windows Desktop PWA (Recommended)</span>
                  </h4>
                  <ol className="list-decimal list-inside space-y-1.5 text-xs text-white/80 leading-relaxed">
                    <li>Open <code className="text-[#A9BCFF]">http://localhost:3000</code> in **Microsoft Edge** or **Google Chrome**.</li>
                    <li>Click the **Install Icon** at the right end of your address bar (or Menu &gt; Apps &gt; Install Bluey).</li>
                    <li>Check **"Pin to Taskbar"** and **"Create Desktop Shortcut"**.</li>
                    <li>Bluey now runs directly as a desktop app with full hotkey support!</li>
                  </ol>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                  <h4 className="font-bold text-white text-sm mb-1.5 flex items-center gap-2">
                    <span>⚡ Method 2: Double-Click Batch Launcher</span>
                  </h4>
                  <p className="text-xs text-white/80 leading-relaxed mb-2">
                    The root directory includes a ready-to-run Windows script <code className="text-[#A9BCFF]">start-windows.bat</code>.
                  </p>
                  <div className="text-xs text-white/60">
                    Right click <strong>start-windows.bat</strong> &gt; <strong>Send to</strong> &gt; <strong>Desktop (create shortcut)</strong> to put a launcher directly on your desktop!
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Android Setup */}
          {tab === 'android' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#162722]/60 border border-emerald-500/30">
                <h3 className="font-fredoka text-lg text-[#5BE49B] mb-1">
                  Android Phone Companion Installation
                </h3>
                <p className="text-xs text-white/70">
                  Put Bluey on your Android phone resting under your PC monitor!
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                  <h4 className="font-bold text-white text-sm mb-1.5">
                    📱 Method 1: Install from Chrome / Brave (1-Tap Install)
                  </h4>
                  <ol className="list-decimal list-inside space-y-1.5 text-xs text-white/80 leading-relaxed">
                    <li>Connect your Android phone to the same Wi-Fi as your PC.</li>
                    <li>Open Chrome on your phone and go to your PC's local IP (or this app URL).</li>
                    <li>Tap the **Three Dots (⋮)** in Chrome &gt; select **"Install App"** (or **"Add to Home screen"**).</li>
                    <li>Bluey's blueberry icon will be pinned to your Android apps drawer!</li>
                    <li>Launches fullscreen with no address bar, microphone input, and touch gaze.</li>
                  </ol>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                  <h4 className="font-bold text-white text-sm mb-1.5">
                    📦 Method 2: Compile a Native Android APK
                  </h4>
                  <p className="text-xs text-white/70 mb-2">
                    Build a signed or debug <code className="text-[#5BE49B]">.apk</code> with Capacitor:
                  </p>
                  <div className="bg-[#100e19] p-3 rounded-xl border border-white/10 font-plex-mono text-xs text-white/80 space-y-1">
                    <div>npm install @capacitor/core @capacitor/cli @capacitor/android</div>
                    <div>npx cap init "Bluey" "com.bluey.googlyeyes" --web-dir dist</div>
                    <div>npm run build && npx cap add android</div>
                    <div>npx cap open android</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Hotkeys */}
          {tab === 'hotkeys' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <h3 className="font-fredoka text-lg text-white mb-2">
                  Windows PC Hotkeys & Shortcuts
                </h3>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 flex justify-between items-center">
                    <span className="font-plex-mono text-[#A9BCFF] font-bold">Alt + Space</span>
                    <span className="text-white/70">Wake up / Sleep</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 flex justify-between items-center">
                    <span className="font-plex-mono text-[#A9BCFF] font-bold">Ctrl + Alt + F</span>
                    <span className="text-white/70">Toggle Follow Mouse</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 flex justify-between items-center">
                    <span className="font-plex-mono text-[#A9BCFF] font-bold">Ctrl + Alt + P</span>
                    <span className="text-white/70">Point to Mouse</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 flex justify-between items-center">
                    <span className="font-plex-mono text-[#A9BCFF] font-bold">Ctrl + Alt + D</span>
                    <span className="text-white/70">Dock character at bottom</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 flex justify-between items-center">
                    <span className="font-plex-mono text-[#A9BCFF] font-bold">Ctrl + Alt + T</span>
                    <span className="text-white/70">Talk bounce test</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 flex justify-between items-center text-rose-300">
                    <span className="font-plex-mono font-bold">Ctrl + Alt + S</span>
                    <span>Emergency Stop</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <h3 className="font-fredoka text-lg text-white mb-2">
                  Android Touch Gestures
                </h3>
                <ul className="space-y-2 text-xs text-white/80">
                  <li className="flex items-start gap-2">
                    <span className="text-[#6C86F5] font-bold">●</span>
                    <span><strong>Press & Hold Screen:</strong> Turns on microphone. Talk to Bluey; let go and he answers in a speech bubble and chirps!</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#6C86F5] font-bold">●</span>
                    <span><strong>Double Tap:</strong> Instantly toggles Bluey between awake and sleepy mode.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#6C86F5] font-bold">●</span>
                    <span><strong>Touch & Drag:</strong> Directs Bluey's eyes to look wherever your finger touches.</span>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 flex items-center justify-between bg-[#141220] text-xs">
          <span className="text-white/50">Full guides also documented in <code className="text-[#A9BCFF]">README.md</code> and <code className="text-[#A9BCFF]">INSTALL.md</code></span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#4254D6] hover:bg-[#3444b5] text-white font-semibold transition"
          >
            Got It
          </button>
        </div>

      </div>
    </div>
  );
};
