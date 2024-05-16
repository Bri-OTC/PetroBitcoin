import {
  signedWrappedOpenQuoteResponse,
  getSignedWrappedOpenQuotes,
} from "@pionerfriends/api-client";
import { Order } from "@/components/sections/trade/SectionOrders";

const getPositions = async (
  token: string,
  timeout: number = 3000
): Promise<Order[]> => {
  try {
    const response = await getSignedWrappedOpenQuotes(
      "1.0",
      64165,
      token,
      timeout
    );

    if (response && response.data) {
      const orders: Order[] = response.data.map(
        (quote: signedWrappedOpenQuoteResponse) => {
          const size = parseFloat(quote.amount);
          const trigger = parseFloat(quote.price);
          const amount = size * trigger;
          const filled = 0; // Assuming no filled amount initially
          const remainingSize = size;
          const breakEvenPrice = trigger; // Assuming break-even price is the same as the quote price
          const limitPrice = quote.price;
          const status = quote.messageState === 0 ? "Open" : "Closed";
          const reduceOnly = "No"; // Assuming not reduce-only by default
          const fillAmount = "No"; // Assuming not filled by default
          const entryTime = new Date(
            parseInt(quote.emitTime, 10)
          ).toISOString();

          return {
            id: quote.nonceOpenQuote,
            size,
            market: quote.assetHex,
            icon: "/$.svg", // Placeholder icon path
            trigger,
            amount,
            filled,
            remainingSize,
            breakEvenPrice,
            limitPrice,
            status,
            reduceOnly,
            fillAmount,
            entryTime,
          };
        }
      );

      return orders;
    }
  } catch (error) {
    console.error("Error fetching positions:", error);
  }

  return [];
};

export default getPositions;
