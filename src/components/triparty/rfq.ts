import {
  sendRfq,
  RfqWebsocketClient,
  RfqResponse,
  getPayloadAndLogin,
  QuoteWebsocketClient,
  QuoteResponse,
  RfqRequest,
  getPrices,
} from "@pionerfriends/api-client";
import { useAuthStore } from "@/store/authStore";
import { adjustQuantities, getPairConfig } from "./configRead";
import { useTradeStore } from "@/store/tradeStore";

export async function getRfq() {
  const token = useAuthStore((state) => state.token);
  const bidPrice = useTradeStore((state) => state.bidPrice);
  const askPrice = useTradeStore((state) => state.askPrice);
  const symbol = useTradeStore((state) => state.symbol);

  if (token === null) {
    return;
  }

  const websocketClient = new QuoteWebsocketClient(
    (message: QuoteResponse) => {},
    (error) => {
      console.error("WebSocket error:", error);
    }
  );
  await websocketClient.startWebSocket(token);
}
