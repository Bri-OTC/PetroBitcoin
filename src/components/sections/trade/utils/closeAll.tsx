import { useAuthStore } from "@/store/authStore";
import { useWalletAndProvider } from "@/components/layout/menu";
import { networks } from "@pionerfriends/blockchain-client";

import React, { useEffect, useState } from "react";
import { useTradeStore } from "@/store/tradeStore";
import { useRfqRequestStore } from "@/store/rfqStore";
import { PionerV1Wrapper } from "@pionerfriends/blockchain-client";
import {
  accounts,
  pionerV1OpenContract,
  pionerV1WrapperContract,
  wallets,
  web3Client,
} from "./init";
import { useWallets } from "@privy-io/react-auth";
import { Address, bytesToHex, parseUnits, toBytes } from "viem";
import {
  sendSignedWrappedOpenQuote,
  SignedWrappedOpenQuoteRequest,
  sendSignedCloseQuote,
  SignedCloseQuoteRequest,
} from "@pionerfriends/api-client";
import { Button } from "@/components/ui/button";
import { JsonRpcSigner } from "ethers";

interface Order {
  id: string;
  price: string;
  amount: string;
  limitOrStop: string;
  expiry: number;
  authorized: string;
  nonce: number;
}

interface OpenQuoteButtonProps {
  orders: Order[];
}

const OpenQuoteButton: React.FC<OpenQuoteButtonProps> = ({ orders }) => {
  const [loading, setLoading] = useState(false);
  const walletClient = useAuthStore((state) => state.walletClient);
  const wallet = useAuthStore((state) => state.wallet);
  const token = useAuthStore((state) => state.token);

  const setWallet = useAuthStore((state) => state.setWallet);

  const { wallets } = useWallets();
  let ethersProvider = wallet.getEthersProvider();

  const handleOpenQuote = async () => {
    if (
      !wallet ||
      !wallet.address ||
      !token ||
      !walletClient ||
      !ethersProvider
    ) {
      console.error(
        "Wallet, wallet address, token, walletClient, or etherSigner is missing"
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

    const signedCloseQuotes: SignedCloseQuoteRequest[] = [];

    for (const order of orders) {
      const openCloseQuoteValue = {
        bContractId: 1,
        price: parseUnits(order.price, 18).toString(),
        amount: order.amount,
        limitOrStop: parseUnits(order.limitOrStop, 18).toString(),
        expiry: order.expiry,
        authorized: order.authorized,
        nonce: order.nonce,
      };

      const signatureBoracle = await ethersProvider.signTypedData(
        domainClose,
        OpenCloseQuoteType,
        openCloseQuoteValue
      );

      const signedCloseQuote: SignedCloseQuoteRequest = {
        issuerAddress: wallet.address,
        counterpartyAddress: order.authorized,
        version: "1.0",
        chainId: 64165,
        verifyingContract: networks.sonic.contracts.pionerV1Close,
        bcontractId: 1,
        price: parseUnits(order.price, 18).toString(),
        amount: order.amount,
        limitOrStop: Number(parseUnits(order.limitOrStop, 18)),
        expiry: String(order.expiry),
        authorized: order.authorized,
        nonce: order.nonce,
        signatureClose: signatureBoracle,
        emitTime: Date.now().toString(),
        messageState: 0,
      };

      signedCloseQuotes.push(signedCloseQuote);
    }

    for (const signedCloseQuote of signedCloseQuotes) {
      await sendSignedCloseQuote(signedCloseQuote, token);
    }

    setLoading(false);
  };

  return (
    <Button className="w-full" onClick={handleOpenQuote} disabled={loading}>
      {loading ? "Loading..." : "Open Quote"}
    </Button>
  );
};

export default OpenQuoteButton;
