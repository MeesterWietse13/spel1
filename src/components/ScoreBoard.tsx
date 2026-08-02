import React from 'react';
import { motion } from 'motion/react';
import { PlayerColor, PlayerConfig } from '../types';
import { Sphere } from './Sphere';
import { Bot, User } from 'lucide-react';

interface ScoreBoardProps {
  players: PlayerConfig[];
  scores: Record<PlayerColor, number>;
  activePlayer: PlayerColor;
  tableMode: boolean;
  totalBallsOnBoard: number;
  id?: string;
}

export const ScoreBoard: React.FC<ScoreBoardProps> = ({
  players,
  scores,
  activePlayer,
  tableMode,
  totalBallsOnBoard,
  id = 'scoreboard',
}) => {
  return (
    <div
      id={id}
      className="w-full grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 md:gap-4 my-2"
    >
      {players.map((player) => {
        const isActive = player.id === activePlayer;
        const score = scores[player.id] || 0;
        const percentage = Math.round((score / Math.max(1, totalBallsOnBoard)) * 100);

        // Rotation angles for table play mode (sitting around a tablet)
        const rotationClass = tableMode
          ? player.id === 'red'
            ? 'rotate-180 md:rotate-0' // top
            : player.id === 'yellow'
            ? 'rotate-0' // bottom
            : player.id === 'blue'
            ? '-rotate-90 md:rotate-0' // left
            : 'rotate-90 md:rotate-0' // right
          : '';

        return (
          <motion.div
            key={player.id}
            initial={false}
            animate={{
              scale: isActive ? 1.03 : 1,
              borderColor: isActive ? player.colorHex : 'rgba(51, 65, 85, 0.4)',
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className={`relative rounded-xl sm:rounded-2xl p-2.5 sm:p-3 md:p-3.5 border-2 bg-slate-900/90 backdrop-blur-md shadow-lg flex flex-col justify-between overflow-hidden transition-all duration-300 ${rotationClass}`}
          >
            {/* Active turn glow background pulse */}
            {isActive && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.15, 0.35, 0.15] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className={`absolute inset-0 ${player.colorBg} blur-xl pointer-events-none`}
              />
            )}

            <div className="relative z-10 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <Sphere color={player.id} sizeClassName="w-7 h-7 sm:w-8 sm:h-8" />
                <div className="min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-white text-xs sm:text-sm truncate">
                      {player.name}
                    </span>
                    <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  </div>
                  <span className="text-[10px] sm:text-xs text-slate-400 block font-medium">
                    Speler
                  </span>
                </div>
              </div>

              {/* Turn Badge */}
              {isActive && (
                <span className={`px-2 py-0.5 text-[10px] sm:text-xs font-black uppercase rounded-full text-slate-950 ${player.colorBg} shadow-sm shrink-0`}>
                  Aan zet
                </span>
              )}
            </div>

            {/* Score Display */}
            <div className="relative z-10 mt-2 flex items-baseline justify-between">
              <div className="flex items-baseline gap-1">
                <span className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">
                  {score}
                </span>
                <span className="text-xs sm:text-sm font-semibold text-slate-400">
                  ballen
                </span>
              </div>
              <span className="text-xs font-bold text-slate-400">
                {percentage}%
              </span>
            </div>

            {/* Progress Bar */}
            <div className="relative z-10 w-full h-1.5 bg-slate-800 rounded-full mt-2 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 0.4 }}
                className={`h-full ${player.colorBg}`}
              />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
