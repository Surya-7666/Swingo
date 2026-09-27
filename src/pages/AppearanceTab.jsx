import React, { useRef } from 'react';
import {
  SlidersHorizontal,
  Sparkles,
  MoveHorizontal,
  Maximize2,
  Ruler,
  CircleDot,
  Palette,
  Link2
} from 'lucide-react';
import { ROPE_STYLES } from '../data/constants';

function RangeControl({
  label,
  value,
  displayValue,
  min,
  max,
  step,
  onChange,
  leftLabel,
  rightLabel,
  icon: Icon,
}) {
  return (
    <div className="group">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-[8px] bg-white/[0.035] border border-white/[0.055] flex items-center justify-center">
            <Icon className="w-[13px] h-[13px] text-slate-500 group-hover:text-indigo-400 transition-colors" />
          </div>

          <span className="text-[11px] font-medium text-slate-300">
            {label}
          </span>
        </div>

        <span className="text-[11px] font-mono text-indigo-300">
          {displayValue}
        </span>
      </div>

      <div className="relative pt-1">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="swingo-range w-full"
        />

        <div className="flex justify-between mt-2">
          <span className="text-[9px] text-slate-600">{leftLabel}</span>
          <span className="text-[9px] text-slate-600">{rightLabel}</span>
        </div>
      </div>
    </div>
  );
}

export default function AppearanceTab({
  selectedCharm,
  selectedRope,
  onSelectRope,
  screenPosition,
  onScreenPositionChange,
  ropeLength,
  onRopeLengthChange,
  ropeThickness,
  onRopeThicknessChange,
  charmScale,
  onCharmScaleChange,
  charmYOffset,
  onCharmYOffsetChange,
}) {
  const colorPickerRef = useRef(null);

  const handleCustomColor = (e) => {
    const hex = e.target.value;
    onSelectRope({
      id: 'custom-cord',
      name: 'Custom Cord',
      type: 'cord',
      color: hex,
      accent: hex,
    });
  };

  const isChain = selectedRope?.type?.includes('chain');

  return (
    <div className="w-full min-h-full pb-10">
      {/* ------------------------------------------------------------ */}
      {/* Header */}
      {/* ------------------------------------------------------------ */}

      <header className="flex items-end justify-between mb-7">
        <div>
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-1 h-5 rounded-full bg-gradient-to-b from-indigo-400 to-blue-500 shadow-[0_0_12px_rgba(99,102,241,0.45)]" />
            <h2 className="text-[22px] font-semibold tracking-[-0.02em] text-white">
              Appearance
            </h2>
          </div>

          <p className="ml-3.5 text-[11px] text-slate-500">
            Shape the way your companion lives on the desktop.
          </p>
        </div>

        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/[0.055] bg-white/[0.02]">
          <span className="relative flex w-1.5 h-1.5">
            <span className="absolute inset-0 rounded-full bg-emerald-400/40 animate-ping" />
            <span className="relative w-1.5 h-1.5 rounded-full bg-emerald-400" />
          </span>

          <span className="text-[9px] uppercase tracking-[0.14em] font-medium text-slate-500">
            Desktop preview connected
          </span>
        </div>
      </header>

      {/* ------------------------------------------------------------ */}
      {/* Hero Preview */}
      {/* ------------------------------------------------------------ */}

      <section className="relative h-[238px] mb-8 overflow-hidden rounded-[18px] border border-white/[0.07] bg-[#090e18]">
        <div className="pointer-events-none absolute -left-28 -top-32 w-[360px] h-[360px] rounded-full bg-indigo-600/[0.08] blur-[90px]" />
        <div className="pointer-events-none absolute right-[-100px] bottom-[-180px] w-[420px] h-[420px] rounded-full bg-blue-600/[0.06] blur-[100px]" />

        <div
          className="pointer-events-none absolute inset-0 opacity-[0.16]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(148,163,184,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.07) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />

        <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />

        <div className="absolute left-5 top-5 z-10">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-[9px] uppercase tracking-[0.18em] font-semibold text-indigo-300/80">
              Live companion
            </span>
          </div>

          <p className="text-[10px] text-slate-600 mt-1">
            Changes are reflected instantly
          </p>
        </div>

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative flex flex-col items-center">
            <div className="absolute top-[48px] w-28 h-28 rounded-full bg-indigo-500/[0.10] blur-2xl" />

            <div className="relative z-10 w-2.5 h-2.5 rounded-full bg-slate-300 shadow-[0_0_10px_rgba(255,255,255,0.4)]" />

            {/* Rope / Chain preview */}
            <div
              className={`relative h-[70px] ${isChain ? 'w-[6px] border-x border-white/20' : 'w-[3px]'}`}
              style={{
                backgroundColor: selectedRope?.color || '#6366f1',
                boxShadow: `0 0 10px ${selectedRope?.color || '#6366f1'}40`,
              }}
            >
              <span
                className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-px opacity-60"
                style={{
                  backgroundColor: selectedRope?.accent || '#ffffff',
                }}
              />
            </div>

            <div className="relative z-10 w-[96px] h-[96px] flex items-center justify-center">
              <div className="absolute inset-2 rounded-full bg-white/[0.025] border border-white/[0.04] blur-[1px]" />

              {selectedCharm?.image && (
                <img
                  src={selectedCharm.image}
                  alt={selectedCharm.name}
                  className="relative w-full h-full object-contain select-none pointer-events-none drop-shadow-[0_14px_18px_rgba(0,0,0,0.5)]"
                  draggable="false"
                  onError={(e) => {
                    e.currentTarget.style.opacity = '0.25';
                  }}
                />
              )}
            </div>

            <div className="absolute top-[178px] whitespace-nowrap">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/[0.07] bg-[#0b1019]/90 backdrop-blur-md shadow-xl">
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{
                    backgroundColor: selectedRope?.color || '#64748b',
                  }}
                />

                <span className="text-[10px] font-medium text-slate-300">
                  {selectedCharm?.name || 'Charm'}
                </span>

                <span className="text-slate-700">/</span>

                <span className="text-[9px] text-slate-500">
                  {selectedRope?.name || 'Rope'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-4 left-5 flex items-center gap-2">
          <MoveHorizontal className="w-3 h-3 text-slate-600" />
          <span className="text-[9px] font-mono text-slate-600">
            X {Math.round(screenPosition * 100)}%
          </span>
        </div>

        <div className="absolute right-5 top-5 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.65)]" />
          <span className="text-[9px] text-emerald-400/80">
            LIVE
          </span>
        </div>
      </section>

      {/* ------------------------------------------------------------ */}
      {/* Controls */}
      {/* ------------------------------------------------------------ */}

      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-[8px] bg-indigo-500/[0.08] border border-indigo-500/[0.10] flex items-center justify-center">
              <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-400" />
            </div>

            <div>
              <h3 className="text-[12px] font-medium text-slate-200">
                Fine controls
              </h3>

              <p className="text-[9px] text-slate-600 mt-0.5">
                Position, proportions and hanging geometry
              </p>
            </div>
          </div>

          <span className="text-[9px] uppercase tracking-[0.14em] text-slate-700">
            Calibration
          </span>
        </div>

        <div className="grid grid-cols-2 gap-x-10 gap-y-7 px-1">
          <RangeControl
            label="Screen position"
            value={screenPosition}
            displayValue={`${Math.round(screenPosition * 100)}%`}
            min="0.10"
            max="0.92"
            step="0.01"
            onChange={onScreenPositionChange}
            leftLabel="Left"
            rightLabel="Right"
            icon={MoveHorizontal}
          />

          <RangeControl
            label="Charm size"
            value={charmScale}
            displayValue={`${charmScale}px`}
            min="65"
            max="180"
            step="5"
            onChange={onCharmScaleChange}
            leftLabel="Small"
            rightLabel="Large"
            icon={Maximize2}
          />

          <RangeControl
            label="Rope length"
            value={ropeLength}
            displayValue={`${ropeLength}px`}
            min="120"
            max="460"
            step="10"
            onChange={onRopeLengthChange}
            leftLabel="Short"
            rightLabel="Long"
            icon={Ruler}
          />

          <RangeControl
            label="Charm offset"
            value={charmYOffset}
            displayValue={`${charmYOffset > 0 ? '+' : ''}${charmYOffset}px`}
            min="-60"
            max="30"
            step="1"
            onChange={onCharmYOffsetChange}
            leftLabel="Up"
            rightLabel="Down"
            icon={CircleDot}
          />

          <div className="col-span-2">
            <RangeControl
              label="Rope thickness"
              value={ropeThickness}
              displayValue={`${ropeThickness.toFixed(1)}px`}
              min="1.2"
              max="7.0"
              step="0.2"
              onChange={onRopeThicknessChange}
              leftLabel="Fine"
              rightLabel="Heavy"
              icon={Ruler}
            />
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ */}
      {/* Rope / Chain Styles */}
      {/* ------------------------------------------------------------ */}

      <section>
        <div className="flex items-end justify-between mb-4">
          <div>
            <h3 className="text-[12px] font-medium text-slate-200">
              Rope & Chain Materials
            </h3>

            <p className="text-[9px] text-slate-600 mt-1">
              Select metallic links or a custom-tinted cord.
            </p>
          </div>

          {/* Interactive Color Picker Trigger */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => colorPickerRef.current?.click()}
              className="group flex items-center gap-2 h-7 px-3 rounded-[8px] border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06] text-[10px] text-slate-300 transition-all"
            >
              <Palette className="w-3 h-3 text-indigo-400 group-hover:scale-110 transition-transform" />
              <span>Custom Cord Color</span>
              <span
                className="w-3 h-3 rounded-full border border-white/30"
                style={{ backgroundColor: selectedRope?.color || '#6366f1' }}
              />
            </button>
            <input
              ref={colorPickerRef}
              type="color"
              value={selectedRope?.color || '#6366f1'}
              onChange={handleCustomColor}
              className="hidden"
            />
          </div>
        </div>

        <div className="grid grid-cols-5 gap-3">
          {ROPE_STYLES.map((rope) => {
            const isSelected = selectedRope.id === rope.id;
            const isChainCard = rope.type?.includes('chain');

            return (
              <button
                key={rope.id}
                type="button"
                onClick={() => onSelectRope(rope)}
                className={`group relative h-[88px] overflow-hidden rounded-[14px] border text-left transition-all duration-200 ${
                  isSelected
                    ? 'border-indigo-500/45 bg-indigo-500/[0.08] shadow-[0_10px_30px_rgba(79,70,229,0.12)]'
                    : 'border-white/[0.055] bg-[#0b1019] hover:border-white/[0.11] hover:bg-white/[0.025]'
                }`}
              >
                {isSelected && (
                  <div
                    className="absolute -right-8 -top-8 w-20 h-20 rounded-full blur-2xl opacity-20"
                    style={{
                      backgroundColor: rope.color,
                    }}
                  />
                )}

                <div className="relative h-full px-3.5 py-3">
                  <div className="h-9 flex items-center">
                    {isChainCard ? (
                      <div className="flex items-center gap-1 opacity-90">
                        <Link2
                          className="w-4 h-4 rotate-45"
                          style={{ color: rope.color }}
                        />
                        <div
                          className="h-[4px] w-full rounded-full border border-white/20"
                          style={{
                            background: `linear-gradient(90deg, ${rope.color}, ${rope.accent}, ${rope.color})`
                          }}
                        />
                      </div>
                    ) : (
                      <div
                        className="relative w-full h-[5px] rounded-full"
                        style={{
                          backgroundColor: rope.color,
                          border: `1px solid ${rope.accent}`,
                          boxShadow: isSelected
                            ? `0 0 10px ${rope.color}55`
                            : 'none',
                        }}
                      >
                        <span
                          className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-px opacity-40"
                          style={{
                            backgroundColor: rope.accent,
                          }}
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[10px] font-medium ${
                        isSelected
                          ? 'text-slate-200'
                          : 'text-slate-500 group-hover:text-slate-300'
                      }`}
                    >
                      {rope.name}
                    </span>

                    <span
                      className={`w-1.5 h-1.5 rounded-full transition-all ${
                        isSelected
                          ? 'shadow-[0_0_7px_rgba(129,140,248,0.8)]'
                          : 'opacity-30'
                      }`}
                      style={{
                        backgroundColor: isSelected
                          ? rope.color
                          : '#475569',
                      }}
                    />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <style>{`
        .swingo-range {
          appearance: none;
          -webkit-appearance: none;
          width: 100%;
          height: 3px;
          border-radius: 999px;
          background: #1b2535;
          outline: none;
        }

        .swingo-range::-webkit-slider-thumb {
          appearance: none;
          -webkit-appearance: none;
          width: 13px;
          height: 13px;
          border-radius: 50%;
          background: #6366f1;
          border: 3px solid #111827;
          box-shadow: 0 0 0 1px rgba(129, 140, 248, 0.35),
                      0 0 12px rgba(99, 102, 241, 0.28);
          cursor: pointer;
          transition: transform 150ms ease, box-shadow 150ms ease;
        }

        .swingo-range::-webkit-slider-thumb:hover {
          transform: scale(1.12);
          box-shadow: 0 0 0 1px rgba(129, 140, 248, 0.55),
                      0 0 16px rgba(99, 102, 241, 0.4);
        }

        .swingo-range::-moz-range-thumb {
          width: 13px;
          height: 13px;
          border-radius: 50%;
          background: #6366f1;
          border: 3px solid #111827;
          box-shadow: 0 0 0 1px rgba(129, 140, 248, 0.35),
                      0 0 12px rgba(99, 102, 241, 0.28);
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}