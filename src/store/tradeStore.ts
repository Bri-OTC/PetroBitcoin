import { create } from "zustand";
import { StoreState, initialState } from "./tradeStoreInit";

export const useTradeStore = create<StoreState>((set) => ({
  ...initialState,

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
          initialState.balance /
          (parseFloat(initialState.entryPrice) / state.leverage)
        ).toFixed(2)
      ),
      estimatedLiquidationPrice:
        parseFloat(state.entryPrice) /
        (1 - parseFloat(state.amount) / state.balance),
    })),

  //
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

  //
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
  //
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
  //
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
  setLeverage: (leverage) =>
    set({
      leverage: leverage,
      maxAmount: parseFloat(
        (
          initialState.balance /
          (parseFloat(initialState.entryPrice) / leverage)
        ).toFixed(2)
      ),
    }),

  //
  setCurrentTabIndex: (index) => set({ currentTabIndex: index }),
  //
  setEstimatedLiquidationPrice: (price) =>
    set({ estimatedLiquidationPrice: price }),

  setEntryPriceModified: (modified) => set({ entryPriceModified: modified }),
}));
