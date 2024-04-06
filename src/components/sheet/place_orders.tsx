// SheetPlaceOrder.tsx

import { DrawerClose, DrawerContent, DrawerTitle } from "../ui/drawer";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";
import { FaEquals } from "react-icons/fa";
import { Dialog, DialogTrigger } from "../ui/dialog";
import { Card } from "../ui/card";
import { Slider } from "../ui/slider";
import PopupModify from "../popup/modify";
import { useTradeStore } from "@/store/tradeStore";

function SheetPlaceOrder() {
  const currentMethod = useTradeStore((state) => state.currentMethod);
  const entryPrice = useTradeStore((state) => state.entryPrice);
  const takeProfit = useTradeStore((state) => state.takeProfit);
  const takeProfitPercentage = useTradeStore(
    (state) => state.takeProfitPercentage
  );
  const stopLoss = useTradeStore((state) => state.stopLoss);
  const stopLossPercentage = useTradeStore((state) => state.stopLossPercentage);
  const amount = useTradeStore((state) => state.amount);
  const maxAmount = useTradeStore((state) => state.maxAmount);
  const amountUSD = useTradeStore((state) => state.amountUSD);
  const isReduceTP = useTradeStore((state) => state.isReduceTP);
  const isReduceSL = useTradeStore((state) => state.isReduceSL);
  const sliderValue = useTradeStore((state) => state.sliderValue);
  const exitPnL = useTradeStore((state) => state.exitPnL);
  const stopPnL = useTradeStore((state) => state.stopPnL);
  const riskRewardPnL = useTradeStore((state) => state.riskRewardPnL);
  const accountLeverage = useTradeStore((state) => state.accountLeverage);
  const estimatedLiquidationPrice = useTradeStore(
    (state) => state.estimatedLiquidationPrice
  );
  const bidPrice = useTradeStore((state) => state.bidPrice);
  const askPrice = useTradeStore((state) => state.askPrice);
  const symbol = useTradeStore((state) => state.symbol);
  const setCurrentMethod = useTradeStore((state) => state.setCurrentMethod);
  const setEntryPrice = useTradeStore((state) => state.setEntryPrice);
  const setTakeProfit = useTradeStore((state) => state.setTakeProfit);
  const setTakeProfitPercentage = useTradeStore(
    (state) => state.setTakeProfitPercentage
  );
  const setStopLoss = useTradeStore((state) => state.setStopLoss);
  const setStopLossPercentage = useTradeStore(
    (state) => state.setStopLossPercentage
  );
  const setAmount = useTradeStore((state) => state.setAmount);
  const setAmountUSD = useTradeStore((state) => state.setAmountUSD);
  const setIsReduceTP = useTradeStore((state) => state.setIsReduceTP);
  const setIsReduceSL = useTradeStore((state) => state.setIsReduceSL);
  const setSliderValue = useTradeStore((state) => state.setSliderValue);
  return (
    <DrawerContent>
      <DrawerTitle className="text-center mt-3">BTC-PERP</DrawerTitle>
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
                          ? "border-red-500 text-red-500"
                          : "border-green-500 text-green-500"
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
            <p className="text-white">Bid price : {bidPrice}</p>
          </Card>
          <Card className="py-4">
            <p className="text-white">Ask price : {askPrice}</p>
          </Card>
        </div>

        <div className="flex space-x-5 justify-between items-end">
          <div className="flex flex-col space-y-2 w-full">
            <h3 className="text-left text-card-foreground">Entry Price</h3>
            <div className="flex items-center space-x-5 border-b">
              <Input
                className="bg-transparent border-none"
                placeholder="Input Price"
                value={entryPrice}
                onChange={(e) => setEntryPrice(e.target.value)}
              />
              <p>USD</p>
            </div>
          </div>
          <Dialog>
            <DialogTrigger className="w-full bg-card">Limit</DialogTrigger>
            <PopupModify />
          </Dialog>
          <div className="flex flex-col items-center space-y-1">
            <p>Reduce</p>
            <Checkbox />
          </div>
        </div>
        <div className="flex space-x-5 justify-between items-end">
          <div className="flex flex-col space-y-2 w-full">
            <h3 className="text-left text-card-foreground">Take profit exit</h3>
            <div className="flex items-center space-x-5 border-b">
              <Input
                className="bg-transparent border-none"
                placeholder="Input Price"
                value={takeProfit}
                onChange={(e) => setTakeProfit(e.target.value)}
              />
              <p>USD</p>
            </div>
          </div>
          <div className="flex flex-col space-y-2 w-full">
            <h3 className="text-left text-card-foreground">% Gain</h3>
            <div className="flex items-center space-x-5 border-b">
              <Input
                className="bg-transparent border-none"
                placeholder="Input Price"
                value={takeProfitPercentage}
                onChange={(e) => setTakeProfitPercentage(e.target.value)}
              />
              <p>USD</p>
            </div>
          </div>
          <div className="flex flex-col items-center space-y-1">
            <p>Reduce</p>
            <Checkbox
              checked={isReduceTP}
              onChange={() => setIsReduceTP(!isReduceTP)}
            />
          </div>
        </div>
        <div className="flex space-x-5 justify-between items-end">
          <div className="flex flex-col space-y-2 w-full">
            <h3 className="text-left text-card-foreground">Stop loss</h3>
            <div className="flex items-center space-x-5 border-b">
              <Input
                className="bg-transparent border-none"
                placeholder="Input Price"
                value={stopLoss}
                onChange={(e) => setStopLoss(e.target.value)}
              />
              <p>USD</p>
            </div>
          </div>
          <div className="flex flex-col space-y-2 w-full">
            <h3 className="text-left text-card-foreground">% Loss</h3>
            <div className="flex items-center space-x-5 border-b">
              <Input
                className="bg-transparent border-none"
                placeholder="Input Price"
                value={stopLossPercentage}
                onChange={(e) => setStopLossPercentage(e.target.value)}
              />
              <p>USD</p>
            </div>
          </div>
          <div className="flex flex-col items-center space-y-1">
            <p>Reduce</p>
            <Checkbox
              checked={isReduceSL}
              onChange={() => setIsReduceSL(!isReduceSL)}
            />
          </div>
        </div>
        <div className="flex space-x-5 justify-between items-end">
          <div className="flex flex-col space-y-2 w-full">
            <h3 className="text-left text-card-foreground">Amount</h3>
            <div className="flex items-center space-x-5 border-b">
              <Input
                className="bg-transparent border-none"
                placeholder="Input Price"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              <p>BTC</p>
            </div>
          </div>
          <FaEquals />
          <div className="flex flex-col space-y-2 w-full">
            <h3 className="text-left text-card-foreground">Amount</h3>
            <div className="flex items-center space-x-5 border-b">
              <Input
                className="bg-transparent border-none"
                placeholder="Input Price"
                value={amountUSD}
                onChange={(e) => setAmountUSD(e.target.value)}
              />
              <p>USD</p>
            </div>
          </div>
        </div>
        <div className="py-3">
          <Slider
            min={1}
            max={maxAmount}
            value={[sliderValue]}
            onValueChange={(value) => setSliderValue(value[0])}
          />
        </div>
        <div className="flex items-center space-x-2">
          {[25, 50, 75, 100].map((x) => {
            return (
              <h2
                key={x + "drawer"}
                onClick={() => setSliderValue(x)}
                className="w-full bg-card py-2 text-center hover:bg-primary rounded-lg cursor-pointer"
              >
                {x}%
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
            <h3>Exit PnL</h3>
            <h3>{exitPnL} USD</h3>
          </div>
          <div className="flex flex-col items-center space-y-2 text-center">
            <h3>Stop PnL</h3>
            <h3>{stopPnL} USD</h3>
          </div>
          <div className="flex flex-col items-center space-y-2 text-center">
            <h3>Risk Reward PnL</h3>
            <h3>{riskRewardPnL} USD</h3>
          </div>
        </div>
        <DrawerClose>
          <Button className="w-full">Place Orders</Button>
        </DrawerClose>
      </div>
    </DrawerContent>
  );
}

export default SheetPlaceOrder;
