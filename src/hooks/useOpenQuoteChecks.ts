// useOpenQuoteChecks.ts
import { useEffect, useState, useMemo } from "react";
import { useTradeStore } from "@/store/tradeStore";
import { useRfqRequestStore } from "@/store/rfqStore";
import { useQuoteStore } from "@/components/triparty/quoteStore";
import { useAuthStore } from "@/store/authStore";
import { usePrivy } from "@privy-io/react-auth";
import { useWalletAndProvider } from "@/components/layout/menu";
import {
  networks,
  PionerV1,
  NetworkKey,
} from "@pionerfriends/blockchain-client";
import { encodeFunctionData, Address, formatUnits } from "viem";

// Refactored to a hook
function useDepositedBalance() {
  const { wallet, provider } = useWalletAndProvider();
  const [depositedBalance, setDepositedBalance] = useState("0");
  const chainId = useAuthStore((state) => state.chainId);
  const { ready, authenticated, user, logout } = usePrivy();

  useEffect(() => {
    const fetchDepositedBalance = async () => {
      if (wallet && provider) {
        try {
          const dataDeposited = encodeFunctionData({
            abi: PionerV1.abi,
            functionName: "getBalances",
            args: [wallet.address],
          });

          const depositedBalanceResponse = await provider.request({
            method: "eth_call",
            params: [
              {
                to: networks[chainId as unknown as NetworkKey].contracts
                  .PionerV1 as Address,
                data: dataDeposited,
              },
              "latest",
            ],
          });

          if (depositedBalanceResponse === "0x") {
            setDepositedBalance("0");
          } else {
            const depositedBalanceInUnits = formatUnits(
              BigInt(depositedBalanceResponse as string),
              18
            );
            setDepositedBalance(depositedBalanceInUnits);
          }
        } catch (error) {
          // Handle error
        }
      }
    };

    fetchDepositedBalance();
    const interval = setInterval(fetchDepositedBalance, 2500);
    return () => clearInterval(interval);
  }, [wallet, provider, chainId, logout]);

  return depositedBalance;
}

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

  const maxAmountAllowed = useMemo(() => {
    return Number(depositedBalance) / Number(entryPrice);
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
    sufficientBalance: Number(amount) <= maxAmountAllowed,
    maxAmountAllowed,
    isBalanceZero: Number(depositedBalance) === 0,
    isAmountMinAmount: Number(amount) < requiredBalance,
    minAmountFromQuote,
    maxAmountFromQuote,
    advisedAmount,
    noQuotesReceived,
  };
};
