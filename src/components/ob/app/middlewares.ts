// middlewares.ts
import { PayloadAction } from "@reduxjs/toolkit";
import { Middleware } from "redux";
import { batch } from "react-redux";
import { OrderMessage } from "../features/orderBook/orderBookSlice";
import { RootState } from "./store";

let deltaBatch: PayloadAction<OrderMessage>[] = [];
let timeout: ReturnType<typeof setTimeout> | null = null;

export const throttleOrderBook: Middleware = (store) => {
  const state = store.getState() as RootState;

  return (next) => (action: PayloadAction<OrderMessage> | { type: string }) => {
    if (action.type === "orderBook/delta") {
      deltaBatch.push(action as PayloadAction<OrderMessage>);
      if (!timeout) {
        const { prefersReducedMotion } = state.ui;
        timeout = setTimeout(
          () => {
            const actions = deltaBatch.splice(0, deltaBatch.length);
            batch(() => actions.forEach((action) => next(action)));
            timeout = null;
          },
          prefersReducedMotion ? 1000 : 100
        );
      }
    } else {
      return next(action);
    }
  };
};
