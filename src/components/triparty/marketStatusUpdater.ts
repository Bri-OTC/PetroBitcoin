// marketStatusUpdater.ts
import { useEffect } from "react";
import { formatSymbols } from "@/components/triparty/priceUpdater";
import { useAuthStore } from "@/store/authStore";
import { useTradeStore } from "@/store/tradeStore";

interface MarketStatusResponse {
  isTheStockMarketOpen: boolean;
  isTheEuronextMarketOpen: boolean;
  isTheForexMarketOpen: boolean;
  isTheCryptoMarketOpen: boolean;
}

const UpdateMarketStatus: React.FC = () => {
  const symbol = useTradeStore((state) => state.symbol);
  const setIsMarketOpen = useAuthStore((state) => state.setIsMarketOpen);

  useEffect(() => {
    const updateMarketStatus = async () => {
      try {
        const response = await fetch(
          "https://api.pio.finance:2096/api/v1/is_market_open",
          {
            method: "GET",
            headers: {
              Authorization:
                "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MTQwOTE3NTgsImRhdGEiOnsibm9uY2UiOiJjMTE5ODc1Njg2MmU3NDc4YzI1OTUyMDdlM2Q3ZDcxMDdjNmE3N2IwZjQ0ZTEzN2ZmZjBhY2ZkNGRiNzQ1MzhkIiwiYWRkcmVzcyI6IjB4ZDBkZGY5MTU2OTNmMTNjZjliM2I2OWRmZjQ0ZWU3N2M5MDE4ODJmOCJ9LCJpYXQiOjE3MTM0ODY5NTh9.4-Nl4C-NzXaVVnGlalaqsXXLeEyzX8wrbueRCt9QzLo",
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

        if (isForexPair) {
          setIsMarketOpen(data.isTheForexMarketOpen);
        } else if (isStockPair) {
          setIsMarketOpen(data.isTheStockMarketOpen);
        } else {
          setIsMarketOpen(data.isTheCryptoMarketOpen);
        }
      } catch (error) {
        console.error("Error fetching market status:", error);
        setIsMarketOpen(false);
      }
    };

    updateMarketStatus();
    const interval = setInterval(updateMarketStatus, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [symbol, setIsMarketOpen]);

  return null;
};

export default UpdateMarketStatus;
