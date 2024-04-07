import React, { useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";

const TradingViewAdvancedChart = ({ symbol, interval }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/tv.js";
    script.async = true;
    script.onload = () => {
      if (typeof TradingView !== "undefined") {
        new window.TradingView.widget({
          autosize: true,
          symbol: symbol,
          interval: interval,
          timezone: "Etc/UTC",
          theme: "dark",
          style: "1",
          locale: "en",
          enable_publishing: false,
          hide_side_toolbar: true,
          hide_top_toolbar: true,
          calendar: false,
          hide_volume: true,

          allow_symbol_change: false,
          container_id: containerRef.current.id,
        });
      }
    };

    containerRef.current.appendChild(script);

    return () => {
      if (containerRef.current) {
        while (containerRef.current.firstChild) {
          containerRef.current.removeChild(containerRef.current.firstChild);
        }
      }
    };
  }, [symbol, interval]);

  return (
    <Card className="p-0 bg-transparent border-none h-full w-full">
      <div
        ref={containerRef}
        id="tradingview-advanced-chart"
        className="tradingview-widget-container h-full w-full"
      ></div>
    </Card>
  );
};

export default TradingViewAdvancedChart;
