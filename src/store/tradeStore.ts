import { create } from "zustand";

export const leverageValues = [1, 10, 25, 50, 100, 500];

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
  minAmount: number;
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
  setMaxAmount: (maxAmount: number) => void;
  setMinAmount: (minAmount: number) => void;
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

  initializeLeverage: () => void;
}

export const initialState: StoreState = {
  balance: 0,
  currentMethod: "Buy",
  entryPrice: "0",
  takeProfit: "0",
  takeProfitPercentage: "0",
  stopLoss: "0",
  stopLossPercentage: "0",
  amount: "0",
  amountUSD: "0",
  minAmount: 0,
  maxAmount: 10,
  isReduceTP: true,
  isReduceSL: true,
  sliderValue: 50,
  exitPnL: 0,
  stopPnL: 0,
  riskRewardPnL: 0,
  accountLeverage: 500,
  bidPrice: 1,
  askPrice: 1,
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
  setMaxAmount: () => {},
  setMinAmount: () => {},
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

  initializeLeverage: () => {},
};

export const useTradeStore = create<StoreState>((set) => ({
  ...initialState,

  initializeLeverage: () => {
    if (typeof window !== "undefined") {
      const storedLeverage = localStorage.getItem("leverage");
      if (storedLeverage) {
        const parsedLeverage = parseInt(storedLeverage, 10);
        set({ leverage: parsedLeverage });
      } else {
        set({ leverage: 500 });
        localStorage.setItem("leverage", "500");
      }
    }
  },

  setLeverage: (leverage) =>
    set((state) => {
      const maxAmount = parseFloat(
        (state.balance / (parseFloat(state.entryPrice) / leverage)).toFixed(2)
      );
      const estimatedLiquidationPrice =
        parseFloat(state.entryPrice) /
        (1 - parseFloat(state.amount) / state.balance);

      if (typeof window !== "undefined") {
        localStorage.setItem("leverage", leverage.toString());
      }

      return {
        leverage,
        maxAmount,
        estimatedLiquidationPrice,
      };
    }),

  setBalance: (balance) =>
    set((state) => ({
      balance: balance,
      estimatedLiquidationPrice:
        parseFloat(state.entryPrice) /
        (1 - parseFloat(state.amount) / state.balance),
    })),

  setCurrentMethod: (method) => set({ currentMethod: method }),
  setEntryPrice: (price) =>
    set((state) => ({
      entryPrice: price,
      maxAmount: parseFloat(
        (
          (state.balance * state.leverage) /
          parseFloat(state.entryPrice)
        ).toFixed(2)
      ),
      estimatedLiquidationPrice:
        parseFloat(state.entryPrice) /
        (1 - parseFloat(state.amount) / state.balance),
    })),

  setTakeProfit: (price) =>
    set((state) => {
      const entryPrice = parseFloat(state.entryPrice);
      const takeProfit = parseFloat(price);
      const amount = parseFloat(state.amount);

      const takeProfitPercentage = (
        ((takeProfit - entryPrice) / entryPrice) *
        100
      ).toFixed(2);

      const exitPnL = (takeProfit - entryPrice) * amount;
      const riskRewardPnL =
        parseFloat(takeProfitPercentage) / parseFloat(state.stopLossPercentage);

      return {
        takeProfit: price,
        takeProfitPercentage,
        exitPnL,
        riskRewardPnL,
      };
    }),

  setTakeProfitPercentage: (percentage) =>
    set((state) => {
      const entryPrice = parseFloat(state.entryPrice);
      const takeProfitPercentage = parseFloat(percentage);
      const amount = parseFloat(state.amount);

      const takeProfit = (
        entryPrice *
        (1 + takeProfitPercentage / 100)
      ).toFixed(2);

      const exitPnL = (parseFloat(takeProfit) - entryPrice) * amount;
      const riskRewardPnL =
        takeProfitPercentage / parseFloat(state.stopLossPercentage);

      return {
        takeProfitPercentage: percentage,
        takeProfit,
        exitPnL,
        riskRewardPnL,
      };
    }),
  setStopLoss: (price) =>
    set((state) => {
      const entryPrice = parseFloat(state.entryPrice);
      const stopLoss = parseFloat(price);
      const amount = parseFloat(state.amount);

      const stopLossPercentage = (
        ((entryPrice - stopLoss) / entryPrice) *
        100
      ).toFixed(2);

      const stopPnL = (entryPrice - stopLoss) * amount;
      const riskRewardPnL =
        parseFloat(state.takeProfitPercentage) / parseFloat(stopLossPercentage);

      return {
        stopLoss: price,
        stopLossPercentage,
        stopPnL,
        riskRewardPnL,
      };
    }),
  setStopLossPercentage: (percentage) =>
    set((state) => {
      const entryPrice = parseFloat(state.entryPrice);
      const stopLossPercentage = parseFloat(percentage);
      const amount = parseFloat(state.amount);

      const stopLoss = (entryPrice * (1 - stopLossPercentage / 100)).toFixed(2);

      const stopPnL = (entryPrice - parseFloat(stopLoss)) * amount;
      const riskRewardPnL =
        parseFloat(state.takeProfitPercentage) / stopLossPercentage;

      return {
        stopLossPercentage: percentage,
        stopLoss,
        stopPnL,
        riskRewardPnL,
      };
    }),
  setAmount: (amount) =>
    set((state) => {
      const entryPrice = parseFloat(state.entryPrice);
      const takeProfit = parseFloat(state.takeProfit);
      const stopLoss = parseFloat(state.stopLoss);

      const exitPnL = (takeProfit - entryPrice) * parseFloat(amount);
      const stopPnL = (entryPrice - stopLoss) * parseFloat(amount);

      return {
        amount: amount.toString(),
        exitPnL,
        stopPnL,
      };
    }),
  setAmountUSD: (amountUSD) =>
    set((state) => {
      const entryPrice = parseFloat(state.entryPrice);
      const takeProfit = parseFloat(state.takeProfit);
      const stopLoss = parseFloat(state.stopLoss);

      const exitPnL =
        ((takeProfit - entryPrice) * parseFloat(amountUSD)) / entryPrice;
      const stopPnL =
        ((entryPrice - stopLoss) * parseFloat(amountUSD)) / entryPrice;

      return {
        amountUSD: amountUSD.toString(),
        exitPnL,
        stopPnL,
      };
    }),
  setIsReduceTP: (reduce) => set({ isReduceTP: reduce }),
  setIsReduceSL: (reduce) => set({ isReduceSL: reduce }),
  setSliderValue: (value) =>
    set((state) => {
      const maxAmount = parseFloat(
        (
          state.balance /
          (parseFloat(state.entryPrice) / state.leverage)
        ).toFixed(2)
      );
      const amount = ((value / 100) * maxAmount).toString();
      const amountUSD = (
        parseFloat(amount) * parseFloat(state.entryPrice)
      ).toString();

      return {
        ...state,
        sliderValue: value,
        amount,
        amountUSD,
      };
    }),
  setAccountLeverage: (leverage) => set({ accountLeverage: leverage }),
  setBidPrice: (price) => set({ bidPrice: price }),
  setAskPrice: (price) => set({ askPrice: price }),
  setSymbol: (symbol) => set({ symbol }),

  setCurrentTabIndex: (index) => set({ currentTabIndex: index }),
  setEstimatedLiquidationPrice: (price) =>
    set({ estimatedLiquidationPrice: price }),
  setEntryPriceModified: (modified) => set({ entryPriceModified: modified }),
}));

useTradeStore.getState().initializeLeverage();
