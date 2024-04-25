"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Drawer, DrawerTrigger } from "@/components/ui/drawer";
import { FaEquals } from "react-icons/fa";
import { useState, useEffect } from "react";
import SheetPlaceOrder from "@/components/sheet/place_orders";
import { useTradeStore } from "@/store/tradeStore";
import { OrderBook } from "@/components/sections/trade/OrderBook";
import { useAuthStore } from "@/store/authStore";
import startMarketStatusUpdater from "@/components/triparty/marketStatusUpdater";

function SectionTradeOrderTrades() {
  const {
    accountLeverage,
    bidPrice,
    askPrice,
    entryPrice,
    maxAmount,
    currentMethod,
    amount,
    amountUSD,
    currentTabIndex,
    symbol,
    setCurrentMethod: setCurrentMethodStore,
    setEntryPrice,
    setAmount,
    setAmountUSD,
    setCurrentTabIndex: setCurrentTabIndexStore,
    setCurrentTabIndex,
  } = useTradeStore();

  const isMarketOpen = useAuthStore((state) => state.isMarketOpen);

  useEffect(() => {
    if (currentTabIndex === "Market") {
      setEntryPrice(
        currentMethod === "Buy" ? bidPrice.toString() : askPrice.toString()
      );
    }
  }, [currentTabIndex, currentMethod, bidPrice, askPrice, setEntryPrice]);

  useEffect(() => {
    setAmount(amount);
    setAmountUSD((parseFloat(amount) * parseFloat(entryPrice)).toFixed(5));
  }, [amount, maxAmount, entryPrice, setAmount, setAmountUSD]);

  useEffect(() => {
    const checkMarketStatus = () => {
      const props = {
        symbol: symbol,
      };
      startMarketStatusUpdater(props);
    };

    const checkMarketStatusInterval = setInterval(checkMarketStatus, 60000); // Check every minute

    return () => {
      clearInterval(checkMarketStatusInterval);
    };
  }, [symbol]);

  return (
    <div className="mt-5">
      <div className="border-b flex space-x-5 px-5">
        {["Limit", "Market"].map((x) => (
          <div
            key={x}
            onClick={() => {
              setCurrentTabIndex(x);
              setCurrentTabIndexStore(x);
            }}
          >
            <h2
              className={`${
                currentTabIndex === x ? "text-white" : "text-card-foreground"
              } transition-all font-medium cursor-pointer`}
            >
              {x}
            </h2>
            <div
              className={`w-[18px] h-[4px] ${
                currentTabIndex === x ? "bg-white" : "bg-transparent"
              } mt-3 transition-all`}
            />
          </div>
        ))}
      </div>
      <div className="flex items-stretch space-x-5 pt-5 px-5">
        <div className="w-full flex flex-col space-y-5">
          <div className="flex border-b">
            {["Buy", "Sell"].map((x) => (
              <h3
                key={x}
                onClick={() => setCurrentMethodStore(x)}
                className={`w-full text-center pb-3 border-b-[3px] ${
                  currentMethod === x
                    ? currentMethod === "Sell"
                      ? "border-[#F23645] text-[#F23645]"
                      : "border-[#089981] text-[#089981]"
                    : "border-transparent"
                } font-medium transition-all cursor-pointer`}
              >
                {x}
              </h3>
            ))}
          </div>

          <div className="flex flex-col space-y-5">
            <p className="text-card-foreground">Price</p>
            <div className="flex pb-3 items-center space-x-2 border-b">
              <Input
                type="number"
                className="border-none bg-transparent px-0"
                placeholder="Input Price"
                value={entryPrice}
                onChange={(e) => setEntryPrice(e.target.value)}
                disabled={currentTabIndex === "Market"}
              />
              <p>USD</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex flex-col space-y-2 w-full">
                <p className="text-card-foreground">Amount (Contracts)</p>
                <input
                  type="number"
                  className="pb-3 outline-none w-full border-b-[1px] bg-transparent"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
              <div className="mt-5">
                <FaEquals className="text-[0.8rem]" />
              </div>
              <div className="flex flex-col space-y-2 w-full">
                <p className="text-card-foreground">Amount (USD)</p>
                <input
                  type="number"
                  className="pb-3 outline-none w-full border-b-[1px] bg-transparent"
                  value={amountUSD}
                  onChange={(e) => setAmountUSD(e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {["25", "50", "75", "100"].map((x) => (
                <Button key={x} variant="ghost" className="w-full px-3 py-2">
                  <h3 className="font-medium">{x}%</h3>
                </Button>
              ))}
            </div>
            <p className="text-card-foreground">
              {accountLeverage}x Account Leverage
            </p>

            <div>
              <Drawer>
                <DrawerTrigger
                  className={`w-full py-3 ${
                    isMarketOpen
                      ? currentMethod === "Buy"
                        ? "bg-[#089981]"
                        : "bg-[#F23645]"
                      : "bg-[#666EFF] cursor-not-allowed"
                  }`}
                  disabled={!isMarketOpen}
                >
                  <p>{currentMethod}</p>
                </DrawerTrigger>
                <SheetPlaceOrder />
              </Drawer>
            </div>
          </div>
        </div>
        <div className="w-full max-w-[135px] md:max-w-[250px] flex items-center justify-center text-center bg-card">
          <OrderBook maxRows={5} isOrderBookOn={isMarketOpen} />
        </div>
      </div>
    </div>
  );
}

export default SectionTradeOrderTrades;
