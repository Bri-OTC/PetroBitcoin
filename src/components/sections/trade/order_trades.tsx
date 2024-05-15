"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Drawer, DrawerTrigger } from "@/components/ui/drawer";
import { FaEquals } from "react-icons/fa";
import { ChangeEvent, useEffect } from "react";
import SheetPlaceOrder from "@/components/sheet/place_orders";
import { useTradeStore } from "@/store/tradeStore";
import { OrderBook } from "@/components/sections/trade/OrderBook";
import { useAuthStore } from "@/store/authStore";
import startMarketStatusUpdater from "@/components/triparty/marketStatusUpdater";
import useBlurEffect from "@/components/hooks/blur";

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
  const setSliderValue = useTradeStore((state) => state.setSliderValue);
  const blur = useBlurEffect();
  const isMarketOpen = useAuthStore((state) => state.isMarketOpen);
  const testBool = true;

  const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
    setAmountUSD(
      (parseFloat(e.target.value) * parseFloat(entryPrice)).toString()
    );
  };

  const handleAmountUSDChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAmountUSD(e.target.value);
    setAmount((parseFloat(e.target.value) / parseFloat(entryPrice)).toString());
  };

  useEffect(() => {
    if (currentTabIndex === "Market") {
      setEntryPrice(
        currentMethod === "Buy" ? bidPrice.toString() : askPrice.toString()
      );
    }
  }, [currentTabIndex, currentMethod, bidPrice, askPrice, setEntryPrice]);

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
    <div className={`container ${blur ? "blur" : ""}`}>
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
                  className="pb-3 outline-none w-full border-b-[1px] bg-transparent hover:shadow-[0_0_0_2px_rgba(256,200,52,1)]"
                  placeholder="Input Price"
                  value={entryPrice}
                  onChange={(e) => setEntryPrice(e.target.value)}
                  disabled={currentTabIndex === "Market"}
                />
                <p>USD</p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex flex-col space-y-2 w-full">
                  <p className="text-card-foreground">Amount (Contracts)</p>
                  <input
                    type="number"
                    className="pb-3 outline-none w-full border-b-[1px] bg-transparent hover:shadow-[0_0_0_2px_rgba(256,200,52,1)]"
                    value={amount}
                    onChange={handleAmountChange}
                  />
                </div>
                <div className="mt-5">
                  <FaEquals className="text-[0.8rem]" />
                </div>
                <div className="flex flex-col space-y-2 w-full">
                  <p className="text-card-foreground">Amount (USD)</p>
                  <input
                    type="number"
                    className="pb-3 outline-none w-full border-b-[1px] bg-transparent hover:shadow-[0_0_0_2px_rgba(256,200,52,1)]"
                    value={amountUSD}
                    onChange={handleAmountUSDChange}
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {[25, 50, 75, 100].map((x) => (
                  <button
                    key={x}
                    onClick={() => setSliderValue(x)}
                    className="w-full bg-card py-2 text-center hover:bg-primary rounded-lg cursor-pointer"
                  >
                    {x}%
                  </button>
                ))}
              </div>
              <div className="flex items-center space-x-2">
                <p className="text-card-foreground">
                  {accountLeverage}x Account Leverage
                </p>
                <p className="text-card-foreground">
                  <span className="text-red-500">6.25%</span> APR
                </p>
              </div>
              <div>
                <Drawer>
                  <DrawerTrigger
                    className={`w-full py-3 ${
                      testBool
                        ? currentMethod === "Buy"
                          ? "bg-[#089981]"
                          : "bg-[#F23645]"
                        : "bg-[#666EFF] cursor-not-allowed"
                    }`}
                    disabled={!testBool}
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
    </div>
  );
}

export default SectionTradeOrderTrades;
