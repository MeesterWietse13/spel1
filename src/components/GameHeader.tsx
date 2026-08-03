import React from 'react';
import { Volume2, VolumeX, RotateCcw, HelpCircle, Settings, Maximize2, Sparkles, Lightbulb, Smartphone, Dices } from 'lucide-react';
import { BoardTheme, GameSettings } from '../types';
import { soundManager } from '../utils/audio';

interface GameHeaderProps {
  onNewGame: () => void;
  onOpenDiceRoll?: () => void;
  onReset: () => void;
  onUndo: () => void;
  canUndo: boolean;
  onOpenRules: () => void;
  onOpenSettings: () => void;
  settings: GameSettings;
  onUpdateSettings: (newSettings: Partial<GameSettings>) => void;
  themes: Record<string, BoardTheme>;
  id?: string;
}

export const GameHeader: React.FC<GameHeaderProps> = ({
  onNewGame,
  onOpenDiceRoll,
  onReset,
  onUndo,
  canUndo,
  onOpenRules,
  onOpenSettings,
  settings,
  onUpdateSettings,
  themes,
  id = 'game-header',
}) => {
  const toggleSound = () => {
    const next = !settings.soundEnabled;
    soundManager.setEnabled(next);
    onUpdateSettings({ soundEnabled: next });
    if (next) soundManager.playClick();
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  return (
    <header id={id} className="w-full flex flex-col md:flex-row items-center justify-between gap-3 px-3 py-2.5 sm:px-4 sm:py-3 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 shadow-lg select-none">
      {/* Brand Title */}
      <div className="flex items-center gap-3">
        <div className="relative flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-red-500 via-yellow-500 to-blue-500 shadow-md">
          <div className="w-4 h-4 rounded-full bg-green-500 shadow-inner border border-white/40" />
        </div>
        <div>
          <h1 className="text-lg sm:text-xl font-black text-white tracking-wide flex items-center gap-1.5">
            ROLIT <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-gradient-to-r from-red-500 to-yellow-500 text-slate-950 uppercase">Tablet</span>
          </h1>
          <p className="text-[11px] sm:text-xs text-slate-400 font-medium hidden sm:block">
            Digitaal 3D Bordspel voor 2-4 Spelers
          </p>
        </div>
      </div>

      {/* Main Action Buttons */}
      <div className="flex items-center flex-wrap justify-center gap-1.5 sm:gap-2">
        {/* Undo button */}
        <button
          onClick={onUndo}
          disabled={!canUndo}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-xs sm:text-sm transition-all ${
            canUndo
              ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 active:scale-95'
              : 'bg-slate-800/40 text-slate-600 border border-slate-800/50 cursor-not-allowed'
          }`}
          title="Herdoe laatste zet"
        >
          <RotateCcw className="w-4 h-4" />
          <span className="hidden xs:inline">Herdoen</span>
        </button>

        {/* Hints toggle */}
        <button
          onClick={() => onUpdateSettings({ showHints: !settings.showHints })}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-xs sm:text-sm transition-all border ${
            settings.showHints
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
              : 'bg-slate-800 text-slate-400 border-slate-700'
          }`}
          title="Toon/verberg geldige zet hints"
        >
          <Lightbulb className={`w-4 h-4 ${settings.showHints ? 'text-amber-400 fill-amber-400/30' : ''}`} />
          <span className="hidden sm:inline">Hints</span>
        </button>

        {/* Table Mode Toggle */}
        <button
          onClick={() => onUpdateSettings({ tableMode: !settings.tableMode })}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-xs sm:text-sm transition-all border ${
            settings.tableMode
              ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/50'
              : 'bg-slate-800 text-slate-400 border-slate-700'
          }`}
          title="Tafelmodus: Draait spelerskaarten voor tablet op tafel"
        >
          <Smartphone className="w-4 h-4" />
          <span className="hidden md:inline">Tafelstand</span>
        </button>

        {/* Sound Toggle */}
        <button
          onClick={toggleSound}
          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all active:scale-95"
          title={settings.soundEnabled ? 'Geluid uitschakelen' : 'Geluid inschakelen'}
        >
          {settings.soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
        </button>

        {/* Rules button */}
        <button
          onClick={onOpenRules}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs sm:text-sm transition-all active:scale-95"
        >
          <HelpCircle className="w-4 h-4 text-sky-400" />
          <span className="hidden sm:inline">Spelregels</span>
        </button>

        {/* Settings button */}
        <button
          onClick={onOpenSettings}
          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all active:scale-95"
          title="Instellingen"
        >
          <Settings className="w-4 h-4 text-slate-300" />
        </button>

        {/* Fullscreen button */}
        <button
          onClick={toggleFullscreen}
          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all active:scale-95 hidden sm:block"
          title="Volledig scherm"
        >
          <Maximize2 className="w-4 h-4 text-slate-400" />
        </button>

        {/* Wie Begint / Dice Roll Button */}
        {onOpenDiceRoll && (
          <button
            onClick={onOpenDiceRoll}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/50 font-bold text-xs sm:text-sm transition-all active:scale-95"
            title="Gooi dobbelstenen om te bepalen wie begint"
          >
            <Dices className="w-4 h-4 text-amber-400" />
            <span className="hidden md:inline">Wie Begint?</span>
          </button>
        )}

        {/* New Game Button */}
        <button
          onClick={onNewGame}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95"
        >
          <Sparkles className="w-4 h-4" />
          <span>Nieuw Spel</span>
        </button>
      </div>
    </header>
  );
};
