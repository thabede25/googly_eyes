import React from 'react';
import { ComputerAction } from '../types';
import {
  X,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Lock,
  PowerOff,
  CheckCircle2,
  Terminal,
  Activity
} from 'lucide-react';

interface ComputerControlModalProps {
  isOpen: boolean;
  onClose: () => void;
  allowControl: boolean;
  setAllowControl: (v: boolean) => void;
  actions: ComputerAction[];
  onEmergencyStop: () => void;
}

export const ComputerControlModal: React.FC<ComputerControlModalProps> = ({
  isOpen,
  onClose,
  allowControl,
  setAllowControl,
  actions,
  onEmergencyStop,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#1c192b] border border-white/15 rounded-3xl shadow-2xl p-6 text-white space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-fredoka text-xl text-white">PC Automation & Guardrails</h2>
              <p className="text-xs text-white/50">Accessibility & Computer Control Safeguards</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-white/10 text-white/40 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Master Control Toggle */}
        <div className="p-4 rounded-2xl bg-[#141220] border border-white/10 flex items-center justify-between">
          <div>
            <div className="font-fredoka text-sm text-white">Let Him Use the Computer</div>
            <p className="text-xs text-white/50 max-w-md mt-0.5">
              Allows Bluey to click, type, press shortcuts, scroll, drag, and open apps on screen.
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={allowControl}
              onChange={(e) => setAllowControl(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-12 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#5BE49B]"></div>
          </label>
        </div>

        {/* Guardrail Rules */}
        <div className="space-y-2">
          <div className="text-xs font-bold text-white/70 uppercase tracking-wider">
            Built-in Safety Guardrails
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-white">Acts only when requested</span>
                <p className="text-[11px] text-white/50">Never initiates computer actions unprompted.</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-white">Confirms out loud</span>
                <p className="text-[11px] text-white/50">Asks verbal confirmation before hard-to-undo actions.</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-start gap-2.5">
              <Lock className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-white">Password & Logout Lock</span>
                <p className="text-[11px] text-white/50">Strictly refuses credential forms, lock, and shutdown.</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-start gap-2.5">
              <PowerOff className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-white">Emergency Stop: Ctrl+Alt+S</span>
                <p className="text-[11px] text-white/50">Immediately halts any in-progress cursor or keystroke.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Log */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-white/70 uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-[#6C86F5]" />
              Recent Automation Audit Log
            </span>
            <span className="text-[10px] text-white/40 font-plex-mono">{actions.length} events</span>
          </div>

          <div className="max-h-36 overflow-y-auto space-y-1.5 p-2 rounded-xl bg-[#141220] border border-white/10 font-plex-mono text-[11px]">
            {actions.map((act) => (
              <div key={act.id} className="flex items-center justify-between py-1 px-2 rounded hover:bg-white/5">
                <span className="text-white/40">{act.timestamp}</span>
                <span className="text-[#A9BCFF] font-semibold">{act.type}</span>
                <span className="text-white/70 truncate max-w-xs">{act.detail}</span>
                <span className="text-emerald-400 font-bold">{act.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-2 border-t border-white/10 flex items-center justify-between">
          <button
            onClick={onEmergencyStop}
            className="px-4 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 font-semibold text-xs transition flex items-center gap-1.5"
          >
            <PowerOff className="w-3.5 h-3.5" />
            Emergency Stop (Ctrl+Alt+S)
          </button>
          
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
