"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FaRegClock, FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import TradingViewAdvancedChart from "../../tradingview/TradingViewAdvancedChart";
import { useTradeStore } from "@/store/tradeStore";
import { useActivePrice } from "@/components/triparty/priceUpdater";
import { RfqRequestUpdater } from "@/components/triparty/rfq";
import useBlurEffect from "@/hooks/blur";

function SectionTradeChart() {
  const [showChart, setShowChart] = useState(true);
  const [interval, setInterval] = useState("60");
  const [chartHeight, setChartHeight] = useState(200);
  const [isResizing, setIsResizing] = useState(false);
  const activePrice = useActivePrice();
  const blur = useBlurEffect();
  const symbol = useTradeStore((state) => state.symbol);
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    activePrice();
  }, [activePrice]);

  const handleIntervalChange = (value: string) => {
    setInterval(value);
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isResizing || !chartRef.current) return;
      const chartRect = chartRef.current.getBoundingClientRect();
      const newHeight = e.clientY - chartRect.top;
      requestAnimationFrame(() => {
        setChartHeight(
          Math.max(100, Math.min(newHeight, window.innerHeight - 100))
        );
      });
    },
    [isResizing]
  );

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  }, [handleMouseMove]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  useEffect(() => {
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  return (
    <div className={`container ${blur ? "blur" : ""}`}>
      <div className="flex flex-col space-y-3 mt-2 px-5">
        <RfqRequestUpdater />

        <div className="flex items-center justify-between">
          <Select onValueChange={handleIntervalChange}>
            <SelectTrigger className="w-fit flex items-center space-x-2">
              <FaRegClock />
              <SelectValue placeholder="1D" className="outline-none" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="D">1d</SelectItem>
              <SelectItem value="W">1w</SelectItem>
              <SelectItem value="M">1m</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center space-x-2">
            <Button
              onClick={() => setShowChart(!showChart)}
              size="icon"
              variant="ghost"
            >
              {showChart ? <FaRegEye /> : <FaRegEyeSlash />}
            </Button>
          </div>
        </div>
        <div
          ref={chartRef}
          className={`${
            showChart ? "" : "max-h-0"
          } overflow-hidden transition-all bg-card text-white relative`}
          style={{ height: showChart ? `${chartHeight}px` : "0px" }}
        >
          <div className="w-full h-full flex items-center justify-center">
            <TradingViewAdvancedChart symbol={symbol} interval={interval} />
          </div>
          <div
            className={`absolute bottom-0 left-0 right-0 h-2 cursor-ns-resize transition-opacity duration-200 ${
              isResizing
                ? "bg-blue-500 opacity-50"
                : "opacity-0 hover:opacity-30"
            }`}
            onMouseDown={handleMouseDown}
          />
        </div>
      </div>
    </div>
  );
}

export default SectionTradeChart;
