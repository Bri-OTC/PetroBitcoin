import { useEffect } from "react";
import { toast } from "react-toastify";
import {
  PionerWebsocketClient,
  signedWrappedOpenQuoteResponse,
  WebSocketType,
} from "@pionerfriends/api-client";
import { json } from "stream/consumers";
import { convertFromBytes32 } from "@/components/web3/utils";

const useFillOpenQuote = (token: string | null) => {
  let quoteClient = null;

  useEffect(() => {
    if (token) {
      quoteClient = new PionerWebsocketClient(
        WebSocketType.LiveWrappedOpenQuotes,
        (message) => {
          console.log("Quote Message:", message);
          if (message.messageState === 6) {
            toast(
              ` ${convertFromBytes32(message.assetHex)}  : ${
                message.amount
              } filled at ${message.price}`
            );
          }
        },
        () => console.log("Quote Open"),
        () => console.log("Quote Closed"),
        () => console.log("Quote Reconnected"),
        (error) => console.error("Quote Error:", error)
      );
      quoteClient.startWebSocket(token);
      toast("Quote Websocket Started");
    }
  }, [token]);
};

export default useFillOpenQuote;
