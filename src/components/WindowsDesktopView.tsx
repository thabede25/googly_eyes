import React, { useState, useEffect, useRef } from 'react';
import { Mood, PointerTrail, CursorMode, PALETTE } from '../types';
import {
  Monitor,
  MousePointer,
  FolderOpen,
  Sliders,
  ShieldCheck,
  Sparkles,
  Volume2,
  FileText,
  Search,
  Wifi,
  ChevronUp,
  Settings,
  Bell,
  HardDrive,
  Copy,
  ExternalLink,
  HelpCircle,
  BookOpen
} from 'lucide-react';
import { playChirp } from '../utils/audio';

interface WindowsDesktopViewProps {
  mood: Mood;
  setMood: (m: Mood) => void;
  isAwake: boolean;
  setIsAwake: (a: boolean) => void;
  speechText: string | null;
  pointerPos: { x: number; y: number };
  setPointerPos: (pos: { x: number; y: number }) => void;
  cursorMode: CursorMode;
  setCursorMode: (mode: CursorMode) => void;
  pointerTrail: PointerTrail;
  setPointerTrail: (trail: PointerTrail) => void;
  allowComputerControl: boolean;
  setAllowComputerControl: (v: boolean) => void;
  onOpenNotes: () => void;
  onOpenComputerControl: () => void;
  onPointAtSpot: (x: number, y: number, label: string) => void;
  phonePlacement: 'left' | 'center' | 'right';
  setPhonePlacement: (p: 'left' | 'center' | 'right') => void;
  onOpenInstallGuide?: () => void;
}

export const WindowsDesktopView: React.FC<WindowsDesktopViewProps> = ({
  mood,
  setMood,
  isAwake,
  setIsAwake,
  speechText,
  pointerPos,
  setPointerPos,
  cursorMode,
  setCursorMode,
  pointerTrail,
  setPointerTrail,
  allowComputerControl,
  setAllowComputerControl,
  onOpenNotes,
  onOpenComputerControl,
  onPointAtSpot,
  phonePlacement,
  setPhonePlacement,
  onOpenInstallGuide,
}) => {
  const [showTrayMenu, setShowTrayMenu] = useState(false);
  const [showStartMenu, setShowStartMenu] = useState(false);
  const [activeWindow, setActiveWindow] = useState<'notes' | 'browser' | 'guardrails'>('notes');
  const desktopRef = useRef<HTMLDivElement | null>(null);

  // Windows hotkeys listener:
  // Alt+Space: wake / sleep
  // Ctrl+Alt+F: toggle follow mouse
  // Ctrl+Alt+P: point to mouse
  // Ctrl+Alt+D: dock at bottom
  // Ctrl+Alt+T: talk test bounce
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.code === 'Space') {
        e.preventDefault();
        const next = !isAwake;
        setIsAwake(next);
        setMood(next ? 'listening' : 'sleepy');
        playChirp(next ? 'wake' : 'sleep');
      } else if (e.ctrlKey && e.altKey && e.key.toLowerCase() === 'f') {
        e.preventDefault();
        setCursorMode(cursorMode === 'following' ? 'docked' : 'following');
        playChirp('chirp');
      } else if (e.ctrlKey && e.altKey && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        setCursorMode('docked');
        playChirp('point');
      } else if (e.ctrlKey && e.altKey && e.key.toLowerCase() === 't') {
        e.preventDefault();
        playChirp('happy');
        setMood('happy');
        setTimeout(() => setMood('listening'), 2400);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAwake, cursorMode, setIsAwake, setMood, setCursorMode]);

  // Track mouse movement inside desktop if following
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (cursorMode === 'following' && desktopRef.current) {
      const rect = desktopRef.current.getBoundingClientRect();
      const x = Math.max(24, Math.min(rect.width - 24, e.clientX - rect.left));
      const y = Math.max(24, Math.min(rect.height - 60, e.clientY - rect.top));
      setPointerPos({ x, y });
    }
  };

  const interactiveTargets = [
    { id: 't-doc', label: 'Quarterly OKRs.docx', x: 280, y: 130, desc: 'Windows Office document' },
    { id: 't-code', label: 'Terminal: npm run dev', x: 540, y: 180, desc: 'PowerShell / command line' },
    { id: 't-btn', label: 'Submit Windows Update', x: 390, y: 280, desc: 'Desktop UI automation element' },
  ];

  // Anchor for string trail to Android phone
  const getPhoneAnchor = () => {
    if (!desktopRef.current) return { x: 300, y: 500 };
    const w = desktopRef.current.clientWidth;
    const h = desktopRef.current.clientHeight;
    if (phonePlacement === 'left') return { x: w * 0.15, y: h };
    if (phonePlacement === 'right') return { x: w * 0.85, y: h };
    return { x: w * 0.5, y: h };
  };

  const phoneAnchor = getPhoneAnchor();

  return (
    <div
      ref={desktopRef}
      onMouseMove={handleMouseMove}
      className="relative flex-1 h-full bg-radial from-[#131d36] via-[#0d1224] to-[#070913] overflow-hidden flex flex-col select-none"
    >
      {/* Windows 11 Desktop Wallpaper and Content */}
      <div className="relative flex-1 p-4 sm:p-6 overflow-hidden">
        
        {/* Windows Desktop Icons on left */}
        <div className="flex flex-col space-y-4 w-20 z-10">
          <div
            onClick={onOpenNotes}
            className="flex flex-col items-center p-2 rounded-lg hover:bg-white/10 cursor-pointer transition text-center group"
          >
            <div className="w-10 h-10 rounded-lg bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shadow-sm group-hover:scale-105 transition">
              <FolderOpen className="w-5 h-5" />
            </div>
            <span className="text-[11px] text-white/90 mt-1 drop-shadow leading-tight">Bluey Notes</span>
          </div>

          <div
            onClick={onOpenComputerControl}
            className="flex flex-col items-center p-2 rounded-lg hover:bg-white/10 cursor-pointer transition text-center group"
          >
            <div className="w-10 h-10 rounded-lg bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 shadow-sm group-hover:scale-105 transition">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="text-[11px] text-white/90 mt-1 drop-shadow leading-tight">Guardrails</span>
          </div>

          <div
            onClick={() => setActiveWindow('browser')}
            className="flex flex-col items-center p-2 rounded-lg hover:bg-white/10 cursor-pointer transition text-center group"
          >
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 border border-blue-400/40 flex items-center justify-center text-blue-300 shadow-sm group-hover:scale-105 transition">
              <ExternalLink className="w-5 h-5" />
            </div>
            <span className="text-[11px] text-white/90 mt-1 drop-shadow leading-tight">Edge Vision</span>
          </div>

          {onOpenInstallGuide && (
            <div
              onClick={onOpenInstallGuide}
              className="flex flex-col items-center p-2 rounded-lg hover:bg-white/10 cursor-pointer transition text-center group"
            >
              <div className="w-10 h-10 rounded-lg bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-purple-300 shadow-sm group-hover:scale-105 transition">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="text-[11px] text-white/90 mt-1 drop-shadow leading-tight">Setup Guide</span>
            </div>
          )}
        </div>

        {/* Floating Windows App: Meeting Notes / Document Window */}
        <div className="absolute top-6 left-28 right-6 max-w-2xl bg-[#1b1c2e]/90 backdrop-blur-xl border border-white/15 rounded-xl shadow-2xl overflow-hidden z-10">
          {/* Windows 11 Title Bar */}
          <div className="h-9 bg-[#23243a] border-b border-white/10 px-3 flex items-center justify-between text-xs text-white/80 select-none">
            <div className="flex items-center space-x-2">
              <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-tr from-[#A9BCFF] to-[#6C86F5]"></div>
              <span className="font-plex-sans text-[12px] font-semibold text-white/90">
                Bluey for Windows — Meeting Session & PC Control
              </span>
            </div>
            <div className="flex items-center space-x-3 text-white/60">
              <span className="hover:text-white cursor-pointer">─</span>
              <span className="hover:text-white cursor-pointer">□</span>
              <span className="hover:text-rose-400 cursor-pointer text-sm">✕</span>
            </div>
          </div>

          {/* Window Body */}
          <div className="p-4 sm:p-5 space-y-3.5 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <h3 className="font-fredoka text-base text-[#A9BCFF]">Windows Realtime Vision & Pointing</h3>
                <p className="text-[11px] text-white/60">
                  Bluey watches through your Android phone and points at anything on your PC monitor
                </p>
              </div>
              <button
                onClick={() => onPointAtSpot(420, 140, 'Target Window')}
                className="px-3 py-1.5 bg-[#4254D6] hover:bg-[#3444b5] text-white rounded-lg font-semibold flex items-center gap-1.5 shadow-md transition"
              >
                <MousePointer className="w-3.5 h-3.5" />
                Point Here
              </button>
            </div>

            {/* Interactive Target Areas */}
            <div className="grid grid-cols-3 gap-2.5">
              {interactiveTargets.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onPointAtSpot(item.x, item.y, item.label)}
                  className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl cursor-pointer transition group"
                >
                  <div className="font-semibold text-white group-hover:text-[#A9BCFF] text-[12px] flex items-center justify-between">
                    <span>{item.label}</span>
                  </div>
                  <p className="text-[10px] text-white/50 mt-1">{item.desc}</p>
                </div>
              ))}
            </div>

            {/* Status bar inside window */}
            <div className="flex items-center justify-between pt-1 text-[11px] text-white/50">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#5BE49B]"></span>
                Windows UI Automation: Active
              </span>
              <span>Hotkeys: Alt+Space (wake/sleep) • Ctrl+Alt+F (follow)</span>
            </div>
          </div>
        </div>

        {/* Shortcuts card at bottom-left */}
        <div className="absolute left-6 bottom-4 bg-[#141525]/85 backdrop-blur-md border border-white/10 rounded-xl p-3 text-[11px] text-white/70 shadow-xl space-y-1 z-10 hidden sm:block">
          <div className="font-bold text-white/90 mb-1 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#A9BCFF]" />
            Windows Hotkeys
          </div>
          <div className="flex justify-between gap-4 font-plex-mono text-[10px]">
            <span>Alt+Space</span> <span className="text-white/50">Wake up / Sleep</span>
          </div>
          <div className="flex justify-between gap-4 font-plex-mono text-[10px]">
            <span>Ctrl+Alt+F</span> <span className="text-white/50">Toggle Follow Mouse</span>
          </div>
          <div className="flex justify-between gap-4 font-plex-mono text-[10px]">
            <span>Ctrl+Alt+P</span> <span className="text-white/50">Point to Mouse</span>
          </div>
          <div className="flex justify-between gap-4 font-plex-mono text-[10px]">
            <span>Ctrl+Alt+D</span> <span className="text-white/50">Dock at bottom</span>
          </div>
          <div className="flex justify-between gap-4 font-plex-mono text-[10px]">
            <span>Ctrl+Alt+T</span> <span className="text-white/50">Talk bounce test</span>
          </div>
        </div>
      </div>

      {/* SVG Canvas for Pointer Trail (Comet / String) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-20">
        {pointerTrail === 'string' && (
          <path
            d={`M ${phoneAnchor.x} ${phoneAnchor.y} Q ${phoneAnchor.x} ${
              (phoneAnchor.y + pointerPos.y) / 2
            } ${pointerPos.x} ${pointerPos.y}`}
            fill="none"
            stroke="#6C86F5"
            strokeWidth="2.5"
            strokeDasharray="6 4"
            className="opacity-70 animate-pulse"
          />
        )}
        {pointerTrail === 'comet' && (
          <defs>
            <linearGradient id="winCometGrad" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#4254D6" stopOpacity="0" />
              <stop offset="100%" stopColor="#A9BCFF" stopOpacity="0.8" />
            </linearGradient>
          </defs>
        )}
        {pointerTrail === 'comet' && (
          <line
            x1={pointerPos.x}
            y1={pointerPos.y + 35}
            x2={pointerPos.x}
            y2={pointerPos.y}
            stroke="url(#winCometGrad)"
            strokeWidth="6"
            strokeLinecap="round"
          />
        )}
      </svg>

      {/* The Big Flying Bluey Cursor ("Pointer") on Windows */}
      <div
        className="absolute z-30 transition-all duration-300 pointer-events-none"
        style={{
          transform: `translate(${pointerPos.x - 24}px, ${pointerPos.y - 24}px)`,
          left: 0,
          top: 0,
        }}
      >
        <div className="relative">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#A9BCFF] via-[#6C86F5] to-[#2B2F8F] shadow-[0_0_24px_rgba(108,134,245,0.7)] flex items-center justify-center border-2 border-white/60">
            <div className="absolute -top-2 w-3.5 h-2.5 bg-[#1C1F66] rounded-xs"></div>
            <div className="flex space-x-1.5 items-center">
              <div className="w-2.5 h-2.5 rounded-full bg-white flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-[#17151F]"></div>
              </div>
              <div className="w-2.5 h-2.5 rounded-full bg-white flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-[#17151F]"></div>
              </div>
            </div>
          </div>

          {/* Pointing Index Finger */}
          <div className="absolute -top-3.5 -right-1 w-3 h-5 bg-[#6C86F5] border-2 border-white/80 rounded-t-full rotate-45 origin-bottom shadow-md"></div>

          {/* Speech Bubble next to pointer */}
          {speechText && (
            <div className="absolute left-14 -top-6 bg-white text-[#17151F] px-3.5 py-2 rounded-2xl rounded-tl-none shadow-xl max-w-xs font-plex-sans text-xs border border-indigo-200 animate-in fade-in zoom-in-95 duration-200">
              <p className="font-medium leading-relaxed">{speechText}</p>
            </div>
          )}
        </div>
      </div>

      {/* Windows 11 Taskbar */}
      <div className="h-12 bg-[#121422]/90 backdrop-blur-xl border-t border-white/10 px-4 flex items-center justify-between z-40 select-none">
        
        {/* Left spacer / Widgets widget */}
        <div className="w-28 hidden sm:flex items-center text-xs text-white/70 space-x-2">
          <span className="text-[11px] font-medium text-white/80">⛅ 72°F</span>
          <span className="text-[10px] text-white/40">Clear</span>
        </div>

        {/* Windows 11 Center App Icons */}
        <div className="flex items-center space-x-1.5">
          {/* Windows 11 Start Button */}
          <button
            onClick={() => setShowStartMenu(!showStartMenu)}
            className="p-2 rounded-lg hover:bg-white/10 transition active:scale-95"
            title="Start"
          >
            <div className="grid grid-cols-2 gap-0.5 w-4 h-4">
              <div className="bg-[#0078D4] rounded-[1px]"></div>
              <div className="bg-[#0078D4] rounded-[1px]"></div>
              <div className="bg-[#0078D4] rounded-[1px]"></div>
              <div className="bg-[#0078D4] rounded-[1px]"></div>
            </div>
          </button>

          {/* Search Button */}
          <button className="p-2 rounded-lg hover:bg-white/10 transition text-white/80">
            <Search className="w-4 h-4" />
          </button>

          {/* Bluey Desktop App Icon on Windows Taskbar */}
          <button
            onClick={() => {
              setCursorMode(cursorMode === 'following' ? 'docked' : 'following');
              playChirp('chirp');
            }}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/15 transition relative group"
            title="Bluey Companion"
          >
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#A9BCFF] via-[#6C86F5] to-[#2B2F8F] shadow flex items-center justify-center">
              <span className="text-[9px] text-white font-bold">●</span>
            </div>
            {/* Active app indicator line underneath */}
            <div className="absolute -bottom-1 left-2 right-2 h-0.5 bg-[#6C86F5] rounded-full"></div>
          </button>

          {/* Notes folder */}
          <button
            onClick={onOpenNotes}
            className="p-2 rounded-lg hover:bg-white/10 transition text-amber-400"
            title="Open Meeting Notes"
          >
            <FolderOpen className="w-4 h-4" />
          </button>

          {/* Guardrails */}
          <button
            onClick={onOpenComputerControl}
            className="p-2 rounded-lg hover:bg-white/10 transition text-emerald-400"
            title="PC Guardrails"
          >
            <ShieldCheck className="w-4 h-4" />
          </button>
        </div>

        {/* Windows 11 System Tray (Right) */}
        <div className="flex items-center space-x-2.5 text-xs text-white/80">
          <button
            onClick={() => setShowTrayMenu(!showTrayMenu)}
            className="p-1.5 rounded hover:bg-white/10 transition text-white/60"
            title="Show hidden icons"
          >
            <ChevronUp className="w-3.5 h-3.5" />
          </button>

          {/* Bluey Tray Icon */}
          <button
            onClick={() => setShowTrayMenu(!showTrayMenu)}
            className="p-1.5 rounded hover:bg-white/10 transition relative"
            title="Bluey Tray Settings"
          >
            <div className="w-4 h-4 rounded-full bg-gradient-to-br from-[#A9BCFF] to-[#2B2F8F] flex items-center justify-center">
              <span className="w-1 h-1 rounded-full bg-white"></span>
            </div>
          </button>

          <div className="flex items-center space-x-1 px-1 py-0.5 rounded hover:bg-white/10 transition cursor-pointer text-white/70">
            <Wifi className="w-3.5 h-3.5" />
            <Volume2 className="w-3.5 h-3.5" />
          </div>

          <div className="text-right leading-tight px-1 py-0.5 rounded hover:bg-white/10 transition cursor-pointer">
            <div className="text-[11px] font-medium text-white/90">2:25 PM</div>
            <div className="text-[10px] text-white/50">10/15/2026</div>
          </div>
        </div>
      </div>

      {/* Windows System Tray Context Menu Pop-up */}
      {showTrayMenu && (
        <div className="absolute right-4 bottom-14 w-68 bg-[#1e1b29]/95 backdrop-blur-xl border border-white/15 rounded-xl shadow-2xl p-3 z-50 text-xs text-white space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-150">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <div>
              <div className="font-fredoka text-sm text-[#A9BCFF]">Bluey for Windows</div>
              <div className="text-[10px] text-white/50">Paired with Android phone</div>
            </div>
            <span className="w-2 h-2 rounded-full bg-[#5BE49B]"></span>
          </div>

          <div>
            <div className="text-[10px] uppercase font-semibold text-white/40 tracking-wider mb-1">
              Cursor Mode
            </div>
            <div className="grid grid-cols-2 gap-1">
              <button
                onClick={() => {
                  setCursorMode('following');
                  setShowTrayMenu(false);
                  playChirp('chirp');
                }}
                className={`px-2 py-1.5 rounded text-left transition ${
                  cursorMode === 'following' ? 'bg-[#4254D6] text-white' : 'hover:bg-white/5 text-white/70'
                }`}
              >
                Follow Mouse (Ctrl+Alt+F)
              </button>
              <button
                onClick={() => {
                  setCursorMode('docked');
                  setShowTrayMenu(false);
                  playChirp('point');
                }}
                className={`px-2 py-1.5 rounded text-left transition ${
                  cursorMode === 'docked' ? 'bg-[#4254D6] text-white' : 'hover:bg-white/5 text-white/70'
                }`}
              >
                Docked (Ctrl+Alt+D)
              </button>
            </div>
          </div>

          <div className="pt-2 border-t border-white/5">
            <div className="text-[10px] uppercase font-semibold text-white/40 tracking-wider mb-1">
              Pointer Trail
            </div>
            <div className="grid grid-cols-3 gap-1">
              {(['comet', 'string', 'none'] as PointerTrail[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setPointerTrail(t)}
                  className={`px-2 py-1 rounded text-center capitalize transition text-[11px] ${
                    pointerTrail === t ? 'bg-[#6C86F5]/30 text-[#A9BCFF] font-semibold' : 'hover:bg-white/5 text-white/60'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-white/5">
            <label className="flex items-center justify-between py-1 hover:bg-white/5 rounded cursor-pointer">
              <span className="text-white/80 text-[11px]">Allow PC Automation</span>
              <input
                type="checkbox"
                checked={allowComputerControl}
                onChange={(e) => setAllowComputerControl(e.target.checked)}
                className="accent-[#6C86F5]"
              />
            </label>
          </div>

          <div className="pt-2 border-t border-white/10 flex justify-between">
            <button
              onClick={() => {
                playChirp('happy');
                setMood('happy');
                setShowTrayMenu(false);
              }}
              className="text-[11px] text-[#A9BCFF] hover:underline"
            >
              Talk Test (Ctrl+Alt+T)
            </button>
            <button
              onClick={() => setShowTrayMenu(false)}
              className="text-[11px] text-white/40 hover:text-white"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
