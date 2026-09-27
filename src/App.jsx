import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import AppearanceTab from './pages/AppearanceTab';
import CharmsTab from './pages/CharmsTab';
import InteractionTab from './pages/InteractionTab';
import SettingsTab from './pages/SettingsTab';
import AboutTab from './pages/AboutTab';
import { CHARMS, ROPE_STYLES } from './data/constants';

const STORAGE_KEY = 'swingo_saved_settings';

const DEFAULT_SETTINGS = {
  charmId: CHARMS[0].id,
  customCharm: null,
  ropeId: ROPE_STYLES[0].id,
  actionId: 'win-l',
  screenPosition: 0.85,
  ropeLength: 220,
  ropeThickness: 2.8,
  charmScale: 115,
  charmYOffset: 0,
};

export default function App() {
  // Charms is now the first page when Swingo opens
  const [activeTab, setActiveTab] = useState('charms');

  const [savedSettings, setSavedSettings] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);

      return stored
        ? { ...DEFAULT_SETTINGS, ...JSON.parse(stored) }
        : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  const initialCharm =
    savedSettings.customCharm ||
    CHARMS.find((c) => c.id === savedSettings.charmId) ||
    CHARMS[0];

  const initialRope =
    ROPE_STYLES.find((r) => r.id === savedSettings.ropeId) ||
    ROPE_STYLES[0];

  const [selectedCharm, setSelectedCharm] = useState(initialCharm);
  const [selectedRope, setSelectedRope] = useState(initialRope);
  const [selectedAction, setSelectedAction] = useState(
    savedSettings.actionId
  );

  const [screenPosition, setScreenPosition] = useState(
    savedSettings.screenPosition
  );

  const [ropeLength, setRopeLength] = useState(
    savedSettings.ropeLength
  );

  const [ropeThickness, setRopeThickness] = useState(
    savedSettings.ropeThickness
  );

  const [charmScale, setCharmScale] = useState(
    savedSettings.charmScale
  );

  const [charmYOffset, setCharmYOffset] = useState(
    savedSettings.charmYOffset
  );

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // ------------------------------------------------------------
  // Send live preview settings to the desktop charm
  // ------------------------------------------------------------

  const broadcastToDangle = (overrides = {}) => {
    if (window.swingoAPI) {
      window.swingoAPI.sendPreviewUpdate({
        charm: overrides.charm || selectedCharm,

        rope: overrides.rope || selectedRope,

        stretchAction:
          overrides.stretchAction || selectedAction,

        screenPosition:
          overrides.screenPosition !== undefined
            ? overrides.screenPosition
            : screenPosition,

        ropeLength:
          overrides.ropeLength !== undefined
            ? overrides.ropeLength
            : ropeLength,

        ropeThickness:
          overrides.ropeThickness !== undefined
            ? overrides.ropeThickness
            : ropeThickness,

        charmScale:
          overrides.charmScale !== undefined
            ? overrides.charmScale
            : charmScale,

        charmYOffset:
          overrides.charmYOffset !== undefined
            ? overrides.charmYOffset
            : charmYOffset,
      });
    }
  };

  // Initial desktop preview
  useEffect(() => {
    broadcastToDangle();
  }, []);

  const markChanged = () => {
    setHasUnsavedChanges(true);
  };

  // ------------------------------------------------------------
  // Charm
  // ------------------------------------------------------------

  const handleCharmChange = (charm) => {
    setSelectedCharm(charm);
    markChanged();

    broadcastToDangle({
      charm,
    });
  };

  // ------------------------------------------------------------
  // Rope
  // ------------------------------------------------------------

  const handleRopeChange = (rope) => {
    setSelectedRope(rope);
    markChanged();

    broadcastToDangle({
      rope,
    });
  };

  // ------------------------------------------------------------
  // Interaction
  // ------------------------------------------------------------

  const handleActionChange = (actionId) => {
    setSelectedAction(actionId);
    markChanged();

    broadcastToDangle({
      stretchAction: actionId,
    });
  };

  // ------------------------------------------------------------
  // Screen position
  // ------------------------------------------------------------

  const handleScreenPositionChange = (pos) => {
    setScreenPosition(pos);
    markChanged();

    broadcastToDangle({
      screenPosition: pos,
    });
  };

  // ------------------------------------------------------------
  // Rope length
  // ------------------------------------------------------------

  const handleRopeLengthChange = (len) => {
    setRopeLength(len);
    markChanged();

    broadcastToDangle({
      ropeLength: len,
    });
  };

  // ------------------------------------------------------------
  // Rope thickness
  // ------------------------------------------------------------

  const handleRopeThicknessChange = (thick) => {
    setRopeThickness(thick);
    markChanged();

    broadcastToDangle({
      ropeThickness: thick,
    });
  };

  // ------------------------------------------------------------
  // Charm scale
  // ------------------------------------------------------------

  const handleCharmScaleChange = (scale) => {
    setCharmScale(scale);
    markChanged();

    broadcastToDangle({
      charmScale: scale,
    });
  };

  // ------------------------------------------------------------
  // Charm vertical offset
  // ------------------------------------------------------------

  const handleCharmYOffsetChange = (offset) => {
    setCharmYOffset(offset);
    markChanged();

    broadcastToDangle({
      charmYOffset: offset,
    });
  };

  // ------------------------------------------------------------
  // Apply
  // ------------------------------------------------------------

  const handleApply = () => {
    const toSave = {
      charmId:
        selectedCharm.category === 'custom'
          ? null
          : selectedCharm.id,

      customCharm:
        selectedCharm.category === 'custom'
          ? selectedCharm
          : null,

      ropeId: selectedRope.id,

      actionId: selectedAction,

      screenPosition,

      ropeLength,

      ropeThickness,

      charmScale,

      charmYOffset,
    };

    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(toSave)
      );

      setSavedSettings(toSave);
      setHasUnsavedChanges(false);
    } catch (err) {
      console.error(
        'Failed to save settings:',
        err
      );
    }

    broadcastToDangle();
  };

  // ------------------------------------------------------------
  // Reset unsaved changes
  // ------------------------------------------------------------

  const handleReset = () => {
    const fallbackCharm =
      savedSettings.customCharm ||
      CHARMS.find(
        (c) => c.id === savedSettings.charmId
      ) ||
      CHARMS[0];

    const fallbackRope =
      ROPE_STYLES.find(
        (r) => r.id === savedSettings.ropeId
      ) ||
      ROPE_STYLES[0];

    setSelectedCharm(fallbackCharm);
    setSelectedRope(fallbackRope);

    setSelectedAction(
      savedSettings.actionId
    );

    setScreenPosition(
      savedSettings.screenPosition
    );

    setRopeLength(
      savedSettings.ropeLength
    );

    setRopeThickness(
      savedSettings.ropeThickness
    );

    setCharmScale(
      savedSettings.charmScale
    );

    setCharmYOffset(
      savedSettings.charmYOffset
    );

    setHasUnsavedChanges(false);

    broadcastToDangle({
      charm: fallbackCharm,

      rope: fallbackRope,

      stretchAction:
        savedSettings.actionId,

      screenPosition:
        savedSettings.screenPosition,

      ropeLength:
        savedSettings.ropeLength,

      ropeThickness:
        savedSettings.ropeThickness,

      charmScale:
        savedSettings.charmScale,

      charmYOffset:
        savedSettings.charmYOffset,
    });
  };

  // ------------------------------------------------------------
  // Factory reset
  // ------------------------------------------------------------

  const handleFactoryReset = () => {
    setSelectedCharm(CHARMS[0]);
    setSelectedRope(ROPE_STYLES[0]);

    setSelectedAction('win-l');

    setScreenPosition(0.85);

    setRopeLength(220);

    setRopeThickness(2.8);

    setCharmScale(115);

    setCharmYOffset(0);

    broadcastToDangle({
      charm: CHARMS[0],

      rope: ROPE_STYLES[0],

      stretchAction: 'win-l',

      screenPosition: 0.85,

      ropeLength: 220,

      ropeThickness: 2.8,

      charmScale: 115,

      charmYOffset: 0,
    });
  };

  return (
    <div className="flex h-screen w-screen bg-[#07090e] text-slate-100 select-none overflow-hidden font-sans">
      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Main content */}
      <main className="flex-1 flex flex-col justify-between overflow-hidden bg-gradient-to-br from-[#07090e] via-[#0d121f] to-[#07090e]">
        <div className="flex-1 overflow-y-auto p-8 max-w-full">
          
          {/* -------------------------------------------------- */}
          {/* CHARMS */}
          {/* -------------------------------------------------- */}

          {activeTab === 'charms' && (
            <CharmsTab
              selectedCharm={selectedCharm}
              onSelectCharm={handleCharmChange}
            />
          )}

          {/* -------------------------------------------------- */}
          {/* APPEARANCE */}
          {/* -------------------------------------------------- */}

          {activeTab === 'appearance' && (
            <AppearanceTab
              selectedCharm={selectedCharm}
              selectedRope={selectedRope}
              onSelectRope={handleRopeChange}

              screenPosition={screenPosition}
              onScreenPositionChange={
                handleScreenPositionChange
              }

              ropeLength={ropeLength}
              onRopeLengthChange={
                handleRopeLengthChange
              }

              ropeThickness={ropeThickness}
              onRopeThicknessChange={
                handleRopeThicknessChange
              }

              charmScale={charmScale}
              onCharmScaleChange={
                handleCharmScaleChange
              }

              charmYOffset={charmYOffset}
              onCharmYOffsetChange={
                handleCharmYOffsetChange
              }
            />
          )}

          {/* -------------------------------------------------- */}
          {/* INTERACTION */}
          {/* -------------------------------------------------- */}

          {activeTab === 'interaction' && (
            <InteractionTab
              selectedAction={selectedAction}
              onSelectAction={handleActionChange}
            />
          )}

          {/* -------------------------------------------------- */}
          {/* SETTINGS */}
          {/* -------------------------------------------------- */}

          {activeTab === 'settings' && (
            <SettingsTab
              onFactoryReset={handleFactoryReset}
            />
          )}

          {/* -------------------------------------------------- */}
          {/* ABOUT */}
          {/* -------------------------------------------------- */}

          {activeTab === 'about' && (
            <AboutTab />
          )}
        </div>

        {/* Footer */}
        <Footer
          onReset={handleReset}
          onApply={handleApply}
          hasUnsavedChanges={hasUnsavedChanges}
        />
      </main>
    </div>
  );
}