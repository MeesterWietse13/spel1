import React, { useState } from 'react';
import { motion } from 'motion/react';
import { BoardSize, GameMode, GameSettings, PlayerColor, PlayerConfig } from '../types';
import { PLAYER_INFO } from '../utils/rolitEngine';
import { Users, Play, X, Sparkles, Grid, Palette } from 'lucide-react';
import { Sphere } from './Sphere';

interface NewGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartGame: (players: PlayerConfig[], boardSize: BoardSize, theme: GameSettings['theme']) => void;
  currentPlayers: PlayerConfig[];
  currentBoardSize?: BoardSize;
  currentTheme?: GameSettings['theme'];
  id?: string;
}

export const NewGameModal: React.FC<NewGameModalProps> = ({
  isOpen,
  onClose,
  onStartGame,
  currentPlayers,
  currentBoardSize = 8,
  currentTheme = 'white',
  id = 'new-game-modal',
}) => {
  const [gameMode, setGameMode] = useState<GameMode>('4-players');
  const [boardSize, setBoardSize] = useState<BoardSize>(currentBoardSize);
  const [boardTheme, setBoardTheme] = useState<GameSettings['theme']>(currentTheme);

  // Initial local setup state for 4 player names
  const [playerNames, setPlayerNames] = useState<Record<PlayerColor, string>>({
    red: currentPlayers.find(p => p.id === 'red')?.name || 'Rood',
    yellow: currentPlayers.find(p => p.id === 'yellow')?.name || 'Geel',
    blue: currentPlayers.find(p => p.id === 'blue')?.name || 'Blauw',
    green: currentPlayers.find(p => p.id === 'green')?.name || 'Groen',
  });

  if (!isOpen) return null;

  const activeColors: PlayerColor[] =
    gameMode === '2-players'
      ? ['red', 'green']
      : gameMode === '3-players'
      ? ['red', 'yellow', 'green']
      : ['red', 'yellow', 'blue', 'green'];

  const handleStart = () => {
    const finalPlayers: PlayerConfig[] = activeColors.map((color) => {
      const info = PLAYER_INFO[color];
      const customName = playerNames[color];

      return {
        id: color,
        name: customName.trim() || info.name,
        avatar: 'user',
        colorHex: info.hex,
        colorBg: info.bg,
        colorBorder: info.border,
        colorText: info.text,
        gradient: info.gradient,
      };
    });

    onStartGame(finalPlayers, boardSize, boardTheme);
  };

  const updatePlayerName = (color: PlayerColor, name: string) => {
    setPlayerNames((prev) => ({
      ...prev,
      [color]: name,
    }));
  };

  return (
    <div
      id={id}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative w-full max-w-xl bg-slate-900 border border-slate-700 rounded-2xl md:rounded-3xl p-5 sm:p-6 md:p-8 shadow-2xl text-white my-auto max-h-[92vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black tracking-wide">
                Nieuw Spel Instellen
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Kies het aantal spelers en de bordgrootte
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

        <div className="space-y-6 my-5 overflow-y-auto pr-1">
          {/* Game Mode Selector */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2.5 flex items-center gap-2">
              <Users className="w-4 h-4 text-amber-400" />
              Aantal Spelers
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { mode: '2-players' as GameMode, label: '2 Spelers', sub: 'Rood ↔ Groen (Diagonaal)' },
                { mode: '3-players' as GameMode, label: '3 Spelers', sub: 'Rood, Geel, Groen' },
                { mode: '4-players' as GameMode, label: '4 Spelers', sub: 'Klassiek Rolit (4 Kleuren)' },
              ].map(({ mode, label, sub }) => (
                <button
                  key={mode}
                  onClick={() => setGameMode(mode)}
                  className={`p-3 rounded-xl border font-bold text-center transition-all ${
                    gameMode === mode
                      ? 'bg-gradient-to-br from-amber-500/20 to-red-500/20 border-amber-500 text-amber-300 shadow-lg scale-[1.02]'
                      : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700/80 text-slate-400'
                  }`}
                >
                  <div className="text-sm font-black">{label}</div>
                  <div className="text-[10px] font-medium opacity-70 mt-0.5">{sub}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Board Size Selector */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2.5 flex items-center gap-2">
              <Grid className="w-4 h-4 text-emerald-400" />
              Bordgrootte
            </label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { size: 6 as BoardSize, label: '6 op 6', desc: 'Snelle pot (36 vakken)' },
                { size: 8 as BoardSize, label: '8 op 8', desc: 'Klassiek Rolit (64 vakken)' },
              ].map(({ size, label, desc }) => (
                <button
                  key={size}
                  onClick={() => setBoardSize(size)}
                  className={`p-3.5 rounded-xl border text-left font-bold transition-all ${
                    boardSize === size
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-md scale-[1.02]'
                      : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700/80 text-slate-400'
                  }`}
                >
                  <div className="text-sm font-black flex items-center justify-between">
                    <span>{label}</span>
                    {boardSize === size && <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />}
                  </div>
                  <div className="text-[11px] font-medium opacity-70 mt-1">{desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Board Theme / Style Selector */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2.5 flex items-center gap-2">
              <Palette className="w-4 h-4 text-sky-400" />
              Spelbord Thema & Uiterlijk
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {[
                { id: 'white' as const, label: 'Schoon Wit Bord', previewBg: 'bg-slate-100 border-slate-300' },
                { id: 'classic' as const, label: 'Klassiek Rood Vilt', previewBg: 'bg-red-950 border-amber-700' },
                { id: 'wood' as const, label: 'Luxe Hout', previewBg: 'bg-amber-950 border-amber-800' },
                { id: 'dark' as const, label: 'Modern Obsidian', previewBg: 'bg-slate-950 border-slate-700' },
                { id: 'neon' as const, label: 'Cyber Neon', previewBg: 'bg-indigo-950 border-cyan-500' },
              ].map((th) => (
                <button
                  key={th.id}
                  type="button"
                  onClick={() => setBoardTheme(th.id)}
                  className={`p-2.5 rounded-xl border flex items-center gap-2.5 text-left transition-all ${
                    boardTheme === th.id
                      ? 'bg-sky-500/20 border-sky-400 text-sky-200 shadow-md scale-[1.02]'
                      : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700/80 text-slate-400'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full border-2 shrink-0 ${th.previewBg}`} />
                  <span className="text-xs font-bold leading-tight">{th.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Players Customization List */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2.5">
              Namen van de Spelers
            </label>

            <div className="space-y-2.5">
              {activeColors.map((color) => {
                const info = PLAYER_INFO[color];

                return (
                  <div
                    key={color}
                    className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 w-full">
                      <Sphere color={color} sizeClassName="w-8 h-8 shrink-0" />
                      <input
                        type="text"
                        value={playerNames[color]}
                        onChange={(e) => updatePlayerName(color, e.target.value)}
                        placeholder={`Speler ${info.name}`}
                        className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm font-bold text-white w-full focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-sm transition-all"
          >
            Annuleren
          </button>
          <button
            onClick={handleStart}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-red-500 hover:from-amber-400 hover:to-red-400 text-slate-950 font-black text-sm shadow-xl transition-all active:scale-95"
          >
            <Play className="w-4 h-4 fill-slate-950" />
            Start Spel
          </button>
        </div>
      </motion.div>
    </div>
  );
};
