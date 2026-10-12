import React, { useState } from 'react';
import { X, VenetianMask, Check, ShieldAlert } from 'lucide-react';
import { CLOAK_PRESETS, applyCloak } from '../utils/cloak.js';

export function CloakModal({
  isOpen,
  onClose,
  currentCloak,
  onSelectCloak,
}) {
  const [customTitle, setCustomTitle] = useState('');
  const [customFavicon, setCustomFavicon] = useState('');

  if (!isOpen) return null;

  const handleSelect = (preset) => {
    onSelectCloak(preset);
    applyCloak(preset);
  };

  const handleApplyCustom = (e) => {
    e.preventDefault();
    if (!customTitle) return;
    document.title = customTitle;
    let faviconLink = document.getElementById('favicon-link');
    if (faviconLink && customFavicon) {
      faviconLink.href = customFavicon;
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <VenetianMask className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-base text-white">Tab Cloaker & Disguise</h2>
              <p className="text-xs text-zinc-400">Camouflage browser tab title and favicon</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Presets List */}
        <div className="p-6 flex flex-col gap-4 max-h-[75vh] overflow-y-auto">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Select Cloak Preset
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {Object.keys(CLOAK_PRESETS).map((key) => {
                const info = CLOAK_PRESETS[key];
                const isSelected = currentCloak === key;

                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleSelect(key)}
                    className={`flex items-center justify-between p-3 rounded-xl border text-left transition ${
                      isSelected
                        ? 'bg-amber-500/10 border-amber-500/40 text-amber-300'
                        : 'bg-zinc-950 border-zinc-800 text-zinc-300 hover:bg-zinc-850 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-lg">{info.iconChar}</span>
                      <div className="min-w-0">
                        <div className="font-semibold text-xs truncate">{info.name}</div>
                        <div className="text-[10px] text-zinc-500 truncate">{info.title}</div>
                      </div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-amber-400 shrink-0 ml-1" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Panic Key Notice */}
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-rose-300">Instant Panic Button</h4>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                Press the <kbd className="px-1.5 py-0.5 bg-zinc-800 text-rose-300 rounded font-mono font-bold">]</kbd> key anytime on your keyboard to instantly redirect this tab to Google Classroom.
              </p>
            </div>
          </div>

          {/* Custom Cloak Option */}
          <form onSubmit={handleApplyCustom} className="pt-3 border-t border-zinc-800/80 flex flex-col gap-2.5">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Custom Title & Favicon
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Custom Tab Title (e.g. Science Homework)"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                className="flex-1 px-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-amber-500"
              />
              <button
                type="submit"
                className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-xs font-semibold transition"
              >
                Apply
              </button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-950/60 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
