import { MouseEventHandler } from "react";

export interface SquareProps {
  onClick: MouseEventHandler<HTMLButtonElement>;
  value: string | null;
  key: undefined | string;
}

export interface BoardProps {
  squares: ("O" | "X" | "draw" | null)[];
  onClick: (i: number) => void;
}

export interface HistoryState {
  squares: ("O" | "X" | "draw" | null)[];
}

export interface AppState {
  history: HistoryState[];
  xIsNext: boolean;
  stepNumber: number;
  isAsc: boolean;
}
