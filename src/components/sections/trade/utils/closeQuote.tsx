import { sendSignedCloseQuote } from "@pionerfriends/api-client";
import { useAuthStore } from "@/store/authStore";
import { useWalletAndProvider } from "@/components/layout/menu";
import { parseUnits } from "viem";
import { networks } from "@pionerfriends/blockchain-client";

export interface SignedCloseQuoteRequest {
  issuerAddress: string;
  counterpartyAddress: string;
  version: string;
  chainId: number;
  verifyingContract: string;
  bcontractId: number;
  price: string;
  amount: string;
  limitOrStop: number;
  expiry: string;
  authorized: string;
  nonce: number;
  signatureClose: string;
  emitTime: string;
  messageState: number;
}
