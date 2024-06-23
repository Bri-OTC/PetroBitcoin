import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import { useTradeStore } from "@/store/tradeStore";
import { useQuoteStore } from "@/store/quotePriceStore";
import { useOpenQuoteChecks } from "@/hooks/useOpenQuoteChecks";

interface Order {
  price: number;
  amount: number;
}

interface OrderBookProps {
  maxRows?: number;
  isOrderBookOn: boolean;
}

const OrderRow: React.FC<Order & { type: "ask" | "bid"; index: number }> =
  React.memo(({ price, amount, type, index }) => {
    const setEntryPrice = useTradeStore((state) => state.setEntryPrice);
    const [displayPrice, setDisplayPrice] = useState(price);
    const [displayAmount, setDisplayAmount] = useState(amount);
    const [flashClass, setFlashClass] = useState("");
    const lastUpdateTime = useRef(Date.now());

    useEffect(() => {
      const now = Date.now();
      if (
        now - lastUpdateTime.current >= 750 &&
        (price !== displayPrice || amount !== displayAmount)
      ) {
        setDisplayPrice(price);
        setDisplayAmount(amount);
        setFlashClass(type === "ask" ? "flash-red" : "flash-green");
        lastUpdateTime.current = now;
      }
    }, [price, amount, type, displayPrice, displayAmount]);

    useEffect(() => {
      if (flashClass) {
        const timer = setTimeout(() => setFlashClass(""), 500);
        return () => clearTimeout(timer);
      }
    }, [flashClass]);

    const handleClick = useCallback(
      () => setEntryPrice(displayPrice.toString()),
      [displayPrice, setEntryPrice]
    );

    return (
      <tr className={flashClass} onClick={handleClick}>
        <td className="amount">{Math.abs(displayAmount).toFixed(6)}</td>
        <td className="price">{displayPrice.toFixed(6)}</td>
      </tr>
    );
  });

const useWebSocket = (url: string, isOn: boolean) => {
  const [data, setData] = useState<{
    bids: number[][];
    asks: number[][];
  } | null>(null);

  useEffect(() => {
    if (!isOn) return;

    let ws: WebSocket | null = null;
    let timeoutId: NodeJS.Timeout | null = null;
    let retryCount = 0;

    const connect = () => {
      ws = new WebSocket(url);
      ws.onopen = () => {
        retryCount = 0;
        ws?.send(
          JSON.stringify({
            event: "bts:subscribe",
            data: { channel: `order_book_btcusd` },
          })
        );
      };
      ws.onmessage = (event) => {
        const parsedData = JSON.parse(event.data).data;
        if (parsedData && parsedData.bids && parsedData.asks) {
          setData({
            bids: parsedData.bids.map(([price, amount]: [string, string]) => [
              parseFloat(price),
              parseFloat(amount),
            ]),
            asks: parsedData.asks.map(([price, amount]: [string, string]) => [
              parseFloat(price),
              parseFloat(amount),
            ]),
          });
        }
      };
      ws.onclose = reconnect;
    };

    const reconnect = () => {
      if (ws) {
        ws.close();
        ws = null;
      }
      const delay = Math.min(Math.pow(2, retryCount++) * 1000, 30000);
      timeoutId = setTimeout(connect, delay);
    };

    connect();

    return () => {
      if (ws) ws.close();
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [url, isOn]);

  return data;
};

const generateAmount = (previousAmount: number, maxAmount: number): number => {
  if (maxAmount <= 0) return 0;

  // Generate a random deviation with high tails
  const deviation =
    Math.tan((Math.random() - 0.5) * Math.PI) * (maxAmount * 0.1);

  // Apply the deviation to the previous amount
  let newAmount = previousAmount + deviation;

  // Ensure the new amount is within bounds
  newAmount = Math.max(0, Math.min(newAmount, maxAmount));

  return newAmount;
};

export const OrderBook: React.FC<OrderBookProps> = React.memo(
  ({ maxRows = 5, isOrderBookOn }) => {
    const amount = useTradeStore((state) => state.amount);
    const entryPrice = useTradeStore((state) => state.entryPrice);
    const bidPrice = useTradeStore((state) => state.bidPrice);
    const askPrice = useTradeStore((state) => state.askPrice);
    const { bidQty, askQty } = useQuoteStore();
    const { bestBid, bestAsk, maxAmount } = useOpenQuoteChecks(
      amount,
      entryPrice
    );

    const orders = useWebSocket("wss://ws.bitstamp.net", isOrderBookOn);
    const previousAmounts = useRef<number[]>([]);

    const {
      asksToDisplay,
      bidsToDisplay,
      effectiveBidPrice,
      effectiveAskPrice,
    } = useMemo(() => {
      const effectiveBidPrice =
        bestBid && parseFloat(bestBid) !== 0 ? parseFloat(bestBid) : bidPrice;
      const effectiveAskPrice =
        bestAsk && parseFloat(bestAsk) !== 0 ? parseFloat(bestAsk) : askPrice;

      if (!effectiveBidPrice || !effectiveAskPrice) {
        return {
          asksToDisplay: [],
          bidsToDisplay: [],
          effectiveBidPrice,
          effectiveAskPrice,
        };
      }

      const effectiveMaxAmount =
        maxAmount && maxAmount > 0 ? maxAmount : Math.max(bidQty, askQty);

      let askPrices = [];
      let bidPrices = [];

      if (orders && orders.asks.length && orders.bids.length) {
        askPrices = orders.asks.map(([price]) => price);
        bidPrices = orders.bids.map(([price]) => price);
      } else {
        const spread = effectiveAskPrice - effectiveBidPrice;
        const step = spread / (maxRows * 2);
        askPrices = Array.from(
          { length: maxRows },
          (_, i) => effectiveAskPrice + step * i
        );
        bidPrices = Array.from(
          { length: maxRows },
          (_, i) => effectiveBidPrice - step * i
        ).reverse();
      }

      if (previousAmounts.current.length !== maxRows * 2) {
        previousAmounts.current = Array(maxRows * 2).fill(
          effectiveMaxAmount / (maxRows * 2)
        );
      }

      const newAmounts = previousAmounts.current.map((prevAmount) =>
        generateAmount(prevAmount, effectiveMaxAmount)
      );
      previousAmounts.current = newAmounts;

      const asksToDisplay = askPrices
        .slice(0, maxRows)
        .map((price, i) => ({
          price: parseFloat(price.toString()),
          amount: -newAmounts[i],
        }))
        .reverse();

      const bidsToDisplay = bidPrices.slice(-maxRows).map((price, i) => ({
        price: parseFloat(price.toString()),
        amount: newAmounts[i + maxRows],
      }));

      return {
        asksToDisplay,
        bidsToDisplay,
        effectiveBidPrice,
        effectiveAskPrice,
      };
    }, [
      orders,
      maxRows,
      bidPrice,
      askPrice,
      bidQty,
      askQty,
      bestBid,
      bestAsk,
      maxAmount,
    ]);

    return (
      <div className="order-container">
        <table className="order-book">
          <thead>
            <tr>
              <th className="amount">Amount</th>
              <th className="price">Price</th>
            </tr>
          </thead>
          <tbody>
            {asksToDisplay.map((order, index) => (
              <OrderRow
                key={`ask-${index}`}
                {...order}
                type="ask"
                index={index}
              />
            ))}
            <tr className="best-prices">
              <td className="bid-price">Bid: {effectiveBidPrice.toFixed(6)}</td>
              <td className="ask-price">Ask: {effectiveAskPrice.toFixed(6)}</td>
            </tr>
            {bidsToDisplay.map((order, index) => (
              <OrderRow
                key={`bid-${index}`}
                {...order}
                type="bid"
                index={index}
              />
            ))}
          </tbody>
        </table>
      </div>
    );
  }
);

OrderBook.displayName = "OrderBook";
