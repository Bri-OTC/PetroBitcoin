// marketStatusUpdater.ts
import { useEffect, useState } from "react";
import { formatSymbols } from "@/components/triparty/priceUpdater";

interface MarketStatusResponse {
  isTheStockMarketOpen: boolean;
  isTheEuronextMarketOpen: boolean;
  isTheForexMarketOpen: boolean;
  isTheCryptoMarketOpen: boolean;
}

const useUpdateMarketStatus = (token: string | null, symbol: string) => {
  const [isMarketOpen, setIsMarketOpen] = useState(true);

  useEffect(() => {
    if (!token) return;

    const updateMarketStatus = async () => {
      try {
        const response = await fetch(
          "https://api.pio.finance:2096/api/v1/is_market_open",
          {
            method: "GET",
            headers: {
              Authorization: token,
            },
          }
        );
        const data: MarketStatusResponse = await response.json();

        const [resolvedSymbol1, resolvedSymbol2] = await formatSymbols(symbol);
        const isForexPair =
          resolvedSymbol1.startsWith("forex") ||
          resolvedSymbol2.startsWith("forex");
        const isStockPair =
          resolvedSymbol1.startsWith("stock") ||
          resolvedSymbol2.startsWith("stock");

        let newMarketStatus = false;

        if (isForexPair) {
          newMarketStatus = data.isTheForexMarketOpen;
        } else if (isStockPair) {
          newMarketStatus = data.isTheStockMarketOpen;
        } else if (isForexPair && isStockPair) {
          newMarketStatus =
            data.isTheForexMarketOpen && data.isTheStockMarketOpen;
        }

        setIsMarketOpen(newMarketStatus);

        console.log(
          "Market status updated:",
          resolvedSymbol1,
          resolvedSymbol2,
          isForexPair,
          isStockPair,
          newMarketStatus
        );
      } catch (error) {
        console.error("Error fetching market status:", error);
        setIsMarketOpen(false);
      }
    };

    updateMarketStatus();
    const interval = setInterval(updateMarketStatus, 60000);

    return () => clearInterval(interval);
  }, [symbol, token]);

  return isMarketOpen;
};

export default useUpdateMarketStatus;
