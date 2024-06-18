import React, { useState, useEffect, useMemo, useRef } from "react";
import { useTradeStore } from "@/store/tradeStore";
import { useQuoteStore } from "@/store/quoteStore";

interface Order {
  price: number | null;
  amount: number | null;
}

const OrderRowAsk: React.FC<Order> = ({ price, amount }) => {
  const [flashClass, setFlashClass] = useState("");
  const setEntryPrice = useTradeStore((state) => state.setEntryPrice);

  useEffect(() => {
    if (amount !== null) {
      setFlashClass("flash-red");
      const timer = setTimeout(() => setFlashClass(""), 500);
      return () => clearTimeout(timer);
    }
  }, [price, amount]);

  if (price === null || amount === null) {
    return null;
  }

  const handleClick = () => {
    if (price !== null) {
      setEntryPrice(String(price));
    }
  };

  return (
    <tr className={flashClass} onClick={handleClick}>
      <td className="amount">{Math.abs(amount).toFixed(6)}</td>
      <td className="price">{price.toFixed(6)}</td>
    </tr>
  );
};

const OrderRowBid: React.FC<Order> = ({ price, amount }) => {
  const [flashClass, setFlashClass] = useState("");
  const setEntryPrice = useTradeStore((state) => state.setEntryPrice);

  useEffect(() => {
    if (amount !== null) {
      setFlashClass("flash-green");
      const timer = setTimeout(() => setFlashClass(""), 500);
      return () => clearTimeout(timer);
    }
  }, [price, amount]);

  if (price === null || amount === null) {
    return null;
  }

  const handleClick = () => {
    if (price !== null) {
      setEntryPrice(String(price));
    }
  };

  return (
    <tr className={flashClass} onClick={handleClick}>
      <td className="amount">{Math.abs(amount).toFixed(7)}</td>
      <td className="price">{price.toFixed(7)}</td>
    </tr>
  );
};

interface OrderBookProps {
  maxRows?: number;
  isOrderBookOn: boolean;
}

const OrderBook: React.FC<OrderBookProps> = ({
  maxRows = 5,
  isOrderBookOn,
}) => {
  const [orders, setOrders] = useState<{ bids: number[][]; asks: number[][] }>({
    bids: [],
    asks: [],
  });

  const bidPrice = useTradeStore((state) => state.bidPrice);
  const askPrice = useTradeStore((state) => state.askPrice);
  const { bidQty, askQty } = useQuoteStore();

  const lastOrdersRef = useRef<{ bids: number[][]; asks: number[][] }>({
    bids: [],
    asks: [],
  });

  useEffect(() => {
    if (!isOrderBookOn) return;

    const subscribe = {
      event: "bts:subscribe",
      data: { channel: `order_book_btcusd` },
    };

    const ws = new WebSocket("wss://ws.bitstamp.net"); // wss://www.cryptofacilities.com/ws/v1 // wss://ws.bitstamp.net
    ws.onopen = () => ws.send(JSON.stringify(subscribe));
    ws.onmessage = (event) => setOrders(JSON.parse(event.data).data);
    ws.onclose = () => ws.close();

    return () => ws.close();
  }, [isOrderBookOn]);

  useEffect(() => {
    if (isOrderBookOn) {
      lastOrdersRef.current = orders;
    }
  }, [isOrderBookOn, orders]);

  const ordersToUse = isOrderBookOn ? orders : lastOrdersRef.current;

  const { asksToDisplay, bidsToDisplay } = useMemo(() => {
    if (
      !bidPrice ||
      !askPrice ||
      !bidQty ||
      !askQty ||
      !ordersToUse.asks ||
      !ordersToUse.bids
    )
      return { asksToDisplay: [], bidsToDisplay: [] };

    const spread = askPrice - bidPrice;
    const askPrices = ordersToUse.asks.map(([price]) => price);
    const bidPrices = ordersToUse.bids.map(([price]) => price);

    const totalAskQty = ordersToUse.asks.reduce(
      (sum, [_, qty]) => sum + qty,
      0
    );
    const totalBidQty = ordersToUse.bids.reduce(
      (sum, [_, qty]) => sum + qty,
      0
    );

    const asks = askPrices
      .slice(0, maxRows)
      .map((price, i) => {
        const amount =
          totalAskQty > 0 ? (ordersToUse.asks[i][1] / totalAskQty) * askQty : 0;
        const newPrice =
          askPrice +
          (price - askPrices[0]) *
            (spread / (askPrices[0] - bidPrices[bidPrices.length - 1]));
        return { price: newPrice, amount: -amount };
      })
      .reverse();

    const bids = bidPrices.slice(-maxRows).map((price, i) => {
      const amount =
        totalBidQty > 0
          ? (ordersToUse.bids[ordersToUse.bids.length - maxRows + i][1] /
              totalBidQty) *
            bidQty
          : 0;
      const newPrice =
        bidPrice -
        (bidPrices[bidPrices.length - 1] - price) *
          (spread / (askPrices[0] - bidPrices[bidPrices.length - 1]));
      return { price: newPrice, amount };
    });

    return {
      asksToDisplay: asks,
      bidsToDisplay: bids,
    };
  }, [ordersToUse, maxRows, bidPrice, askPrice, bidQty, askQty]);

  useEffect(() => {
    if (!isOrderBookOn) return;

    let ws: WebSocket | null = null;
    let timeoutId: NodeJS.Timeout | null = null;
    let retryCount = 0;

    const connect = () => {
      const subscribe = {
        event: "bts:subscribe",
        data: { channel: `order_book_btcusd` },
      };

      ws = new WebSocket("wss://ws.bitstamp.net");
      ws.onopen = () => {
        retryCount = 0; // Reset retry count on successful connection
        if (ws) {
          ws.send(JSON.stringify(subscribe));
        }
      };
      ws.onmessage = (event) => {
        setOrders(JSON.parse(event.data).data);
      };
      ws.onclose = () => {
        reconnect();
      };
    };

    const reconnect = () => {
      if (ws) {
        ws.close();
        ws = null;
      }

      // Exponential backoff delay
      const delay = Math.min(Math.pow(2, retryCount) * 1000, 30000);
      retryCount++;

      timeoutId = setTimeout(connect, delay);
    };

    connect();

    return () => {
      if (ws) {
        ws.close();
        ws = null;
      }
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isOrderBookOn]);

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
          {asksToDisplay.map(({ price, amount }, index) => (
            <OrderRowAsk
              key={`${price}-${amount}-${index}`}
              price={price}
              amount={amount}
            />
          ))}
          <tr className="best-prices">
            <td className="bid-price">Bid: {bidPrice.toFixed(6)}</td>
            <td className="ask-price">Ask: {askPrice.toFixed(6)}</td>
          </tr>
          {bidsToDisplay.map(({ price, amount }, index) => (
            <OrderRowBid
              key={`${price}-${amount}-${index}`}
              price={price}
              amount={amount}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export { OrderBook };
