import { useEffect } from "react";
import { toast } from "react-toastify";
import {
  PionerWebsocketClient,
  QuoteResponse,
  WebSocketType,
} from "@pionerfriends/api-client";

const useQuoteWss = (
  token: string | null,
  addQuote: (message: QuoteResponse) => void
) => {
  let quoteClient = null;
  useEffect(() => {
    if (token) {
      quoteClient = new PionerWebsocketClient(
        WebSocketType.LiveQuotes,
        (message) => {
          console.log("Quote Message:", message), addQuote(message);
        },
        () => console.log("Quote Open"),
        () => console.log("Quote Closed"),
        () => console.log("Quote Reconnected"),
        (error) => console.error("Quote Error:", error)
      );

      quoteClient.startWebSocket(token);
      toast("Quote Websocket Started");
    }
  }, [token, addQuote]);
};

export default useQuoteWss;
