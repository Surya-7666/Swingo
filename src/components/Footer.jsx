import React, { useState } from 'react';
import { Check, RotateCcw, Sparkles, Circle } from 'lucide-react';

export default function Footer({
  onReset,
  onApply,
  hasUnsavedChanges,
}) {
  const [justSaved, setJustSaved] = useState(false);

  const handleApplyClick = () => {
    onApply();
    setJustSaved(true);

    setTimeout(() => {
      setJustSaved(false);
    }, 1800);
  };

  return (
    <footer className="relative h-[68px] shrink-0 px-7 border-t border-white/[0.055] bg-[#080b12]/95 backdrop-blur-xl flex items-center justify-between select-none">
      {/* Subtle top glow */}
      <div className="pointer-events-none absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />

      {/* ====================================================== */}
      {/* Status */}
      {/* ====================================================== */}

      <div className="flex items-center">
        {hasUnsavedChanges ? (
          <div className="flex items-center gap-2.5">
            <div className="relative flex w-2 h-2">
              <span className="absolute inset-0 rounded-full bg-amber-400/40 animate-ping" />
              <span className="relative w-2 h-2 rounded-full bg-amber-400" />
            </div>

            <div>
              <p className="text-[10px] font-medium text-slate-300 leading-none">
                Unsaved changes
              </p>

              <p className="text-[9px] text-slate-600 mt-1 leading-none">
                Apply to save your changes
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2.5">
            <div className="relative flex w-2 h-2">
              <span className="absolute inset-0 rounded-full bg-emerald-400/30" />
              <span className="relative w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_7px_rgba(52,211,153,0.5)]" />
            </div>

            <div>
              <p className="text-[10px] font-medium text-slate-300 leading-none">
                All changes saved
              </p>

              <p className="text-[9px] text-slate-700 mt-1 leading-none">
                Swingo is up to date
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ====================================================== */}
      {/* Actions */}
      {/* ====================================================== */}

      <div className="flex items-center gap-2.5">
        {/* Reset */}
        <button
          type="button"
          onClick={onReset}
          className="group h-9 px-3.5 rounded-[9px] border border-white/[0.055] bg-white/[0.02] text-slate-500 hover:text-slate-200 hover:bg-white/[0.045] hover:border-white/[0.09] flex items-center gap-2 transition-all duration-200"
        >
          <RotateCcw className="w-3.5 h-3.5 transition-transform duration-300 group-hover:-rotate-45" />

          <span className="text-[10px] font-medium">
            Reset
          </span>
        </button>

        {/* Apply */}
        <button
          type="button"
          onClick={handleApplyClick}
          className={`relative overflow-hidden h-9 px-4 rounded-[9px] flex items-center gap-2 text-[10px] font-semibold transition-all duration-200 ${
            justSaved
              ? 'bg-emerald-500/90 text-white shadow-[0_6px_20px_rgba(16,185,129,0.18)]'
              : hasUnsavedChanges
                ? 'bg-gradient-to-r from-indigo-500 to-blue-500 text-white shadow-[0_6px_22px_rgba(79,70,229,0.20)] hover:from-indigo-400 hover:to-blue-400'
                : 'bg-indigo-500/80 text-white shadow-[0_6px_20px_rgba(79,70,229,0.12)] hover:bg-indigo-500'
          }`}
        >
          {/* Button shine */}
          {!justSaved && hasUnsavedChanges && (
            <span className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
          )}

          {justSaved ? (
            <>
              <Check className="relative w-3.5 h-3.5" />
              <span className="relative">
                Saved
              </span>
            </>
          ) : (
            <>
              <Sparkles className="relative w-3.5 h-3.5" />
              <span className="relative">
                Apply Changes
              </span>
            </>
          )}
        </button>
      </div>
    </footer>
  );
}