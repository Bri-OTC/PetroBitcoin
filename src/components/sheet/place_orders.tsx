// SheetPlaceOrder.tsx
import { DrawerClose, DrawerContent, DrawerTitle } from "../ui/drawer";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { FaEquals } from "react-icons/fa";
import { Dialog, DialogTrigger } from "../ui/dialog";
import { Card } from "../ui/card";
import { Slider } from "../ui/slider";
import PopupModify from "../popup/modify";
import { useTradeStore } from "@/store/tradeStore";
import OpenQuoteButton from "@/components/sections/trade/utils/openQuote";
import { useAuthStore } from "@/store/authStore";
import { useWalletAndProvider } from "@/components/layout/menu";
import { useEffect } from "react";
import React, { useState } from "react";
import { useBalance } from "@/hooks/useBalance";
import Link from "next/link";
import { useColorStore } from "@/store/colorStore";

function SheetPlaceOrder() {
  const token = useAuthStore().token;
  const { wallet, provider } = useWalletAndProvider();

  const currentMethod = useTradeStore((state) => state.currentMethod);
  const entryPrice = useTradeStore((state) => state.entryPrice);

  const amount = useTradeStore((state) => state.amount);
  const amountUSD = useTradeStore((state) => state.amountUSD);
  const sliderValue = useTradeStore((state) => state.sliderValue);

  const bidPrice = useTradeStore((state) => state.bidPrice);
  const askPrice = useTradeStore((state) => state.askPrice);
  const [prevBidPrice, setPrevBidPrice] = useState(bidPrice);
  const [prevAskPrice, setPrevAskPrice] = useState(askPrice);
  const symbol = useTradeStore((state) => state.symbol);
  const currentTabIndex = useTradeStore((state) => state.currentTabIndex);

  const setCurrentMethod = useTradeStore((state) => state.setCurrentMethod);
  const setCurrentTabIndex = useTradeStore((state) => state.setCurrentTabIndex);

  const setEntryPrice = useTradeStore((state) => state.setEntryPrice);

  const setAmount = useTradeStore((state) => state.setAmount);
  const setAmountUSD = useTradeStore((state) => state.setAmountUSD);
  const setSliderValue = useTradeStore((state) => state.setSliderValue);

  const accountLeverage = useTradeStore((state) => state.accountLeverage);
  const estimatedLiquidationPrice = useTradeStore(
    (state) => state.estimatedLiquidationPrice
  );
  const exitPnL = useTradeStore((state) => state.exitPnL);
  const stopPnL = useTradeStore((state) => state.stopPnL);
  const riskRewardPnL = useTradeStore((state) => state.riskRewardPnL);
  const { sufficientBalance, maxAmountAllowed, isBalanceZero } = useBalance(
    amount,
    entryPrice
  );

  const color = useColorStore((state) => state.color);

  useEffect(() => {
    if (currentMethod === "Buy") {
      try {
        setEntryPrice(askPrice.toString());
      } catch (error) {
        console.error("Error setting entry price:", error);
      }
    } else if (currentMethod === "Sell") {
      try {
        setEntryPrice(bidPrice.toString());
      } catch (error) {
        console.error("Error setting entry price:", error);
      }
    }
  }, [currentMethod, askPrice, bidPrice, setEntryPrice]);

  useEffect(() => {
    if (currentTabIndex === "Market") {
      if (currentMethod === "Buy") {
        try {
          setEntryPrice(askPrice.toString());
        } catch (error) {}
      } else if (currentMethod === "Sell") {
        try {
          setEntryPrice(bidPrice.toString());
        } catch (error) {}
      }
    }
  }, [currentTabIndex, currentMethod, askPrice, bidPrice, setEntryPrice]);

  useEffect(() => {
    setAmountUSD((parseFloat(amount) * parseFloat(entryPrice)).toString());
  }, [entryPrice, amount, setAmountUSD]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPrevBidPrice(bidPrice);
      setPrevAskPrice(askPrice);
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [bidPrice, askPrice]);

  const toggleTabIndex = () => {
    setCurrentTabIndex(currentTabIndex === "Market" ? "Limit" : "Market");
  };

  const handleAmountChange = (value: string) => {
    setAmount(value);
    setAmountUSD(String(parseFloat(value) * parseFloat(entryPrice)));
  };

  const handleAmountUSDChange = (value: string) => {
    setAmountUSD(value);
    setAmount(String(parseFloat(value) / parseFloat(entryPrice)));
  };

  return (
    <DrawerContent>
      <DrawerTitle className="text-center mt-3">{symbol}</DrawerTitle>
      <div className="flex flex-col space-y-3 p-5">
        <div className="flex border-b">
          {["Buy", "Sell"].map((x) => {
            return (
              <h2
                key={x + "drawer"}
                onClick={() => setCurrentMethod(x)}
                className={`w-full text-center pb-3 border-b-[3px] ${
                  currentMethod === x
                    ? `${
                        currentMethod === "Sell"
                          ? "border-[#F23645] text-[#F23645]"
                          : "border-[#089981] text-[#089981]"
                      }`
                    : "border-transparent"
                } font-medium transition-all cursor-pointer`}
              >
                {x}
              </h2>
            );
          })}
        </div>
        <div className="flex items-center justify-center mt-5 space-x-5">
          <Card className="py-4">
            <p
              className={`text-white ${
                bidPrice !== prevBidPrice ? "fade-effect" : ""
              }`}
            >
              Bid price : {bidPrice.toFixed(5)}
            </p>
          </Card>
          <Card className="py-4">
            <p
              className={`text-white ${
                askPrice !== prevAskPrice ? "fade-effect" : ""
              }`}
            >
              Ask price : {askPrice.toFixed(5)}
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
                    : "hover:shadow-[0_0_0_2px] hover:shadow-[${color}]"
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
                placeholder="Input Price"
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
        ) : null}
        <div className="py-3">
          <Slider
            min={1}
            max={100}
            value={[sliderValue]}
            onValueChange={(value) => setSliderValue(value[0])}
          />
        </div>
        <div className="flex items-center space-x-2">
          {[25, 50, 75, "Max"].map((x) => {
            const value = x === "Max" ? 100 : x;
            return (
              <h2
                key={x + "drawer"}
                onClick={() => setSliderValue(Number(value))}
                className="w-full bg-card py-2 text-center hover:bg-primary rounded-lg cursor-pointer"
              >
                {x}
              </h2>
            );
          })}
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
              nonceBoracle: 0,
              signatureBoracle: "",
              isLong: currentMethod === "Buy",
              price: entryPrice,
              amount: amount,
              interestRate: "",
              isAPayingApr: false,
              frontEnd: "",
              affiliate: "",
              authorized: "",
              nonceOpenQuote: 0,
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
