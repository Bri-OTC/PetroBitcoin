import { useEffect, useRef } from "react";
import { toast } from "react-toastify";
import {
  PionerWebsocketClient,
  signedWrappedOpenQuoteResponse,
  WebSocketType,
} from "@pionerfriends/api-client";
import { convertFromBytes32 } from "@/components/web3/utils";
import { useWalletAndProvider } from "@/components/layout/menu";

const useFillOpenQuote = (token: string | null) => {
  const { wallet, provider } = useWalletAndProvider();

  const quoteClientRef =
    useRef<PionerWebsocketClient<WebSocketType.LiveWrappedOpenQuotes> | null>(
      null
    );

  useEffect(() => {
    if (token && token !== null && wallet) {
      quoteClientRef.current =
        new PionerWebsocketClient<WebSocketType.LiveWrappedOpenQuotes>(
          WebSocketType.LiveWrappedOpenQuotes,
          (message: signedWrappedOpenQuoteResponse) => {
            //console.log("Quote Message:", message);
            if (message.messageState === 6) {
              toast(
                `${convertFromBytes32(message.assetHex)} : ${
                  message.amount
                } filled at ${message.price}`
              );
            }
          },
          () => console.log("Quote Open"),
          () => console.log("Quote Closed"),
          () => console.log("Quote Reconnected"),
          (error: Error) => console.error("Quote Error:", error)
        );
      quoteClientRef.current.startWebSocket(token);
      toast("Quote Websocket Started");
    }

    return () => {
      if (quoteClientRef.current) {
        quoteClientRef.current.closeWebSocket();
      }
    };
  }, [token]);
};

export default useFillOpenQuote;
