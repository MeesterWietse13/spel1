import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BoardState, BoardTheme, PlayerColor, Position } from '../types';
import { Sphere } from './Sphere';
import { ValidMove } from '../utils/rolitEngine';
import { PLAYER_INFO } from '../utils/rolitEngine';

interface BoardProps {
  board: BoardState;
  validMoves: ValidMove[];
  activePlayer: PlayerColor;
  lastMove: Position | null;
  flippedPositions: Position[];
  onCellClick: (row: number, col: number) => void;
  showHints: boolean;
  theme: BoardTheme;
  id?: string;
}

export const Board: React.FC<BoardProps> = ({
  board,
  validMoves,
  activePlayer,
  lastMove,
  flippedPositions,
  onCellClick,
  showHints,
  theme,
  id = 'rolit-board',
}) => {
  const [hoveredPos, setHoveredPos] = useState<Position | null>(null);
  const boardSize = board.length;

  const getValidMoveForCell = (r: number, c: number): ValidMove | undefined => {
    return validMoves.find(m => m.position.row === r && m.position.col === c);
  };

  const isFlipped = (r: number, c: number): boolean => {
    return flippedPositions.some(p => p.row === r && p.col === c);
  };

  const isLastPlaced = (r: number, c: number): boolean => {
    return lastMove !== null && lastMove.row === r && lastMove.col === c;
  };

  const activeInfo = PLAYER_INFO[activePlayer];

  return (
    <div
      id={id}
      className={`relative w-full max-w-[94vw] sm:max-w-[620px] md:max-w-[720px] lg:max-w-[780px] max-h-[64vh] aspect-square rounded-2xl md:rounded-3xl p-2.5 sm:p-4 md:p-5 ${theme.boardBorder} border-4 sm:border-8 md:border-[12px] shadow-2xl transition-all duration-300 select-none flex flex-col justify-center items-center`}
    >
      {/* Frame Texture detail with dynamic grid columns/rows */}
      <div
        style={{
          gridTemplateColumns: `repeat(${boardSize}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${boardSize}, minmax(0, 1fr))`,
        }}
        className={`w-full h-full rounded-xl sm:rounded-2xl ${theme.boardBg} p-1.5 sm:p-2 md:p-3 grid gap-1 sm:gap-1.5 md:gap-2 relative`}
      >
        {board.map((row, rIdx) =>
          row.map((cellState, cIdx) => {
            const validMove = getValidMoveForCell(rIdx, cIdx);
            const isValid = !!validMove;
            const isHovered = hoveredPos?.row === rIdx && hoveredPos?.col === cIdx;

            return (
              <div
                key={`${rIdx}-${cIdx}`}
                onClick={() => onCellClick(rIdx, cIdx)}
                onMouseEnter={() => setHoveredPos({ row: rIdx, col: cIdx })}
                onMouseLeave={() => setHoveredPos(null)}
                className={`relative aspect-square rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer touch-manipulation ${
                  theme.socketBg
                } hover:brightness-125`}
              >
                {/* Sphere rendering */}
                {cellState !== null ? (
                  <Sphere
                    color={cellState}
                    isLastMove={isLastPlaced(rIdx, cIdx)}
                    isFlipped={isFlipped(rIdx, cIdx)}
                    sizeClassName="w-[88%] h-[88%]"
                  />
                ) : (
                  /* Optional hints if player specifically turns hints on in settings */
                  <AnimatePresence>
                    {isValid && showHints && (
                      <motion.div
                        initial={{ scale: 0.4, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className="relative w-full h-full flex items-center justify-center"
                      >
                        {validMove.isCapturing ? (
                          <div className="flex items-center justify-center">
                            <motion.div
                              animate={{ scale: [0.85, 1.1, 0.85] }}
                              transition={{ repeat: Infinity, duration: 1.5 }}
                              className={`w-3.5 h-3.5 sm:w-5 sm:h-5 md:w-6 md:h-6 rounded-full ${activeInfo.bg} opacity-80 shadow-md flex items-center justify-center`}
                            >
                              <span className="text-[10px] sm:text-xs font-black text-white leading-none">
                                +{validMove.flippedPositions.length}
                              </span>
                            </motion.div>
                          </div>
                        ) : (
                          <div className={`w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 rounded-full ${activeInfo.bg} opacity-40`} />
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}

                {/* Ghost preview on hover over empty sockets */}
                {cellState === null && isHovered && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30 scale-85">
                    <Sphere color={activePlayer} sizeClassName="w-[88%] h-[88%]" />
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
