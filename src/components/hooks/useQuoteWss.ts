import { useEffect } from "react";
import { QuoteResponse } from "@pionerfriends/api-client";
import { useQuoteWebSocketStore } from "@/store/useQuoteWebSocketStore";

const useQuoteWss = (
  token: string | null,
  addQuote: (message: QuoteResponse) => void
) => {
  const initializeWebSocket = useQuoteWebSocketStore(
    (state) => state.initializeWebSocket
  );
  const closeWebSocket = useQuoteWebSocketStore(
    (state) => state.closeWebSocket
  );

  useEffect(() => {
    if (token) {
      initializeWebSocket(token, addQuote);
    }
    return () => {
      closeWebSocket();
    };
  }, [token, addQuote]);
};

export default useQuoteWss;
