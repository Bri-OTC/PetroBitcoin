import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { parseUnits } from "viem";
import { networks } from "@pionerfriends/blockchain-client";
import { toBytes, bytesToHex } from "viem";
import { useTradeStore } from "@/store/tradeStore";
import { useRfqRequestStore } from "@/store/rfqStore";

import {
  sendSignedWrappedOpenQuote,
  SignedWrappedOpenQuoteRequest,
  sendSignedCloseQuote,
  SignedCloseQuoteRequest,
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

const OpenQuoteButton: React.FC<OpenQuoteButtonProps> = ({ request }) => {
  const [loading, setLoading] = useState(false);
  const walletClient = useAuthStore((state) => state.walletClient);
  const wallet = useAuthStore((state) => state.wallet);
  const token = useAuthStore((state) => state.token);
  const symbol: string = useTradeStore((state) => state.symbol);
  const updateRfqRequest = useRfqRequestStore(
    (state) => state.updateRfqRequest
  );

  const currentMethod: string = useTradeStore((state) => state.currentMethod);
  const entryPrice: string = useTradeStore((state) => state.entryPrice);
  const amount: string = useTradeStore((state) => state.amount);
  const isReduceTP: boolean = useTradeStore((state) => state.isReduceTP);
  const isReduceSL: boolean = useTradeStore((state) => state.isReduceSL);
  const stopLoss: string = useTradeStore((state) => state.stopLoss);
  const takeProfit: string = useTradeStore((state) => state.takeProfit);

  const handleOpenQuote = async () => {
    if (!wallet || !wallet.address || !token || !walletClient) {
      console.error(
        "Wallet, wallet address, token, or walletClient is missing"
      );
      return;
    }

    setLoading(true);
    const paddedSymbol = symbol.padEnd(32, "\0");
    const assetHex = bytesToHex(toBytes(paddedSymbol));

    const quote: SignedWrappedOpenQuoteRequest = {
      ...request,
      issuerAddress: wallet.address,
      counterpartyAddress: "0x0000000000000000000000000000000000000000",
      version: "1.0",
      chainId: 64165,
      verifyingContract: "0x0000000000000000000000000000000000000000",
      x: "0x20568a84796e6ade0446adfd2d8c4bba2c798c2af0e8375cc3b734f71b17f5fd",
      parity: String(0),
      maxConfidence: String(parseUnits("1", 18)),
      assetHex: assetHex,
      maxDelay: "600",
      precision: 5,
      isLong: currentMethod === "Buy" ? true : false,
      price: entryPrice,
      amount: amount,
      frontEnd: "0xd0dDF915693f13Cf9B3b69dFF44eE77C901882f8",
      affiliate: "0xd0dDF915693f13Cf9B3b69dFF44eE77C901882f8",
      authorized: "0xd0dDF915693f13Cf9B3b69dFF44eE77C901882f8",
      nonceOpenQuote: 0,
      emitTime: String(Date.now()),
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

    console.log(walletClient);
    console.log(wallet.address);
    console.log(wallet);

    quote.signatureOpenQuote = await walletClient.signTypedData({
      domain: domainOpen,
      types: openQuoteSignType,
      primaryType: "Quote",
      message: openQuoteSignValue,
      account: wallet.address,
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

    if (isReduceTP) {
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
        bContractId: 1,
        price: takeProfit,
        amount: quote.amount,
        limitOrStop: parseFloat(takeProfit),
        expiry: 17139884340000,
        authorized: quote.counterpartyAddress,
        nonce: 0,
      };

      const signatureTP = await walletClient.signTypedData({
        domain: domainClose,
        types: OpenCloseQuoteType,
        primaryType: "OpenCloseQuote",
        message: openCloseQuoteValue,
        account: wallet.address as `0x${string}`,
      });

      const tpQuote: SignedCloseQuoteRequest = {
        issuerAddress: quote.issuerAddress,
        counterpartyAddress: quote.counterpartyAddress,
        version: quote.version,
        chainId: quote.chainId,
        verifyingContract: networks.sonic.contracts.pionerV1Close,
        bcontractId: 1,
        price: takeProfit,
        amount: quote.amount,
        limitOrStop: parseFloat(takeProfit),
        expiry: String(17139884340000),
        authorized: quote.counterpartyAddress,
        nonce: 0,
        signatureClose: signatureTP,
        emitTime: quote.emitTime,
        messageState: 0,
      };

      await sendSignedCloseQuote(tpQuote, token);
    }
    if (isReduceSL) {
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
        bContractId: 1,
        price: stopLoss,
        amount: quote.amount,
        limitOrStop: 0, // Stop order
        expiry: 17139884340000,
        authorized: quote.counterpartyAddress,
        nonce: 0,
      };

      const signatureSL = await walletClient.signTypedData({
        domain: domainClose,
        types: OpenCloseQuoteType,
        primaryType: "OpenCloseQuote",
        message: openCloseQuoteValue,
        account: wallet.address as `0x${string}`,
      });

      const slQuote: SignedCloseQuoteRequest = {
        issuerAddress: quote.issuerAddress,
        counterpartyAddress: quote.counterpartyAddress,
        version: quote.version,
        chainId: quote.chainId,
        verifyingContract: networks.sonic.contracts.pionerV1Close,
        bcontractId: 1,
        price: stopLoss,
        amount: quote.amount,
        limitOrStop: 0, // Stop order
        expiry: String(17139884340000),
        authorized: quote.counterpartyAddress,
        nonce: 0,
        signatureClose: signatureSL,
        emitTime: quote.emitTime,
        messageState: 0,
      };

      await sendSignedCloseQuote(slQuote, token);
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
