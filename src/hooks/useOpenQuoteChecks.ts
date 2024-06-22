import { useState, useEffect, useCallback, useMemo } from "react";
import { useTradeStore } from "@/store/tradeStore";
import { useRfqRequestStore } from "@/store/rfqStore";
import { useQuoteStore, QuoteResponse } from "@/store/quoteStore";
import { useDepositedBalance } from "@/hooks/useDepositedBalance";
import { debounce } from "lodash"; // Make sure to install lodash if not already present

interface OpenQuoteCheckResults {
  quotes: QuoteResponse[];
  sufficientBalance: boolean;
  maxAmountOpenable: number;
  isBalanceZero: boolean;
  isAmountMinAmount: boolean;
  noQuotesReceived: boolean;
  minAmount: number;
  recommendedStep: number;
  canBuyMinAmount: boolean;
}

export const useOpenQuoteChecks = (amount: string, entryPrice: string) => {
  const depositedBalance = useDepositedBalance();
  const currentMethod = useTradeStore((state) => state.currentMethod);
  const rfqRequest = useRfqRequestStore((state) => state.rfqRequest);
  const { quotes, cleanExpiredQuotes } = useQuoteStore();
  const accountLeverage = useTradeStore((state) => state.accountLeverage);

  const [cachedResults, setCachedResults] = useState<OpenQuoteCheckResults>({
    quotes: [],
    sufficientBalance: false,
    maxAmountOpenable: 0,
    isBalanceZero: true,
    isAmountMinAmount: true,
    noQuotesReceived: true,
    minAmount: 0,
    recommendedStep: 0,
    canBuyMinAmount: false,
  });

  const [lastValidBalance, setLastValidBalance] = useState("0");

  const updateResults = useCallback(
    debounce((newResults: OpenQuoteCheckResults) => {
      setCachedResults(newResults);
    }, 500),
    []
  );

  useEffect(() => {
    const interval = setInterval(() => {
      cleanExpiredQuotes();
    }, 1000);
    return () => clearInterval(interval);
  }, [cleanExpiredQuotes]);

  useEffect(() => {
    if (depositedBalance !== "0") {
      setLastValidBalance(depositedBalance);
    }
  }, [depositedBalance]);

  const balanceToUse = useMemo(() => {
    return depositedBalance === "0" ? lastValidBalance : depositedBalance;
  }, [depositedBalance, lastValidBalance]);

  useEffect(() => {
    const safeParseFloat = (value: string | undefined): number => {
      if (value === undefined || value === null) return 0;
      const parsed = parseFloat(value);
      return isNaN(parsed) ? 0 : parsed;
    };

    const requiredBalance =
      currentMethod === "Buy"
        ? safeParseFloat(rfqRequest?.lImA) + safeParseFloat(rfqRequest?.lDfA)
        : safeParseFloat(rfqRequest?.sImB) + safeParseFloat(rfqRequest?.sDfB);

    const maxAmountOpenable =
      (safeParseFloat(balanceToUse) / safeParseFloat(entryPrice)) *
      requiredBalance *
      accountLeverage;

    const minAmount =
      quotes.length > 0
        ? Math.min(...quotes.map((q) => safeParseFloat(q.minAmount)))
        : 0;

    const recommendedStep = minAmount > 0 ? minAmount / 10 : 0;

    const currentAmount = safeParseFloat(amount);
    const isAmountMinAmount = currentAmount < minAmount;
    const canBuyMinAmount =
      isAmountMinAmount &&
      minAmount * safeParseFloat(entryPrice) <=
        safeParseFloat(balanceToUse) * accountLeverage;

    const newResults: OpenQuoteCheckResults = {
      quotes,
      sufficientBalance: currentAmount <= maxAmountOpenable,
      maxAmountOpenable,
      isBalanceZero: safeParseFloat(balanceToUse) === 0,
      isAmountMinAmount,
      noQuotesReceived: quotes.length === 0,
      minAmount,
      recommendedStep,
      canBuyMinAmount,
    };

    updateResults(newResults);
  }, [
    amount,
    entryPrice,
    currentMethod,
    rfqRequest,
    balanceToUse,
    quotes,
    updateResults,
    accountLeverage,
  ]);

  return cachedResults;
};
