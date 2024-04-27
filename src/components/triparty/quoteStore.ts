import create from "zustand";

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

interface RfqStore {
  bids: QuoteResponse[];
  asks: QuoteResponse[];
  addQuote: (quote: QuoteResponse) => void;
}

const isQuoteValid = (quote: QuoteResponse) => {
  const currentTime = new Date().getTime();
  const quoteTime = new Date(quote.createdAt).getTime();
  const expirationTime = new Date(quote.expiration).getTime();
  return currentTime - quoteTime <= 5000 && currentTime < expirationTime;
};

export const useRfqRequestStore = create<RfqStore>((set) => ({
  bids: [],
  asks: [],
  addQuote: (quote: QuoteResponse) => {
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
}));
