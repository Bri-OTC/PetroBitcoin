import React, { useState, useEffect, useMemo } from "react";
import "./OrderBook.css";
import { useTradeStore } from "@/store/tradeStore";

interface Order {
  price: number | null;
  amount: number | null;
}

function isMarketOpen() {}

const OrderRowAsk: React.FC<Order> = ({ price, amount }) => {
  const [flashClass, setFlashClass] = useState("");
  const setEntryPrice = useTradeStore((state) => state.setEntryPrice);
  const bidPrice = useTradeStore((state) => state.bidPrice);
  const askPrice = useTradeStore((state) => state.askPrice);

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
      <td className="amount">{Math.abs(amount)}</td>
      <td className="price">{price}</td>
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
      <td className="amount">{Math.abs(amount)}</td>
      <td className="price">{price}</td>
    </tr>
  );
};
interface OrderBookProps {
  currencyPair?: string;
  maxRows?: number;
}

const OrderBook: React.FC<OrderBookProps> = ({
  currencyPair = "btcusd",
  maxRows = 5,
}) => {
  const [orders, setOrders] = useState<{ bids: number[][]; asks: number[][] }>({
    bids: [],
    asks: [],
  });
  const [currencyBase, currencyQuote] = currencyPair
    .toUpperCase()
    .match(/.{1,3}/g) || ["", ""];

  useEffect(() => {
    const subscribe = {
      event: "bts:subscribe",
      data: { channel: `order_book_${currencyPair}` },
    };

    const ws = new WebSocket("wss://ws.bitstamp.net");
    ws.onopen = () => ws.send(JSON.stringify(subscribe));
    ws.onmessage = (event) => setOrders(JSON.parse(event.data).data);
    ws.onclose = () => ws.close();
    return () => ws.close();
  }, [currencyPair]);

  const { asksToDisplay, bidsToDisplay } = useMemo(() => {
    const asks = (orders.asks || [])
      .slice(0, maxRows)
      .map(([price, amount]) => ({ price, amount: -amount }))
      .reverse();

    const bids = (orders.bids || [])
      .slice(0, maxRows)
      .map(([price, amount]) => ({ price, amount }));

    return {
      asksToDisplay: asks,
      bidsToDisplay: bids,
    };
  }, [orders, maxRows]);

  const bestBid = orders.bids?.[0]?.[0] || "-";
  const bestAsk = orders.asks?.[0]?.[0] || "-";

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
            <td colSpan={2}>
              Bid: {bestBid} | Ask: {bestAsk}
            </td>
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
