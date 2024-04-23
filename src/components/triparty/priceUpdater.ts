// activePrice.ts
import { useTradeStore } from "@/store/tradeStore";
import { useAuthStore } from "@/store/authStore";
import { getPrices } from "@pionerfriends/api-client";
import { getPrefixedName } from "./configReader";

export function useActivePrice() {
  const currentTabIndex = useTradeStore((state) => state.currentTabIndex);
  const currentMethod = useTradeStore((state) => state.currentMethod);
  const token = useAuthStore().token;
  const symbol = useTradeStore((state) => state.symbol);
  const setBidPrice = useTradeStore((state) => state.setBidPrice);
  const setAskPrice = useTradeStore((state) => state.setAskPrice);

  const activePrice = async () => {
    const [symbol1, symbol2] = formatSymbols(symbol);

    if (token !== null) {
      const response = await getPrices([symbol1, symbol2], token);
      if (response && response.data) {
        const { data } = response;
        const bidSymbol1 = parseFloat(data[symbol1]?.bidPrice || "0");
        const bidSymbol2 = parseFloat(data[symbol2]?.bidPrice || "0");
        const askSymbol1 = parseFloat(data[symbol1]?.askPrice || "0");
        const askSymbol2 = parseFloat(data[symbol2]?.askPrice || "0");

        const calculatedBidPrice = bidSymbol1 / bidSymbol2;
        const calculatedAskPrice = askSymbol1 / askSymbol2;

        if (currentTabIndex === "Market") {
          const spread = 0.0005; // 0.05% spread
          if (currentMethod === "Buy") {
            setBidPrice(calculatedAskPrice * (1 + spread));
          } else {
            setAskPrice(calculatedBidPrice * (1 - spread));
          }
        } else {
          setBidPrice(calculatedBidPrice);
          setAskPrice(calculatedAskPrice);
        }
      }
    }
  };

  return activePrice;
}

export function formatSymbols(symbol: string): [string, string] {
  let [symbol1, symbol2] = symbol.split("/");
  symbol1 = getPrefixedName(symbol1) || symbol1;
  symbol2 = getPrefixedName(symbol2) || symbol2;
  console.log(symbol1, symbol2, "symbol");
  return [symbol1, symbol2];
}

let interval: NodeJS.Timeout | null = null;

export function startPriceUpdater() {
  const activePrice = useActivePrice();
  if (!interval) {
    interval = setInterval(activePrice, 200);
  }
}

export function stopPriceUpdater() {
  if (interval) {
    clearInterval(interval);
    interval = null;
  }
}
