export type Mood = 'listening' | 'resting' | 'thinking' | 'talking' | 'pointing' | 'happy' | 'sleepy';

export const MOODS: { id: Mood; title: string; description: string }[] = [
  { id: 'listening', title: 'Listening', description: 'Attentive, eyes tracking mouse closely' },
  { id: 'happy', title: 'Happy', description: 'Rosy blush, joyful smile squint' },
  { id: 'talking', title: 'Talking', description: 'Speaking with mouth movement and body bounce' },
  { id: 'thinking', title: 'Thinking', description: 'Looking up-right with animated thought dots' },
  { id: 'pointing', title: 'Pointing', description: 'Focused, laser-locked on on-screen targets' },
  { id: 'sleepy', title: 'Sleepy', description: 'Heavy, slow drooping eyelids' },
  { id: 'resting', title: 'Resting', description: 'Peaceful slumber with floating Zs' },
];

export const PALETTE = {
  berry1: '#A9BCFF',
  berry2: '#6C86F5',
  berry3: '#4254D6',
  berry4: '#2B2F8F',
  nose: '#1C1F66',
  ink: '#17151F',
  inkSoft: '#B9B2CC',
  panel: '#1E1B29',
  blush: '#F3A6D8',
  tongue: '#E58BC4',
  green: '#5BE49B',
  pink: '#E5547A',
};

export interface FaceState {
  gazeX: number; // -1 to 1
  gazeY: number; // -1 to 1
  mood: Mood;
  talk: number;  // 0 to 1
}

export type CursorMode = 'docked' | 'following' | 'pinned';
export type PointerTrail = 'comet' | 'string' | 'none';

export interface MeetingSession {
  id: string;
  title: string;
  date: string;
  durationSeconds: number;
  audioChunks: number;
  transcripts: {
    speaker: string;
    time: string;
    text: string;
  }[];
  summary: string;
  actionItems: string[];
}

export interface ScreenTarget {
  id: string;
  name: string;
  category: string;
  xPercent: number; // 0-100%
  yPercent: number; // 0-100%
  description: string;
}

export interface ComputerAction {
  id: string;
  timestamp: string;
  type: 'look_at_screen' | 'point_at' | 'point_at_spot' | 'click' | 'type_text' | 'scroll' | 'open_app';
  target?: string;
  detail: string;
  status: 'completed' | 'blocked' | 'in_progress';
}
