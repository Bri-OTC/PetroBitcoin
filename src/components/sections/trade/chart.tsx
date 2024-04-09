// SectionTradeChart.tsx
"use client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { useState } from "react";
import { CgMaximizeAlt } from "react-icons/cg";
import { FaRegClock, FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { HiOutlineCog6Tooth } from "react-icons/hi2";
import { BsThreeDotsVertical } from "react-icons/bs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PopupShare from "../../popup/share";
import PopupChart from "../../popup/chart";
import PopupModify from "../../popup/modify";
import TradingViewAdvancedChart from "../../tradingview/TradingViewAdvancedChart";

function SectionTradeChart() {
  const [showChart, setShowChart] = useState(true);
  const [symbol, setSymbol] = useState("NASDAQ:AAPL");
  const [interval, setInterval] = useState("D");

  const handleIntervalChange = (value: string) => {
    setInterval(value);
  };

  return (
    <div className="flex flex-col space-y-3 mt-2 px-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-accent-foreground">24h volume</p>
          <p>US$2,455,213,189</p>
        </div>
        <div>
          <p className="text-accent-foreground">Predicted funding rate</p>
          <p>
            <span className="text-red-500">0.0022%</span> in 47 min
          </p>
        </div>
        <div className="flex items-center space-x-5">
          <Dialog>
            <DialogTrigger className="bg-card p-2">
              <BsThreeDotsVertical className="text-[1.1rem]" />
            </DialogTrigger>
            <PopupShare />
          </Dialog>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <Select onValueChange={handleIntervalChange}>
          <SelectTrigger className="w-fit flex items-center space-x-2">
            <FaRegClock />
            <SelectValue placeholder="1D" className="outline-none" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">1m</SelectItem>
            <SelectItem value="5">5m</SelectItem>
            <SelectItem value="15">15m</SelectItem>
            <SelectItem value="60">1h</SelectItem>
            <SelectItem value="D">1d</SelectItem>
            <SelectItem value="W">1w</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex items-center space-x-2">
          <Dialog>
            <DialogTrigger className="bg-card p-2">
              <HiOutlineCog6Tooth className="text-[1.1rem]" />
            </DialogTrigger>
            <PopupModify />
          </Dialog>
          <Button
            onClick={() => setShowChart(!showChart)}
            size="icon"
            variant="ghost"
          >
            {showChart ? <FaRegEye /> : <FaRegEyeSlash />}
          </Button>
          <Dialog>
            <DialogTrigger className="bg-card p-2">
              <CgMaximizeAlt className="text-[1.1rem]" />
            </DialogTrigger>
            <DialogContent>
              <div className="w-full h-full flex items-center justify-center">
                <TradingViewAdvancedChart symbol={symbol} interval={interval} />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div
        className={`${
          showChart ? "h-full" : "max-h-0"
        } overflow-hidden transition-all bg-card text-white`}
      >
        <div className="w-full h-full flex items-center justify-center">
          <TradingViewAdvancedChart symbol={symbol} interval={interval} />
        </div>
      </div>
    </div>
  );
}

export default SectionTradeChart;
