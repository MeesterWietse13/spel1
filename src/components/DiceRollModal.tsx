import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PlayerConfig } from '../types';
import { soundManager } from '../utils/audio';
import { Dices, Trophy, Play, Sparkles, RotateCcw } from 'lucide-react';
import { Sphere } from './Sphere';

interface DiceRollModalProps {
  isOpen: boolean;
  players: PlayerConfig[];
  onComplete: (winningPlayerIndex: number) => void;
  id?: string;
}

// 2D SVG Die component showing 1 to 6 dots
const DieFace: React.FC<{ value: number | null; isRolling: boolean; isWinner: boolean; isTie: boolean }> = ({
  value,
  isRolling,
  isWinner,
  isTie,
}) => {
  const getDotPositions = (val: number) => {
    switch (val) {
      case 1:
        return [[50, 50]];
      case 2:
        return [[25, 25], [75, 75]];
      case 3:
        return [[25, 25], [50, 50], [75, 75]];
      case 4:
        return [[25, 25], [25, 75], [75, 25], [75, 75]];
      case 5:
        return [[25, 25], [25, 75], [50, 50], [75, 25], [75, 75]];
      case 6:
        return [[25, 25], [25, 50], [25, 75], [75, 25], [75, 50], [75, 75]];
      default:
        return [];
    }
  };

  return (
    <motion.div
      animate={
        isRolling
          ? { rotate: [0, 90, 180, 270, 360], scale: [1, 1.15, 0.95, 1.1, 1] }
          : isWinner
          ? { scale: [1, 1.1, 1] }
          : {}
      }
      transition={isRolling ? { repeat: Infinity, duration: 0.25 } : { duration: 0.3 }}
      className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl p-2 flex items-center justify-center shadow-xl border-2 transition-all ${
        isWinner
          ? 'bg-gradient-to-br from-amber-400 to-yellow-500 border-yellow-200 shadow-yellow-500/50 scale-105 ring-4 ring-yellow-400/40'
          : isTie
          ? 'bg-amber-900/60 border-amber-500/80 text-amber-200'
          : value !== null
          ? 'bg-slate-800 border-slate-600'
          : 'bg-slate-800/50 border-slate-700/60 border-dashed'
      }`}
    >
      {value === null ? (
        <Dices className="w-8 h-8 text-slate-500 animate-pulse" />
      ) : (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {getDotPositions(value).map(([cx, cy], idx) => (
            <circle
              key={idx}
              cx={cx}
              cy={cy}
              r={9}
              fill={isWinner ? '#1e293b' : '#f8fafc'}
            />
          ))}
        </svg>
      )}
    </motion.div>
  );
};

export const DiceRollModal: React.FC<DiceRollModalProps> = ({
  isOpen,
  players,
  onComplete,
  id = 'dice-roll-modal',
}) => {
  const [diceValues, setDiceValues] = useState<(number | null)[]>([]);
  const [isRolling, setIsRolling] = useState<boolean>(false);
  const [winnerIndex, setWinnerIndex] = useState<number | null>(null);
  const [tiedIndices, setTiedIndices] = useState<number[]>([]);
  const [hasRolled, setHasRolled] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setDiceValues(Array(players.length).fill(null));
      setIsRolling(false);
      setWinnerIndex(null);
      setTiedIndices([]);
      setHasRolled(false);
    }
  }, [isOpen, players.length]);

  if (!isOpen) return null;

  const handleRoll = () => {
    if (isRolling) return;

    setIsRolling(true);
    setWinnerIndex(null);
    setTiedIndices([]);
    setHasRolled(true);
    soundManager.playDiceRoll();

    // Fast dice shuffle interval animation
    let count = 0;
    const interval = setInterval(() => {
      setDiceValues(players.map(() => Math.floor(Math.random() * 6) + 1));
      count++;

      if (count > 12) {
        clearInterval(interval);
        // Final roll values
        const finalValues = players.map(() => Math.floor(Math.random() * 6) + 1);
        setDiceValues(finalValues);
        setIsRolling(false);

        // Find max
        const maxVal = Math.max(...finalValues);
        const topIndices = finalValues
          .map((v, i) => (v === maxVal ? i : -1))
          .filter((i) => i !== -1);

        if (topIndices.length === 1) {
          const winIdx = topIndices[0];
          setWinnerIndex(winIdx);
          soundManager.playDiceWinner();
        } else {
          setTiedIndices(topIndices);
          soundManager.playInvalid();
        }
      }
    }, 90);
  };

  const handleConfirmWinner = () => {
    if (winnerIndex !== null) {
      onComplete(winnerIndex);
    }
  };

  return (
    <div
      id={id}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 shadow-2xl text-white my-auto flex flex-col items-center text-center"
      >
        {/* Header Icon */}
        <div className="p-3.5 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 mb-3">
          <Dices className="w-8 h-8 sm:w-10 sm:h-10" />
        </div>

        <h2 className="text-xl sm:text-2xl font-black tracking-wide text-white">
          Wie Mag Er Beginnen?
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 mb-6 max-w-xs">
          Gooi de dobbelstenen om te bepalen welke speler de eerste zet mag doen!
        </p>

        {/* Players & Dice Cards Grid */}
        <div className="w-full grid grid-cols-2 gap-3 mb-6">
          {players.map((p, idx) => {
            const val = diceValues[idx];
            const isWinner = winnerIndex === idx;
            const isTie = tiedIndices.includes(idx);

            return (
              <motion.div
                key={p.id}
                animate={
                  isWinner
                    ? { scale: [1, 1.03, 1] }
                    : isTie
                    ? { x: [-2, 2, -2, 2, 0] }
                    : {}
                }
                className={`p-3.5 rounded-2xl border flex flex-col items-center justify-between gap-2.5 transition-all ${
                  isWinner
                    ? 'bg-amber-950/60 border-amber-400/80 shadow-lg shadow-amber-500/20'
                    : isTie
                    ? 'bg-amber-900/30 border-amber-500/60'
                    : 'bg-slate-800/70 border-slate-700/80'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Sphere color={p.id} sizeClassName="w-5 h-5 shrink-0" />
                  <span className={`text-xs sm:text-sm font-extrabold ${p.colorText}`}>
                    {p.name}
                  </span>
                </div>

                <DieFace
                  value={val}
                  isRolling={isRolling}
                  isWinner={isWinner}
                  isTie={isTie}
                />

                {isWinner && (
                  <div className="flex items-center gap-1 text-[11px] font-black text-amber-300 bg-amber-500/20 border border-amber-400/40 px-2 py-0.5 rounded-full">
                    <Trophy className="w-3 h-3 text-amber-400" />
                    Begint het spel!
                  </div>
                )}
                {isTie && (
                  <div className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">
                    Gelijkspel ({val})
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Dynamic Status Banner */}
        {winnerIndex !== null && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full bg-emerald-950/80 border border-emerald-500/50 rounded-xl p-3 mb-5 text-emerald-200 text-xs sm:text-sm font-bold flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-emerald-400 animate-spin" />
            <span>
              {players[winnerIndex]?.name} gooit hoogste ({diceValues[winnerIndex]}) en mag beginnen!
            </span>
          </motion.div>
        )}

        {tiedIndices.length > 0 && !isRolling && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full bg-amber-950/80 border border-amber-500/50 rounded-xl p-3 mb-5 text-amber-200 text-xs sm:text-sm font-bold"
          >
            Gelijkspel voor hoogste worp! Klik op opnieuw gooien om de winnaar te bepalen.
          </motion.div>
        )}

        {/* Action Button */}
        <div className="w-full flex justify-center">
          {winnerIndex !== null ? (
            <button
              onClick={handleConfirmWinner}
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-base shadow-xl flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <Play className="w-5 h-5 fill-slate-950" />
              Start het Spel Met {players[winnerIndex]?.name}
            </button>
          ) : (
            <button
              onClick={handleRoll}
              disabled={isRolling}
              className={`w-full py-3.5 px-6 rounded-xl font-black text-base shadow-xl flex items-center justify-center gap-2 transition-all active:scale-95 ${
                isRolling
                  ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950'
              }`}
            >
              {hasRolled ? (
                <>
                  <RotateCcw className="w-5 h-5" />
                  {tiedIndices.length > 0 ? 'Opnieuw Gooien (Herkansing)' : 'Opnieuw Gooien'}
                </>
              ) : (
                <>
                  <Dices className="w-5 h-5" />
                  Gooi Dobbelstenen!
                </>
              )}
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};
