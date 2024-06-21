// SheetPlaceOrder.tsx
import React, { useEffect, useState } from "react";
import { DrawerClose, DrawerContent, DrawerTitle } from "../ui/drawer";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { FaEquals } from "react-icons/fa";
import { Card } from "../ui/card";
import { Slider } from "../ui/slider";
import { useTradeStore } from "@/store/tradeStore";
import OpenQuoteButton from "@/components/sections/trade/utils/openQuote";
import { useWalletAndProvider } from "@/components/layout/menu";
import { useOpenQuoteChecks } from "@/hooks/useOpenQuoteChecks";
import Link from "next/link";
import { useColorStore } from "@/store/colorStore";

// Utility functions
const calculateMaxAmountAllowed = (balance: number, maxAmount: number) => {
  return Math.min(balance, maxAmount);
};

const calculateStepSize = (minAmount: number, maxAmountAllowed: number) => {
  return minAmount > maxAmountAllowed ? minAmount : maxAmountAllowed / 100;
};

const calculateNearestStep = (value: number, stepSize: number) => {
  return Math.round(value / stepSize) * stepSize;
};

function SheetPlaceOrder() {
  const { wallet, provider } = useWalletAndProvider();
  const {
    currentMethod,
    entryPrice,
    amount,
    amountUSD,
    sliderValue,
    bidPrice,
    askPrice,
    symbol,
    currentTabIndex,
    setCurrentMethod,
    setCurrentTabIndex,
    setEntryPrice,
    setAmount,
    setAmountUSD,
    setSliderValue,
    accountLeverage,
    estimatedLiquidationPrice,
    exitPnL,
    stopPnL,
    riskRewardPnL,
    balance,
    maxAmount,
  } = useTradeStore();

  const [prevBidPrice, setPrevBidPrice] = useState(bidPrice);
  const [prevAskPrice, setPrevAskPrice] = useState(askPrice);
  const [userInteracted, setUserInteracted] = useState(false);

  const {
    sufficientBalance,
    maxAmountOpenable,
    isBalanceZero,
    isAmountMinAmount,
    minAmountFromQuote,
    maxAmountFromQuote,
    advisedAmount,
    noQuotesReceived,
  } = useOpenQuoteChecks(amount, entryPrice);

  const color = useColorStore((state) => state.color);

  const maxAmountAllowed = calculateMaxAmountAllowed(balance, maxAmount);
  const stepSize = calculateStepSize(
    Number(minAmountFromQuote),
    maxAmountOpenable
  );

  useEffect(() => {
    if (currentMethod === "Buy") {
      setEntryPrice(askPrice.toString());
    } else if (currentMethod === "Sell") {
      setEntryPrice(bidPrice.toString());
    }
  }, [currentMethod, askPrice, bidPrice, setEntryPrice]);

  useEffect(() => {
    if (currentTabIndex === "Market") {
      if (currentMethod === "Buy") {
        setEntryPrice(askPrice.toString());
      } else if (currentMethod === "Sell") {
        setEntryPrice(bidPrice.toString());
      }
    }
  }, [currentTabIndex, currentMethod, askPrice, bidPrice, setEntryPrice]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPrevBidPrice(bidPrice);
      setPrevAskPrice(askPrice);
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [bidPrice, askPrice]);

  useEffect(() => {
    if (!userInteracted) {
      setAmount(minAmountFromQuote.toString());
      setAmountUSD(
        (parseFloat(minAmountFromQuote) * parseFloat(entryPrice)).toString()
      );
    }
  }, [minAmountFromQuote, entryPrice, userInteracted, setAmount, setAmountUSD]);

  const toggleTabIndex = () => {
    setCurrentTabIndex(currentTabIndex === "Market" ? "Limit" : "Market");
  };

  const handleAmountChange = (value: string) => {
    setUserInteracted(true);
    setAmount(value);
    setAmountUSD((parseFloat(value) * parseFloat(entryPrice)).toString());
  };

  const handleAmountUSDChange = (value: string) => {
    setUserInteracted(true);
    setAmountUSD(value);
    setAmount((parseFloat(value) / parseFloat(entryPrice)).toString());
  };

  const handleSliderChange = (value: number) => {
    setUserInteracted(true);
    const newValue = calculateNearestStep(value, stepSize);
    setSliderValue(newValue);
    setAmount(newValue.toString());
    setAmountUSD((newValue * parseFloat(entryPrice)).toString());
  };

  return (
    <DrawerContent className="transform scale-60 origin-bottom">
      <DrawerTitle className="text-center mt-3">{symbol}</DrawerTitle>
      <div className="flex flex-col space-y-3 p-5">
        <div className="flex border-b">
          {["Buy", "Sell"].map((x) => (
            <h2
              key={x + "drawer"}
              onClick={() => setCurrentMethod(x)}
              className={`w-full text-center pb-3 border-b-[3px] ${
                currentMethod === x
                  ? currentMethod === "Sell"
                    ? "border-[#F23645] text-[#F23645]"
                    : "border-[#089981] text-[#089981]"
                  : "border-transparent"
              } font-medium transition-all cursor-pointer`}
            >
              {x}
            </h2>
          ))}
        </div>
        <div className="flex items-center justify-center mt-5 space-x-5">
          <Card className="py-4">
            <p
              className={`text-white ${
                bidPrice !== prevBidPrice ? "fade-effect" : ""
              }`}
            >
              Bid price: {bidPrice.toFixed(5)}
            </p>
          </Card>
          <Card className="py-4">
            <p
              className={`text-white ${
                askPrice !== prevAskPrice ? "fade-effect" : ""
              }`}
            >
              Ask price: {askPrice.toFixed(5)}
            </p>
          </Card>
        </div>

        <div className="flex space-x-5 justify-between items-end">
          <div className="flex flex-col space-y-2 w-full">
            <h3 className="text-left text-card-foreground">Entry Price</h3>
            <div className="flex items-center space-x-5 border-b">
              <Input
                className={`pb-3 outline-none w-full border-b-[0px] bg-transparent ${
                  currentTabIndex === "Market"
                    ? "text-gray-400 cursor-not-allowed"
                    : `hover:shadow-[0_0_0_2px] hover:shadow-[${color}]`
                }`}
                placeholder="Input Price"
                value={entryPrice}
                onChange={(e) => setEntryPrice(e.target.value)}
                disabled={currentTabIndex === "Market"}
              />
              <p>USD</p>
            </div>
          </div>
          <Button
            onClick={toggleTabIndex}
            className={`w-full ${
              currentTabIndex === "Market"
                ? "bg-primary text-primary-foreground"
                : "bg-card text-card-foreground hover:bg-primary hover:text-primary-foreground"
            }`}
          >
            {currentTabIndex}
          </Button>
        </div>

        <div className="flex space-x-5 justify-between items-center">
          <div className="flex flex-col space-y-2 w-full">
            <h3 className="text-left text-card-foreground">Amount</h3>
            <div className="flex items-center space-x-5 border-b">
              <Input
                className="pb-3 outline-none w-full border-b-[0px] bg-transparent hover:shadow-[0_0_0_2px_rgba(256,200,52,1)]"
                placeholder="Input Amount"
                value={amount}
                onChange={(e) => handleAmountChange(e.target.value)}
              />
              <p>Contracts</p>
            </div>
          </div>
          <FaEquals />
          <div className="flex flex-col space-y-2 w-full">
            <h3 className="text-left text-card-foreground">Amount</h3>
            <div className="flex items-center space-x-5 border-b">
              <Input
                className="pb-3 outline-none w-full border-b-[0px] bg-transparent hover:shadow-[0_0_0_2px_rgba(256,200,52,1)]"
                placeholder="Contracts Amount"
                value={amountUSD}
                onChange={(e) => handleAmountUSDChange(e.target.value)}
              />
              <p>USD</p>
            </div>
          </div>
        </div>
        {isBalanceZero ? (
          <p className="text-red-500 text-sm mt-1">
            Your balance is zero. Please{" "}
            <Link href="/wallet" className="text-blue-500 underline">
              deposit funds
            </Link>{" "}
            to continue trading.
          </p>
        ) : !sufficientBalance ? (
          <p className="text-red-500 text-sm mt-1">
            Max amount allowed at this price: {maxAmountAllowed.toFixed(8)}
          </p>
        ) : parseFloat(amount) < parseFloat(minAmountFromQuote) ? (
          <p className="text-red-500 text-sm mt-1">
            Minimum amount: {minAmountFromQuote}. Advised amount:{" "}
            {advisedAmount}.
          </p>
        ) : parseFloat(amount) > parseFloat(maxAmountFromQuote) ? (
          <p className="text-red-500 text-sm mt-1">
            Maximum amount: {maxAmountFromQuote}. Advised amount:{" "}
            {advisedAmount}.
          </p>
        ) : noQuotesReceived ? (
          <p className="text-red-500 text-sm mt-1">
            No quotes have been received. Please try again later.
          </p>
        ) : null}
        <div className="py-3">
          <Slider
            min={0}
            max={maxAmountAllowed}
            step={stepSize}
            value={[parseFloat(amount)]}
            onValueChange={(value) => handleSliderChange(value[0])}
          />
        </div>
        <div className="flex items-center space-x-2">
          {[25, 50, 75, 100].map((x) => (
            <Button
              key={x}
              onClick={() => handleSliderChange((x / 100) * maxAmountAllowed)}
              className="w-full bg-card py-2 text-center hover:bg-primary rounded-lg"
            >
              {x}%
            </Button>
          ))}
        </div>
        <h3 className="text-left text-card-foreground">
          {accountLeverage}x Account Leverage | Estimated Liquidation Price:{" "}
          {estimatedLiquidationPrice}
        </h3>
        <div className="flex items-center justify-between p-5 px-8 bg-card">
          <div className="flex flex-col items-center space-y-2 text-center">
            <h3>Liquidation Price</h3>
            <h3>{exitPnL} USD</h3>
          </div>
          <div className="flex flex-col items-center space-y-2 text-center">
            <h3>Liquidation PnL</h3>
            <h3>{stopPnL} USD</h3>
          </div>
          <div className="flex flex-col items-center space-y-2 text-center">
            <h3>Risk Reward</h3>
            <h3>{riskRewardPnL} USD</h3>
          </div>
        </div>
        <DrawerClose>
          <OpenQuoteButton
            request={{
              issuerAddress: "0x0000000000000000000000000000000000000000",
              counterpartyAddress: "0x0000000000000000000000000000000000000000",
              version: "1.0",
              chainId: 64165,
              verifyingContract: "",
              x: "",
              parity: "0",
              maxConfidence: "",
              assetHex: "",
              maxDelay: "600",
              precision: 5,
              imA: "",
              imB: "",
              dfA: "",
              dfB: "",
              expiryA: "",
              expiryB: "",
              timeLock: "",
              nonceBoracle: "0",
              signatureBoracle: "",
              isLong: currentMethod === "Buy",
              price: entryPrice,
              amount: amount,
              interestRate: "",
              isAPayingApr: false,
              frontEnd: "",
              affiliate: "",
              authorized: "",
              nonceOpenQuote: "0",
              signatureOpenQuote: "",
              emitTime: "0",
              messageState: 0,
            }}
          />
        </DrawerClose>
      </div>
    </DrawerContent>
  );
}

export default SheetPlaceOrder;
