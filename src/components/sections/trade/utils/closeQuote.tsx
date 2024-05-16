import { useAuthStore } from "@/store/authStore";
import { useWalletAndProvider } from "@/components/layout/menu";
import { networks } from "@pionerfriends/blockchain-client";
import React, { useEffect, useState } from "react";
import { useTradeStore } from "@/store/tradeStore";
import { useRfqRequestStore } from "@/store/rfqStore";
import { PionerV1Wrapper } from "@pionerfriends/blockchain-client";

import { useWallets } from "@privy-io/react-auth";
import { Address, bytesToHex, parseUnits, toBytes } from "viem";
import {
  sendSignedWrappedOpenQuote,
  SignedWrappedOpenQuoteRequest,
  sendSignedCloseQuote,
  SignedCloseQuoteRequest,
} from "@pionerfriends/api-client";
import { Button } from "@/components/ui/button";

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

interface CloseQuoteButtonProps {
  request: SignedCloseQuoteRequest;
}

const CloseQuoteButton: React.FC<CloseQuoteButtonProps> = ({ request }) => {
  const [loading, setLoading] = useState(false);
  const walletClient = useAuthStore((state) => state.walletClient);
  const wallet = useAuthStore((state) => state.wallet);
  const token = useAuthStore((state) => state.token);
  const symbol: string = useTradeStore((state) => state.symbol);
  const updateRfqRequest = useRfqRequestStore(
    (state) => state.updateRfqRequest
  );

  let ethersProvider = wallet.getEthersProvider();
  const takeProfit: string = useTradeStore((state) => state.takeProfit);

  const handleCloseQuote = async () => {
    if (!wallet || !wallet.address || !token || !walletClient) {
      console.error(
        "Wallet, wallet address, token, or walletClient is missing"
      );
      return;
    }

    setLoading(true);

    const domainClose = {
      name: "PionerV1Close",
      version: "1.0",
      chainId: 64165,
      verifyingContract: networks.sonic.contracts
        .pionerV1Close as `0x${string}`,
    };

    const OpenCloseQuoteType = {
      OpenCloseQuote: [
        { name: "bContractId", type: "uint256" },
        { name: "price", type: "uint256" },
        { name: "amount", type: "uint256" },
        { name: "limitOrStop", type: "uint256" },
        { name: "expiry", type: "uint256" },
        { name: "authorized", type: "address" },
        { name: "nonce", type: "uint256" },
      ],
    };

    const openCloseQuoteValue = {
      bContractId: request.bcontractId,
      price: parseUnits(takeProfit, 18).toString(),
      amount: request.amount,
      limitOrStop: parseUnits(takeProfit, 18).toString(),
      expiry: 17139884340000,
      authorized: request.counterpartyAddress,
      nonce: 0,
    };

    const signatureClose = await ethersProvider._signTypedData(
      domainClose,
      OpenCloseQuoteType,
      openCloseQuoteValue
    );

    const closeQuote: SignedCloseQuoteRequest = {
      issuerAddress: request.issuerAddress,
      counterpartyAddress: request.counterpartyAddress,
      version: request.version,
      chainId: request.chainId,
      verifyingContract: networks.sonic.contracts.pionerV1Close,
      bcontractId: request.bcontractId,
      price: parseUnits(takeProfit, 18).toString(),
      amount: request.amount,
      limitOrStop: Number(parseUnits(takeProfit, 18)),
      expiry: String(17139884340000),
      authorized: request.counterpartyAddress,
      nonce: 0,
      signatureClose: signatureClose,
      emitTime: request.emitTime,
      messageState: 0,
    };

    await sendSignedCloseQuote(closeQuote, token);

    setLoading(false);
  };

  return (
    <Button className="w-full" onClick={handleCloseQuote} disabled={loading}>
      {loading ? "Loading..." : "Close Quote"}
    </Button>
  );
};

export default CloseQuoteButton;
