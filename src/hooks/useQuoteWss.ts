import { useEffect, useRef } from "react";
import { toast } from "react-toastify";
import {
  PionerWebsocketClient,
  QuoteResponse,
  WebSocketType,
} from "@pionerfriends/api-client";
import { useWalletAndProvider } from "@/components/layout/menu";
import useBlurEffect from "@/hooks/blur";

const useQuoteWss = (
  token: string | null,
  addQuote: (message: QuoteResponse) => void
) => {
  const { wallet, provider } = useWalletAndProvider();
  const blur = useBlurEffect();

  const quoteClientRef =
    useRef<PionerWebsocketClient<WebSocketType.LiveQuotes> | null>(null);

  useEffect(() => {
    if (token && token !== null && !wallet) {
      quoteClientRef.current =
        new PionerWebsocketClient<WebSocketType.LiveQuotes>(
          WebSocketType.LiveQuotes,
          (message: QuoteResponse) => {
            console.log("Quote Message:", message);
            addQuote(message);
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
  }, [token, addQuote]);
};

export default useQuoteWss;
