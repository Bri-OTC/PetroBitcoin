import { useEffect } from "react";
import { toast } from "react-toastify";
import { signedFillOpenQuoteResponse } from "@pionerfriends/api-client";
import { useSignedFillOpenQuoteWebSocketStore } from "@/store/useSignedFillOpenQuoteWebSocketStore";

const useSignedFillOpenQuoteToastify = (token: string | null) => {
  const initializeWebSocket = useSignedFillOpenQuoteWebSocketStore(
    (state) => state.initializeWebSocket
  );
  const closeWebSocket = useSignedFillOpenQuoteWebSocketStore(
    (state) => state.closeWebSocket
  );

  const handleSignedFillOpenQuote = (message: signedFillOpenQuoteResponse) => {
    toast(`Trade Filled: ${message.quoteId}`);
  };

  useEffect(() => {
    if (token) {
      initializeWebSocket(token, handleSignedFillOpenQuote);
    }
    return () => {
      closeWebSocket();
    };
  }, [token]);

  return null;
};

export default useSignedFillOpenQuoteToastify;
