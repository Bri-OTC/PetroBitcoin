// SectionTradeChart.tsx
"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { CgMaximizeAlt } from "react-icons/cg";
import { FaRegClock, FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { HiOutlineCog6Tooth } from "react-icons/hi2";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PopupModify from "../../popup/modify";
import TradingViewAdvancedChart from "../../tradingview/TradingViewAdvancedChart";
import { useTradeStore } from "@/store/tradeStore";
import { useActivePrice } from "@/components/triparty/priceUpdater";
import { RfqRequestUpdater } from "@/components/triparty/rfq";
import UpdateMarketStatus from "@/components/triparty/marketStatusUpdater";

function SectionTradeChart() {
  const [showChart, setShowChart] = useState(true);
  const [interval, setInterval] = useState("D");
  const symbol = useTradeStore((state) => state.symbol);
  const activePrice = useActivePrice();

  useEffect(() => {
    activePrice();
  }, [activePrice]);

  const handleIntervalChange = (value: string) => {
    setInterval(value);
  };

  return (
    <div className="flex flex-col space-y-3 mt-2 px-5">
      <RfqRequestUpdater />
      <UpdateMarketStatus />

      <div className="flex items-center justify-between">
        <div>
          <p className="text-accent-foreground">24h volume</p>
          <p>US$189</p>
        </div>
        <div>
          <p className="text-accent-foreground">Funding rate</p>
          <p>
            <span className="text-red-500">6.25%</span> APR
          </p>
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
