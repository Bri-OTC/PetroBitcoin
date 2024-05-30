// useBalance.ts
import { useEffect, useState } from "react";
import { useTradeStore } from "@/store/tradeStore";
import { useRfqRequestStore } from "@/store/rfqStore";
import { DepositedBalance } from "@/components/sections/wallet/table";

export const useBalance = (amount: string, entryPrice: string) => {
  const [sufficientBalance, setSufficientBalance] = useState(true);
  const [maxAmountAllowed, setMaxAmountAllowed] = useState(0);
  const [isBalanceZero, setIsBalanceZero] = useState(false);
  const depositedBalance = DepositedBalance();
  const currentMethod: string = useTradeStore((state) => state.currentMethod);
  const rfqRequest = useRfqRequestStore((state) => state.rfqRequest);

  useEffect(() => {
    const requiredBalance =
      currentMethod === "Buy"
        ? parseFloat(rfqRequest.lImA) + parseFloat(rfqRequest.lDfA)
        : parseFloat(rfqRequest.sImB) + parseFloat(rfqRequest.sDfB);

    const maxAmount = Number(depositedBalance) / Number(entryPrice);
    setMaxAmountAllowed(maxAmount);

    setIsBalanceZero(Number(depositedBalance) === 0);
    setSufficientBalance(Number(amount) <= maxAmount);
  }, [depositedBalance, currentMethod, rfqRequest, amount, entryPrice]);

  return { sufficientBalance, maxAmountAllowed, isBalanceZero };
};
