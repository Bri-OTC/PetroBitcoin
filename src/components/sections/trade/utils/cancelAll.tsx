import { Order } from "../SectionOrders";
import {
  SignedCancelOpenQuoteRequest,
  sendSignedCancelOpenQuote,
} from "@pionerfriends/api-client";

interface CancelAllProps {
  orders: Order[];
}

async function cancelAllOrders(orders: Order[], token: string) {
  const cancelPromises = orders.map((order) => {
    const cancelRequest: SignedCancelOpenQuoteRequest = {};

    return sendSignedCancelOpenQuote(cancelRequest, token);
  });

  try {
    await Promise.all(cancelPromises);
    console.log("All orders canceled successfully");
  } catch (error) {
    console.error("Error canceling orders:", error);
  }
}

function CancelAll({ orders }: CancelAllProps) {
  const token = "YOUR_TOKEN_HERE";

  const handleCancelAll = () => {
    cancelAllOrders(orders, token);
  };

  return <button onClick={handleCancelAll}>Cancel All</button>;
}

export default CancelAll;
