import React, { useState } from 'react';
import { Mood, PointerTrail, CursorMode, MeetingSession, ComputerAction } from './types';
import { AndroidPhoneView } from './components/AndroidPhoneView';
import { WindowsDesktopView } from './components/WindowsDesktopView';
import { MacDesktopSimulation } from './components/MacDesktopSimulation';
import { SessionDrawer } from './components/SessionDrawer';
import { ComputerControlModal } from './components/ComputerControlModal';
import { playChirp } from './utils/audio';
import {
  Smartphone,
  Monitor,
  LayoutGrid,
  Apple,
  Sparkles,
  Volume2,
  FolderOpen,
  ShieldCheck,
  BookOpen,
  Download
} from 'lucide-react';
import { InstallGuideModal } from './components/InstallGuideModal';

export function App() {
  // Mode: dual (Desktop + Phone), phone-only, desktop-only
  const [viewMode, setViewMode] = useState<'dual' | 'phone' | 'desktop'>('dual');
  // OS ecosystem: 'windows-android' vs 'mac-ios'
  const [platform, setPlatform] = useState<'windows-android' | 'mac-ios'>('windows-android');

  // Character state
  const [mood, setMood] = useState<Mood>('listening');
  const [isAwake, setIsAwake] = useState<boolean>(true);
  const [talkLevel, setTalkLevel] = useState<number>(0);
  const [speechText, setSpeechText] = useState<string | null>(null);

  // Desktop Pointer state
  const [pointerPos, setPointerPos] = useState<{ x: number; y: number }>({ x: 380, y: 160 });
  const [cursorMode, setCursorMode] = useState<CursorMode>('following');
  const [pointerTrail, setPointerTrail] = useState<PointerTrail>('string');
  const [phonePlacement, setPhonePlacement] = useState<'left' | 'center' | 'right'>('center');
  const [allowComputerControl, setAllowComputerControl] = useState<boolean>(true);

  // Sound settings
  const [chirpVolume, setChirpVolume] = useState<number>(0.8);

  // Drawers / Modals
  const [isSessionsOpen, setIsSessionsOpen] = useState<boolean>(false);
  const [isGuardrailsOpen, setIsGuardrailsOpen] = useState<boolean>(false);
  const [isInstallGuideOpen, setIsInstallGuideOpen] = useState<boolean>(false);
  const [isRecordingSession, setIsRecordingSession] = useState<boolean>(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  React.useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallPwa = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice?.outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    } else {
      setIsInstallGuideOpen(true);
    }
  };

  // Mock sessions
  const [sessions, setSessions] = useState<MeetingSession[]>([
    {
      id: 'sess-20261015-01',
      title: 'Windows & Android Architecture Sync',
      date: 'Oct 15, 2026',
      durationSeconds: 1240,
      audioChunks: 4,
      summary: 'Reviewed real-time mDNS discovery over Wi-Fi, low-latency WebSockets for pointer tracking, and continuous 5-minute diarization chunks.',
      actionItems: [
        'Deploy Android background service for mic capture',
        'Verify Windows UI Automation accessibility guardrails',
        'Package local installer for Windows desktop tray'
      ],
      transcripts: [
        { speaker: 'Engineer', time: '00:15', text: 'Hey Bluey, can you inspect the active deployment window on my desktop?' },
        { speaker: 'Bluey', time: '00:19', text: 'Pointing right now! Found the terminal running npm run dev on port 3000.' },
        { speaker: 'Product', time: '01:30', text: 'The diarization should group speakers by voice print and write to notes.md.' },
        { speaker: 'Bluey', time: '01:35', text: 'All chunks recorded and saved in ~/Documents/Bluey Notes.' }
      ]
    },
    {
      id: 'sess-20261014-02',
      title: 'Vision Screen Intelligence Review',
      date: 'Oct 14, 2026',
      durationSeconds: 980,
      audioChunks: 3,
      summary: 'Discussed ScreenCaptureKit and Windows Desktop Duplication API for extracting text bounding boxes and mouse coordinates.',
      actionItems: [
        'Fine-tune spring easing curve for pointer redirection',
        'Confirm emergency stop hotkey Ctrl+Alt+S'
      ],
      transcripts: [
        { speaker: 'Designer', time: '00:40', text: 'Bluey should lean toward where he looks and double-blink occasionally.' },
        { speaker: 'Bluey', time: '00:45', text: 'I love double blinking! And my cheeks get rosy when I smile.' }
      ]
    }
  ]);

  // Actions audit log
  const [actions, setActions] = useState<ComputerAction[]>([
    { id: '1', timestamp: '14:20:12', type: 'look_at_screen', detail: 'Scanned 14 UI controls via Vision', status: 'completed' },
    { id: '2', timestamp: '14:21:05', type: 'point_at_spot', target: 'Search Bar', detail: 'Coordinates (260, 145)', status: 'completed' },
    { id: '3', timestamp: '14:22:30', type: 'click', detail: 'Blocked: Password field detected (Guardrail)', status: 'blocked' },
    { id: '4', timestamp: '14:24:18', type: 'point_at', target: 'Meeting Note #41', detail: 'Flew to target coordinates', status: 'completed' }
  ]);

  // Bluey Question answering simulation
  const handleAskQuestion = (query: string) => {
    setMood('thinking');
    playChirp('chirp', chirpVolume);
    setSpeechText(`Thinking about: "${query}"...`);

    setTimeout(() => {
      setMood('talking');
      setTalkLevel(0.8);
      playChirp('happy', chirpVolume);

      // Tailored responses
      let reply = `I'm watching your ${platform === 'windows-android' ? 'Windows desktop' : 'Mac screen'}! Everything looks running smoothly.`;
      if (query.toLowerCase().includes('screen') || query.toLowerCase().includes("what's")) {
        reply = `I see your active apps and terminal. The dev server is live on port 3000!`;
        onPointAtSpot(350, 160, 'Main App Window');
      } else if (query.toLowerCase().includes('meeting') || query.toLowerCase().includes('note')) {
        reply = `I've logged 4 audio chunks today with speaker diarization. You can review them in the Notes drawer.`;
      } else if (query.toLowerCase().includes('point')) {
        reply = `Flying to point at that spot right now!`;
        onPointAtSpot(420, 260, 'Target');
      }

      setSpeechText(reply);

      // Finish talking after 4 seconds
      setTimeout(() => {
        setTalkLevel(0);
        setMood('happy');
        setTimeout(() => {
          setMood('listening');
          setSpeechText(null);
        }, 2500);
      }, 4000);
    }, 1200);
  };

  const onPointAtSpot = (x: number, y: number, label: string) => {
    setPointerPos({ x, y });
    setMood('pointing');
    playChirp('point', chirpVolume);
    setActions((prev) => [
      {
        id: Date.now().toString(),
        timestamp: new Date().toLocaleTimeString(),
        type: 'point_at_spot',
        target: label,
        detail: `Flew to (${Math.round(x)}, ${Math.round(y)})`,
        status: 'completed',
      },
      ...prev,
    ]);
  };

  const handleToggleSessionRecording = () => {
    const next = !isRecordingSession;
    setIsRecordingSession(next);
    if (next) {
      playChirp('wake', chirpVolume);
      setMood('listening');
    } else {
      playChirp('chirp', chirpVolume);
    }
  };

  const handleEmergencyStop = () => {
    setAllowComputerControl(false);
    setCursorMode('docked');
    setMood('sleepy');
    playChirp('sleep', chirpVolume);
    setSpeechText('Emergency Stop activated. PC automation halted.');
    setTimeout(() => setSpeechText(null), 3000);
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-[#090812] text-white font-plex-sans overflow-hidden">
      
      {/* Top Application Header Bar */}
      <header className="h-12 bg-[#12101e] border-b border-white/10 px-4 flex items-center justify-between shrink-0 z-30 select-none">
        <div className="flex items-center space-x-3">
          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#A9BCFF] via-[#6C86F5] to-[#2B2F8F] shadow flex items-center justify-center text-xs">
            🫐
          </div>
          <div>
            <h1 className="font-fredoka text-sm font-bold text-[#A9BCFF] tracking-wide flex items-center gap-1.5">
              Bluey Googly Eyes
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#5BE49B]/20 text-[#5BE49B] font-plex-mono font-normal">
                v2.1
              </span>
            </h1>
          </div>
        </div>

        {/* View Mode & Platform Selectors */}
        <div className="flex items-center space-x-2">
          {/* Platform Toggle: Windows + Android vs Mac + iOS */}
          <div className="bg-black/40 border border-white/10 p-0.5 rounded-xl flex items-center text-xs">
            <button
              onClick={() => {
                setPlatform('windows-android');
                playChirp('chirp');
              }}
              className={`px-2.5 py-1 rounded-lg transition font-medium text-[11px] flex items-center gap-1 ${
                platform === 'windows-android'
                  ? 'bg-[#4254D6] text-white shadow'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <span>🪟 Windows + Android</span>
            </button>
            <button
              onClick={() => {
                setPlatform('mac-ios');
                playChirp('chirp');
              }}
              className={`px-2.5 py-1 rounded-lg transition font-medium text-[11px] flex items-center gap-1 ${
                platform === 'mac-ios'
                  ? 'bg-[#4254D6] text-white shadow'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <Apple className="w-3 h-3" />
              <span>Mac + iPhone</span>
            </button>
          </div>

          {/* View Mode Switcher: Dual / Phone / Desktop */}
          <div className="bg-black/40 border border-white/10 p-0.5 rounded-xl flex items-center text-xs">
            <button
              onClick={() => setViewMode('dual')}
              className={`p-1.5 rounded-lg transition ${
                viewMode === 'dual' ? 'bg-white/20 text-white' : 'text-white/60 hover:text-white'
              }`}
              title="Dual Desktop + Phone Setup"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('desktop')}
              className={`p-1.5 rounded-lg transition ${
                viewMode === 'desktop' ? 'bg-white/20 text-white' : 'text-white/60 hover:text-white'
              }`}
              title="Desktop Only"
            >
              <Monitor className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('phone')}
              className={`p-1.5 rounded-lg transition ${
                viewMode === 'phone' ? 'bg-white/20 text-white' : 'text-white/60 hover:text-white'
              }`}
              title="Phone Companion Only"
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Install Guide button */}
          <button
            onClick={() => {
              setIsInstallGuideOpen(true);
              playChirp('chirp');
            }}
            className="px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-[#6C86F5]/20 to-[#A9BCFF]/20 hover:from-[#6C86F5]/30 hover:to-[#A9BCFF]/30 border border-[#6C86F5]/40 text-[#A9BCFF] transition text-xs font-semibold flex items-center gap-1.5 shadow-sm"
            title="Installation Guide"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Install Guide</span>
          </button>

          {/* Sessions & Guardrails quick buttons */}
          <button
            onClick={() => setIsSessionsOpen(true)}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[#A9BCFF] transition"
            title="Meeting Notes"
          >
            <FolderOpen className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setIsGuardrailsOpen(true)}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[#5BE49B] transition"
            title="Automation Guardrails"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Main Workspace Area */}
      <main className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        {/* Desktop Screen Area (Windows 11 or Mac) */}
        {(viewMode === 'dual' || viewMode === 'desktop') && (
          <div className="flex-1 h-full flex flex-col min-h-0 border-r border-white/10">
            {platform === 'windows-android' ? (
              <WindowsDesktopView
                mood={mood}
                setMood={setMood}
                isAwake={isAwake}
                setIsAwake={setIsAwake}
                speechText={speechText}
                pointerPos={pointerPos}
                setPointerPos={setPointerPos}
                cursorMode={cursorMode}
                setCursorMode={setCursorMode}
                pointerTrail={pointerTrail}
                setPointerTrail={setPointerTrail}
                allowComputerControl={allowComputerControl}
                setAllowComputerControl={setAllowComputerControl}
                onOpenNotes={() => setIsSessionsOpen(true)}
                onOpenComputerControl={() => setIsGuardrailsOpen(true)}
                onPointAtSpot={onPointAtSpot}
                phonePlacement={phonePlacement}
                setPhonePlacement={setPhonePlacement}
                onOpenInstallGuide={() => setIsInstallGuideOpen(true)}
              />
            ) : (
              <MacDesktopSimulation
                mood={mood}
                setMood={setMood}
                isAwake={isAwake}
                setIsAwake={setIsAwake}
                speechText={speechText}
                pointerPos={pointerPos}
                setPointerPos={setPointerPos}
                cursorMode={cursorMode}
                setCursorMode={setCursorMode}
                pointerTrail={pointerTrail}
                setPointerTrail={setPointerTrail}
                phonePlacement={phonePlacement}
                setPhonePlacement={setPhonePlacement}
                allowComputerControl={allowComputerControl}
                setAllowComputerControl={setAllowComputerControl}
                onOpenNotes={() => setIsSessionsOpen(true)}
                onOpenComputerControl={() => setIsGuardrailsOpen(true)}
                onPointAtSpot={onPointAtSpot}
              />
            )}
          </div>
        )}

        {/* Phone Companion Area (Android Device or iPhone) */}
        {(viewMode === 'dual' || viewMode === 'phone') && (
          <div
            className={`${
              viewMode === 'dual' ? 'w-full md:w-[420px] shrink-0' : 'flex-1'
            } h-full bg-[#0a0814] flex flex-col items-center justify-center relative overflow-hidden`}
          >
            <AndroidPhoneView
              mood={mood}
              setMood={setMood}
              isAwake={isAwake}
              setIsAwake={setIsAwake}
              talkLevel={talkLevel}
              speechText={speechText}
              onAskQuestion={handleAskQuestion}
              onOpenSessions={() => setIsSessionsOpen(true)}
              onOpenSettings={() => setIsGuardrailsOpen(true)}
              chirpVolume={chirpVolume}
              setChirpVolume={setChirpVolume}
              pairedDeviceName={platform === 'windows-android' ? 'Windows 11 PC' : 'MacBook Pro'}
              isPaired={true}
              isRecordingSession={isRecordingSession}
              onToggleSessionRecording={handleToggleSessionRecording}
              onOpenInstallGuide={() => setIsInstallGuideOpen(true)}
            />
          </div>
        )}
      </main>

      {/* Meeting Sessions Drawer */}
      <SessionDrawer
        isOpen={isSessionsOpen}
        onClose={() => setIsSessionsOpen(false)}
        sessions={sessions}
        isRecording={isRecordingSession}
        onToggleRecording={handleToggleSessionRecording}
      />

      {/* PC Automation Guardrails Modal */}
      <ComputerControlModal
        isOpen={isGuardrailsOpen}
        onClose={() => setIsGuardrailsOpen(false)}
        allowControl={allowComputerControl}
        setAllowControl={setAllowComputerControl}
        actions={actions}
        onEmergencyStop={handleEmergencyStop}
      />

      {/* Installation Guide Modal */}
      <InstallGuideModal
        isOpen={isInstallGuideOpen}
        onClose={() => setIsInstallGuideOpen(false)}
        onInstallPwa={handleInstallPwa}
      />
    </div>
  );
}

export default App;
