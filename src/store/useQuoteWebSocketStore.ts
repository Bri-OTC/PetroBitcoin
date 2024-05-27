import create from "zustand";
import { QuoteResponse } from "@pionerfriends/api-client";
import { config } from "@/config";

interface QuoteWebSocketState {
  websocket: WebSocket | null;
  initializeWebSocket: (
    token: string | null,
    addQuote: (message: QuoteResponse) => void
  ) => void;
  closeWebSocket: () => void;
}

export const useQuoteWebSocketStore = create<QuoteWebSocketState>(
  (set, get) => ({
    websocket: null,
    initializeWebSocket: (token, addQuote) => {
      if (!token || get().websocket) return;

      const wsEndpoint = `wss://${config.serverAddress}:${config.serverPort}/live_quotes?token=${token}`;
      const websocket = new WebSocket(wsEndpoint);

      websocket.onopen = () => {
        console.log("WebSocket connected");
      };

      websocket.onerror = (error: Event) => {
        console.error("WebSocket error:", error);
      };

      websocket.onclose = () => {
        console.log("WebSocket closed");
        set({ websocket: null });
        setTimeout(() => {
          get().initializeWebSocket(token, addQuote);
        }, 3000);
      };

      websocket.onmessage = (event: MessageEvent) => {
        try {
          const message = JSON.parse(event.data) as QuoteResponse;
          addQuote(message);
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
  })
);
