// useQuoteStore.ts
import { create } from "zustand";

export interface QuoteResponse {
  id: string;
  chainId: number;
  createdAt: string;
  userId: string;
  userAddress: string;
  rfqId: string;
  expiration: string;
  sMarketPrice: string;
  sPrice: string;
  sQuantity: string;
  lMarketPrice: string;
  lPrice: string;
  lQuantity: string;
  minAmount: string;
  maxAmount: string;
}

interface BestQuote {
  price: string;
  counterpartyAddress: string;
  minAmount: string;
  maxAmount: string;
}

interface QuoteStore {
  bids: QuoteResponse[];
  asks: QuoteResponse[];
  addQuote: (quote: QuoteResponse | null) => void;
  chainId: number;
  getBestQuotes: (amount: string) => {
    bestBid: BestQuote | undefined;
    bestAsk: BestQuote | undefined;
  };
}

const isQuoteValid = (quote: QuoteResponse | null | undefined) => {
  if (!quote) return false;
  if (quote.chainId !== 64165) return false;

  const currentTime = new Date().getTime();
  const quoteTime = parseInt(quote.createdAt, 10);
  const expirationTime = quoteTime + parseInt(quote.expiration, 10);

  return (
    currentTime - quoteTime <= expirationTime && currentTime < expirationTime
  );
};

export const useQuoteStore = create<QuoteStore>((set, get) => {
  let isUpdating = false;
  const refreshDelay = 500; // Refresh delay in milliseconds (500ms)

  const addQuoteWithLimit = (quote: QuoteResponse | null) => {
    if (isUpdating) return;

    isUpdating = true;

    setTimeout(() => {
      if (!quote) {
        // Remove expired quotes
        set((state) => ({
          bids: state.bids.filter(isQuoteValid),
          asks: state.asks.filter(isQuoteValid),
        }));
      } else {
        console.log("Adding quote:", quote);
        if (!isQuoteValid(quote)) return;

        set((state) => {
          const bids = [...state.bids, quote]
            .filter(isQuoteValid)
            .sort((a, b) => parseFloat(b.sPrice) - parseFloat(a.sPrice));

          const asks = [...state.asks, quote]
            .filter(isQuoteValid)
            .sort((a, b) => parseFloat(a.lPrice) - parseFloat(b.lPrice));

          return { bids, asks };
        });
      }

      isUpdating = false;
    }, refreshDelay);
  };

  return {
    bids: [],
    asks: [],
    addQuote: addQuoteWithLimit,
    chainId: 0,
    getBestQuotes: (amount: string) => {
      const { bids, asks } = get();

      const validBids = bids.filter(isQuoteValid);
      const validAsks = asks.filter(isQuoteValid);

      const bestBid = validBids.find(
        (quote) =>
          parseFloat(quote.minAmount) <= parseFloat(amount) &&
          parseFloat(quote.maxAmount) >= parseFloat(amount)
      );
      const bestAsk = validAsks.find(
        (quote) =>
          parseFloat(quote.minAmount) <= parseFloat(amount) &&
          parseFloat(quote.maxAmount) >= parseFloat(amount)
      );

      return {
        bestBid: bestBid
          ? {
              price: bestBid.sPrice,
              counterpartyAddress: bestBid.userAddress,
              minAmount: bestBid.minAmount,
              maxAmount: bestBid.maxAmount,
            }
          : undefined,
        bestAsk: bestAsk
          ? {
              price: bestAsk.lPrice,
              counterpartyAddress: bestAsk.userAddress,
              minAmount: bestAsk.minAmount,
              maxAmount: bestAsk.maxAmount,
            }
          : undefined,
      };
    },
  };
});
