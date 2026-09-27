import React, { useState, useEffect } from 'react';
import {
  Power,
  Monitor,
  Cpu,
  Trash2,
  Check,
  Zap,
  Play,
  Square,
  RotateCcw,
  Shield,
  Gauge,
} from 'lucide-react';

export default function SettingsTab({ onFactoryReset }) {
  const [launchOnStartup, setLaunchOnStartup] = useState(false);
  const [monitors, setMonitors] = useState([]);
  const [selectedMonitor, setSelectedMonitor] = useState('');
  const [targetFps, setTargetFps] = useState('120');
  const [pauseOnFullscreen, setPauseOnFullscreen] = useState(true);
  const [charmVisible, setCharmVisible] = useState(true);
  const [resetDone, setResetDone] = useState(false);

  // ------------------------------------------------------------
  // Load settings
  // ------------------------------------------------------------

  useEffect(() => {
    let isMounted = true;

    if (window.swingoAPI?.getAutostart) {
      window.swingoAPI
        .getAutostart()
        .then((res) => {
          if (isMounted) {
            setLaunchOnStartup(Boolean(res));
          }
        })
        .catch(() => {});
    }

    if (window.swingoAPI?.getMonitors) {
      window.swingoAPI
        .getMonitors()
        .then((list) => {
          if (
            isMounted &&
            Array.isArray(list) &&
            list.length > 0
          ) {
            setMonitors(list);

            const primary =
              list.find((m) => m.isPrimary) ||
              list[0];

            if (primary) {
              setSelectedMonitor(String(primary.id));
            }
          }
        })
        .catch(() => {});
    }

    try {
      const savedFps =
        localStorage.getItem('swingo_target_fps');

      if (savedFps && isMounted) {
        setTargetFps(savedFps);
      }

      const savedPause =
        localStorage.getItem(
          'swingo_pause_fullscreen'
        );

      if (
        savedPause !== null &&
        isMounted
      ) {
        setPauseOnFullscreen(
          savedPause === 'true'
        );
      }

      const savedCharmVisible =
        localStorage.getItem('swingo_charm_visible');

      if (
        savedCharmVisible !== null &&
        isMounted
      ) {
        setCharmVisible(
          savedCharmVisible === 'true'
        );
      }
    } catch {
      // Ignore storage errors
    }

    return () => {
      isMounted = false;
    };
  }, []);

  // ------------------------------------------------------------
  // Startup
  // ------------------------------------------------------------

  const handleAutostartToggle = async () => {
    const nextVal = !launchOnStartup;

    setLaunchOnStartup(nextVal);

    if (window.swingoAPI?.setAutostart) {
      try {
        await window.swingoAPI.setAutostart(
          nextVal
        );
      } catch (err) {
        console.error(err);
      }
    }
  };

  // ------------------------------------------------------------
  // Monitor
  // ------------------------------------------------------------

  const handleMonitorChange = async (e) => {
    const idStr = e.target.value;

    setSelectedMonitor(idStr);

    if (
      window.swingoAPI?.setMonitor &&
      idStr
    ) {
      try {
        await window.swingoAPI.setMonitor(
          Number(idStr)
        );
      } catch (err) {
        console.error(err);
      }
    }
  };

  // ------------------------------------------------------------
  // FPS
  // ------------------------------------------------------------

  const handleFpsChange = (fps) => {
    setTargetFps(fps);

    try {
      localStorage.setItem(
        'swingo_target_fps',
        fps
      );
    } catch {}
  };

  // ------------------------------------------------------------
  // Fullscreen
  // ------------------------------------------------------------

  const handlePauseToggle = () => {
    const nextVal = !pauseOnFullscreen;

    setPauseOnFullscreen(nextVal);

    try {
      localStorage.setItem(
        'swingo_pause_fullscreen',
        String(nextVal)
      );
    } catch {}

    if (
      window.swingoAPI?.setPauseOnFullscreen
    ) {
      window.swingoAPI.setPauseOnFullscreen(
        nextVal
      );
    }
  };

  // ------------------------------------------------------------
  // Charm visibility
  // ------------------------------------------------------------

  const handleCharmVisibilityToggle = () => {
    const nextVal = !charmVisible;

    setCharmVisible(nextVal);

    try {
      localStorage.setItem(
        'swingo_charm_visible',
        String(nextVal)
      );
    } catch {}

    if (
      window.swingoAPI?.setCharmVisibility
    ) {
      window.swingoAPI.setCharmVisibility(
        nextVal
      );
    }
  };

  // ------------------------------------------------------------
  // Factory reset
  // ------------------------------------------------------------

  const triggerFactoryReset = () => {
    if (
      window.confirm(
        'Reset all Swingo settings, calibration, and uploaded cutouts?'
      )
    ) {
      try {
        localStorage.clear();
      } catch {}

      if (
        typeof onFactoryReset === 'function'
      ) {
        onFactoryReset();
      }

      setResetDone(true);

      setTimeout(() => {
        setResetDone(false);
      }, 2000);
    }
  };

  // ------------------------------------------------------------
  // Toggle
  // ------------------------------------------------------------

  const Toggle = ({
    enabled,
    onClick,
  }) => {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-pressed={enabled}
        className={`relative w-[42px] h-[23px] rounded-full p-[3px] transition-all duration-200 ${
          enabled
            ? 'bg-indigo-500 shadow-[0_0_14px_rgba(99,102,241,0.25)]'
            : 'bg-slate-800 border border-white/[0.06]'
        }`}
      >
        <span
          className={`block w-[17px] h-[17px] rounded-full bg-white shadow-md transition-transform duration-200 ${
            enabled
              ? 'translate-x-[19px]'
              : 'translate-x-0'
          }`}
        />
      </button>
    );
  };

  return (
    <div className="w-full min-h-full pb-10">
      {/* ====================================================== */}
      {/* Header */}
      {/* ====================================================== */}

      <header className="flex items-end justify-between mb-8">
        <div>
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-1 h-5 rounded-full bg-gradient-to-b from-indigo-400 to-blue-500 shadow-[0_0_12px_rgba(99,102,241,0.45)]" />

            <h2 className="text-[22px] font-semibold tracking-[-0.02em] text-white">
              Settings
            </h2>
          </div>

          <p className="ml-3.5 text-[11px] text-slate-500">
            Control how Swingo runs, where it appears, and how it performs.
          </p>
        </div>

        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/[0.055] bg-white/[0.02]">
          <Shield className="w-3 h-3 text-indigo-400" />

          <span className="text-[9px] uppercase tracking-[0.14em] text-slate-500">
            Local settings
          </span>
        </div>
      </header>

      {/* ====================================================== */}
      {/* Startup */}
      {/* ====================================================== */}

      <section className="mb-8">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-7 h-7 rounded-[8px] bg-indigo-500/[0.08] border border-indigo-500/[0.10] flex items-center justify-center">
            <Power className="w-3.5 h-3.5 text-indigo-400" />
          </div>

          <div>
            <h3 className="text-[12px] font-medium text-slate-200">
              Startup & behaviour
            </h3>

            <p className="text-[9px] text-slate-600 mt-0.5">
              Decide when Swingo should be visible.
            </p>
          </div>
        </div>

        <div className="rounded-[15px] border border-white/[0.06] bg-[#0b1019] overflow-hidden">
          {/* Launch */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.045]">
            <div className="flex items-center gap-3.5">
              <div
                className={`w-9 h-9 rounded-[10px] flex items-center justify-center border ${
                  launchOnStartup
                    ? 'bg-indigo-500/[0.09] border-indigo-500/15'
                    : 'bg-white/[0.025] border-white/[0.05]'
                }`}
              >
                <Play
                  className={`w-3.5 h-3.5 ${
                    launchOnStartup
                      ? 'text-indigo-400'
                      : 'text-slate-600'
                  }`}
                />
              </div>

              <div>
                <p className="text-[11px] font-medium text-slate-200">
                  Launch with Windows
                </p>

                <p className="text-[9px] text-slate-600 mt-1">
                  Start Swingo automatically when you sign in.
                </p>
              </div>
            </div>

            <Toggle
              enabled={launchOnStartup}
              onClick={handleAutostartToggle}
            />
          </div>

          {/* Fullscreen */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.045]">
            <div className="flex items-center gap-3.5">
              <div
                className={`w-9 h-9 rounded-[10px] flex items-center justify-center border ${
                  pauseOnFullscreen
                    ? 'bg-indigo-500/[0.09] border-indigo-500/15'
                    : 'bg-white/[0.025] border-white/[0.05]'
                }`}
              >
                <Square
                  className={`w-3.5 h-3.5 ${
                    pauseOnFullscreen
                      ? 'text-indigo-400'
                      : 'text-slate-600'
                  }`}
                />
              </div>

              <div>
                <p className="text-[11px] font-medium text-slate-200">
                  Pause during fullscreen
                </p>

                <p className="text-[9px] text-slate-600 mt-1">
                  Temporarily hide the companion while games or movies are fullscreen.
                </p>
              </div>
            </div>

            <Toggle
              enabled={pauseOnFullscreen}
              onClick={handlePauseToggle}
            />
          </div>

          {/* Charm visibility */}
          <div className="flex items-center justify-between px-5 py-4">
            <div className="flex items-center gap-3.5">
              <div
                className={`w-9 h-9 rounded-[10px] flex items-center justify-center border ${
                  charmVisible
                    ? 'bg-indigo-500/[0.09] border-indigo-500/15'
                    : 'bg-white/[0.025] border-white/[0.05]'
                }`}
              >
                <Play
                  className={`w-3.5 h-3.5 ${
                    charmVisible
                      ? 'text-indigo-400'
                      : 'text-slate-600'
                  }`}
                />
              </div>

              <div>
                <p className="text-[11px] font-medium text-slate-200">
                  Show Charm
                </p>

                <p className="text-[9px] text-slate-600 mt-1">
                  Show or hide the Swingo companion on your desktop.
                </p>
              </div>
            </div>

            <Toggle
              enabled={charmVisible}
              onClick={handleCharmVisibilityToggle}
            />
          </div>
        </div>
      </section>

      {/* ====================================================== */}
      {/* Display */}
      {/* ====================================================== */}

      <section className="mb-8">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-7 h-7 rounded-[8px] bg-indigo-500/[0.08] border border-indigo-500/[0.10] flex items-center justify-center">
            <Monitor className="w-3.5 h-3.5 text-indigo-400" />
          </div>

          <div>
            <h3 className="text-[12px] font-medium text-slate-200">
              Display
            </h3>

            <p className="text-[9px] text-slate-600 mt-0.5">
              Choose which monitor should host your companion.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-[1fr_280px] gap-4">
          {/* Monitor visual */}
          <div className="relative h-[145px] rounded-[15px] border border-white/[0.06] bg-[#0b1019] overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-[250px] h-[105px] rounded-[8px] border border-slate-700/60 bg-[#080c14] shadow-[0_18px_40px_rgba(0,0,0,0.35)]">
                {/* Screen */}
                <div className="absolute inset-[5px] rounded-[4px] bg-gradient-to-br from-[#10162a] via-[#0c1220] to-[#080c14] overflow-hidden">
                  <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[2px] h-9 bg-gradient-to-b from-indigo-400/80 to-transparent" />

                  <div className="absolute left-1/2 top-8 -translate-x-1/2 w-3 h-3 rounded-full bg-indigo-500/20 border border-indigo-400/40 shadow-[0_0_15px_rgba(99,102,241,0.4)]" />

                  <div className="absolute left-1/2 top-12 -translate-x-1/2 w-12 h-[38px] flex justify-center">
                    <div className="w-[2px] h-full bg-slate-500/60 rounded-full" />
                  </div>
                </div>

                {/* Stand */}
                <div className="absolute left-1/2 bottom-[-18px] -translate-x-1/2 w-7 h-[18px] border-l border-r border-slate-700/60" />

                <div className="absolute left-1/2 bottom-[-20px] -translate-x-1/2 w-20 h-1 rounded-full bg-slate-700/50" />
              </div>
            </div>

            <div className="absolute left-4 bottom-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_7px_rgba(52,211,153,0.6)]" />

              <span className="text-[9px] text-slate-600">
                Companion display
              </span>
            </div>
          </div>

          {/* Monitor selector */}
          <div className="rounded-[15px] border border-white/[0.06] bg-[#0b1019] p-4">
            <div className="flex items-center justify-between mb-3">
              <label className="text-[10px] font-medium text-slate-400">
                Target monitor
              </label>

              <span className="text-[8px] uppercase tracking-[0.12em] text-slate-700">
                Display
              </span>
            </div>

            <select
              value={selectedMonitor}
              onChange={handleMonitorChange}
              className="w-full h-10 bg-[#080c14] text-slate-300 border border-white/[0.07] rounded-[9px] px-3 text-[10px] outline-none focus:border-indigo-500/40 transition-all"
            >
              {monitors.length > 0 ? (
                monitors.map((m) => (
                  <option
                    key={m.id}
                    value={String(m.id)}
                  >
                    {m.name}
                    {m.isPrimary
                      ? ' (Primary)'
                      : ''}
                  </option>
                ))
              ) : (
                <option value="">
                  Primary Display
                </option>
              )}
            </select>

            <p className="text-[9px] text-slate-700 leading-relaxed mt-3">
              The transparent Swingo window will be positioned on this display.
            </p>
          </div>
        </div>
      </section>

      {/* ====================================================== */}
      {/* Performance */}
      {/* ====================================================== */}

      <section className="mb-8">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-7 h-7 rounded-[8px] bg-indigo-500/[0.08] border border-indigo-500/[0.10] flex items-center justify-center">
            <Cpu className="w-3.5 h-3.5 text-indigo-400" />
          </div>

          <div>
            <h3 className="text-[12px] font-medium text-slate-200">
              Performance
            </h3>

            <p className="text-[9px] text-slate-600 mt-0.5">
              Balance smooth physics with power usage.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* 60 FPS */}
          <button
            type="button"
            onClick={() =>
              handleFpsChange('60')
            }
            className={`group relative overflow-hidden text-left rounded-[14px] border p-4 transition-all duration-200 ${
              targetFps === '60'
                ? 'border-indigo-500/40 bg-indigo-500/[0.08] shadow-[0_12px_30px_rgba(79,70,229,0.10)]'
                : 'border-white/[0.055] bg-[#0b1019] hover:border-white/[0.11] hover:bg-white/[0.025]'
            }`}
          >
            {targetFps === '60' && (
              <div className="absolute -right-10 -top-10 w-24 h-24 rounded-full bg-indigo-500/[0.08] blur-2xl" />
            )}

            <div className="relative flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-[10px] flex items-center justify-center border ${
                    targetFps === '60'
                      ? 'bg-indigo-500/[0.12] border-indigo-500/20'
                      : 'bg-white/[0.025] border-white/[0.05]'
                  }`}
                >
                  <Gauge
                    className={`w-4 h-4 ${
                      targetFps === '60'
                        ? 'text-indigo-300'
                        : 'text-slate-600'
                    }`}
                  />
                </div>

                <div>
                  <p
                    className={`text-[11px] font-medium ${
                      targetFps === '60'
                        ? 'text-white'
                        : 'text-slate-400'
                    }`}
                  >
                    60 FPS
                  </p>

                  <p className="text-[9px] text-slate-600 mt-1">
                    Eco mode
                  </p>
                </div>
              </div>

              {targetFps === '60' && (
                <span className="w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center">
                  <Check className="w-2.5 h-2.5 text-white" />
                </span>
              )}
            </div>

            <p className="relative text-[9px] text-slate-600 mt-4 leading-relaxed">
              Lower CPU usage and better battery life for laptops.
            </p>
          </button>

          {/* 120 FPS */}
          <button
            type="button"
            onClick={() =>
              handleFpsChange('120')
            }
            className={`group relative overflow-hidden text-left rounded-[14px] border p-4 transition-all duration-200 ${
              targetFps === '120'
                ? 'border-indigo-500/40 bg-indigo-500/[0.08] shadow-[0_12px_30px_rgba(79,70,229,0.10)]'
                : 'border-white/[0.055] bg-[#0b1019] hover:border-white/[0.11] hover:bg-white/[0.025]'
            }`}
          >
            {targetFps === '120' && (
              <div className="absolute -right-10 -top-10 w-24 h-24 rounded-full bg-indigo-500/[0.08] blur-2xl" />
            )}

            <div className="relative flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-[10px] flex items-center justify-center border ${
                    targetFps === '120'
                      ? 'bg-indigo-500/[0.12] border-indigo-500/20'
                      : 'bg-white/[0.025] border-white/[0.05]'
                  }`}
                >
                  <Zap
                    className={`w-4 h-4 ${
                      targetFps === '120'
                        ? 'text-indigo-300'
                        : 'text-slate-600'
                    }`}
                  />
                </div>

                <div>
                  <p
                    className={`text-[11px] font-medium ${
                      targetFps === '120'
                        ? 'text-white'
                        : 'text-slate-400'
                    }`}
                  >
                    120 FPS
                  </p>

                  <p className="text-[9px] text-slate-600 mt-1">
                    Fluid mode
                  </p>
                </div>
              </div>

              {targetFps === '120' && (
                <span className="w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center">
                  <Check className="w-2.5 h-2.5 text-white" />
                </span>
              )}
            </div>

            <p className="relative text-[9px] text-slate-600 mt-4 leading-relaxed">
              Maximum smoothness for rope movement and physics.
            </p>
          </button>
        </div>
      </section>

      {/* ====================================================== */}
      {/* Danger Zone */}
      {/* ====================================================== */}

      <section>
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-7 h-7 rounded-[8px] bg-red-500/[0.06] border border-red-500/[0.10] flex items-center justify-center">
            <Trash2 className="w-3.5 h-3.5 text-red-400/80" />
          </div>

          <div>
            <h3 className="text-[12px] font-medium text-slate-200">
              Data & storage
            </h3>

            <p className="text-[9px] text-slate-600 mt-0.5">
              Permanently remove local Swingo configuration.
            </p>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[15px] border border-red-500/[0.10] bg-red-500/[0.025] p-4">
          <div className="pointer-events-none absolute -right-20 -top-20 w-40 h-40 rounded-full bg-red-500/[0.035] blur-3xl" />

          <div className="relative flex items-center justify-between gap-5">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 shrink-0 rounded-[10px] bg-red-500/[0.06] border border-red-500/[0.10] flex items-center justify-center">
                <RotateCcw className="w-3.5 h-3.5 text-red-400/70" />
              </div>

              <div>
                <p className="text-[11px] font-medium text-slate-300">
                  Reset all Swingo data
                </p>

                <p className="text-[9px] text-slate-600 mt-1 leading-relaxed max-w-[430px]">
                  Clears saved calibration, preferences, and uploaded charm data, then restores the default configuration.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={triggerFactoryReset}
              className={`shrink-0 flex items-center gap-2 h-9 px-3.5 rounded-[9px] text-[9px] font-medium border transition-all ${
                resetDone
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                  : 'bg-red-500/[0.06] border-red-500/15 text-red-400/80 hover:bg-red-500/[0.10] hover:text-red-300'
              }`}
            >
              {resetDone ? (
                <>
                  <Check className="w-3 h-3" />
                  Reset complete
                </>
              ) : (
                <>
                  <Trash2 className="w-3 h-3" />
                  Reset data
                </>
              )}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}