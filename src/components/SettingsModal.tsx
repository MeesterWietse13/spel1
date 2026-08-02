import React from 'react';
import { motion } from 'motion/react';
import { BoardTheme, GameSettings } from '../types';
import { Settings, X, Volume2, VolumeX, Lightbulb, Smartphone, Palette, Zap, RotateCcw } from 'lucide-react';
import { BOARD_THEMES } from '../utils/themes';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: GameSettings;
  onUpdateSettings: (newSettings: Partial<GameSettings>) => void;
  id?: string;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  id = 'settings-modal',
}) => {
  if (!isOpen) return null;

  return (
    <div
      id={id}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl md:rounded-3xl p-5 sm:p-6 shadow-2xl text-white my-auto max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-slate-800 text-slate-300 border border-slate-700">
              <Settings className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black tracking-wide">
                Instellingen
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Pas het bord, geluid en speelsnelheid aan
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Options */}
        <div className="space-y-5 my-5 overflow-y-auto pr-1">
          {/* Theme Selection */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2.5 flex items-center gap-2">
              <Palette className="w-4 h-4 text-amber-400" />
              Bord Thema
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {Object.values(BOARD_THEMES).map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => onUpdateSettings({ theme: theme.id })}
                  className={`p-3 rounded-xl border text-left font-bold transition-all ${
                    settings.theme === theme.id
                      ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-md'
                      : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700 text-slate-400'
                  }`}
                >
                  <div className="text-sm">{theme.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Board Size Selection */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2.5 flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-400" />
              Spelbord Grootte
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {[
                { size: 6 as const, label: '6 op 6 (36 vakken)' },
                { size: 8 as const, label: '8 op 8 (64 vakken)' },
              ].map(({ size, label }) => (
                <button
                  key={size}
                  onClick={() => onUpdateSettings({ boardSize: size })}
                  className={`p-3 rounded-xl border text-center font-bold text-xs transition-all ${
                    settings.boardSize === size
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-md'
                      : 'bg-slate-800 border-slate-700 text-slate-400'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Toggle Switches */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            {/* Sound */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
              <div className="flex items-center gap-3">
                {settings.soundEnabled ? <Volume2 className="w-5 h-5 text-emerald-400" /> : <VolumeX className="w-5 h-5 text-slate-500" />}
                <div>
                  <div className="text-sm font-bold">Geluidseffecten</div>
                  <div className="text-xs text-slate-400">Audio bij zetten, rolen en winnen</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.soundEnabled}
                onChange={(e) => onUpdateSettings({ soundEnabled: e.target.checked })}
                className="w-5 h-5 accent-emerald-500 cursor-pointer"
              />
            </div>

            {/* Hints */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
              <div className="flex items-center gap-3">
                <Lightbulb className="w-5 h-5 text-amber-400" />
                <div>
                  <div className="text-sm font-bold">Toon Geldige Zet Hints</div>
                  <div className="text-xs text-slate-400">Toont mogelijke zetten & insluitingen</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.showHints}
                onChange={(e) => onUpdateSettings({ showHints: e.target.checked })}
                className="w-5 h-5 accent-amber-500 cursor-pointer"
              />
            </div>

            {/* Table Mode */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
              <div className="flex items-center gap-3">
                <Smartphone className="w-5 h-5 text-indigo-400" />
                <div>
                  <div className="text-sm font-bold">Tafelstand voor Tablets</div>
                  <div className="text-xs text-slate-400">Roteert spelerskaarten rond de tablet</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.tableMode}
                onChange={(e) => onUpdateSettings({ tableMode: e.target.checked })}
                className="w-5 h-5 accent-indigo-500 cursor-pointer"
              />
            </div>

            {/* Allow Undo */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
              <div className="flex items-center gap-3">
                <RotateCcw className="w-5 h-5 text-rose-400" />
                <div>
                  <div className="text-sm font-bold">Sta Herdoen (Undo) toe</div>
                  <div className="text-xs text-slate-400">Sla de verplichte zet niet over bij fouten</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.allowUndo}
                onChange={(e) => onUpdateSettings({ allowUndo: e.target.checked })}
                className="w-5 h-5 accent-rose-500 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm transition-all"
          >
            Sluiten
          </button>
        </div>
      </motion.div>
    </div>
  );
};
