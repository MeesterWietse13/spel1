import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, X, Sparkles } from 'lucide-react';
import {
  BoardSize,
  BoardState,
  GameSettings,
  Move,
  PlayerColor,
  PlayerConfig,
  Position,
} from './types';
import {
  applyMove,
  calculateScores,
  createInitialBoard,
  getValidMoves,
  isAdjacentToOccupied,
  isGameOver,
  PLAYER_INFO,
} from './utils/rolitEngine';
import { soundManager } from './utils/audio';
import { BOARD_THEMES } from './utils/themes';
import { Board } from './components/Board';
import { ScoreBoard } from './components/ScoreBoard';
import { GameHeader } from './components/GameHeader';
import { NewGameModal } from './components/NewGameModal';
import { RulesModal } from './components/RulesModal';
import { SettingsModal } from './components/SettingsModal';
import { GameOverModal } from './components/GameOverModal';
import { DiceRollModal } from './components/DiceRollModal';

// Default initial 4 human players configuration
const DEFAULT_PLAYERS: PlayerConfig[] = [
  {
    id: 'red',
    name: 'Rood',
    avatar: 'user',
    colorHex: PLAYER_INFO.red.hex,
    colorBg: PLAYER_INFO.red.bg,
    colorBorder: PLAYER_INFO.red.border,
    colorText: PLAYER_INFO.red.text,
    gradient: PLAYER_INFO.red.gradient,
  },
  {
    id: 'yellow',
    name: 'Geel',
    avatar: 'user',
    colorHex: PLAYER_INFO.yellow.hex,
    colorBg: PLAYER_INFO.yellow.bg,
    colorBorder: PLAYER_INFO.yellow.border,
    colorText: PLAYER_INFO.yellow.text,
    gradient: PLAYER_INFO.yellow.gradient,
  },
  {
    id: 'blue',
    name: 'Blauw',
    avatar: 'user',
    colorHex: PLAYER_INFO.blue.hex,
    colorBg: PLAYER_INFO.blue.bg,
    colorBorder: PLAYER_INFO.blue.border,
    colorText: PLAYER_INFO.blue.text,
    gradient: PLAYER_INFO.blue.gradient,
  },
  {
    id: 'green',
    name: 'Groen',
    avatar: 'user',
    colorHex: PLAYER_INFO.green.hex,
    colorBg: PLAYER_INFO.green.bg,
    colorBorder: PLAYER_INFO.green.border,
    colorText: PLAYER_INFO.green.text,
    gradient: PLAYER_INFO.green.gradient,
  },
];

export interface InvalidMoveNotice {
  title: string;
  message: string;
}

export default function App() {
  const [players, setPlayers] = useState<PlayerConfig[]>(DEFAULT_PLAYERS);
  const activeColors = players.map((p) => p.id);

  // App Settings (default showHints is false as requested by user, default theme is 'white')
  const [settings, setSettings] = useState<GameSettings>({
    soundEnabled: true,
    showHints: false,
    allowUndo: true,
    tableMode: false,
    language: 'nl',
    theme: 'white',
    boardSize: 8,
  });

  const [board, setBoard] = useState<BoardState>(() => createInitialBoard(activeColors, settings.boardSize));
  const [activePlayerIndex, setActivePlayerIndex] = useState<number>(0);
  const [startingPlayerIndex, setStartingPlayerIndex] = useState<number>(0);
  const [lastMove, setLastMove] = useState<Position | null>(null);
  const [flippedPositions, setFlippedPositions] = useState<Position[]>([]);
  const [isGameEnded, setIsGameEnded] = useState<boolean>(false);

  // Invalid move notification state
  const [invalidNotice, setInvalidNotice] = useState<InvalidMoveNotice | null>(null);
  const [startingNotice, setStartingNotice] = useState<string | null>(null);

  // Undo History stack
  const [boardHistory, setBoardHistory] = useState<BoardState[]>([]);
  const [playerIndexHistory, setPlayerIndexHistory] = useState<number[]>([]);
  const [moveHistory, setMoveHistory] = useState<Move[]>([]);

  // Modals state - ALWAYS show start setup modal on app load
  const [isNewGameModalOpen, setIsNewGameModalOpen] = useState<boolean>(true);
  const [isDiceModalOpen, setIsDiceModalOpen] = useState<boolean>(false);
  const [isRulesModalOpen, setIsRulesModalOpen] = useState<boolean>(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState<boolean>(false);
  const [isGameOverModalOpen, setIsGameOverModalOpen] = useState<boolean>(false);

  const activePlayerConfig = players[activePlayerIndex] || players[0];
  const activeColor = activePlayerConfig.id;
  const currentValidMoves = getValidMoves(board, activeColor);
  const currentScores = calculateScores(board);
  const totalBallsOnBoard = Object.values(currentScores).reduce((a, b) => a + b, 0);

  // Auto-dismiss invalid move notice after 4 seconds
  useEffect(() => {
    if (invalidNotice) {
      const timer = setTimeout(() => {
        setInvalidNotice(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [invalidNotice]);

  // Auto-dismiss starting notice banner after 4.5 seconds
  useEffect(() => {
    if (startingNotice) {
      const timer = setTimeout(() => {
        setStartingNotice(null);
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [startingNotice]);

  // When setting up a new game from NewGameModal -> open Dice Minigame!
  const handleStartGame = (
    newPlayers: PlayerConfig[],
    chosenBoardSize?: BoardSize,
    chosenTheme?: GameSettings['theme']
  ) => {
    const size = chosenBoardSize || settings.boardSize;
    const theme = chosenTheme || settings.theme;
    setSettings((prev) => ({ ...prev, boardSize: size, theme }));
    setPlayers(newPlayers);
    setIsNewGameModalOpen(false);
    setIsGameOverModalOpen(false);
    setIsDiceModalOpen(true);
  };

  // Called when dice roll minigame completes
  const handleDiceRollComplete = (winningPlayerIndex: number) => {
    setIsDiceModalOpen(false);
    setStartingPlayerIndex(winningPlayerIndex);
    setActivePlayerIndex(winningPlayerIndex);

    const colors = players.map((p) => p.id);
    const initBoard = createInitialBoard(colors, settings.boardSize);
    setBoard(initBoard);
    setLastMove(null);
    setFlippedPositions([]);
    setBoardHistory([]);
    setPlayerIndexHistory([]);
    setMoveHistory([]);
    setIsGameEnded(false);
    setInvalidNotice(null);

    const starterName = players[winningPlayerIndex]?.name || 'Speler';
    setStartingNotice(`🎲 Dobbelsteen winnaar: ${starterName} mag beginnen!`);
  };

  // Replay / Reset current game: Rotates starting player to the NEXT player automatically!
  const handleResetCurrentGame = () => {
    const nextStartIndex = (startingPlayerIndex + 1) % players.length;
    setStartingPlayerIndex(nextStartIndex);
    setActivePlayerIndex(nextStartIndex);

    const colors = players.map((p) => p.id);
    const initBoard = createInitialBoard(colors, settings.boardSize);
    setBoard(initBoard);
    setLastMove(null);
    setFlippedPositions([]);
    setBoardHistory([]);
    setPlayerIndexHistory([]);
    setMoveHistory([]);
    setIsGameEnded(false);
    setIsGameOverModalOpen(false);
    setInvalidNotice(null);

    const starterName = players[nextStartIndex]?.name || 'Speler';
    setStartingNotice(`🔄 Volgende partij: ${starterName} mag als eerste beginnen!`);
  };

  // Update settings handler
  const handleUpdateSettings = (newSet: Partial<GameSettings>) => {
    if (newSet.boardSize && newSet.boardSize !== settings.boardSize) {
      setSettings((prev) => ({ ...prev, ...newSet }));
      const colors = players.map((p) => p.id);
      setBoard(createInitialBoard(colors, newSet.boardSize));
      setActivePlayerIndex(0);
      setLastMove(null);
      setFlippedPositions([]);
      setBoardHistory([]);
      setPlayerIndexHistory([]);
      setMoveHistory([]);
      setIsGameEnded(false);
      setInvalidNotice(null);
    } else {
      setSettings((prev) => ({ ...prev, ...newSet }));
    }
  };

  // Handle cell click on the board
  const handleCellClick = useCallback(
    (row: number, col: number) => {
      if (isGameEnded) return;

      // 1. Check if occupied
      if (board[row][col] !== null) {
        soundManager.playInvalid();
        setInvalidNotice({
          title: 'Vakje al bezet',
          message: 'Er ligt al een bal in dit vakje op het bord.',
        });
        return;
      }

      // 2. Check if adjacent to existing spheres
      if (!isAdjacentToOccupied(board, row, col)) {
        soundManager.playInvalid();
        setInvalidNotice({
          title: 'Aansluitingsregel',
          message: 'Je nieuwe bal moet altijd grenzen aan ten minste één al aanwezige bal op het bord.',
        });
        return;
      }

      // 3. Check if move is in valid moves list
      const isValidMove = currentValidMoves.some(
        (m) => m.position.row === row && m.position.col === col
      );

      if (isValidMove) {
        // Clear any notice
        setInvalidNotice(null);

        // Execute valid move
        const player = activePlayerConfig.id;
        const { newBoard, flipped } = applyMove(board, row, col, player);

        // Save state to Undo history
        setBoardHistory((prev) => [...prev, board]);
        setPlayerIndexHistory((prev) => [...prev, activePlayerIndex]);

        const newMoveRecord: Move = {
          position: { row, col },
          player,
          flippedPositions: flipped,
          timestamp: Date.now(),
        };
        setMoveHistory((prev) => [...prev, newMoveRecord]);

        // Play audio
        soundManager.playPlaceSphere();
        if (flipped.length > 0) {
          soundManager.playFlipSphere(flipped.length);
        }

        setBoard(newBoard);
        setLastMove({ row, col });
        setFlippedPositions(flipped);

        // Check game over
        if (isGameOver(newBoard, activeColors)) {
          setIsGameEnded(true);
          setTimeout(() => {
            soundManager.playVictory();
            setIsGameOverModalOpen(true);
          }, 600);
          return;
        }

        // Advance turn to next player
        const nextIndex = (activePlayerIndex + 1) % players.length;
        setActivePlayerIndex(nextIndex);
      } else {
        // The cell is empty and adjacent, but not valid -> Capturing was mandatory!
        soundManager.playInvalid();
        setInvalidNotice({
          title: 'Verplichte insluiting',
          message:
            'Omdat er ballen van tegenstanders ingesloten kunnen worden, ben je volgens de spelregels verplicht een zet te kiezen die ballen omrolt.',
        });
      }
    },
    [
      isGameEnded,
      board,
      currentValidMoves,
      activePlayerConfig.id,
      activePlayerIndex,
      activeColors,
      players.length,
    ]
  );

  // Turn management & pass turn if no valid moves exist
  useEffect(() => {
    if (isGameEnded) return;

    // Check if game over on turn start
    if (isGameOver(board, activeColors)) {
      setIsGameEnded(true);
      setTimeout(() => {
        soundManager.playVictory();
        setIsGameOverModalOpen(true);
      }, 500);
      return;
    }

    // Check if active player has any valid moves
    if (currentValidMoves.length === 0) {
      // Pass turn automatically to next player
      const nextIndex = (activePlayerIndex + 1) % players.length;
      setActivePlayerIndex(nextIndex);
    } else {
      soundManager.playTurnChime();
    }
  }, [activePlayerIndex, board, activeColors, isGameEnded, players.length, currentValidMoves.length]);

  // Handle Undo
  const handleUndo = () => {
    if (boardHistory.length === 0 || !settings.allowUndo) return;

    const lastBoard = boardHistory[boardHistory.length - 1];
    const lastPlayerIdx = playerIndexHistory[playerIndexHistory.length - 1];

    setBoardHistory((prev) => prev.slice(0, -1));
    setPlayerIndexHistory((prev) => prev.slice(0, -1));
    setMoveHistory((prev) => prev.slice(0, -1));

    setBoard(lastBoard);
    setActivePlayerIndex(lastPlayerIdx);
    setLastMove(null);
    setFlippedPositions([]);
    setIsGameEnded(false);
    setInvalidNotice(null);
    soundManager.playUndo();
  };

  const currentTheme = BOARD_THEMES[settings.theme] || BOARD_THEMES.classic;

  return (
    <div className="h-screen max-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none overflow-hidden">
      {/* Top Navigation Header */}
      <GameHeader
        onNewGame={() => setIsNewGameModalOpen(true)}
        onOpenDiceRoll={() => setIsDiceModalOpen(true)}
        onReset={handleResetCurrentGame}
        onUndo={handleUndo}
        canUndo={boardHistory.length > 0 && settings.allowUndo}
        onOpenRules={() => setIsRulesModalOpen(true)}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        themes={BOARD_THEMES}
      />

      {/* Main Tablet Layout Workspace */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-4 py-2 flex flex-col items-center justify-between gap-2 overflow-hidden">
        {/* Scoreboard Panel */}
        <ScoreBoard
          players={players}
          scores={currentScores}
          activePlayer={activeColor}
          tableMode={settings.tableMode}
          totalBallsOnBoard={totalBallsOnBoard}
        />

        {/* Dynamic Rolit Game Board */}
        <div className="flex-1 flex items-center justify-center w-full my-auto py-1">
          <Board
            board={board}
            validMoves={currentValidMoves}
            activePlayer={activeColor}
            lastMove={lastMove}
            flippedPositions={flippedPositions}
            onCellClick={handleCellClick}
            showHints={settings.showHints}
            theme={currentTheme}
          />
        </div>

        {/* Active Turn & Feedback Bottom Banner */}
        <div className="relative w-full max-w-xl">
          <AnimatePresence mode="wait">
            {invalidNotice ? (
              /* Invalid Move Feedback Toast Banner */
              <motion.div
                key="invalid-toast"
                initial={{ opacity: 0, y: 15, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.96 }}
                className="bg-amber-950/95 border-2 border-amber-500/80 text-amber-100 rounded-2xl p-3 shadow-2xl flex items-start gap-3 backdrop-blur-md"
              >
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5 animate-bounce" />
                <div className="flex-1 text-xs sm:text-sm">
                  <div className="font-extrabold text-amber-300 flex items-center gap-2">
                    {invalidNotice.title}
                  </div>
                  <div className="font-medium text-amber-100/90 leading-tight mt-0.5">
                    {invalidNotice.message}
                  </div>
                </div>
                <button
                  onClick={() => setInvalidNotice(null)}
                  className="text-amber-400 hover:text-white p-1 rounded-lg transition-colors shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            ) : startingNotice ? (
              /* Starting Player / Rotation Notice Banner */
              <motion.div
                key="starting-notice"
                initial={{ opacity: 0, y: 15, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.96 }}
                className="bg-emerald-950/95 border-2 border-emerald-500/80 text-emerald-100 rounded-2xl p-3 shadow-2xl flex items-center justify-between gap-3 backdrop-blur-md"
              >
                <div className="flex items-center gap-2 text-xs sm:text-sm font-extrabold text-emerald-200">
                  <Sparkles className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>{startingNotice}</span>
                </div>
                <button
                  onClick={() => setStartingNotice(null)}
                  className="text-emerald-400 hover:text-white p-1 rounded-lg transition-colors shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            ) : (
              /* Active Player Turn Banner */
              <motion.div
                key="turn-banner"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-full px-4 py-2 flex items-center justify-between shadow-lg text-xs sm:text-sm"
              >
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 font-medium">Actieve Beurt:</span>
                  <span className={`font-black ${activePlayerConfig.colorText}`}>
                    {activePlayerConfig.name}
                  </span>
                  <span className="text-[10px] bg-slate-800 text-slate-300 font-semibold px-2 py-0.5 rounded-full border border-slate-700">
                    {settings.boardSize}x{settings.boardSize}
                  </span>
                </div>

                <div className="text-slate-400 font-medium">
                  Beurt speler <strong className="text-white capitalize font-bold">{activePlayerConfig.id}</strong>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Dialog Modals */}
      <NewGameModal
        isOpen={isNewGameModalOpen}
        onClose={() => setIsNewGameModalOpen(false)}
        onStartGame={handleStartGame}
        currentPlayers={players}
        currentBoardSize={settings.boardSize}
        currentTheme={settings.theme}
      />

      <DiceRollModal
        isOpen={isDiceModalOpen}
        players={players}
        onComplete={handleDiceRollComplete}
      />

      <RulesModal
        isOpen={isRulesModalOpen}
        onClose={() => setIsRulesModalOpen(false)}
      />

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
      />

      <GameOverModal
        isOpen={isGameOverModalOpen}
        players={players}
        scores={currentScores}
        totalMoves={moveHistory.length}
        boardSize={settings.boardSize}
        onPlayAgain={handleResetCurrentGame}
        onNewSetup={() => {
          setIsGameOverModalOpen(false);
          setIsNewGameModalOpen(true);
        }}
      />
    </div>
  );
}
