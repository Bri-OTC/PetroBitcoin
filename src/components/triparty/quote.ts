import { useEffect } from "react";
import { QuoteWebsocketClient } from "@pionerfriends/api-client";
import { useRfqRequestStore, QuoteResponse } from "./quoteStore";

const QuoteWss: React.FC = () => {
  const { addQuote } = useRfqRequestStore();

  useEffect(() => {
    const websocketClient = new QuoteWebsocketClient(
      (message: QuoteResponse) => {
        addQuote(message);
      },
      (error) => {
        console.error("WebSocket error:", error);
      }
    );

    return () => {
      websocketClient.closeWebSocket();
    };
  }, [addQuote]);

  return null;
};

export default QuoteWss;
