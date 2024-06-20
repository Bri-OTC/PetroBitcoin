import { useEffect, useRef } from "react";
import { toast } from "react-toastify";
import {
  PionerWebsocketClient,
  signedCloseQuoteResponse,
  WebSocketType,
} from "@pionerfriends/api-client";
import { useWalletAndProvider } from "@/components/layout/menu";

const useFillCloseQuote = (token: string | null) => {
  const { wallet, provider } = useWalletAndProvider();

  const quoteClientRef =
    useRef<PionerWebsocketClient<WebSocketType.LiveCloseQuotes> | null>(null);

  useEffect(() => {
    if (token && token !== null && wallet) {
      quoteClientRef.current =
        new PionerWebsocketClient<WebSocketType.LiveCloseQuotes>(
          WebSocketType.LiveCloseQuotes,
          (message: signedCloseQuoteResponse) => {
            console.log("Quote Message:", message);
            if (message.messageState === 3) {
              toast(
                `${message.bcontractId} : ${message.amount} filled at ${message.price}`
              );
            }
          },
          () => console.log("Quote Close"),
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

export default useFillCloseQuote;
