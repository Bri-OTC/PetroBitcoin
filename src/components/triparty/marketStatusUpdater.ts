import { formatSymbols } from "@/components/triparty/priceUpdater";
import { useAuthStore } from "@/store/authStore";

interface MarketStatusResponse {
  isTheStockMarketOpen: boolean;
  isTheEuronextMarketOpen: boolean;
  isTheForexMarketOpen: boolean;
  isTheCryptoMarketOpen: boolean;
}

const updateMarketStatus = async (symbol: string) => {
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

    const [symbol1, symbol2] = formatSymbols(symbol);
    const isForexPair =
      symbol1.startsWith("forex") || symbol2.startsWith("forex");
    const isStockPair =
      symbol1.startsWith("stock") || symbol2.startsWith("stock");

    const setIsMarketOpen = useAuthStore.getState().setIsMarketOpen;

    if (isForexPair) {
      setIsMarketOpen(data.isTheForexMarketOpen);
    } else if (isStockPair) {
      setIsMarketOpen(data.isTheStockMarketOpen);
    } else {
      setIsMarketOpen(data.isTheCryptoMarketOpen);
    }
  } catch (error) {
    console.error("Error fetching market status:", error);
  }
};

const startMarketStatusUpdater = (symbol: string) => {
  updateMarketStatus(symbol);
  setInterval(() => {
    updateMarketStatus(symbol);
  }, 20000);
};

export default startMarketStatusUpdater;
