import { useState } from "react";
import { DrawerClose, DrawerContent, DrawerTitle } from "../ui/drawer";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";
import { FaEquals } from "react-icons/fa";
import { Dialog, DialogTrigger } from "../ui/dialog";
import { Card } from "../ui/card";
import { Slider } from "../ui/slider";
import PopupModify from "../popup/modify";

function SheetPlaceOrder() {
  const [currentMethod, setCurrentMethod] = useState("Buy");
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
            <p className="text-white">Bid price : 46,423</p>
          </Card>
          <Card className="py-4">
            <p className="text-white">Ask price : 46,423</p>
          </Card>
        </div>
        <div className="flex space-x-5 justify-between items-end">
          <div className="flex flex-col space-y-2 w-full">
            <h3 className="text-left text-card-foreground">Entry Price</h3>
            <div className="flex items-center space-x-5 border-b">
              <Input
                className="bg-transparent border-none"
                placeholder="Input Price"
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
          <div className="flex flex-col space-y-2">
            <h3 className="text-left text-card-foreground">Take profix exit</h3>
            <div className="flex items-center space-x-5 border-b">
              <Input
                className="bg-transparent border-none"
                placeholder="Input Price"
              />
              <p>USD</p>
            </div>
          </div>
          <div className="flex flex-col space-y-2">
            <h3 className="text-left text-card-foreground">% Gain</h3>
            <div className="flex items-center space-x-5 border-b">
              <Input
                className="bg-transparent border-none"
                placeholder="Input Price"
              />
              <p>USD</p>
            </div>
          </div>
          <div className="flex flex-col items-center space-y-1">
            <p>Reduce</p>
            <Checkbox />
          </div>
        </div>
        <div className="flex space-x-5 justify-between items-end">
          <div className="flex flex-col space-y-2">
            <h3 className="text-left text-card-foreground">Stop loss</h3>
            <div className="flex items-center space-x-5 border-b">
              <Input
                className="bg-transparent border-none"
                placeholder="Input Price"
              />
              <p>USD</p>
            </div>
          </div>
          <div className="flex flex-col space-y-2">
            <h3 className="text-left text-card-foreground">% Loss</h3>
            <div className="flex items-center space-x-5 border-b">
              <Input
                className="bg-transparent border-none"
                placeholder="Input Price"
              />
              <p>USD</p>
            </div>
          </div>
          <div className="flex flex-col items-center space-y-1">
            <p>Reduce</p>
            <Checkbox />
          </div>
        </div>
        <div className="flex space-x-5 justify-between items-end">
          <div className="flex flex-col space-y-2">
            <h3 className="text-left text-card-foreground">Amount</h3>
            <div className="flex items-center space-x-5 border-b">
              <Input
                className="bg-transparent border-none"
                placeholder="Input Price"
              />
              <p>BTC</p>
            </div>
          </div>
          <FaEquals />
          <div className="flex flex-col space-y-2">
            <h3 className="text-left text-card-foreground">Amount</h3>
            <div className="flex items-center space-x-5 border-b">
              <Input
                className="bg-transparent border-none"
                placeholder="Input Price"
              />
              <p>USD</p>
            </div>
          </div>
        </div>
        <div className="py-3">
          <Slider min={1} max={100} />
        </div>
        <div className="flex items-center space-x-2">
          {[25, 50, 75, 100].map((x) => {
            return (
              <h2
                key={x + "drawer"}
                className="w-full bg-card py-2 text-center hover:bg-primary rounded-lg"
              >
                {x}%
              </h2>
            );
          })}
        </div>
        <h3 className="text-left text-card-foreground">
          4.89x Account Leverage | Estimated Liquidation Price: 54,611
        </h3>
        <div className="flex items-center justify-between p-5 px-8 bg-card">
          <div className="flex flex-col items-center space-y-2 text-center">
            <h3>Exit PnL</h3>
            <h3>30.73 USD</h3>
          </div>
          <div className="flex flex-col items-center space-y-2 text-center">
            <h3>Stop PnL</h3>
            <h3>30.73 USD</h3>
          </div>
          <div className="flex flex-col items-center space-y-2 text-center">
            <h3>Risk Reward PnL</h3>
            <h3>30.73 USD</h3>
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
