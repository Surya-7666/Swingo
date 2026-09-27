import React from 'react';
import { 
  Code2, 
  Cpu, 
  ShieldCheck, 
  ExternalLink, 
  MousePointer, 
  ArrowDown, 
  Layers, 
  CheckCircle2 
} from 'lucide-react';
import swingoLogo from '../assets/swingo-logo.png';

export default function AboutTab() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white">About Swingo</h2>
        <p className="text-xs text-slate-400 mt-1">
          A lightweight, physics-driven ambient desktop companion built for Windows.
        </p>
      </div>

      {/* Hero Brand Card */}
      <div className="p-6 rounded-2xl border border-white/[0.08] bg-gradient-to-br from-indigo-950/40 via-[#0d121f] to-purple-950/20 backdrop-blur-md relative overflow-hidden">
        <div className="relative z-10 flex items-start justify-between">
          <div className="flex items-center gap-4">

            {/* Swingo Logo */}
            <div className="w-14 h-14 rounded-2xl overflow-hidden border border-white/[0.08] shadow-xl shadow-indigo-600/40 bg-white/[0.03] flex items-center justify-center p-2">
              <img 
                src={swingoLogo} 
                alt="Swingo Logo" 
                className="w-full h-full object-contain" 
              />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-white tracking-tight">SWINGO</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  v1.2.0 Stable
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Hang anything. Let it swing. Physical OS shortcuts at your fingertip.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Active Companion
          </div>
        </div>
      </div>

      {/* Gesture Mechanics Guide */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Interaction Mechanics
        </h3>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-white/[0.06] bg-white/[0.02] flex items-start gap-3">
            <div className="p-2.5 rounded-lg bg-indigo-600/20 text-indigo-400">
              <MousePointer className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-white">Direct Manipulation & Flick</h4>
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                Click and drag the charm to swing it. Release with velocity to impart inertia and realistic rope harmonics across the screen.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-white/[0.06] bg-white/[0.02] flex items-start gap-3">
            <div className="p-2.5 rounded-lg bg-red-600/20 text-red-400">
              <ArrowDown className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-white">Full-Stretch Shortcut Trigger</h4>
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                Pull straight downwards past 95% of maximum tensile limit. The cord glows crimson and executes your designated Windows shortcut.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tech Specifications */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Engine Architecture
        </h3>

        <div className="grid grid-cols-3 gap-3">
          <div className="p-4 rounded-xl border border-white/[0.06] bg-white/[0.02]">
            <div className="flex items-center gap-2 text-indigo-400 mb-2">
              <Cpu className="w-4 h-4" />
              <span className="text-xs font-semibold text-white">Verlet Physics</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              14-node catenary particle simulation with aerodynamic damping and exponential tensile constraint solving at 120 Hz.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-white/[0.06] bg-white/[0.02]">
            <div className="flex items-center gap-2 text-indigo-400 mb-2">
              <Layers className="w-4 h-4" />
              <span className="text-xs font-semibold text-white">Frameless Canvas</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Transparent, hardware-accelerated click-through window overlay utilizing dynamic mouse passthrough via Electron.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-white/[0.06] bg-white/[0.02]">
            <div className="flex items-center gap-2 text-indigo-400 mb-2">
              <ShieldCheck className="w-4 h-4" />
              <span className="text-xs font-semibold text-white">Native System IPC</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Zero-latency command execution interfacing with Windows workstation locks, shell automation, and multimedia controls.
            </p>
          </div>
        </div>
      </div>

      {/* Stack & System Info */}
      <div className="p-4 rounded-xl border border-white/[0.06] bg-white/[0.02] flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Code2 className="w-4 h-4 text-indigo-400" />
          <span>Built with Electron, React 18, Vite, Tailwind CSS & HTML5 Canvas</span>
        </div>
        <span className="text-[11px] text-slate-500 font-mono">Platform: Windows x64</span>
      </div>
    </div>
  );
}