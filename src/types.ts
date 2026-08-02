export type PlayerColor = 'red' | 'yellow' | 'blue' | 'green';

export interface PlayerConfig {
  id: PlayerColor;
  name: string;
  avatar: string;
  colorHex: string;
  colorBg: string;
  colorBorder: string;
  colorText: string;
  gradient: string;
}

export type CellState = PlayerColor | null;

export type BoardState = CellState[][];

export type BoardSize = 6 | 8;

export interface Position {
  row: number;
  col: number;
}

export interface Move {
  position: Position;
  player: PlayerColor;
  flippedPositions: Position[];
  timestamp: number;
}

export interface BoardTheme {
  id: 'classic' | 'wood' | 'dark' | 'neon';
  name: string;
  boardBg: string;
  socketBg: string;
  gridLineColor: string;
  boardBorder: string;
}

export type GameMode = '2-players' | '3-players' | '4-players';

export interface GameSettings {
  soundEnabled: boolean;
  showHints: boolean;
  allowUndo: boolean;
  tableMode: boolean; // Rotates player controls for tablet sitting on table
  language: 'nl' | 'en';
  theme: 'classic' | 'wood' | 'dark' | 'neon';
  boardSize: BoardSize;
}
