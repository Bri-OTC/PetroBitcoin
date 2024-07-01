import { useState, useEffect, useCallback, useMemo } from "react";
import { useTradeStore } from "@/store/tradeStore";
import { useRfqRequestStore } from "@/store/rfqStore";
import { useQuoteStore, QuoteResponse } from "@/store/quoteStore";
import { useDepositedBalance } from "@/hooks/useDepositedBalance";
import { debounce } from "lodash";

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
  selectedQuoteUserAddress: string;
  lastValidBalance: string;
  recommendedAmount: number;
  bestBid: string | null;
  bestAsk: string | null;
  maxAmount: number;
}

export const useOpenQuoteChecks = (amount: string, entryPrice: string) => {
  const depositedBalance = useDepositedBalance();
  const currentMethod = useTradeStore((state) => state.currentMethod);
  const rfqRequest = useRfqRequestStore((state) => state.rfqRequest);
  const { quotes, cleanExpiredQuotes } = useQuoteStore();
  const leverage = useTradeStore((state) => state.leverage);

  const [selectedQuote, setSelectedQuote] = useState<QuoteResponse | null>(
    null
  );
  const [lastValidBalance, setLastValidBalance] = useState("0");

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
    selectedQuoteUserAddress: "0xd0dDF915693f13Cf9B3b69dFF44eE77C901882f8",
    lastValidBalance: "0",
    recommendedAmount: 0,
    bestBid: null,
    bestAsk: null,
    maxAmount: 0,
  });

  const updateResults = useCallback(
    (newResults: OpenQuoteCheckResults) => {
      setCachedResults(newResults);
    },
    [setCachedResults]
  );

  const debouncedUpdateResults = useMemo(
    () => debounce(updateResults, 500),
    [updateResults]
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

  // Select the best quote every second
  useEffect(() => {
    const selectBestQuote = () => {
      if (quotes.length > 0) {
        const currentAmount = parseFloat(amount);
        const sortedQuotes = [...quotes].sort((a, b) => {
          const priceA =
            currentMethod === "Buy"
              ? parseFloat(a.sPrice)
              : parseFloat(a.lPrice);
          const priceB =
            currentMethod === "Buy"
              ? parseFloat(b.sPrice)
              : parseFloat(b.lPrice);
          return currentMethod === "Buy" ? priceA - priceB : priceB - priceA;
        });

        const bestPriceQuote = sortedQuotes[0];
        const bestPriceMaxAmount = parseFloat(bestPriceQuote.maxAmount);

        if (currentAmount <= bestPriceMaxAmount) {
          setSelectedQuote(bestPriceQuote);
        } else {
          const sufficientQuote = sortedQuotes.find(
            (q) => parseFloat(q.maxAmount) >= currentAmount
          );
          setSelectedQuote(sufficientQuote || bestPriceQuote);
        }
      } else {
        setSelectedQuote(null);
      }
    };

    const interval = setInterval(selectBestQuote, 1000);
    return () => clearInterval(interval);
  }, [quotes, amount, currentMethod]);

  useEffect(() => {
    const safeParseFloat = (value: string | undefined): number => {
      if (value === undefined || value === null) return 0;
      const parsed = parseFloat(value);
      return isNaN(parsed) ? 0 : parsed;
    };

    const collateralRequirement =
      currentMethod === "Buy"
        ? safeParseFloat(rfqRequest?.lImA) + safeParseFloat(rfqRequest?.lDfA)
        : safeParseFloat(rfqRequest?.sImB) + safeParseFloat(rfqRequest?.sDfB);

    const minAmount =
      quotes.length > 0
        ? Math.min(...quotes.map((q) => safeParseFloat(q.minAmount)))
        : 0;

    const recommendedStep = minAmount > 0 ? minAmount : 0;

    const calculateMaxAmountOpenable = (
      balance: number,
      entryPrice: number,
      collateralRequirement: number,
      step: number
    ): number => {
      const rawMaxAmount = balance / (collateralRequirement * entryPrice);
      const stepsCount = Math.floor(rawMaxAmount / step);
      return stepsCount * step;
    };

    const maxAmountOpenable = calculateMaxAmountOpenable(
      safeParseFloat(balanceToUse),
      safeParseFloat(entryPrice),
      collateralRequirement,
      recommendedStep
    );

    const currentAmount = safeParseFloat(amount);
    const isAmountMinAmount = currentAmount < minAmount;
    const canBuyMinAmount =
      isAmountMinAmount &&
      minAmount * safeParseFloat(entryPrice) * collateralRequirement <=
        safeParseFloat(balanceToUse);

    const calculateRecommendedAmount = (
      currentAmount: number,
      minAmount: number,
      maxAmount: number,
      step: number
    ): number => {
      if (currentAmount <= minAmount) return minAmount;
      if (currentAmount >= maxAmount) return maxAmount;

      const stepsAboveMin = Math.floor((currentAmount - minAmount) / step);
      return Math.min(minAmount + stepsAboveMin * step, maxAmount);
    };

    const recommendedAmount = calculateRecommendedAmount(
      currentAmount,
      minAmount,
      maxAmountOpenable,
      recommendedStep
    );

    // Calculate best bid, best ask, and max amount
    const sortedQuotes = [...quotes].sort(
      (a, b) => parseFloat(b.sPrice) - parseFloat(a.sPrice)
    );
    const bestBid = sortedQuotes.length > 0 ? sortedQuotes[0].sPrice : null;
    const bestAsk = sortedQuotes.length > 0 ? sortedQuotes[0].lPrice : null;
    const maxAmount =
      quotes.length > 0
        ? Math.max(...quotes.map((q) => parseFloat(q.maxAmount)))
        : 0;

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
      selectedQuoteUserAddress:
        selectedQuote?.userAddress ||
        "0xd0dDF915693f13Cf9B3b69dFF44eE77C901882f8",
      lastValidBalance,
      recommendedAmount,
      bestBid,
      bestAsk,
      maxAmount,
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
    leverage,
    selectedQuote,
    lastValidBalance,
  ]);

  return cachedResults;
};
