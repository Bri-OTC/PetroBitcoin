import React, { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useWalletAndProvider } from "@/components/layout/menu";
import { parseUnits } from "viem";
import { networks } from "@pionerfriends/blockchain-client";
import { toBytes } from "viem";
import { createWalletClient, custom, verifyMessage } from "viem";

import {
  sendSignedWrappedOpenQuote,
  SignedWrappedOpenQuoteRequest,
} from "@pionerfriends/api-client";
import { Button } from "@/components/ui/button";

interface OpenQuoteButtonProps {
  request: SignedWrappedOpenQuoteRequest;
  counterpartyAddress: string;
  assetPair: string;
  isLong: boolean;
  price: string;
  amount: string;
}

const OpenQuoteButton: React.FC<OpenQuoteButtonProps> = ({
  request,
  counterpartyAddress,
  assetPair,
  isLong,
  price,
  amount,
}) => {
  const [loading, setLoading] = useState(false);
  const token = useAuthStore().token;
  const { wallet } = useWalletAndProvider();

  const handleOpenQuote = async () => {
    if (!wallet || !token) {
      return;
    }

    const provider = await wallet.getEthereumProvider();

    const walletClient = createWalletClient({
      transport: custom(provider),
    });

    setLoading(true);

    const quote: SignedWrappedOpenQuoteRequest = {
      ...request,
      issuerAddress: wallet.address,
      counterpartyAddress,
      version: "1.0",
      chainId: 64165,
      verifyingContract: "0x0000000000000000000000000000000000000000",
      x: "0x20568a84796e6ade0446adfd2d8c4bba2c798c2af0e8375cc3b734f71b17f5fd",
      parity: String(0),
      maxConfidence: String(parseUnits("1", 18)),
      assetHex: String(toBytes(assetPair, { size: 32 })),
      maxDelay: "600",
      precision: 5,
      isLong,
      price,
      amount,
      frontEnd: "0xd0dDF915693f13Cf9B3b69dFF44eE77C901882f8",
      affiliate: "0xd0dDF915693f13Cf9B3b69dFF44eE77C901882f8",
      authorized: "0xd0dDF915693f13Cf9B3b69dFF44eE77C901882f8",
      nonceOpenQuote: 0,
      emitTime: "0",
      messageState: 0,
    };

    const domainOpen = {
      name: "PionerV1Open",
      version: "1.0",
      chainId: 64165,
      verifyingContract: networks.sonic.contracts.pionerV1Open as `0x${string}`,
    };

    const openQuoteSignType = {
      Quote: [
        { name: "isLong", type: "bool" },
        { name: "bOracleId", type: "uint256" },
        { name: "price", type: "uint256" },
        { name: "amount", type: "uint256" },
        { name: "interestRate", type: "uint256" },
        { name: "isAPayingAPR", type: "bool" },
        { name: "frontEnd", type: "address" },
        { name: "affiliate", type: "address" },
        { name: "authorized", type: "address" },
        { name: "nonce", type: "uint256" },
      ],
    };

    const openQuoteSignValue = {
      isLong: quote.isLong,
      bOracleId: 0,
      price: quote.price,
      amount: quote.amount,
      interestRate: quote.interestRate,
      isAPayingAPR: quote.isAPayingApr,
      frontEnd: "0xd0dDF915693f13Cf9B3b69dFF44eE77C901882f8",
      affiliate: "0xd0dDF915693f13Cf9B3b69dFF44eE77C901882f8",
      authorized: quote.counterpartyAddress,
      nonce: quote.nonceOpenQuote,
    };

    quote.signatureOpenQuote = await walletClient.signTypedData({
      domain: domainOpen,
      types: openQuoteSignType,
      primaryType: "Quote",
      message: openQuoteSignValue,
      account: wallet.address as `0x${string}`,
    });

    const domainWarper = {
      name: "PionerV1Warper",
      version: "1.0",
      chainId: 64165,
      verifyingContract: networks.sonic.contracts
        .pionerV1Warper as `0x${string}`,
    };

    const bOracleSignType = {
      bOracleSign: [
        { name: "x", type: "uint256" },
        { name: "parity", type: "uint8" },
        { name: "maxConfidence", type: "uint256" },
        { name: "assetHex", type: "bytes32" },
        { name: "maxDelay", type: "uint256" },
        { name: "precision", type: "uint256" },
        { name: "imA", type: "uint256" },
        { name: "imB", type: "uint256" },
        { name: "dfA", type: "uint256" },
        { name: "dfB", type: "uint256" },
        { name: "expiryA", type: "uint256" },
        { name: "expiryB", type: "uint256" },
        { name: "timeLock", type: "uint256" },
        { name: "signatureHashOpenQuote", type: "bytes" },
        { name: "nonce", type: "uint256" },
      ],
    };

    const bOracleSignValue = {
      x: quote.x,
      parity: quote.parity,
      maxConfidence: quote.maxConfidence,
      assetHex: quote.assetHex,
      maxDelay: quote.maxDelay,
      precision: quote.precision,
      imA: quote.imA,
      imB: quote.imB,
      dfA: quote.dfA,
      dfB: quote.dfB,
      expiryA: quote.expiryA,
      expiryB: quote.expiryB,
      timeLock: quote.timeLock,
      signatureHashOpenQuote: quote.signatureOpenQuote,
      nonce: quote.nonceBoracle,
    };

    quote.signatureBoracle = await walletClient.signTypedData({
      domain: domainWarper,
      types: bOracleSignType,
      primaryType: "bOracleSign",
      message: bOracleSignValue,
      account: wallet.address as `0x${string}`,
    });

    await sendSignedWrappedOpenQuote(quote, token);

    setLoading(false);
  };

  return (
    <Button className="w-full" onClick={handleOpenQuote} disabled={loading}>
      {loading ? "Loading..." : "Open Quote"}
    </Button>
  );
};

export default OpenQuoteButton;
