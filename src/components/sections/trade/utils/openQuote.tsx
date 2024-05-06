import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { networks } from "@pionerfriends/blockchain-client";
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

interface OpenQuoteButtonProps {
  request: SignedWrappedOpenQuoteRequest;
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

  const handleOpenQuote = async () => {
    console.log(`handleOpenQuote : ${wallet}`);
    if (!wallet || !token || !walletClient || !wallet.address) {
      /*
      console.error(`Wallet : ${!wallet} `);
      console.error(`token : ${!token}`);
      console.error(`walletClient ${!walletClient}`);
      console.error(`wallet.address ${!wallet.address}`);
      */
      console.error(" Missing wallet, token, walletClient or wallet.address");

      return;
    }
    const ethersProvider = await wallet.getEthersProvider();
    const ethersSigner = await ethersProvider.getSigner();

    setLoading(true);
    const paddedSymbol = symbol.padEnd(32, "\0");
    const assetHex = bytesToHex(toBytes(paddedSymbol));

    const quote: SignedWrappedOpenQuoteRequest = {
      issuerAddress: wallet.address,
      counterpartyAddress: "0x0000000000000000000000000000000000000000",
      version: "1.0",
      chainId: 64165,
      verifyingContract: "0x0000000000000000000000000000000000000000",
      x: "0x20568a84796e6ade0446adfd2d8c4bba2c798c2af0e8375cc3b734f71b17f5fd",
      parity: String(0),
      maxConfidence: parseUnits("1", 18).toString(),
      assetHex: assetHex,
      maxDelay: "600",
      precision: 5,
      imA: parseUnits("1", 18).toString(),
      imB: parseUnits("1", 18).toString(),
      dfA: parseUnits("1", 18).toString(),
      dfB: parseUnits("1", 18).toString(),
      expiryA: parseUnits("1", 18).toString(),
      expiryB: parseUnits("1", 18).toString(),
      timeLock: parseUnits("1", 18).toString(),
      nonceBoracle: 0,
      signatureBoracle: "",
      isLong: currentMethod === "Buy" ? true : false,
      price: parseUnits(entryPrice, 18).toString(),
      amount: parseUnits(amount, 18).toString(),
      interestRate: parseUnits("1", 18).toString(),
      isAPayingApr: true,

      frontEnd: "0xd0dDF915693f13Cf9B3b69dFF44eE77C901882f8",
      affiliate: "0xd0dDF915693f13Cf9B3b69dFF44eE77C901882f8",
      authorized: "0x0000000000000000000000000000000000000000",
      nonceOpenQuote: 0,
      signatureOpenQuote: "",
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
      authorized: quote.authorized,
      nonce: quote.nonceOpenQuote,
    };

    const domainWrapper = {
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
      parity: parseInt(quote.parity),
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
    const signatureOpenQuote = await ethersSigner._signTypedData(
      domainOpen,
      openQuoteSignType,
      openQuoteSignValue
    );

    bOracleSignValue.signatureHashOpenQuote = signatureOpenQuote;

    const signatureBoracle = await ethersSigner._signTypedData(
      domainWrapper,
      bOracleSignType,
      bOracleSignValue
    );
    quote.signatureBoracle = signatureBoracle;
    quote.signatureOpenQuote = signatureOpenQuote;
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
