"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Drawer, DrawerTrigger } from "@/components/ui/drawer";
import { FaEquals } from "react-icons/fa";
import { useState } from "react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import PopupModify from "@/components/popup/modify";
import SheetPlaceOrder from "@/components/sheet/place_orders";

function SectionTradeOrderTrades() {
  const [currentTabIndex, setCurrentTabIndex] = useState(0);
  const [currentMethod, setCurrentMethod] = useState("Buy");
  return (
    <div className="mt-5">
      <div className="border-b flex space-x-5 px-5">
        {["Order", "Trades"].map((x, index) => {
          return (
            <div key={x} onClick={() => setCurrentTabIndex(index)}>
              <h2
                className={`${
                  currentTabIndex === index
                    ? "text-white"
                    : "text-card-foreground"
                } transition-all font-medium cursor-pointer`}
              >
                {x}
              </h2>
              <div
                className={`w-[18px] h-[4px] ${
                  currentTabIndex === index ? "bg-white" : "bg-transparent"
                } mt-3 transition-all`}
              />
            </div>
          );
        })}
      </div>
      <div className="flex items-stretch space-x-5 pt-5 px-5">
        <div className="w-full flex flex-col space-y-5">
          <div className="flex border-b">
            {["Buy", "Sell"].map((x) => {
              return (
                <h3
                  key={x}
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
                </h3>
              );
            })}
          </div>
          <Dialog>
            <DialogTrigger className="bg-card p-3 w-full">
              <h2 className="text-white">Limit Order</h2>
            </DialogTrigger>
            <PopupModify />
          </Dialog>
          <div className="flex flex-col space-y-5">
            <p className="text-card-foreground">Price</p>
            <div className="flex pb-3 items-center space-x-2 border-b">
              <Input
                type="number"
                className="border-none bg-transparent px-0"
                placeholder="Input Price"
              />
              <p>USD</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex flex-col space-y-2 w-full">
                <p className="text-card-foreground">Amount (BTC)</p>
                <input
                  type="number"
                  className="pb-3 outline-none w-full border-b-[1px] bg-transparent"
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
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {[25, 50, 75, 100].map((x) => {
                return (
                  <Button key={x} variant="ghost" className="w-full px-3 py-2">
                    <h3 className="font-medium">{x}%</h3>
                  </Button>
                );
              })}
            </div>
            <p className="text-card-foreground">0.00x Account Leverage</p>
            <div className="flex flex-col space-y-3">
              {["Reduce Only", "Post Only", "IOC"].map((x) => {
                return (
                  <div key={x} className="flex items-center space-x-2">
                    <Checkbox />
                    <p className="text-card-foreground">{x}</p>
                  </div>
                );
              })}
            </div>
            <Drawer>
              <DrawerTrigger className="w-full bg-card py-3">
                <p>Buy</p>
              </DrawerTrigger>
              <SheetPlaceOrder />
            </Drawer>
          </div>
        </div>
        <div className="w-full max-w-[135px] md:max-w-[250px] flex items-center justify-center text-center bg-card">
          <h1>Depth</h1>
        </div>
      </div>
    </div>
  );
}

export default SectionTradeOrderTrades;
