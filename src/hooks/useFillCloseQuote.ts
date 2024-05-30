import { useEffect } from "react";
import { toast } from "react-toastify";
import {
  PionerWebsocketClient,
  signedCloseQuoteResponse,
  WebSocketType,
} from "@pionerfriends/api-client";
import { json } from "stream/consumers";

const useFillCloseQuote = (token: string | null) => {
  let quoteClient = null;

  useEffect(() => {
    if (token) {
      quoteClient = new PionerWebsocketClient(
        WebSocketType.LiveCloseQuotes,
        (message) => {
          console.log("Quote Message:", message);
          if (message.messageState === 3) {
            toast(
              ` ${message.bcontractId}  : ${message.amount} filled at ${message.price}`
            );
          }
        },
        () => console.log("Quote Close"),
        () => console.log("Quote Closed"),
        () => console.log("Quote Reconnected"),
        (error) => console.error("Quote Error:", error)
      );
      quoteClient.startWebSocket(token);
      toast("Quote Websocket Started");
    }
  }, [token]);
};

export default useFillCloseQuote;
