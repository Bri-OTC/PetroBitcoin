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

  const quoteClientRef =
    useRef<PionerWebsocketClient<WebSocketType.LiveQuotes> | null>(null);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    if (token && token !== null && wallet) {
      console.log("Setting up WebSocket connection...");
      quoteClientRef.current = new PionerWebsocketClient(
        WebSocketType.LiveQuotes,
        (message: QuoteResponse) => {
          //console.log("Received Quote:", message);
          addQuote(message);
        },
        () => console.log("WebSocket Open"),
        () => console.log("WebSocket Closed"),
        () => console.log("WebSocket Reconnected"),
        (error: Error) => console.error("WebSocket Error:", error)
      );
      quoteClientRef.current.startWebSocket(token);
      console.log("WebSocket Started");

      // Set up an interval to log the WebSocket status every 5 seconds
      /*
      intervalId = setInterval(() => {
        if (quoteClientRef.current) {
          console.log("WebSocket status:", quoteClientRef.current);
        }
      }, 5000);*/
    } else {
      console.log("Token or wallet missing. WebSocket not started.");
    }

    return () => {
      if (quoteClientRef.current) {
        console.log("Closing WebSocket connection...");
        quoteClientRef.current.closeWebSocket();
        console.log("WebSocket Closed");
      }
      // Clear the interval when the component unmounts
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [token, addQuote, wallet]);
};

export default useQuoteWss;
