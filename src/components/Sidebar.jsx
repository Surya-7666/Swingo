import React from 'react';
import { NAV_ITEMS } from '../data/constants';
import SwingoLogo from '../assets/swingo-logo.png';

export default function Sidebar({ activeTab, onTabChange }) {
  const orderedItems = [
    ...NAV_ITEMS.filter((item) => item.id === 'charms'),
    ...NAV_ITEMS.filter((item) => item.id === 'appearance'),
    ...NAV_ITEMS.filter((item) => item.id === 'interaction'),
    ...NAV_ITEMS.filter((item) => item.id === 'settings'),
    ...NAV_ITEMS.filter((item) => item.id === 'about'),
  ];

  return (
    <aside className="relative w-[232px] h-full shrink-0 border-r border-white/[0.06] bg-[#090c14] text-slate-100 flex flex-col select-none overflow-hidden">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute -top-32 -left-24 w-64 h-64 rounded-full bg-indigo-600/[0.07] blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 -left-20 w-56 h-56 rounded-full bg-blue-600/[0.04] blur-3xl" />

      {/* Brand */}
      <div className="relative px-5 pt-6 pb-7">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 shrink-0 flex items-center justify-center">
            <img
              src={SwingoLogo}
              alt="Swingo"
              className="w-full h-full object-contain select-none pointer-events-none"
              draggable="false"
            />
          </div>

          <div className="min-w-0">
            <h1 className="text-[15px] font-bold tracking-[0.18em] text-white leading-none">
              SWINGO
            </h1>

            <p className="mt-1.5 text-[10px] text-slate-500 tracking-wide">
              Desktop companion
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="relative flex-1 px-3">
        <p className="px-3 mb-2 text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-600">
          Workspace
        </p>

        <nav className="space-y-1">
          {orderedItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onTabChange(item.id)}
                className={`group relative w-full h-[42px] flex items-center gap-3 px-3 rounded-[10px] text-left transition-all duration-200 ${
                  isActive
                    ? 'bg-indigo-500/[0.11] text-white'
                    : 'text-slate-500 hover:bg-white/[0.035] hover:text-slate-200'
                }`}
              >
                {isActive && (
                  <span className="absolute left-0 top-[10px] bottom-[10px] w-[2px] rounded-full bg-gradient-to-b from-indigo-400 to-blue-500 shadow-[0_0_8px_rgba(99,102,241,0.45)]" />
                )}

                <span
                  className={`w-8 h-8 rounded-[8px] flex items-center justify-center transition-all duration-200 ${
                    isActive
                      ? 'bg-indigo-500/[0.14] text-indigo-300'
                      : 'text-slate-600 group-hover:text-slate-300'
                  }`}
                >
                  <Icon
                    className="w-[16px] h-[16px]"
                    strokeWidth={isActive ? 2.1 : 1.8}
                  />
                </span>

                <span
                  className={`text-[12px] tracking-wide transition-colors ${
                    isActive
                      ? 'font-medium text-slate-100'
                      : 'font-normal'
                  }`}
                >
                  {item.label}
                </span>

                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-400 shadow-[0_0_7px_rgba(129,140,248,0.7)]" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom status */}
      <div className="relative px-4 pb-4">
        <div className="rounded-[11px] border border-white/[0.06] bg-white/[0.025] px-3 py-3">
          <div className="flex items-center gap-2.5">
            <div className="relative flex h-2 w-2 shrink-0">
              <span className="absolute inset-0 rounded-full bg-emerald-400/40 animate-ping" />
              <span className="relative w-2 h-2 rounded-full bg-emerald-400" />
            </div>

            <div className="min-w-0">
              <p className="text-[10px] font-medium text-slate-300 leading-none">
                Companion active
              </p>

              <p className="mt-1 text-[9px] text-slate-600 leading-none">
                Swingo is running
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}