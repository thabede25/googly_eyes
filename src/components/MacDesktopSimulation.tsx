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
  CheckCircle2,
  AlertTriangle,
  Play
} from 'lucide-react';
import { playChirp } from '../utils/audio';

interface MacDesktopSimulationProps {
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
  phonePlacement: 'left' | 'center' | 'right';
  setPhonePlacement: (p: 'left' | 'center' | 'right') => void;
  allowComputerControl: boolean;
  setAllowComputerControl: (v: boolean) => void;
  onOpenNotes: () => void;
  onOpenComputerControl: () => void;
  onPointAtSpot: (x: number, y: number, label: string) => void;
}

export const MacDesktopSimulation: React.FC<MacDesktopSimulationProps> = ({
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
  phonePlacement,
  setPhonePlacement,
  allowComputerControl,
  setAllowComputerControl,
  onOpenNotes,
  onOpenComputerControl,
  onPointAtSpot,
}) => {
  const [showMenuBarMenu, setShowMenuBarMenu] = useState(false);
  const [activeWindow, setActiveWindow] = useState<'safari' | 'notes' | 'code' | null>('safari');
  const desktopRef = useRef<HTMLDivElement | null>(null);

  // Keyboard shortcut listener matching the Mac app:
  // ⌥Space: wake/sleep
  // ⌃⌥P: fly to mouse
  // ⌃⌥F: follow mouse
  // ⌃⌥D: dock
  // ⌃⌥T: talk test
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.code === 'Space') {
        e.preventDefault();
        setIsAwake(!isAwake);
        setMood(isAwake ? 'sleepy' : 'listening');
        playChirp(isAwake ? 'sleep' : 'wake');
      } else if (e.ctrlKey && e.altKey && e.key.toLowerCase() === 'f') {
        e.preventDefault();
        const nextMode = cursorMode === 'following' ? 'docked' : 'following';
        setCursorMode(nextMode);
        playChirp('chirp');
      } else if (e.ctrlKey && e.altKey && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        setCursorMode('docked');
        playChirp('point');
      } else if (e.ctrlKey && e.altKey && e.key.toLowerCase() === 't') {
        e.preventDefault();
        playChirp('happy');
        setMood('happy');
        setTimeout(() => setMood('listening'), 2500);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAwake, cursorMode, setIsAwake, setMood, setCursorMode]);

  // Track mouse movement inside desktop if following
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (cursorMode === 'following' && desktopRef.current) {
      const rect = desktopRef.current.getBoundingClientRect();
      const x = Math.max(20, Math.min(rect.width - 20, e.clientX - rect.left));
      const y = Math.max(35, Math.min(rect.height - 20, e.clientY - rect.top));
      setPointerPos({ x, y });
    }
  };

  const interactiveItems = [
    { id: 'btn-search', label: 'AI Search Bar', x: 260, y: 145, desc: 'Querying vision intelligence' },
    { id: 'btn-meeting', label: 'Meeting Note #41', x: 580, y: 220, desc: 'Diarized speaker note chunk' },
    { id: 'btn-action', label: 'Approve Deployment', x: 380, y: 310, desc: 'Requires computer control safety guardrail' },
  ];

  // Calculate phone origin for the trail
  const getPhoneAnchor = () => {
    if (!desktopRef.current) return { x: 400, y: 500 };
    const w = desktopRef.current.clientWidth;
    const h = desktopRef.current.clientHeight;
    if (phonePlacement === 'left') return { x: w * 0.2, y: h };
    if (phonePlacement === 'right') return { x: w * 0.8, y: h };
    return { x: w * 0.5, y: h };
  };

  const phoneAnchor = getPhoneAnchor();

  return (
    <div
      ref={desktopRef}
      onMouseMove={handleMouseMove}
      className="relative flex-1 h-full bg-radial from-[#1e1a38] via-[#120f24] to-[#0a0815] overflow-hidden flex flex-col select-none border-b border-indigo-950/40"
    >
      {/* Mac Menu Bar */}
      <div className="h-7 bg-[#171520]/80 backdrop-blur-md border-b border-white/10 px-3 flex items-center justify-between text-xs text-white/90 z-40">
        <div className="flex items-center space-x-3.5">
          <span className="font-semibold text-white/80 cursor-default"></span>
          <span className="font-fredoka font-bold text-sm tracking-wide text-[#A9BCFF]">Bluey</span>
          <span className="text-white/60 hover:text-white cursor-pointer transition">File</span>
          <span className="text-white/60 hover:text-white cursor-pointer transition">Edit</span>
          <span className="text-white/60 hover:text-white cursor-pointer transition">View</span>
          <span className="text-white/60 hover:text-white cursor-pointer transition">Window</span>
          <button
            onClick={onOpenNotes}
            className="text-white/70 hover:text-white flex items-center gap-1 transition"
          >
            <FolderOpen className="w-3 h-3 text-[#6C86F5]" />
            Notes
          </button>
          <button
            onClick={onOpenComputerControl}
            className="text-white/70 hover:text-white flex items-center gap-1 transition"
          >
            <ShieldCheck className="w-3 h-3 text-[#5BE49B]" />
            Guardrails
          </button>
        </div>

        {/* Menu Bar Right Side */}
        <div className="flex items-center space-x-3 text-white/70">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-white/5 border border-white/5 text-[11px]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#5BE49B] animate-pulse"></span>
            <span className="font-plex-mono text-[10px]">_googly._tcp</span>
          </div>

          {/* Bluey Menu Bar Blob */}
          <div className="relative">
            <button
              onClick={() => setShowMenuBarMenu(!showMenuBarMenu)}
              className="p-1 rounded hover:bg-white/10 transition flex items-center gap-1 text-[#6C86F5]"
              title="Bluey Menu"
            >
              <div className="w-4 h-4 rounded-full bg-gradient-to-br from-[#A9BCFF] via-[#6C86F5] to-[#2B2F8F] shadow-sm flex items-center justify-center">
                <span className="text-[7px] text-white font-bold">●</span>
              </div>
            </button>

            {/* Menu Bar Dropdown */}
            {showMenuBarMenu && (
              <div className="absolute right-0 top-8 w-64 bg-[#1e1b29]/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl p-2 z-50 text-xs text-white">
                <div className="px-3 py-2 border-b border-white/10 flex items-center justify-between">
                  <div>
                    <div className="font-fredoka font-bold text-sm text-[#A9BCFF]">Bluey Mac Host</div>
                    <div className="text-[10px] text-white/50">Paired with iPhone (v2.1)</div>
                  </div>
                  <span className="w-2 h-2 rounded-full bg-[#5BE49B]"></span>
                </div>

                <div className="py-1">
                  <div className="px-3 py-1 text-[10px] uppercase font-semibold text-white/40 tracking-wider">
                    Character Mode
                  </div>
                  <div className="grid grid-cols-2 gap-1 px-2">
                    <button
                      onClick={() => {
                        setCursorMode('following');
                        setShowMenuBarMenu(false);
                        playChirp('chirp');
                      }}
                      className={`px-2 py-1.5 rounded text-left transition ${
                        cursorMode === 'following' ? 'bg-[#4254D6] text-white' : 'hover:bg-white/5 text-white/70'
                      }`}
                    >
                      Follow Mouse (⌃⌥F)
                    </button>
                    <button
                      onClick={() => {
                        setCursorMode('docked');
                        setShowMenuBarMenu(false);
                        playChirp('point');
                      }}
                      className={`px-2 py-1.5 rounded text-left transition ${
                        cursorMode === 'docked' ? 'bg-[#4254D6] text-white' : 'hover:bg-white/5 text-white/70'
                      }`}
                    >
                      Docked (⌃⌥D)
                    </button>
                  </div>
                </div>

                <div className="py-1 border-t border-white/5">
                  <div className="px-3 py-1 text-[10px] uppercase font-semibold text-white/40 tracking-wider">
                    Pointer Trail
                  </div>
                  <div className="grid grid-cols-3 gap-1 px-2">
                    {(['comet', 'string', 'none'] as PointerTrail[]).map((t) => (
                      <button
                        key={t}
                        onClick={() => setPointerTrail(t)}
                        className={`px-2 py-1 rounded text-center capitalize transition ${
                          pointerTrail === t ? 'bg-[#6C86F5]/30 text-[#A9BCFF] font-semibold' : 'hover:bg-white/5 text-white/60'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="py-1 border-t border-white/5">
                  <div className="px-3 py-1 text-[10px] uppercase font-semibold text-white/40 tracking-wider">
                    Phone Placement
                  </div>
                  <div className="grid grid-cols-3 gap-1 px-2">
                    {(['left', 'center', 'right'] as const).map((pos) => (
                      <button
                        key={pos}
                        onClick={() => setPhonePlacement(pos)}
                        className={`px-2 py-1 rounded text-center capitalize transition ${
                          phonePlacement === pos ? 'bg-[#6C86F5]/30 text-[#A9BCFF] font-semibold' : 'hover:bg-white/5 text-white/60'
                        }`}
                      >
                        {pos}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="py-1 border-t border-white/5">
                  <label className="flex items-center justify-between px-3 py-1.5 hover:bg-white/5 rounded cursor-pointer">
                    <span className="text-white/80">Allow Computer Control</span>
                    <input
                      type="checkbox"
                      checked={allowComputerControl}
                      onChange={(e) => setAllowComputerControl(e.target.checked)}
                      className="accent-[#6C86F5]"
                    />
                  </label>
                </div>

                <div className="pt-1 border-t border-white/10 flex justify-between px-2">
                  <button
                    onClick={() => {
                      playChirp('happy');
                      setMood('happy');
                      setShowMenuBarMenu(false);
                    }}
                    className="text-[11px] text-[#A9BCFF] hover:underline"
                  >
                    Talk Test (⌃⌥T)
                  </button>
                  <button
                    onClick={() => setShowMenuBarMenu(false)}
                    className="text-[11px] text-white/40 hover:text-white"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>

          <span className="text-[11px]">Thu 2:22 PM</span>
        </div>
      </div>

      {/* Desktop Workspace */}
      <div className="relative flex-1 p-6">
        {/* Mock Safari Window */}
        {activeWindow === 'safari' && (
          <div className="w-full max-w-2xl bg-[#17151f]/90 backdrop-blur-xl border border-white/15 rounded-xl shadow-2xl overflow-hidden mx-auto">
            <div className="h-9 bg-[#1e1b29] border-b border-white/10 px-3 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-[#ff5f56] inline-block cursor-pointer"></span>
                <span className="w-3 h-3 rounded-full bg-[#ffbd2e] inline-block cursor-pointer"></span>
                <span className="w-3 h-3 rounded-full bg-[#27c93f] inline-block cursor-pointer"></span>
              </div>
              <div className="bg-[#121019] px-6 py-1 rounded-md text-[11px] text-white/70 flex items-center gap-2 border border-white/5 w-80 justify-center">
                <Search className="w-3 h-3 text-white/40" />
                <span className="font-plex-mono truncate">bluey.local/research/vision-control</span>
              </div>
              <div className="w-12"></div>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div>
                  <h2 className="font-fredoka text-xl text-[#A9BCFF]">Bluey Desktop Companion</h2>
                  <p className="text-xs text-white/60">Realtime multimodal pointer & screen intelligence</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onPointAtSpot(450, 150, 'Bluey Specs')}
                    className="px-2.5 py-1 bg-[#2B2F8F]/60 hover:bg-[#2B2F8F] border border-[#6C86F5]/40 rounded-lg text-xs font-semibold text-[#A9BCFF] transition flex items-center gap-1.5"
                  >
                    <MousePointer className="w-3 h-3" />
                    Ask Bluey: "What's this?"
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div
                  onClick={() => onPointAtSpot(260, 240, 'ScreenCaptureKit')}
                  className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl cursor-pointer transition group"
                >
                  <div className="font-bold text-white group-hover:text-[#A9BCFF] flex items-center justify-between">
                    <span>ScreenCaptureKit + Vision</span>
                    <span className="text-[10px] text-white/40">Point Target #1</span>
                  </div>
                  <p className="text-white/60 text-[11px] mt-1">
                    Extracts text IDs and bounding boxes. Bluey locks gaze and points directly with his big cursor.
                  </p>
                </div>

                <div
                  onClick={() => onPointAtSpot(520, 240, 'Meeting Transcriber')}
                  className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl cursor-pointer transition group"
                >
                  <div className="font-bold text-white group-hover:text-[#A9BCFF] flex items-center justify-between">
                    <span>Meeting Notes Diarizer</span>
                    <span className="text-[10px] text-white/40">Point Target #2</span>
                  </div>
                  <p className="text-white/60 text-[11px] mt-1">
                    Continuous 5-minute audio chunks with speaker diarization written to ~/Documents/Bluey Notes.
                  </p>
                </div>
              </div>

              {/* Interactive test trigger elements */}
              <div className="p-3 bg-[#1e1b29]/80 rounded-xl border border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs">
                  <Sliders className="w-4 h-4 text-[#6C86F5]" />
                  <span className="text-white/80">Interactive targets Bluey can fly and point to:</span>
                </div>
                <div className="flex items-center gap-2">
                  {interactiveItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => onPointAtSpot(item.x, item.y, item.label)}
                      className="px-2 py-1 bg-white/10 hover:bg-[#4254D6] rounded text-[11px] transition text-white/90"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Shortcuts Cheat Sheet Floater */}
        <div className="absolute left-6 bottom-6 bg-[#17151f]/80 backdrop-blur-md border border-white/10 rounded-xl p-3 text-[11px] text-white/70 shadow-lg space-y-1">
          <div className="font-bold text-white/90 mb-1 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#A9BCFF]" />
            Mac Hotkeys
          </div>
          <div className="flex justify-between gap-4 font-plex-mono text-[10px]">
            <span>⌥Space</span> <span className="text-white/50">Wake up / Sleep</span>
          </div>
          <div className="flex justify-between gap-4 font-plex-mono text-[10px]">
            <span>⌃⌥F</span> <span className="text-white/50">Toggle Follow Mouse</span>
          </div>
          <div className="flex justify-between gap-4 font-plex-mono text-[10px]">
            <span>⌃⌥P</span> <span className="text-white/50">Point At Mouse</span>
          </div>
          <div className="flex justify-between gap-4 font-plex-mono text-[10px]">
            <span>⌃⌥D</span> <span className="text-white/50">Dock at bottom</span>
          </div>
          <div className="flex justify-between gap-4 font-plex-mono text-[10px]">
            <span>⌃⌥T</span> <span className="text-white/50">Talk bounce test</span>
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
            <linearGradient id="cometGrad" x1="0%" y1="100%" x2="0%" y2="0%">
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
            stroke="url(#cometGrad)"
            strokeWidth="6"
            strokeLinecap="round"
          />
        )}
      </svg>

      {/* The Big Flying Bluey Cursor ("Pointer") */}
      <div
        className="absolute z-30 transition-all duration-300 pointer-events-none"
        style={{
          transform: `translate(${pointerPos.x - 24}px, ${pointerPos.y - 24}px)`,
          left: 0,
          top: 0,
        }}
      >
        <div className="relative">
          {/* Cartoon Character Pointer Hand/Blob */}
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#A9BCFF] via-[#6C86F5] to-[#2B2F8F] shadow-[0_0_24px_rgba(108,134,245,0.7)] flex items-center justify-center border-2 border-white/60">
            {/* Crown on cursor */}
            <div className="absolute -top-2 w-3.5 h-2.5 bg-[#1C1F66] rounded-xs"></div>
            {/* Eyes */}
            <div className="flex space-x-1.5 items-center">
              <div className="w-2.5 h-2.5 rounded-full bg-white flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-[#17151F]"></div>
              </div>
              <div className="w-2.5 h-2.5 rounded-full bg-white flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-[#17151F]"></div>
              </div>
            </div>
          </div>

          {/* Pointing Index Finger indicator */}
          <div className="absolute -top-3.5 -right-1 w-3 h-5 bg-[#6C86F5] border-2 border-white/80 rounded-t-full rotate-45 origin-bottom shadow-md"></div>

          {/* Speech Bubble next to the Cursor */}
          {speechText && (
            <div className="absolute left-14 -top-6 bg-white text-[#17151F] px-3.5 py-2 rounded-2xl rounded-tl-none shadow-xl max-w-xs font-plex-sans text-xs border border-indigo-200 animate-in fade-in zoom-in-95 duration-200">
              <p className="font-medium leading-relaxed">{speechText}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
