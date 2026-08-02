import React from 'react';
import { motion } from 'motion/react';
import { PlayerColor } from '../types';

interface SphereProps {
  color: PlayerColor;
  isNew?: boolean;
  isFlipped?: boolean;
  isLastMove?: boolean;
  sizeClassName?: string;
  onClick?: () => void;
  id?: string;
}

export const Sphere: React.FC<SphereProps> = ({
  color,
  isNew = false,
  isFlipped = false,
  isLastMove = false,
  sizeClassName = 'w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16',
  onClick,
  id,
}) => {
  // Color radial gradient map
  const colorGradients: Record<PlayerColor, string> = {
    red: 'radial-gradient(circle at 35% 35%, #ff8888 0%, #ef4444 40%, #b91c1c 80%, #7f1d1d 100%)',
    yellow: 'radial-gradient(circle at 35% 35%, #fef08a 0%, #facc15 40%, #d97706 80%, #78350f 100%)',
    blue: 'radial-gradient(circle at 35% 35%, #93c5fd 0%, #3b82f6 40%, #1d4ed8 80%, #1e3a8a 100%)',
    green: 'radial-gradient(circle at 35% 35%, #86efac 0%, #22c55e 40%, #15803d 80%, #14532d 100%)',
  };

  const ringColors: Record<PlayerColor, string> = {
    red: 'ring-red-400/80',
    yellow: 'ring-yellow-300/80',
    blue: 'ring-blue-400/80',
    green: 'ring-green-400/80',
  };

  return (
    <div
      id={id}
      onClick={onClick}
      className={`relative flex items-center justify-center select-none cursor-pointer ${sizeClassName}`}
      style={{ perspective: '600px' }}
    >
      <motion.div
        key={`${color}-${isFlipped ? 'flipped' : 'normal'}`}
        initial={
          isNew
            ? { scale: 0.2, rotateY: 0, opacity: 0 }
            : isFlipped
            ? { rotateY: 180, scale: 0.9 }
            : { scale: 1, rotateY: 0 }
        }
        animate={{ scale: 1, rotateY: 0, opacity: 1 }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 20,
          mass: 0.8,
        }}
        className={`relative w-full h-full rounded-full shadow-lg overflow-hidden flex items-center justify-center ${
          isLastMove ? `ring-4 ${ringColors[color]} ring-offset-2 ring-offset-emerald-900/60` : ''
        }`}
        style={{
          background: colorGradients[color],
          boxShadow: 'inset -2px -4px 10px rgba(0, 0, 0, 0.6), inset 2px 2px 8px rgba(255, 255, 255, 0.6), 0 6px 12px rgba(0, 0, 0, 0.4)',
        }}
      >
        {/* Specular gloss reflection highlight */}
        <div className="absolute top-[8%] left-[12%] w-[42%] h-[32%] bg-gradient-to-b from-white/80 to-transparent rounded-full blur-[0.5px] pointer-events-none transform -rotate-45" />

        {/* Secondary soft bottom light reflection */}
        <div className="absolute bottom-[8%] right-[10%] w-[35%] h-[25%] bg-white/10 rounded-full blur-[1px] pointer-events-none" />

        {/* Last move indicator dot */}
        {isLastMove && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: [1, 1.25, 1] }}
            transition={{ repeat: Infinity, duration: 1.8 }}
            className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-white shadow-md border border-black/20"
          />
        )}
      </motion.div>
    </div>
  );
};
