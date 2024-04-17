import { create } from "zustand";

interface StoreState {
  balance: number;
  currentMethod: string;
  entryPrice: string;
  takeProfit: string;
  takeProfitPercentage: string;
  stopLoss: string;
  stopLossPercentage: string;
  amount: string;
  maxAmount: number;
  isReduceTP: boolean;
  isReduceSL: boolean;
  sliderValue: number;
  exitPnL: number;
  stopPnL: number;
  riskRewardPnL: number;
  accountLeverage: number;
  bidPrice: number;
  askPrice: number;
  symbol: string;
  leverage: number;
  currentTabIndex: string;
  setBalance: (balance: number) => void;
  setCurrentMethod: (method: string) => void;
  setEntryPrice: (price: string) => void;
  setTakeProfit: (price: string) => void;
  setTakeProfitPercentage: (percentage: string) => void;
  setStopLoss: (price: string) => void;
  setStopLossPercentage: (percentage: string) => void;
  setAmount: (amount: string) => void;
  setIsReduceTP: (reduce: boolean) => void;
  setIsReduceSL: (reduce: boolean) => void;
  setSliderValue: (value: number) => void;
  setExitPnL: (pnl: number) => void;
  setStopPnL: (pnl: number) => void;
  setRiskRewardPnL: (pnl: number) => void;
  setAccountLeverage: (leverage: number) => void;
  setBidPrice: (price: number) => void;
  setAskPrice: (price: number) => void;
  setSymbol: (symbol: string) => void;
  setLeverage: (leverage: number) => void;
  setCurrentTabIndex: (index: string) => void;
}

export const useTradeStore = create<StoreState>((set) => ({
  balance: 1000,
  currentMethod: "Buy",
  entryPrice: "",
  takeProfit: "",
  takeProfitPercentage: "",
  stopLoss: "",
  stopLossPercentage: "",
  amount: "",
  isReduceTP: false,
  isReduceSL: false,
  sliderValue: 50,
  exitPnL: 30.73,
  stopPnL: 30.73,
  riskRewardPnL: 30.73,
  accountLeverage: 500,
  estimatedLiquidationPrice: 54611,
  bidPrice: 46423,
  askPrice: 46423,
  symbol: "AAPL/EURUSD",
  leverage: 500,
  maxAmount: 100000000000000000,
  currentTabIndex: "Limit",

  setBalance: (balance) => set(() => ({ balance })),
  setCurrentMethod: (method) => set(() => ({ currentMethod: method })),
  setEntryPrice: (price) =>
    set((state) => ({
      entryPrice: price,
      maxAmount: state.balance / parseFloat(price),
    })),
  setTakeProfit: (price) => set(() => ({ takeProfit: price })),
  setTakeProfitPercentage: (percentage) =>
    set(() => ({ takeProfitPercentage: percentage })),
  setStopLoss: (price) => set(() => ({ stopLoss: price })),
  setStopLossPercentage: (percentage) =>
    set(() => ({ stopLossPercentage: percentage })),
  setAmount: (amount) => set(() => ({ amount })),
  setIsReduceTP: (reduce) => set(() => ({ isReduceTP: reduce })),
  setIsReduceSL: (reduce) => set(() => ({ isReduceSL: reduce })),
  setSliderValue: (value) => set(() => ({ sliderValue: value })),
  setExitPnL: (pnl) => set(() => ({ exitPnL: pnl })),
  setStopPnL: (pnl) => set(() => ({ stopPnL: pnl })),
  setRiskRewardPnL: (pnl) => set(() => ({ riskRewardPnL: pnl })),
  setAccountLeverage: (leverage) => set(() => ({ accountLeverage: leverage })),
  setBidPrice: (price) => set(() => ({ bidPrice: price })),
  setAskPrice: (price) => set(() => ({ askPrice: price })),
  setSymbol: (symbol) => set(() => ({ symbol })),
  setLeverage: (leverage) => set(() => ({ leverage })),
  setCurrentTabIndex: (index) => set(() => ({ currentTabIndex: index })),
}));
