import { create } from "zustand";

export interface StoreState {
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
  entryPriceModified: boolean;

  setBalance: (balance: number) => void;
  setCurrentMethod: (method: string) => void;
  setEntryPrice: (price: string) => void;
  setTakeProfit: (price: string) => void;
  setTakeProfitPercentage: (percentage: string) => void;
  setStopLoss: (price: string) => void;
  setStopLossPercentage: (percentage: string) => void;
  setAmount: (amount: string) => void;
  setAmountUSD: (amountUSD: string) => void;
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

  setEntryPriceModified: (modified: boolean) => void;
}

export const initialState: StoreState = {
  balance: 1000,
  currentMethod: "Buy",
  entryPrice: "0",
  takeProfit: "0",
  takeProfitPercentage: "0",
  stopLoss: "0",
  stopLossPercentage: "0",
  amount: "0",
  amountUSD: "0",
  maxAmount: 100000000000000000,
  isReduceTP: false,
  isReduceSL: false,
  sliderValue: 50,
  exitPnL: 0,
  stopPnL: 0,
  riskRewardPnL: 0,
  accountLeverage: 500,
  bidPrice: 46423,
  askPrice: 46423,
  symbol: "GBPUSD/EURUSD",
  leverage: 500,
  currentTabIndex: "Limit",
  estimatedLiquidationPrice: 0,
  entryPriceModified: false,
  setBalance: () => {},
  setCurrentMethod: () => {},
  setEntryPrice: () => {},
  setTakeProfit: () => {},
  setTakeProfitPercentage: () => {},
  setStopLoss: () => {},
  setStopLossPercentage: () => {},
  setAmount: () => {},
  setAmountUSD: () => {},
  setIsReduceTP: () => {},
  setIsReduceSL: () => {},
  setSliderValue: () => {},
  setAccountLeverage: () => {},
  setBidPrice: () => {},
  setAskPrice: () => {},
  setSymbol: () => {},
  setLeverage: () => {},
  setCurrentTabIndex: () => {},
  setEstimatedLiquidationPrice: () => {},
  setEntryPriceModified: () => {},
};
