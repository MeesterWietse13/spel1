import { BoardSize, BoardState, CellState, PlayerColor, Position } from '../types';

export const ALL_DIRECTIONS: [number, number][] = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],  [1, 1],
];

export const PLAYER_COLORS: PlayerColor[] = ['red', 'yellow', 'blue', 'green'];

export const PLAYER_INFO: Record<PlayerColor, { name: string; hex: string; bg: string; border: string; text: string; gradient: string }> = {
  red: {
    name: 'Rood',
    hex: '#ef4444',
    bg: 'bg-red-500',
    border: 'border-red-500',
    text: 'text-red-500',
    gradient: 'from-red-500 to-rose-700',
  },
  yellow: {
    name: 'Geel',
    hex: '#eab308',
    bg: 'bg-yellow-500',
    border: 'border-yellow-500',
    text: 'text-yellow-500',
    gradient: 'from-amber-400 to-yellow-600',
  },
  blue: {
    name: 'Blauw',
    hex: '#3b82f6',
    bg: 'bg-blue-500',
    border: 'border-blue-500',
    text: 'text-blue-500',
    gradient: 'from-blue-500 to-indigo-700',
  },
  green: {
    name: 'Groen',
    hex: '#22c55e',
    bg: 'bg-green-500',
    border: 'border-green-500',
    text: 'text-green-500',
    gradient: 'from-emerald-500 to-green-700',
  },
};

/**
 * Creates an initial Rolit board (6x6 or 8x8).
 * Center 4 cells are populated with initial spheres.
 */
export function createInitialBoard(activeColors: PlayerColor[] = PLAYER_COLORS, boardSize: BoardSize = 8): BoardState {
  const board: BoardState = Array(boardSize)
    .fill(null)
    .map(() => Array(boardSize).fill(null));

  // Determine initial center ball colors
  const c1 = activeColors[0] || 'red';
  const c2 = activeColors[1] || 'yellow';
  const c3 = activeColors[2] || 'blue';
  const c4 = activeColors[3] || 'green';

  const mid = Math.floor(boardSize / 2) - 1;

  board[mid][mid] = c1;
  board[mid][mid + 1] = c2;
  board[mid + 1][mid] = c3;
  board[mid + 1][mid + 1] = c4;

  return board;
}

/**
 * Checks if row, col is within board bounds.
 */
export function isValidPosition(r: number, c: number, boardSize: number): boolean {
  return r >= 0 && r < boardSize && c >= 0 && c < boardSize;
}

/**
 * Checks if a cell is adjacent to at least one occupied cell on the board.
 */
export function isAdjacentToOccupied(board: BoardState, r: number, c: number): boolean {
  const boardSize = board.length;
  for (const [dr, dc] of ALL_DIRECTIONS) {
    const nr = r + dr;
    const nc = c + dc;
    if (isValidPosition(nr, nc, boardSize) && board[nr][nc] !== null) {
      return true;
    }
  }
  return false;
}

/**
 * Calculates which opponent spheres would be flipped if player puts a sphere at (row, col).
 */
export function getFlippedPositions(board: BoardState, row: number, col: number, player: PlayerColor): Position[] {
  if (board[row][col] !== null) return [];
  if (!isAdjacentToOccupied(board, row, col)) return [];

  const boardSize = board.length;
  const flipped: Position[] = [];

  for (const [dr, dc] of ALL_DIRECTIONS) {
    const tempToFlip: Position[] = [];
    let currR = row + dr;
    let currC = col + dc;

    while (isValidPosition(currR, currC, boardSize)) {
      const cell = board[currR][currC];
      if (cell === null) {
        // Empty space breaks the straight line
        break;
      }
      if (cell === player) {
        // Found our color! All accumulated opponent spheres in this ray get flipped
        if (tempToFlip.length > 0) {
          flipped.push(...tempToFlip);
        }
        break;
      } else {
        // Opponent sphere
        tempToFlip.push({ row: currR, col: currC });
      }
      currR += dr;
      currC += dc;
    }
  }

  return flipped;
}

export interface ValidMove {
  position: Position;
  flippedPositions: Position[];
  isCapturing: boolean;
}

/**
 * Returns all valid moves for the given player according to official Rolit rules.
 * Rule: If any capturing move exists (flippedPositions.length > 0), player MUST capture.
 * If no capturing move exists, any adjacent empty space is allowed (with 0 flips).
 */
export function getValidMoves(board: BoardState, player: PlayerColor): ValidMove[] {
  const boardSize = board.length;
  const capturingMoves: ValidMove[] = [];
  const nonCapturingMoves: ValidMove[] = [];

  for (let r = 0; r < boardSize; r++) {
    for (let c = 0; c < boardSize; c++) {
      if (board[r][c] === null && isAdjacentToOccupied(board, r, c)) {
        const flipped = getFlippedPositions(board, r, c, player);
        const move: ValidMove = {
          position: { row: r, col: c },
          flippedPositions: flipped,
          isCapturing: flipped.length > 0,
        };

        if (flipped.length > 0) {
          capturingMoves.push(move);
        } else {
          nonCapturingMoves.push(move);
        }
      }
    }
  }

  // Official Rolit Rule: Capturing is mandatory if possible!
  if (capturingMoves.length > 0) {
    return capturingMoves;
  }
  return nonCapturingMoves;
}

/**
 * Applies a move on the board and returns the new board state and flipped list.
 */
export function applyMove(board: BoardState, row: number, col: number, player: PlayerColor): { newBoard: BoardState; flipped: Position[] } {
  const flipped = getFlippedPositions(board, row, col, player);
  const newBoard: BoardState = board.map(r => [...r]);

  newBoard[row][col] = player;
  for (const pos of flipped) {
    newBoard[pos.row][pos.col] = player;
  }

  return { newBoard, flipped };
}

/**
 * Counts the current score (number of spheres) for each player color.
 */
export function calculateScores(board: BoardState): Record<PlayerColor, number> {
  const boardSize = board.length;
  const scores: Record<PlayerColor, number> = {
    red: 0,
    yellow: 0,
    blue: 0,
    green: 0,
  };

  for (let r = 0; r < boardSize; r++) {
    for (let c = 0; c < boardSize; c++) {
      const cell = board[r][c];
      if (cell) {
        scores[cell]++;
      }
    }
  }

  return scores;
}

/**
 * Checks if the board is completely full or if no players have valid moves.
 */
export function isGameOver(board: BoardState, activeColors: PlayerColor[]): boolean {
  const boardSize = board.length;
  let hasEmptyCell = false;

  for (let r = 0; r < boardSize; r++) {
    for (let c = 0; c < boardSize; c++) {
      if (board[r][c] === null) {
        hasEmptyCell = true;
        break;
      }
    }
    if (hasEmptyCell) break;
  }

  if (!hasEmptyCell) return true;

  // Check if at least one player has a valid move
  for (const player of activeColors) {
    const validMoves = getValidMoves(board, player);
    if (validMoves.length > 0) return false;
  }

  return true;
}
