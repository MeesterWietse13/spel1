import { BoardTheme } from '../types';

export const BOARD_THEMES: Record<string, BoardTheme> = {
  classic: {
    id: 'classic',
    name: 'Klassiek Rolit (Rood Vilt)',
    boardBg: 'bg-gradient-to-br from-red-900 via-rose-950 to-slate-950',
    socketBg: 'bg-rose-950/80 shadow-[inset_0_4px_8px_rgba(0,0,0,0.8)] border border-rose-800/40',
    gridLineColor: 'border-rose-900/60',
    boardBorder: 'border-amber-700/80 shadow-[0_12px_40px_rgba(0,0,0,0.6)] bg-gradient-to-b from-amber-900 via-amber-950 to-amber-900',
  },
  wood: {
    id: 'wood',
    name: 'Luxe Houten Bord',
    boardBg: 'bg-gradient-to-br from-amber-950 via-stone-900 to-amber-950',
    socketBg: 'bg-amber-950/90 shadow-[inset_0_4px_8px_rgba(0,0,0,0.9)] border border-amber-900/60',
    gridLineColor: 'border-amber-900/40',
    boardBorder: 'border-amber-800 shadow-[0_12px_40px_rgba(0,0,0,0.7)] bg-amber-900',
  },
  dark: {
    id: 'dark',
    name: 'Modern Obsidian',
    boardBg: 'bg-gradient-to-br from-slate-900 via-slate-950 to-zinc-950',
    socketBg: 'bg-slate-950 shadow-[inset_0_4px_8px_rgba(0,0,0,0.9)] border border-slate-800/50',
    gridLineColor: 'border-slate-800/60',
    boardBorder: 'border-slate-700 shadow-[0_12px_40px_rgba(0,0,0,0.8)] bg-slate-900',
  },
  neon: {
    id: 'neon',
    name: 'Cyber Neon',
    boardBg: 'bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950',
    socketBg: 'bg-indigo-950/90 shadow-[inset_0_4px_8px_rgba(0,0,0,0.9)] border border-cyan-500/30',
    gridLineColor: 'border-cyan-500/20',
    boardBorder: 'border-cyan-500/60 shadow-[0_0_25px_rgba(6,182,212,0.3)] bg-slate-900',
  },
};
