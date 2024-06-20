// useOpenQuoteChecks.ts
import { useEffect, useState, useMemo } from "react";
import { useTradeStore } from "@/store/tradeStore";
import { useRfqRequestStore } from "@/store/rfqStore";
import { useQuoteStore } from "@/store/quoteStore";
import { useDepositedBalance } from "@/hooks/useDepositedBalance";

export const useOpenQuoteChecks = (amount: string, entryPrice: string) => {
  const depositedBalance = useDepositedBalance();
  const currentMethod = useTradeStore((state) => state.currentMethod);
  const rfqRequest = useRfqRequestStore((state) => state.rfqRequest);
  const { bids, asks, getBestQuotes, addQuote } = useQuoteStore();

  const requiredBalance = useMemo(() => {
    return currentMethod === "Buy"
      ? parseFloat(rfqRequest.lImA) + parseFloat(rfqRequest.lDfA)
      : parseFloat(rfqRequest.sImB) + parseFloat(rfqRequest.sDfB);
  }, [currentMethod, rfqRequest]);

  const maxAmountOpenable = useMemo(() => {
    return (
      (Number(depositedBalance) / Number(entryPrice)) *
      requiredBalance *
      Number(amount)
    );
  }, [depositedBalance, entryPrice]);

  const { bestBid, bestAsk } = useMemo(() => {
    return getBestQuotes(amount);
  }, [getBestQuotes, amount]);

  const { minAmountFromQuote, maxAmountFromQuote, advisedAmount } =
    useMemo(() => {
      let min = "0";
      let max = "0";
      let advised = "0";

      if (currentMethod === "Buy" && bestAsk) {
        min = bestAsk.minAmount;
        max = bestAsk.maxAmount;
      } else if (currentMethod === "Sell" && bestBid) {
        min = bestBid.minAmount;
        max = bestBid.maxAmount;
      }

      if (min !== "0") {
        const minAmountFloat = parseFloat(min);
        const amountFloat = parseFloat(amount);

        if (amountFloat % minAmountFloat !== 0) {
          const lowerBoundAmount =
            Math.floor(amountFloat / minAmountFloat) * minAmountFloat;
          advised = lowerBoundAmount.toString();
        } else {
          advised = amount;
        }
      }

      return {
        minAmountFromQuote: min,
        maxAmountFromQuote: max,
        advisedAmount: advised,
      };
    }, [currentMethod, bestBid, bestAsk, amount]);

  const noQuotesReceived = useMemo(() => {
    return bids.length === 0 && asks.length === 0;
  }, [bids, asks]);

  useEffect(() => {
    addQuote(null);
  }, [addQuote]);

  return {
    sufficientBalance: Number(amount) <= maxAmountOpenable,
    maxAmountOpenable,
    isBalanceZero: Number(depositedBalance) === 0,
    isAmountMinAmount: Number(amount) < requiredBalance,
    minAmountFromQuote,
    maxAmountFromQuote,
    advisedAmount,
    noQuotesReceived,
  };
};
