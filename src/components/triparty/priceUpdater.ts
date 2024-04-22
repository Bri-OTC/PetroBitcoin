// activePrice.ts
import { useTradeStore } from "@/store/tradeStore";
import { useAuthStore } from "@/store/authStore";
import { getPrices } from "@pionerfriends/api-client";

export async function activePrice() {
  const currentTabIndex = useTradeStore((state) => state.currentTabIndex);
  const currentMethod = useTradeStore((state) => state.currentMethod);
  const token = useAuthStore().token;
  const symbol = useTradeStore((state) => state.symbol);
  const setBidPrice = useTradeStore((state) => state.setBidPrice);
  const setAskPrice = useTradeStore((state) => state.setAskPrice);

  const [symbol1, symbol2] = formatSymbols(symbol);

  if (token !== null) {
    const response = await getPrices([symbol1, symbol2], token);

    if (response) {
      const bidSymbol1 = parseFloat(response[symbol1].bidPrice);
      const bidSymbol2 = parseFloat(response[symbol2].bidPrice);
      const askSymbol1 = parseFloat(response[symbol1].askPrice);
      const askSymbol2 = parseFloat(response[symbol2].askPrice);

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
}

export function formatSymbols(symbol: string): [string, string] {
  const [symbol1, symbol2] = symbol.split("/");
  return [addPrefix(symbol1), addPrefix(symbol2)];
}

function addPrefix(symbol: string): string {
  if (symbol.startsWith("forex.")) {
    return `forex.${symbol}`;
  } else if (
    symbol.startsWith("stock.nyse.") ||
    symbol.startsWith("stock.nasdaq.")
  ) {
    return symbol.split(".").slice(-1)[0];
  } else {
    return symbol;
  }
}

let interval: NodeJS.Timeout | null = null;

export function startPriceUpdater() {
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
