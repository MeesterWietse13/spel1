import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { PlayerColor, PlayerConfig } from '../types';
import { Trophy, RotateCcw, Sparkles, Award } from 'lucide-react';
import { Sphere } from './Sphere';

interface GameOverModalProps {
  isOpen: boolean;
  players: PlayerConfig[];
  scores: Record<PlayerColor, number>;
  totalMoves: number;
  boardSize: number;
  onPlayAgain: () => void;
  onNewSetup: () => void;
  id?: string;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  isOpen,
  players,
  scores,
  totalMoves,
  boardSize,
  onPlayAgain,
  onNewSetup,
  id = 'game-over-modal',
}) => {
  useEffect(() => {
    if (isOpen) {
      // Fire victory confetti burst
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#ef4444', '#facc15', '#3b82f6', '#22c55e', '#a855f7'],
        });
      } catch (err) {
        // Fallback
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Sort players by score descending
  const sortedPlayers = [...players].sort((a, b) => (scores[b.id] || 0) - (scores[a.id] || 0));
  const winner = sortedPlayers[0];
  const maxScore = scores[winner?.id] || 0;

  // Check if tie
  const isTie = sortedPlayers.length > 1 && scores[sortedPlayers[1].id] === maxScore;

  return (
    <div
      id={id}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto"
    >
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.85, opacity: 0 }}
        className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl md:rounded-3xl p-6 sm:p-8 shadow-2xl text-white my-auto flex flex-col text-center"
      >
        {/* Winner Icon & Header */}
        <div className="relative mx-auto mb-4">
          <motion.div
            initial={{ rotate: -15, scale: 0 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 12 }}
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-200 p-0.5 shadow-2xl flex items-center justify-center mx-auto"
          >
            <div className="w-full h-full rounded-[22px] bg-slate-950 flex items-center justify-center">
              <Trophy className="w-10 h-10 sm:w-12 sm:h-12 text-amber-400 animate-bounce" />
            </div>
          </motion.div>
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-wide">
          {isTie ? 'Gelijkspel!' : `${winner.name} Wint!`}
        </h2>

        <p className="text-xs sm:text-sm text-slate-400 mt-1 mb-6">
          {isTie
            ? `Spannend eindresultaat met ${maxScore} ballen elk!`
            : `Gefeliciteerd! ${winner.name} heeft met ${maxScore} ballen gewonnen.`}
        </p>

        {/* Podium / Final Score Rankings */}
        <div className="space-y-2.5 mb-6 text-left">
          {sortedPlayers.map((player, idx) => {
            const score = scores[player.id] || 0;
            const isFirst = idx === 0 && !isTie;

            return (
              <div
                key={player.id}
                className={`p-3.5 rounded-2xl border flex items-center justify-between transition-all ${
                  isFirst
                    ? 'bg-amber-500/15 border-amber-500/80 shadow-lg'
                    : 'bg-slate-800/60 border-slate-700/60'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center font-black text-xs shrink-0 ${
                      idx === 0
                        ? 'bg-amber-400 text-slate-950'
                        : idx === 1
                        ? 'bg-slate-300 text-slate-950'
                        : idx === 2
                        ? 'bg-amber-700 text-white'
                        : 'bg-slate-700 text-slate-300'
                    }`}
                  >
                    {idx + 1}
                  </div>
                  <Sphere color={player.id} sizeClassName="w-7 h-7 shrink-0" />
                  <span className="font-bold text-sm sm:text-base text-white truncate">
                    {player.name}
                  </span>
                </div>

                <div className="flex items-baseline gap-1 shrink-0">
                  <span className="text-xl sm:text-2xl font-black text-white">
                    {score}
                  </span>
                  <span className="text-xs font-semibold text-slate-400">
                    ballen
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Stats summary */}
        <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800 text-xs text-slate-400 mb-6 flex justify-around">
          <div>
            Totaal Zetten: <strong className="text-white">{totalMoves}</strong>
          </div>
          <div>
            Bordgrootte: <strong className="text-white">{boardSize} x {boardSize} ({boardSize * boardSize})</strong>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onNewSetup}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm border border-slate-700 transition-all active:scale-95"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            Nieuw Instellen
          </button>
          <button
            onClick={onPlayAgain}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-red-500 hover:from-amber-400 hover:to-red-400 text-slate-950 font-black text-sm shadow-xl transition-all active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            Opnieuw Spelen
          </button>
        </div>
      </motion.div>
    </div>
  );
};
