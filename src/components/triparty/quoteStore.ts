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
}

interface BestQuote {
  price: string;
  counterpartyAddress: string;
}

interface QuoteStore {
  bids: QuoteResponse[];
  asks: QuoteResponse[];
  addQuote: (quote: QuoteResponse) => void;
  chainId: number;
  getBestQuotes: () => {
    bestBid: BestQuote | undefined;
    bestAsk: BestQuote | undefined;
  };
}

const isQuoteValid = (quote: QuoteResponse) => {
  const currentTime = new Date().getTime();
  const quoteTime = new Date(quote.createdAt).getTime();
  const expirationTime = new Date(quote.expiration).getTime();
  // todo add chainId check
  return currentTime - quoteTime <= 5000 && currentTime < expirationTime;
};

export const useQuoteStore = create<QuoteStore>((set, get) => ({
  bids: [],
  asks: [],
  addQuote: (quote: QuoteResponse) => {
    console.log("adding quote", quote);
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
  },
  chainId: 0,
  getBestQuotes: () => {
    const { bids, asks } = get();

    const validBids = bids.filter(isQuoteValid);
    const validAsks = asks.filter(isQuoteValid);

    const bestBid: BestQuote | undefined =
      validBids.length > 0
        ? {
            price: validBids[0].sPrice,
            counterpartyAddress: validBids[0].userAddress,
          }
        : undefined;

    const bestAsk: BestQuote | undefined =
      validAsks.length > 0
        ? {
            price: validAsks[0].lPrice,
            counterpartyAddress: validAsks[0].userAddress,
          }
        : undefined;

    return { bestBid, bestAsk };
  },
}));
