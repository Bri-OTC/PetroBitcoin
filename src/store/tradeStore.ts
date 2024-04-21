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
  amountUSD: string;
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
  estimatedLiquidationPrice: number;

  setAmountUSD: (amountUSD: string) => void;

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
  setAccountLeverage: (leverage: number) => void;
  setBidPrice: (price: number) => void;
  setAskPrice: (price: number) => void;
  setSymbol: (symbol: string) => void;
  setLeverage: (leverage: number) => void;
  setCurrentTabIndex: (index: string) => void;
  setEstimatedLiquidationPrice: (price: number) => void;
}

export const useTradeStore = create<StoreState>((set, get) => ({
  balance: 1000,
  currentMethod: "Buy",
  entryPrice: "0",
  takeProfit: "0",
  takeProfitPercentage: "0",
  stopLoss: "0",
  stopLossPercentage: "0",
  amount: "0",
  amountUSD: "0",

  isReduceTP: false,
  isReduceSL: false,
  sliderValue: 50,
  exitPnL: 0,
  stopPnL: 0,
  riskRewardPnL: 0,
  accountLeverage: 500,
  bidPrice: 46423,
  askPrice: 46423,
  symbol: "AAPL/EURUSD",
  leverage: 500,
  maxAmount: 100000000000000000,
  currentTabIndex: "Limit",
  estimatedLiquidationPrice: 0,

  setBalance: (balance) => set(() => ({ balance })),
  setCurrentMethod: (method) => set(() => ({ currentMethod: method })),
  setEntryPrice: (price) =>
    set((state) => ({
      entryPrice: price,
      maxAmount: state.balance / parseFloat(price),
    })),
  setTakeProfit: (price) =>
    set((state) => ({
      takeProfit: price,
      takeProfitPercentage: (
        ((parseFloat(price) - parseFloat(state.entryPrice)) /
          parseFloat(state.entryPrice)) *
        100
      ).toFixed(2),
      exitPnL:
        (parseFloat(price) - parseFloat(state.entryPrice)) *
        parseFloat(state.amount),
      riskRewardPnL:
        parseFloat(state.takeProfitPercentage) /
        parseFloat(state.stopLossPercentage),
    })),
  setTakeProfitPercentage: (percentage) =>
    set((state) => ({
      takeProfitPercentage: percentage,
      takeProfit: (
        parseFloat(state.entryPrice) *
        (1 + parseFloat(percentage) / 100)
      ).toFixed(2),
      exitPnL:
        (parseFloat(state.takeProfit) - parseFloat(state.entryPrice)) *
        parseFloat(state.amount),
      riskRewardPnL:
        parseFloat(percentage) / parseFloat(state.stopLossPercentage),
    })),
  setStopLoss: (price) =>
    set((state) => ({
      stopLoss: price,
      stopLossPercentage: (
        ((parseFloat(state.entryPrice) - parseFloat(price)) /
          parseFloat(state.entryPrice)) *
        100
      ).toFixed(2),
      stopPnL:
        (parseFloat(state.entryPrice) - parseFloat(price)) *
        parseFloat(state.amount),
      riskRewardPnL:
        parseFloat(state.takeProfitPercentage) /
        parseFloat(state.stopLossPercentage),
    })),
  setStopLossPercentage: (percentage) =>
    set((state) => ({
      stopLossPercentage: percentage,
      stopLoss: (
        parseFloat(state.entryPrice) *
        (1 - parseFloat(percentage) / 100)
      ).toFixed(2),
      stopPnL:
        (parseFloat(state.entryPrice) - parseFloat(state.stopLoss)) *
        parseFloat(state.amount),
      riskRewardPnL:
        parseFloat(state.takeProfitPercentage) / parseFloat(percentage),
    })),
  setAmount: (amount) =>
    set((state) => ({
      amount,
      exitPnL:
        (parseFloat(state.takeProfit) - parseFloat(state.entryPrice)) *
        parseFloat(amount),
      stopPnL:
        (parseFloat(state.entryPrice) - parseFloat(state.stopLoss)) *
        parseFloat(amount),
    })),
  setIsReduceTP: (reduce) => set(() => ({ isReduceTP: reduce })),
  setIsReduceSL: (reduce) => set(() => ({ isReduceSL: reduce })),
  setSliderValue: (value) =>
    set((state) => ({
      sliderValue: value,
      amount: ((value / 100) * state.maxAmount).toFixed(2),
    })),
  setAccountLeverage: (leverage) => set(() => ({ accountLeverage: leverage })),
  setBidPrice: (price) => set(() => ({ bidPrice: price })),
  setAskPrice: (price) => set(() => ({ askPrice: price })),
  setSymbol: (symbol) => set(() => ({ symbol })),
  setLeverage: (leverage) => set(() => ({ leverage })),
  setCurrentTabIndex: (index) => set(() => ({ currentTabIndex: index })),
  setAmountUSD: (amountUSD) =>
    set((state) => ({
      amount: (parseFloat(amountUSD) / parseFloat(state.entryPrice)).toFixed(2),
      exitPnL:
        ((parseFloat(state.takeProfit) - parseFloat(state.entryPrice)) *
          parseFloat(amountUSD)) /
        parseFloat(state.entryPrice),
      stopPnL:
        ((parseFloat(state.entryPrice) - parseFloat(state.stopLoss)) *
          parseFloat(amountUSD)) /
        parseFloat(state.entryPrice),
    })),
  setEstimatedLiquidationPrice: (price) =>
    set(() => ({ estimatedLiquidationPrice: price })),
}));
