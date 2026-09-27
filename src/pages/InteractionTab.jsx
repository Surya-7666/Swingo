import React from 'react';
import {
  Lock,
  Monitor,
  Scissors,
  VolumeX,
  Check,
  MousePointer2,
  Zap,
  ArrowDown,
} from 'lucide-react';

const STRETCH_ACTIONS = [
  {
    id: 'win-l',
    name: 'Lock Screen',
    shortcut: 'Win + L',
    description: 'Instantly lock your Windows workstation.',
    icon: Lock,
  },
  {
    id: 'win-d',
    name: 'Show Desktop',
    shortcut: 'Win + D',
    description: 'Minimize your windows and reveal the desktop.',
    icon: Monitor,
  },
  {
    id: 'win-shift-s',
    name: 'Screen Snipping',
    shortcut: 'Win + Shift + S',
    description: 'Open Windows screen capture instantly.',
    icon: Scissors,
  },
  {
    id: 'mute',
    name: 'Mute Volume',
    shortcut: 'Mute Key',
    description: 'Toggle the system audio output.',
    icon: VolumeX,
  },
];

export default function InteractionTab({
  selectedAction,
  onSelectAction,
}) {
  const selected =
    STRETCH_ACTIONS.find(
      (action) => action.id === selectedAction
    ) || STRETCH_ACTIONS[0];

  const SelectedIcon = selected.icon;

  return (
    <div className="w-full min-h-full pb-10">
      {/* ====================================================== */}
      {/* Header */}
      {/* ====================================================== */}

      <header className="flex items-end justify-between mb-7">
        <div>
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-1 h-5 rounded-full bg-gradient-to-b from-indigo-400 to-blue-500 shadow-[0_0_12px_rgba(99,102,241,0.45)]" />

            <h2 className="text-[22px] font-semibold tracking-[-0.02em] text-white">
              Interaction
            </h2>
          </div>

          <p className="ml-3.5 text-[11px] text-slate-500">
            Decide what happens when you pull Swingo to its limit.
          </p>
        </div>

        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/[0.055] bg-white/[0.02]">
          <Zap className="w-3 h-3 text-indigo-400" />

          <span className="text-[9px] uppercase tracking-[0.14em] text-slate-500">
            One action active
          </span>
        </div>
      </header>

      {/* ====================================================== */}
      {/* Interaction Preview */}
      {/* ====================================================== */}

      <section className="relative h-[225px] overflow-hidden rounded-[18px] border border-white/[0.07] bg-[#090e18] mb-8">
        {/* Ambient glow */}
        <div className="pointer-events-none absolute -left-24 -top-24 w-[350px] h-[350px] rounded-full bg-indigo-600/[0.09] blur-[90px]" />

        <div className="pointer-events-none absolute right-[-100px] bottom-[-180px] w-[400px] h-[400px] rounded-full bg-blue-600/[0.06] blur-[100px]" />

        {/* Grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.13]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(148,163,184,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.08) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />

        {/* Top highlight */}
        <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />

        {/* Left information */}
        <div className="absolute left-5 top-5 z-10">
          <div className="flex items-center gap-2">
            <MousePointer2 className="w-3.5 h-3.5 text-indigo-400" />

            <span className="text-[9px] uppercase tracking-[0.18em] font-semibold text-slate-500">
              Pull interaction
            </span>
          </div>

          <h3 className="text-[16px] font-semibold text-white mt-2">
            Pull down → release
          </h3>

          <p className="text-[10px] text-slate-600 mt-1">
            Reach the stretch limit to trigger your selected action.
          </p>
        </div>

        {/* Rope visual */}
        <div className="absolute left-1/2 top-0 -translate-x-1/2 flex flex-col items-center">
          {/* Anchor */}
          <div className="w-2.5 h-2.5 rounded-full bg-slate-500 shadow-[0_0_10px_rgba(148,163,184,0.3)]" />

          {/* Rope */}
          <div className="relative w-[3px] h-[115px] bg-gradient-to-b from-slate-500 via-indigo-400 to-indigo-500 rounded-full shadow-[0_0_12px_rgba(99,102,241,0.25)]">
            <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-px bg-white/20" />

            {/* Pull marker */}
            <div className="absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2 w-7 h-7 rounded-full border border-indigo-400/30 bg-indigo-500/[0.10] shadow-[0_0_20px_rgba(99,102,241,0.15)] flex items-center justify-center">
              <ArrowDown className="w-3.5 h-3.5 text-indigo-300" />
            </div>
          </div>

          {/* Charm */}
          <div className="relative mt-4 w-[55px] h-[55px] rounded-full border border-indigo-400/20 bg-indigo-500/[0.06] flex items-center justify-center shadow-[0_12px_30px_rgba(0,0,0,0.35)]">
            <div className="absolute inset-0 rounded-full bg-indigo-500/[0.08] blur-xl" />

            <SelectedIcon className="relative w-5 h-5 text-indigo-300" />
          </div>
        </div>

        {/* Selected action */}
        <div className="absolute right-5 bottom-5">
          <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-[11px] border border-indigo-500/20 bg-indigo-500/[0.07] backdrop-blur-md">
            <div className="w-7 h-7 rounded-[8px] bg-indigo-500/[0.12] flex items-center justify-center">
              <SelectedIcon className="w-3.5 h-3.5 text-indigo-300" />
            </div>

            <div>
              <p className="text-[9px] uppercase tracking-[0.12em] text-slate-600">
                Selected action
              </p>

              <p className="text-[10px] font-medium text-slate-300 mt-0.5">
                {selected.name}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================== */}
      {/* Action Selection */}
      {/* ====================================================== */}

      <section>
        <div className="flex items-end justify-between mb-4">
          <div>
            <h3 className="text-[12px] font-medium text-slate-200">
              Stretch action
            </h3>

            <p className="text-[9px] text-slate-600 mt-1">
              Choose one Windows action for the pull gesture.
            </p>
          </div>

          <span className="text-[9px] uppercase tracking-[0.14em] text-slate-700">
            {STRETCH_ACTIONS.length} actions
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {STRETCH_ACTIONS.map((action) => {
            const Icon = action.icon;
            const isSelected =
              selectedAction === action.id;

            return (
              <button
                key={action.id}
                type="button"
                onClick={() =>
                  onSelectAction(action.id)
                }
                className={`group relative min-h-[112px] overflow-hidden rounded-[14px] border text-left transition-all duration-200 ${
                  isSelected
                    ? 'border-indigo-500/45 bg-indigo-500/[0.08] shadow-[0_12px_30px_rgba(79,70,229,0.10)]'
                    : 'border-white/[0.055] bg-[#0b1019] hover:border-white/[0.11] hover:bg-white/[0.025]'
                }`}
              >
                {/* Selected glow */}
                {isSelected && (
                  <div className="pointer-events-none absolute -right-10 -top-10 w-28 h-28 rounded-full bg-indigo-500/[0.08] blur-2xl" />
                )}

                {/* Active indicator */}
                <div
                  className={`absolute left-0 top-5 bottom-5 w-[2px] rounded-r-full transition-all ${
                    isSelected
                      ? 'bg-gradient-to-b from-indigo-400 to-blue-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]'
                      : 'bg-transparent'
                  }`}
                />

                <div className="relative flex items-start gap-3.5 p-4">
                  {/* Icon */}
                  <div
                    className={`w-9 h-9 shrink-0 rounded-[10px] border flex items-center justify-center transition-all ${
                      isSelected
                        ? 'border-indigo-500/25 bg-indigo-500/[0.12] text-indigo-300'
                        : 'border-white/[0.05] bg-white/[0.025] text-slate-600 group-hover:text-slate-300'
                    }`}
                  >
                    <Icon className="w-[17px] h-[17px]" />
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 pr-5">
                      <h4
                        className={`text-[11px] font-medium ${
                          isSelected
                            ? 'text-white'
                            : 'text-slate-400 group-hover:text-slate-200'
                        }`}
                      >
                        {action.name}
                      </h4>

                      <span className="text-[8px] font-mono text-slate-700 whitespace-nowrap">
                        {action.shortcut}
                      </span>
                    </div>

                    <p className="text-[9px] leading-relaxed text-slate-600 mt-2 max-w-[300px]">
                      {action.description}
                    </p>
                  </div>

                  {/* Check */}
                  <div
                    className={`absolute right-4 top-4 w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-indigo-500 text-white shadow-[0_0_12px_rgba(99,102,241,0.35)]'
                        : 'border border-white/[0.07] bg-white/[0.02]'
                    }`}
                  >
                    {isSelected && (
                      <Check className="w-2.5 h-2.5" />
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* ====================================================== */}
      {/* Behaviour note */}
      {/* ====================================================== */}

      <div className="mt-7 flex items-center gap-3 px-4 py-3 rounded-[12px] border border-white/[0.045] bg-white/[0.015]">
        <div className="w-7 h-7 rounded-[8px] bg-white/[0.025] border border-white/[0.05] flex items-center justify-center">
          <Zap className="w-3 h-3 text-slate-500" />
        </div>

        <div>
          <p className="text-[9px] font-medium text-slate-400">
            Gesture behaviour
          </p>

          <p className="text-[9px] text-slate-700 mt-0.5">
            Swing freely without triggering anything until the pull reaches its configured limit.
          </p>
        </div>
      </div>
    </div>
  );
}