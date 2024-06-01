import SectionPositions from "../SectionPositions";
import SectionOrders from "../SectionOrders";
import { Order } from "../SectionOrders";
import { Position } from "../SectionPositions";
import {
  signedWrappedOpenQuoteResponse,
  getSignedWrappedOpenQuotes,
  getSignedCloseQuotes,
  signedCloseQuoteResponse,
} from "@pionerfriends/api-client";
import { convertFromBytes32 } from "@/components/web3/utils";

export const getPositions = () => {
  const positions = [
    {
      id: 0,
      size: -0.0048,
      market: "BTC-PERP",
      icon: "/$.svg",
      mark: 45000,
      entryPrice: 312.89,
      pnl: -0.03,
      amount: 233.212,
      type: "Stop Market",
      estLiq: 54427.07,
      entryTime: "1",
    },
  ];
  return positions;
};
