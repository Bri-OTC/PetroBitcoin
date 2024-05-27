import create from "zustand";
import { toast } from "react-toastify";
import { signedFillOpenQuoteResponse } from "@pionerfriends/api-client";
import { config } from "@/config";

interface SignedFillOpenQuoteWebSocketState {
  websocket: WebSocket | null;
  initializeWebSocket: (
    token: string | null,
    handleSignedFillOpenQuote: (message: signedFillOpenQuoteResponse) => void
  ) => void;
  closeWebSocket: () => void;
}

export const useSignedFillOpenQuoteWebSocketStore =
  create<SignedFillOpenQuoteWebSocketState>((set, get) => ({
    websocket: null,
    initializeWebSocket: (token, handleSignedFillOpenQuote) => {
      if (!token || get().websocket) return;

      const wsEndpoint = `wss://${config.serverAddress}:${config.serverPort}/live_open_quote_filled?token=${token}`;
      const websocket = new WebSocket(wsEndpoint);

      websocket.onopen = () => {
        console.log("WebSocket connected");
        toast("WebSocket connected");
      };

      websocket.onerror = (error: Event) => {
        console.error("WebSocket error:", error);
      };

      websocket.onclose = () => {
        console.log("WebSocket closed");
        toast("WebSocket connection closed");
        set({ websocket: null });
        setTimeout(() => {
          get().initializeWebSocket(token, handleSignedFillOpenQuote);
        }, 3000);
      };

      websocket.onmessage = (event: MessageEvent) => {
        try {
          const message = JSON.parse(event.data) as signedFillOpenQuoteResponse;
          handleSignedFillOpenQuote(message);
        } catch (error) {
          console.error("Error parsing message as JSON:", error);
        }
      };

      set({ websocket });
    },
    closeWebSocket: () => {
      const websocket = get().websocket;
      if (websocket) {
        websocket.close();
        set({ websocket: null });
      }
    },
  }));
