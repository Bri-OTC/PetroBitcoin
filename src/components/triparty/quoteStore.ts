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
  addQuote: (quote: QuoteResponse) => void;
  chainId: number;
  getBestQuotes: (amount: string) => {
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

const findBestQuote = (
  quotes: QuoteResponse[],
  amount: string
): BestQuote | undefined => {
  const validQuotes = quotes.filter(
    (quote) =>
      isQuoteValid(quote) &&
      parseFloat(quote.minAmount) <= parseFloat(amount) &&
      parseFloat(quote.maxAmount) >= parseFloat(amount)
  );

  if (validQuotes.length === 0) {
    return undefined;
  }

  const bestQuote = validQuotes[0];
  return {
    price: bestQuote.sPrice,
    counterpartyAddress: bestQuote.userAddress,
    minAmount: bestQuote.minAmount,
    maxAmount: bestQuote.maxAmount,
  };
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
  getBestQuotes: (amount: string) => {
    const { bids, asks } = get();

    const bestBid = findBestQuote(bids, amount);
    const bestAsk = findBestQuote(asks, amount);

    return { bestBid, bestAsk };
  },
}));
