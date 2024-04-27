import { useRfqRequestStore } from "./quoteStore";

export const useBestQuoteAddress = (position: "long" | "short") => {
  const { bids, asks } = useRfqRequestStore();

  if (position === "long") {
    return asks[0]?.userAddress || null;
  } else if (position === "short") {
    return bids[0]?.userAddress || null;
  }

  return null;
};

/*
ex :
  const bestLongAddress = useBestQuoteAddress("long");
  const bestShortAddress = useBestQuoteAddress("short");
  */
