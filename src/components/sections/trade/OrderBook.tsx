import React, { useState, useEffect, useMemo } from "react";
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
}

const OrderBook: React.FC<OrderBookProps> = ({ maxRows = 5 }) => {
  const [orders, setOrders] = useState<{ bids: number[][]; asks: number[][] }>({
    bids: [],
    asks: [],
  });

  const bidPrice = useTradeStore((state) => state.bidPrice);
  const askPrice = useTradeStore((state) => state.askPrice);
  const { bidQty, askQty } = useQuoteStore();

  useEffect(() => {
    const subscribe = {
      event: "bts:subscribe",
      data: { channel: `order_book_btcusd` },
    };

    const ws = new WebSocket("wss://ws.bitstamp.net");
    ws.onopen = () => ws.send(JSON.stringify(subscribe));
    ws.onmessage = (event) => setOrders(JSON.parse(event.data).data);
    ws.onclose = () => ws.close();
    return () => ws.close();
  }, []);

  const { asksToDisplay, bidsToDisplay } = useMemo(() => {
    if (
      !bidPrice ||
      !askPrice ||
      !bidQty ||
      !askQty ||
      !orders.asks ||
      !orders.bids
    )
      return { asksToDisplay: [], bidsToDisplay: [] };

    const spread = askPrice - bidPrice;
    const askPrices = orders.asks.map(([price]) => price);
    const bidPrices = orders.bids.map(([price]) => price);

    const totalAskQty = orders.asks.reduce((sum, [_, qty]) => sum + qty, 0);
    const totalBidQty = orders.bids.reduce((sum, [_, qty]) => sum + qty, 0);

    const asks = askPrices
      .slice(0, maxRows)
      .map((price, i) => {
        const amount =
          totalAskQty > 0 ? (orders.asks[i][1] / totalAskQty) * askQty : 0;
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
          ? (orders.bids[orders.bids.length - maxRows + i][1] / totalBidQty) *
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
  }, [orders, maxRows, bidPrice, askPrice, bidQty, askQty]);

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
