export interface Position {
  size: number;
  market: string;
  icon: string;
  mark: number;
  entryPrice: number;
  pnl: number;
  amount: number;
  type: string;
  limitPrice: string;
  status: string;
  reduceOnly: string;
  fillAmount: string;
}

export interface Order {
  size: number;
  market: string;
  icon: string;
  trigger: number;
  amount: number;
  filled: number;
  remainingSize: number;
  estLiq: number;
  breakEvenPrice: number;
}
