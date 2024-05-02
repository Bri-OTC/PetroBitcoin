import React, { useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";

const TradingViewAdvancedChart = ({ symbol, interval }) => {
  const containerRef = useRef(null);

  let widgetOptions = {
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
    container_id: "tradingview-advanced-chart",
  };

  const initChart = () => {
    const scriptElement = document.getElementById('tv_chart_script');
    if (scriptElement) {
      scriptElement.parentNode.removeChild(scriptElement);
    }
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.id = 'tv_chart_script';
    script.async = true;
    script.onload = () => {
      window.tvWidget = new TradingView.widget(widgetOptions);

      const styleElements = document.querySelectorAll('style');
      styleElements.forEach(element => {
        if (element.textContent.includes('.tradingview-widget-copyright')) {
          element.parentNode.removeChild(element);
        }
      });
    };
    document.body.appendChild(script);
  };

  useEffect(() => {
    initChart();
  }, []);

  useEffect(() => {
    if (window.tvWidget) {
      widgetOptions.symbol = symbol;
      widgetOptions.interval = interval;
      initChart();
    }
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
