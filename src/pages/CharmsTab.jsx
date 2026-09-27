import React, { useState, useRef, useEffect } from 'react';
import {
  Upload,
  Check,
  Trash2,
  Sparkles,
  Search,
  ImagePlus,
} from 'lucide-react';
import { CHARMS, CATEGORIES } from '../data/constants';

export default function CharmsTab({
  selectedCharm,
  onSelectCharm,
}) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [customCharms, setCustomCharms] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const fileInputRef = useRef(null);

  // ------------------------------------------------------------
  // Load uploaded charms
  // ------------------------------------------------------------

  useEffect(() => {
    try {
      const saved = localStorage.getItem('swingo_custom_charms');

      if (saved) {
        setCustomCharms(JSON.parse(saved));
      }
    } catch (err) {
      console.error(
        'Failed to load saved custom charms',
        err
      );
    }
  }, []);

  // ------------------------------------------------------------
  // Save uploaded charms
  // ------------------------------------------------------------

  const saveCustomCharms = (updatedList) => {
    setCustomCharms(updatedList);

    try {
      localStorage.setItem(
        'swingo_custom_charms',
        JSON.stringify(updatedList)
      );
    } catch (err) {
      console.error(
        'Failed to persist saved custom charms',
        err
      );
    }
  };

  // ------------------------------------------------------------
  // Upload
  // ------------------------------------------------------------

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = (event) => {
      const newCustomCharm = {
        id: `custom-${Date.now()}`,
        name: file.name
          .replace(/\.[^/.]+$/, '')
          .slice(0, 18),
        category: 'custom',
        image: event.target?.result,
      };

      const updated = [
        newCustomCharm,
        ...customCharms,
      ];

      saveCustomCharms(updated);
      onSelectCharm(newCustomCharm);
    };

    reader.readAsDataURL(file);

    e.target.value = '';
  };

  // ------------------------------------------------------------
  // Delete
  // ------------------------------------------------------------

  const handleDeleteCustomCharm = (
    e,
    charmId
  ) => {
    e.stopPropagation();

    const updated = customCharms.filter(
      (c) => c.id !== charmId
    );

    saveCustomCharms(updated);

    if (selectedCharm.id === charmId) {
      onSelectCharm(CHARMS[0]);
    }
  };

  // ------------------------------------------------------------
  // Filtering
  // ------------------------------------------------------------

  const normalizedSearch =
    searchQuery.trim().toLowerCase();

  const filteredCharms = CHARMS.filter((charm) => {
    const matchesCategory =
      activeCategory === 'all' ||
      charm.category === activeCategory;

    const matchesSearch =
      !normalizedSearch ||
      charm.name
        .toLowerCase()
        .includes(normalizedSearch);

    return (
      matchesCategory &&
      matchesSearch
    );
  });

  // ------------------------------------------------------------
  // Selected charm
  // ------------------------------------------------------------

  const selectedName =
    selectedCharm?.name || 'No charm selected';

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
              Charms
            </h2>
          </div>

          <p className="ml-3.5 text-[11px] text-slate-500">
            Choose what hangs from the top of your desktop.
          </p>
        </div>

        <div className="hidden md:flex items-center gap-2 text-[9px] uppercase tracking-[0.14em] text-slate-600">
          <Sparkles className="w-3 h-3 text-indigo-400/70" />
          Your collection
        </div>
      </header>

      {/* ====================================================== */}
      {/* Selected Charm Hero */}
      {/* ====================================================== */}

      <section className="relative h-[190px] overflow-hidden rounded-[18px] border border-white/[0.07] bg-[#090e18] mb-8">
        {/* Ambient glow */}
        <div className="pointer-events-none absolute -left-20 -top-32 w-[330px] h-[330px] rounded-full bg-indigo-600/[0.10] blur-[90px]" />

        <div className="pointer-events-none absolute right-[-100px] bottom-[-180px] w-[390px] h-[390px] rounded-full bg-blue-600/[0.07] blur-[100px]" />

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
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]" />

            <span className="text-[9px] uppercase tracking-[0.18em] font-semibold text-slate-500">
              Currently hanging
            </span>
          </div>

          <h3 className="text-[17px] font-semibold text-white mt-2">
            {selectedName}
          </h3>

          <p className="text-[10px] text-slate-600 mt-1">
            Selected companion
          </p>
        </div>

        {/* Center charm */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="relative flex items-center justify-center w-[112px] h-[112px]">
            <div className="absolute inset-3 rounded-full bg-indigo-500/[0.08] blur-2xl" />

            {selectedCharm?.image && (
              <img
                src={selectedCharm.image}
                alt={selectedCharm.name}
                className="relative w-full h-full object-contain drop-shadow-[0_18px_22px_rgba(0,0,0,0.55)]"
                draggable="false"
              />
            )}
          </div>
        </div>

        {/* Right metadata */}
        <div className="absolute right-5 bottom-5 flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-full border border-white/[0.06] bg-black/20 backdrop-blur-md">
            <span className="text-[9px] text-slate-500">
              Live preview
            </span>
          </div>
        </div>

        {/* Bottom left */}
        <div className="absolute left-5 bottom-5 flex items-center gap-2">
          <span className="text-[9px] text-slate-600">
            Changes appear instantly
          </span>
        </div>
      </section>

      {/* ====================================================== */}
      {/* Collection Toolbar */}
      {/* ====================================================== */}

      <section className="mb-5">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="text-[12px] font-medium text-slate-200">
              Collection
            </h3>

            <p className="text-[9px] text-slate-600 mt-1">
              Pick a charm or bring your own.
            </p>
          </div>

          {/* Search */}
          <div className="relative w-[190px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-600" />

            <input
              type="text"
              value={searchQuery}
              onChange={(e) =>
                setSearchQuery(e.target.value)
              }
              placeholder="Search charms..."
              className="w-full h-9 pl-9 pr-3 rounded-[10px] border border-white/[0.06] bg-[#0b1019] text-[10px] text-slate-300 placeholder:text-slate-700 outline-none focus:border-indigo-500/30 focus:bg-[#0c111d] transition-all"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map((category) => {
            const isActive =
              activeCategory === category.id;

            return (
              <button
                key={category.id}
                type="button"
                onClick={() =>
                  setActiveCategory(category.id)
                }
                className={`h-8 px-3.5 rounded-[9px] text-[10px] font-medium whitespace-nowrap border transition-all duration-200 ${
                  isActive
                    ? 'bg-indigo-500/[0.13] border-indigo-500/30 text-indigo-300'
                    : 'bg-white/[0.018] border-white/[0.045] text-slate-600 hover:text-slate-300 hover:bg-white/[0.035]'
                }`}
              >
                {category.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* ====================================================== */}
      {/* Preset Grid */}
      {/* ====================================================== */}

      <section className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[9px] uppercase tracking-[0.15em] font-semibold text-slate-600">
            Presets
          </span>

          <span className="text-[9px] font-mono text-slate-700">
            {filteredCharms.length} available
          </span>
        </div>

        {filteredCharms.length > 0 ? (
          <div className="grid grid-cols-5 gap-3">
            {filteredCharms.map((charm) => {
              const isSelected =
                selectedCharm?.id === charm.id;

              return (
                <button
                  key={charm.id}
                  type="button"
                  onClick={() =>
                    onSelectCharm(charm)
                  }
                  className={`group relative h-[132px] rounded-[14px] border overflow-hidden transition-all duration-200 ${
                    isSelected
                      ? 'border-indigo-500/45 bg-indigo-500/[0.09] shadow-[0_12px_30px_rgba(79,70,229,0.12)]'
                      : 'border-white/[0.055] bg-[#0b1019] hover:border-white/[0.11] hover:bg-white/[0.025]'
                  }`}
                >
                  {/* Selected glow */}
                  {isSelected && (
                    <div className="absolute -right-8 -top-8 w-20 h-20 rounded-full bg-indigo-500/10 blur-2xl" />
                  )}

                  {/* Selected indicator */}
                  {isSelected && (
                    <div className="absolute top-3 right-3 z-10 w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center shadow-[0_0_12px_rgba(99,102,241,0.4)]">
                      <Check className="w-2.5 h-2.5 text-white" />
                    </div>
                  )}

                  {/* Image */}
                  <div className="absolute inset-x-0 top-3 bottom-8 flex items-center justify-center">
                    <div className="relative w-[76px] h-[76px]">
                      <div className="absolute inset-4 rounded-full bg-indigo-500/[0.04] blur-xl group-hover:bg-indigo-500/[0.08] transition-all" />

                      <img
                        src={charm.image}
                        alt={charm.name}
                        className="relative w-full h-full object-contain select-none pointer-events-none drop-shadow-[0_8px_10px_rgba(0,0,0,0.4)] group-hover:scale-[1.06] transition-transform duration-200"
                        draggable="false"
                        onError={(e) => {
                          e.currentTarget.style.opacity =
                            '0.25';
                        }}
                      />
                    </div>
                  </div>

                  {/* Name */}
                  <div className="absolute left-0 right-0 bottom-0 h-8 flex items-center justify-center border-t border-white/[0.04] bg-black/[0.08]">
                    <span
                      className={`text-[9px] truncate px-2 ${
                        isSelected
                          ? 'text-slate-200'
                          : 'text-slate-500 group-hover:text-slate-300'
                      }`}
                    >
                      {charm.name}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="h-[150px] rounded-[14px] border border-dashed border-white/[0.07] flex flex-col items-center justify-center">
            <Search className="w-5 h-5 text-slate-700 mb-2" />

            <p className="text-[10px] text-slate-500">
              No charms found
            </p>

            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="text-[9px] text-indigo-400 mt-1 hover:text-indigo-300"
            >
              Clear search
            </button>
          </div>
        )}
      </section>

      {/* ====================================================== */}
      {/* Custom Charms */}
      {/* ====================================================== */}

      <section>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-[12px] font-medium text-slate-200">
              Your charms
            </h3>

            <p className="text-[9px] text-slate-600 mt-1">
              Import a transparent image from your computer.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              fileInputRef.current?.click()
            }
            className="group flex items-center gap-2 h-8 px-3.5 rounded-[9px] border border-indigo-500/25 bg-indigo-500/[0.08] text-[10px] font-medium text-indigo-300 hover:bg-indigo-500/[0.13] hover:border-indigo-500/35 transition-all"
          >
            <Upload className="w-3 h-3" />

            Import
          </button>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/png, image/jpeg, image/webp, image/svg+xml"
            className="hidden"
          />
        </div>

        {customCharms.length > 0 ? (
          <div className="grid grid-cols-5 gap-3">
            {customCharms.map((charm) => {
              const isSelected =
                selectedCharm?.id === charm.id;

              return (
                <div
                  key={charm.id}
                  onClick={() =>
                    onSelectCharm(charm)
                  }
                  className={`group relative h-[132px] rounded-[14px] border overflow-hidden cursor-pointer transition-all duration-200 ${
                    isSelected
                      ? 'border-indigo-500/45 bg-indigo-500/[0.09]'
                      : 'border-white/[0.055] bg-[#0b1019] hover:border-white/[0.11] hover:bg-white/[0.025]'
                  }`}
                >
                  {/* Image */}
                  <div className="absolute inset-x-0 top-3 bottom-8 flex items-center justify-center">
                    <div className="w-[76px] h-[76px] flex items-center justify-center">
                      <img
                        src={charm.image}
                        alt={charm.name}
                        className="w-full h-full object-contain select-none pointer-events-none drop-shadow-[0_8px_10px_rgba(0,0,0,0.4)] group-hover:scale-[1.06] transition-transform duration-200"
                        draggable="false"
                      />
                    </div>
                  </div>

                  {/* Delete */}
                  <button
                    type="button"
                    onClick={(e) =>
                      handleDeleteCustomCharm(
                        e,
                        charm.id
                      )
                    }
                    title="Delete charm"
                    className="absolute z-20 top-2 left-2 w-6 h-6 rounded-[7px] border border-white/[0.05] bg-black/50 backdrop-blur-md text-slate-600 opacity-0 group-hover:opacity-100 hover:text-red-400 hover:border-red-500/20 transition-all flex items-center justify-center"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>

                  {/* Selected */}
                  {isSelected && (
                    <div className="absolute top-3 right-3 z-10 w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center shadow-[0_0_12px_rgba(99,102,241,0.4)]">
                      <Check className="w-2.5 h-2.5 text-white" />
                    </div>
                  )}

                  {/* Name */}
                  <div className="absolute left-0 right-0 bottom-0 h-8 flex items-center justify-center border-t border-white/[0.04] bg-black/[0.08]">
                    <span
                      className={`text-[9px] truncate px-2 ${
                        isSelected
                          ? 'text-slate-200'
                          : 'text-slate-500'
                      }`}
                    >
                      {charm.name}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <button
            type="button"
            onClick={() =>
              fileInputRef.current?.click()
            }
            className="w-full h-[108px] rounded-[14px] border border-dashed border-white/[0.07] bg-white/[0.012] hover:bg-white/[0.02] hover:border-indigo-500/20 transition-all flex items-center justify-center gap-4 group"
          >
            <div className="w-10 h-10 rounded-[10px] border border-white/[0.06] bg-white/[0.025] flex items-center justify-center">
              <ImagePlus className="w-4 h-4 text-slate-600 group-hover:text-indigo-400 transition-colors" />
            </div>

            <div className="text-left">
              <p className="text-[10px] font-medium text-slate-400 group-hover:text-slate-300">
                Add your own charm
              </p>

              <p className="text-[9px] text-slate-700 mt-1">
                PNG, JPG or WebP
              </p>
            </div>
          </button>
        )}
      </section>
    </div>
  );
}