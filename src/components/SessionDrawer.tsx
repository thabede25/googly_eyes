import React, { useState } from 'react';
import { MeetingSession, PALETTE } from '../types';
import {
  X,
  FileText,
  Copy,
  Check,
  Play,
  Pause,
  Download,
  Calendar,
  Clock,
  Sparkles,
  Users,
  Mic
} from 'lucide-react';
import { playChirp } from '../utils/audio';

interface SessionDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  sessions: MeetingSession[];
  isRecording: boolean;
  onToggleRecording: () => void;
}

export const SessionDrawer: React.FC<SessionDrawerProps> = ({
  isOpen,
  onClose,
  sessions,
  isRecording,
  onToggleRecording,
}) => {
  const [selectedSessionId, setSelectedSessionId] = useState<string>(sessions[0]?.id || '');
  const [copied, setCopied] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  if (!isOpen) return null;

  const activeSession = sessions.find((s) => s.id === selectedSessionId) || sessions[0];

  const handleCopyAgentPrompt = () => {
    if (!activeSession) return;
    const prompt = `You are an AI assistant processing notes from Bluey.
Session Date: ${activeSession.date}
Location: ~/Documents/Bluey Notes/${activeSession.date} ${activeSession.id}/
Files available:
- notes.md: Meeting summary and action items
- session.json: Diarized raw transcript with timestamps
- audio/: 5-minute chunk audio recordings

Summary:
${activeSession.summary}

Action Items:
${activeSession.actionItems.map((a) => `- ${a}`).join('\n')}

Please synthesize the above notes and execute follow-ups.`;

    navigator.clipboard.writeText(prompt);
    setCopied(true);
    playChirp('chirp');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadMarkdown = () => {
    if (!activeSession) return;
    const content = `# Meeting Notes: ${activeSession.title}
Date: ${activeSession.date}
Duration: ${Math.floor(activeSession.durationSeconds / 60)} minutes
Chunks: ${activeSession.audioChunks} (5-min audio intervals)

## Summary
${activeSession.summary}

## Action Items
${activeSession.actionItems.map((a) => `- [ ] ${a}`).join('\n')}

## Diarized Transcripts
${activeSession.transcripts.map((t) => `**[${t.time}] ${t.speaker}:** ${t.text}`).join('\n\n')}
`;

    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `notes-${activeSession.id}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl h-[85vh] bg-[#1a1727] border border-white/15 rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden">
        
        {/* Left Sidebar: Session List */}
        <div className="w-full md:w-80 bg-[#141220] border-r border-white/10 flex flex-col">
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#6C86F5] to-[#A9BCFF] flex items-center justify-center text-white font-bold text-sm shadow">
                🫐
              </div>
              <div>
                <h3 className="font-fredoka text-lg text-white">Bluey Sessions</h3>
                <p className="text-[11px] text-white/50">Meeting Notes & Audio</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-white/10 text-white/50 hover:text-white md:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Record button */}
          <div className="p-3 border-b border-white/10">
            <button
              onClick={onToggleRecording}
              className={`w-full py-2.5 px-4 rounded-xl font-fredoka text-sm flex items-center justify-center gap-2 transition shadow-md ${
                isRecording
                  ? 'bg-[#E5547A] text-white animate-pulse'
                  : 'bg-gradient-to-r from-[#6C86F5] to-[#4254D6] text-white hover:opacity-95'
              }`}
            >
              <Mic className="w-4 h-4" />
              <span>{isRecording ? 'Stop Recording Session' : 'Start New Session'}</span>
            </button>
            <p className="text-[10px] text-white/40 text-center mt-1.5">
              {isRecording ? 'Recording 5-minute audio chunks...' : 'Mic stays open, diarizes speakers.'}
            </p>
          </div>

          {/* Session Items List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
            {sessions.map((session) => (
              <button
                key={session.id}
                onClick={() => {
                  setSelectedSessionId(session.id);
                  playChirp('chirp');
                }}
                className={`w-full p-3 rounded-2xl text-left transition flex flex-col space-y-1 ${
                  selectedSessionId === session.id
                    ? 'bg-[#29253d] border border-[#6C86F5]/40 text-white'
                    : 'hover:bg-white/5 text-white/70'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-fredoka font-semibold text-sm truncate text-[#A9BCFF]">
                    {session.title}
                  </span>
                  <span className="text-[10px] text-white/40 font-plex-mono">
                    {Math.floor(session.durationSeconds / 60)}m
                  </span>
                </div>
                <div className="flex items-center gap-3 text-[11px] text-white/50">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {session.date}
                  </span>
                  <span>{session.audioChunks} chunks</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right Pane: Session Detail & Transcripts */}
        <div className="flex-1 flex flex-col bg-[#1a1727] overflow-hidden">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-[#1f1b30]">
            <div>
              <h2 className="font-fredoka text-xl text-white flex items-center gap-2">
                {activeSession?.title}
              </h2>
              <p className="text-xs text-white/50 flex items-center gap-2 mt-0.5 font-plex-mono">
                <span>{activeSession?.date}</span>
                <span>•</span>
                <span>ID: {activeSession?.id.slice(0, 8)}</span>
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={handleCopyAgentPrompt}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-xs font-semibold text-[#A9BCFF] transition flex items-center gap-1.5"
                title="Copy prompt for agent"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied Prompt!' : 'Copy prompt for agent'}</span>
              </button>

              <button
                onClick={handleDownloadMarkdown}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition"
                title="Export notes.md"
              >
                <Download className="w-4 h-4" />
              </button>

              <button
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-white/10 text-white/50 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            {/* Audio Chunk Simulator Player */}
            <div className="p-4 rounded-2xl bg-[#141220] border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setIsPlayingAudio(!isPlayingAudio);
                    playChirp('chirp');
                  }}
                  className="w-10 h-10 rounded-full bg-[#6C86F5] hover:bg-[#5873ea] text-white flex items-center justify-center transition shadow-lg"
                >
                  {isPlayingAudio ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                </button>
                <div>
                  <div className="text-xs font-semibold text-white">5-Minute Audio Chunks (AAC)</div>
                  <div className="text-[11px] text-white/50 font-plex-mono">
                    chunk-001.m4a • 128 kbps • gpt-transcribe diarized
                  </div>
                </div>
              </div>

              {/* Animated waveform bars */}
              <div className="flex items-center gap-1 h-6">
                {[12, 24, 18, 30, 20, 14, 28, 22, 16, 26, 19, 29].map((h, i) => (
                  <span
                    key={i}
                    style={{ height: isPlayingAudio ? `${h}px` : '4px' }}
                    className="w-1 bg-[#6C86F5] rounded-full transition-all duration-300"
                  ></span>
                ))}
              </div>
            </div>

            {/* AI Summary Card */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#A9BCFF] uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                Meeting Summary
              </div>
              <p className="text-sm text-white/90 leading-relaxed bg-[#201d32] p-4 rounded-2xl border border-white/5">
                {activeSession?.summary}
              </p>
            </div>

            {/* Action items */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" />
                Action Items
              </div>
              <div className="space-y-1.5">
                {activeSession?.actionItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 p-2.5 rounded-xl bg-white/5 border border-white/5 text-xs text-white/90"
                  >
                    <span className="w-4 h-4 rounded-full border border-emerald-400/50 flex items-center justify-center text-[10px] text-emerald-400">
                      ✓
                    </span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Diarized Transcripts */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-white/70 uppercase tracking-wider">
                <Users className="w-3.5 h-3.5" />
                Diarized Transcripts (Speaker Separation)
              </div>
              <div className="space-y-2.5">
                {activeSession?.transcripts.map((t, idx) => (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-2xl border text-xs leading-relaxed ${
                      t.speaker.toLowerCase().includes('bluey')
                        ? 'bg-[#2b2746] border-[#6C86F5]/30'
                        : 'bg-white/5 border-white/5'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-[#A9BCFF] flex items-center gap-1.5">
                        {t.speaker.toLowerCase().includes('bluey') ? '🫐 ' : '👤 '}
                        {t.speaker}
                      </span>
                      <span className="text-[10px] text-white/40 font-plex-mono">{t.time}</span>
                    </div>
                    <p className="text-white/80">{t.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
