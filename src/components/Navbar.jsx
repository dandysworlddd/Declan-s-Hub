import React, { useState } from 'react';
import { Gamepad2, ShieldAlert, VenetianMask, Shuffle } from 'lucide-react';
import { CLOAK_PRESETS } from '../utils/cloak.js';

export function Navbar({
  currentCloak,
  onOpenCloakModal,
  onRandomGame,
  onPanic,
  gameCount,
}) {
  const [showPanicHint, setShowPanicHint] = useState(false);
  const activeCloak = CLOAK_PRESETS[currentCloak] || CLOAK_PRESETS.default;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-zinc-950/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <a href="#" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 via-rose-600 to-amber-600 p-[1px] shadow-lg shadow-red-600/20 group-hover:shadow-red-600/40 transition-shadow">
              <div className="w-full h-full bg-zinc-950 rounded-[11px] flex items-center justify-center">
                <Gamepad2 className="w-5 h-5 text-red-500 group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-red-100 to-red-300 bg-clip-text text-transparent">
                  DECLAN'S HUB
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20">
                  Unblocked
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 hidden sm:block">
                {gameCount} iframe games
              </p>
            </div>
          </a>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Random Game */}
          <button
            onClick={onRandomGame}
            title="Play a random game"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-850 hover:border-red-600/40 transition"
          >
            <Shuffle className="w-3.5 h-3.5 text-red-500" />
            <span className="hidden md:inline">Random</span>
          </button>

          {/* Tab Cloaker */}
          <button
            onClick={onOpenCloakModal}
            title={`Tab Cloaker (Current: ${activeCloak.name})`}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition ${
              currentCloak !== 'default'
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-300 hover:bg-amber-500/20'
                : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700'
            }`}
          >
            <VenetianMask className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">
              {currentCloak !== 'default' ? 'Cloaked' : 'Cloak Tab'}
            </span>
            <span className="text-xs">{activeCloak.iconChar}</span>
          </button>

          {/* Panic Button */}
          <div className="relative">
            <button
              onClick={onPanic}
              onMouseEnter={() => setShowPanicHint(true)}
              onMouseLeave={() => setShowPanicHint(false)}
              title="Panic Button: Instantly closes / redirects to Google Classroom"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-600/30 transition active:scale-95"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>PANIC</span>
            </button>

            {showPanicHint && (
              <div className="absolute right-0 top-full mt-2 w-48 p-2 text-[11px] bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-lg shadow-xl z-50 pointer-events-none">
                Instantly redirects current tab to Google Classroom. Hotkey: <kbd className="px-1 py-0.5 bg-zinc-800 rounded text-rose-400 font-mono">]</kbd>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
