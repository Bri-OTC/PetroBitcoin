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
    console.log("Token", token);
    const response = await getSignedWrappedOpenQuotes("1.0", 64165, token, {
      onlyActive: true,
    });

    if (response && response.data) {
      const orders: Order[] = response.data.map(
        (quote: signedWrappedOpenQuoteResponse) => {
          const size = parseFloat(quote.amount);
          const trigger = parseFloat(quote.price);
          const amount = size * trigger;
          const filled = 0;
          const remainingSize = size;
          const breakEvenPrice = trigger;
          const limitPrice = quote.price;
          const status = quote.messageState === 0 ? "Open" : "Closed";
          const reduceOnly = "No";
          const fillAmount = "No";
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
