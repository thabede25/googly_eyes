import React, { useState, useEffect } from 'react';
import { Mood, PALETTE } from '../types';
import { FaceCanvas } from './FaceCanvas';
import {
  Wifi,
  Battery,
  Volume2,
  FolderOpen,
  Mic,
  MicOff,
  Sparkles,
  Sliders,
  ChevronRight,
  RefreshCw,
  Copy,
  Info
} from 'lucide-react';
import { playChirp } from '../utils/audio';

interface AndroidPhoneViewProps {
  mood: Mood;
  setMood: (m: Mood) => void;
  isAwake: boolean;
  setIsAwake: (a: boolean) => void;
  talkLevel: number;
  speechText: string | null;
  onAskQuestion: (query: string) => void;
  onOpenSessions: () => void;
  onOpenSettings: () => void;
  chirpVolume: number;
  setChirpVolume: (v: number) => void;
  pairedDeviceName: string;
  isPaired: boolean;
  isRecordingSession: boolean;
  onToggleSessionRecording: () => void;
  onOpenInstallGuide?: () => void;
}

export const AndroidPhoneView: React.FC<AndroidPhoneViewProps> = ({
  mood,
  setMood,
  isAwake,
  setIsAwake,
  talkLevel,
  speechText,
  onAskQuestion,
  onOpenSessions,
  onOpenSettings,
  chirpVolume,
  setChirpVolume,
  pairedDeviceName,
  isPaired,
  isRecordingSession,
  onToggleSessionRecording,
  onOpenInstallGuide,
}) => {
  const [isPressingFace, setIsPressingFace] = useState(false);
  const [touchGaze, setTouchGaze] = useState<{ x: number; y: number } | null>(null);
  const [transcriptionInput, setTranscriptionInput] = useState('');
  const [showQuickSettings, setShowQuickSettings] = useState(false);
  const [currentTime, setCurrentTime] = useState('14:25');

  useEffect(() => {
    const updateClock = () => {
      const d = new Date();
      setCurrentTime(d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
    };
    updateClock();
    const timer = setInterval(updateClock, 10000);
    return () => clearInterval(timer);
  }, []);

  const handleDoubleTap = () => {
    const nextAwake = !isAwake;
    setIsAwake(nextAwake);
    if (nextAwake) {
      setMood('listening');
      playChirp('wake', chirpVolume);
    } else {
      setMood('sleepy');
      playChirp('sleep', chirpVolume);
    }
  };

  const handlePressStart = () => {
    setIsPressingFace(true);
    setMood('listening');
    playChirp('chirp', chirpVolume);
  };

  const handlePressEnd = () => {
    if (!isPressingFace) return;
    setIsPressingFace(false);
    // Simulate user asking question
    const sampleQueries = [
      "What's on my Windows screen right now?",
      "Can you summarize this meeting chunk?",
      "Point to the deployment button on my desktop",
      "How does your cursor fly to my mouse?",
      "Help me inspect this code file"
    ];
    const picked = sampleQueries[Math.floor(Math.random() * sampleQueries.length)];
    onAskQuestion(picked);
  };

  const handleManualAsk = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transcriptionInput.trim()) return;
    onAskQuestion(transcriptionInput);
    setTranscriptionInput('');
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-2 sm:p-4 bg-black/40">
      {/* Android Device Frame (Pixel / Galaxy Style) */}
      <div className="relative w-full max-w-[420px] aspect-[9/19.5] max-h-[92vh] bg-[#0c0a13] rounded-[44px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] border-[7px] border-[#252236] flex flex-col overflow-hidden ring-1 ring-white/10">
        
        {/* Android Punch Hole Camera */}
        <div className="absolute top-3.5 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-black border border-white/15 z-50 flex items-center justify-center pointer-events-none">
          <div className="w-1.5 h-1.5 rounded-full bg-[#151936]"></div>
        </div>

        {/* Android Status Bar */}
        <div className="h-10 px-6 flex items-center justify-between text-xs text-white/80 z-40 select-none bg-gradient-to-b from-black/80 to-transparent">
          <div className="font-plex-sans text-[13px] font-medium tracking-tight">
            {currentTime}
          </div>
          <div className="flex items-center space-x-2.5 text-white/90">
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#6C86F5]/20 text-[#A9BCFF] font-plex-mono">
              5G
            </span>
            <Wifi className="w-3.5 h-3.5" />
            <div className="flex items-center gap-1">
              <span className="text-[11px] font-plex-mono">88%</span>
              <Battery className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Top Controls Overlay on Android Screen */}
        <div className="absolute top-11 inset-x-0 px-4 flex items-center justify-between z-40">
          {/* Pair Status Pill */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1e1b29]/80 backdrop-blur-md border border-white/10 text-xs shadow-lg">
            <span className={`w-2 h-2 rounded-full ${isPaired ? 'bg-[#5BE49B] animate-pulse' : 'bg-amber-400'}`}></span>
            <span className="text-white/80 font-plex-sans text-[11px] truncate max-w-[130px]">
              {isPaired ? pairedDeviceName : 'Searching Windows PC…'}
            </span>
          </div>

          {/* Quick Buttons: Session Notes & Settings */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={onToggleSessionRecording}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition shadow-lg ${
                isRecordingSession
                  ? 'bg-[#E5547A] text-white animate-pulse'
                  : 'bg-white/10 hover:bg-white/20 text-white/90 border border-white/10'
              }`}
              title="Record Meeting Session"
            >
              <span className={`w-2 h-2 rounded-full ${isRecordingSession ? 'bg-white' : 'bg-[#E5547A]'}`}></span>
              <span className="text-[11px] font-fredoka">{isRecordingSession ? 'Recording' : 'Record'}</span>
            </button>

            <button
              onClick={onOpenSessions}
              className="p-2 rounded-full bg-[#1e1b29]/80 hover:bg-[#1e1b29] text-[#A9BCFF] border border-white/10 transition shadow-lg"
              title="Meeting Transcripts & Notes"
            >
              <FolderOpen className="w-4 h-4" />
            </button>

            <button
              onClick={() => setShowQuickSettings(!showQuickSettings)}
              className="p-2 rounded-full bg-[#1e1b29]/80 hover:bg-[#1e1b29] text-white/80 border border-white/10 transition shadow-lg"
              title="Bluey Settings"
            >
              <Sliders className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Settings Dropdown Overlay */}
        {showQuickSettings && (
          <div className="absolute top-24 right-4 w-64 bg-[#1e1b29]/95 backdrop-blur-xl border border-white/15 rounded-2xl p-4 shadow-2xl z-50 text-xs text-white space-y-3 animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <span className="font-fredoka text-sm text-[#A9BCFF]">Android Sound & Mood</span>
              <button
                onClick={() => setShowQuickSettings(false)}
                className="text-white/40 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>

            <div>
              <div className="flex justify-between text-[11px] text-white/70 mb-1">
                <span>Chirp Volume</span>
                <span>{Math.round(chirpVolume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={chirpVolume}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setChirpVolume(val);
                  playChirp('chirp', val);
                }}
                className="w-full accent-[#6C86F5]"
              />
            </div>

            <div>
              <span className="text-[11px] text-white/70 block mb-1">Set Character Mood</span>
              <div className="grid grid-cols-2 gap-1.5">
                {(['listening', 'happy', 'talking', 'thinking', 'pointing', 'sleepy', 'resting'] as Mood[]).map((m) => (
                  <button
                    key={m}
                    onClick={() => {
                      setMood(m);
                      playChirp('bounce', chirpVolume);
                      setShowQuickSettings(false);
                    }}
                    className={`px-2 py-1.5 rounded-lg text-left capitalize text-[11px] transition ${
                      mood === m ? 'bg-[#4254D6] text-white font-semibold' : 'bg-white/5 hover:bg-white/10 text-white/70'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-white/10 space-y-2">
              {onOpenInstallGuide && (
                <button
                  onClick={() => {
                    setShowQuickSettings(false);
                    onOpenInstallGuide();
                  }}
                  className="w-full py-1.5 px-3 rounded-lg bg-[#6C86F5]/20 hover:bg-[#6C86F5]/30 text-[#A9BCFF] text-[11px] font-semibold text-center transition flex items-center justify-center gap-1.5"
                >
                  <span>📖 View Installation Guide</span>
                </button>
              )}
              <div className="text-[10px] text-white/50 text-center">
                Double-tap Bluey to wake him or put him to sleep. Press & hold to speak!
              </div>
            </div>
          </div>
        )}

        {/* Speech Bubble on Phone (when he answers or talks) */}
        {speechText && (
          <div className="absolute top-26 inset-x-5 z-40 bg-white/95 text-[#17151F] p-3 rounded-2xl rounded-tl-sm shadow-2xl border border-indigo-200 animate-in fade-in slide-in-from-bottom-2 duration-200">
            <div className="flex items-start gap-2">
              <span className="text-base">🫐</span>
              <p className="font-plex-sans text-xs leading-relaxed font-medium">
                {speechText}
              </p>
            </div>
          </div>
        )}

        {/* The Animated Face Canvas */}
        <div className="flex-1 relative w-full h-full bg-black">
          <FaceCanvas
            mood={mood}
            targetGaze={touchGaze}
            talkLevel={talkLevel}
            isAwake={isAwake}
            onDoubleTap={handleDoubleTap}
            onPressStart={handlePressStart}
            onPressEnd={handlePressEnd}
            onTouchMoveGaze={setTouchGaze}
            className="w-full h-full"
          />

          {/* Press and Hold Visual Hint Overlay */}
          <div className="absolute bottom-16 inset-x-0 flex flex-col items-center justify-center pointer-events-none text-center px-4">
            {isPressingFace ? (
              <div className="px-4 py-1.5 rounded-full bg-[#E5547A]/80 backdrop-blur-md text-white text-xs font-semibold animate-pulse flex items-center gap-2">
                <Mic className="w-3.5 h-3.5" />
                Listening to you... Release to answer
              </div>
            ) : (
              <div className="px-3.5 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white/70 text-[11px] font-plex-sans">
                {isAwake ? 'Hold face to ask • Double tap to sleep' : 'Double tap to wake Bluey'}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Bar: Android Quick Ask & Navigation Bar */}
        <div className="bg-[#121019] border-t border-white/10 px-4 pt-2.5 pb-2 z-40">
          <form onSubmit={handleManualAsk} className="flex items-center gap-2 mb-2">
            <input
              type="text"
              value={transcriptionInput}
              onChange={(e) => setTranscriptionInput(e.target.value)}
              placeholder="Ask Bluey anything..."
              className="flex-1 bg-[#1e1b29] border border-white/10 rounded-full px-4 py-2 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#6C86F5]"
            />
            <button
              type="submit"
              disabled={!transcriptionInput.trim()}
              className="p-2 rounded-full bg-gradient-to-r from-[#6C86F5] to-[#4254D6] text-white disabled:opacity-40 transition shadow-md"
              title="Send to Bluey"
            >
              <Sparkles className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Android Gesture Bar */}
          <div className="flex items-center justify-center pt-1 pb-0.5">
            <div className="w-32 h-1 bg-white/40 rounded-full"></div>
          </div>
        </div>

      </div>
    </div>
  );
};
