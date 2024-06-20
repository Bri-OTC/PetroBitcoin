// openQuote.tsx
import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { networks, NetworkKey } from "@pionerfriends/blockchain-client";
import { useTradeStore } from "@/store/tradeStore";
import { useQuoteStore } from "@/store/quoteStore";
import { useRfqRequestStore } from "@/store/rfqStore";
import { toast } from "react-toastify";
import { formatPair } from "@/components/triparty/priceUpdater";
import { useWalletAndProvider } from "@/components/layout/menu";
import {
  sendSignedWrappedOpenQuote,
  SignedWrappedOpenQuoteRequest,
} from "@pionerfriends/api-client";
import { Button } from "@/components/ui/button";
import {
  convertToBytes32,
  parseDecimalValue,
  generateRandomNonce,
} from "@/components/web3/utils";
import { useOpenQuoteChecks } from "@/hooks/useOpenQuoteChecks";

interface OpenQuoteButtonProps {
  request: SignedWrappedOpenQuoteRequest;
}

const OpenQuoteButton: React.FC<OpenQuoteButtonProps> = ({ request }) => {
  const { getBestQuotes } = useQuoteStore();
  const { bestBid, bestAsk } = getBestQuotes();

  const chainId = String(64165);

  const [loading, setLoading] = useState(false);
  const walletClient = useAuthStore((state) => state.walletClient);
  const { wallet, provider } = useWalletAndProvider();

  const token = useAuthStore((state) => state.token);
  const symbol: string = useTradeStore((state) => state.symbol);

  const updateRfqRequest = useRfqRequestStore(
    (state) => state.updateRfqRequest
  );

  const rfqRequest = useRfqRequestStore((state) => state.rfqRequest);

  const currentMethod: string = useTradeStore((state) => state.currentMethod);
  const entryPrice: string = useTradeStore((state) => state.entryPrice);
  const amount: string = useTradeStore((state) => state.amount);

  const {
    sufficientBalance,
    maxAmountAllowed,
    isBalanceZero,
    isAmountMinAmount,
    minAmountFromQuote,
    maxAmountFromQuote,
    advisedAmount,
    noQuotesReceived,
  } = useOpenQuoteChecks(amount, entryPrice);

  const handleOpenQuote = async () => {
    if (!wallet || !token || !walletClient || !wallet.address) {
      console.error(" Missing wallet, token, walletClient or wallet.address");
      return;
    }

    const ethersProvider = await (wallet as any).getEthersProvider();
    const ethersSigner = await ethersProvider.getSigner();
    const formatedSymbol = await formatPair(symbol);

    setLoading(true);

    let counterparty;
    if (currentMethod === "Buy") {
      if (!bestBid || !bestBid.counterpartyAddress) {
        console.error("No best bid or counterparty address available");
        setLoading(false);
        return;
      }
      counterparty = bestBid.counterpartyAddress;
    } else {
      if (!bestAsk || !bestAsk.counterpartyAddress) {
        console.error("No best ask or counterparty address available");
        setLoading(false);
        return;
      }
      counterparty = bestAsk.counterpartyAddress;
    }
    const nonce = String(generateRandomNonce());

    const quote: SignedWrappedOpenQuoteRequest = {
      issuerAddress: wallet.address,
      counterpartyAddress: counterparty,
      version: "1.0",
      chainId: 64165,
      verifyingContract:
        networks[chainId as unknown as NetworkKey].contracts.PionerV1Open,
      x: "0x20568a84796e6ade0446adfd2d8c4bba2c798c2af0e8375cc3b734f71b17f5fd",
      parity: String(0),
      maxConfidence: parseDecimalValue("1"),
      assetHex: formatedSymbol,
      maxDelay: "600",
      precision: 5,
      imA:
        currentMethod === "Buy"
          ? parseDecimalValue(rfqRequest.lImA)
          : parseDecimalValue(rfqRequest.sImA),
      imB:
        currentMethod === "Buy"
          ? parseDecimalValue(rfqRequest.lImB)
          : parseDecimalValue(rfqRequest.sImB),
      dfA:
        currentMethod === "Buy"
          ? parseDecimalValue(rfqRequest.lDfA)
          : parseDecimalValue(rfqRequest.sDfA),
      dfB:
        currentMethod === "Buy"
          ? parseDecimalValue(rfqRequest.lDfB)
          : parseDecimalValue(rfqRequest.sDfB),
      expiryA:
        currentMethod === "Buy"
          ? rfqRequest.lExpirationA
          : rfqRequest.sExpirationA,
      expiryB:
        currentMethod === "Buy"
          ? rfqRequest.lExpirationB
          : rfqRequest.sExpirationB,
      timeLock:
        currentMethod === "Buy" ? rfqRequest.lTimelockA : rfqRequest.sTimelockA,
      nonceBoracle: nonce,
      signatureBoracle: "",
      isLong: currentMethod === "Buy" ? true : false,
      price: parseDecimalValue(entryPrice),
      amount: parseDecimalValue(amount),
      interestRate:
        currentMethod === "Buy"
          ? parseDecimalValue(rfqRequest.lInterestRate)
          : parseDecimalValue(rfqRequest.sInterestRate),
      isAPayingApr: true,
      frontEnd: "0xd0dDF915693f13Cf9B3b69dFF44eE77C901882f8",
      affiliate: "0xd0dDF915693f13Cf9B3b69dFF44eE77C901882f8",
      authorized: "0x0000000000000000000000000000000000000000",
      nonceOpenQuote: nonce,
      signatureOpenQuote: "",
      emitTime: String(Date.now()),
      messageState: 1,
    };

    console.log("quote", quote);
    console.log("x", quote.x);
    console.log("parity", quote.parity);
    console.log("maxConfidence", quote.maxConfidence);
    console.log("assetHex", quote.assetHex);
    console.log("precision", quote.precision);
    console.log("imA", quote.imA);
    console.log("imB", quote.imB);
    console.log("dfA", quote.dfA);
    console.log("dfB", quote.dfB);
    console.log("expiryA", quote.expiryA);
    console.log("expiryB", quote.expiryB);
    console.log("timeLock", quote.timeLock);
    console.log("signatureHashOpenQuote", quote.signatureOpenQuote);
    console.log("nonce", quote.nonceBoracle);

    const domainOpen = {
      name: "PionerV1Open",
      version: "1.0",
      chainId: 64165,
      verifyingContract:
        networks[chainId as unknown as NetworkKey].contracts.PionerV1Open,
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

    console.log("openQuoteSignType", openQuoteSignType);

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

    console.log("openQuoteSignValue", openQuoteSignValue);

    const domainWrapper = {
      name: "PionerV1Wrapper",
      version: "1.0",
      chainId: 64165,
      verifyingContract:
        networks[chainId as unknown as NetworkKey].contracts.PionerV1Wrapper,
    };

    console.log("domainWrapper", domainWrapper);

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

    console.log("bOracleSignType", bOracleSignType);

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

    console.log("bOracleSignValue", bOracleSignValue);

    let signatureOpenQuote;
    try {
      signatureOpenQuote = await ethersSigner._signTypedData(
        domainOpen,
        openQuoteSignType,
        openQuoteSignValue
      );
      console.log("signatureOpenQuote", signatureOpenQuote);
    } catch (error) {
      console.error("Error obtaining signatureOpenQuote:", error);
      toast.error("Failed to obtain signatureOpenQuote");
      setLoading(false);
      return;
    }

    bOracleSignValue.signatureHashOpenQuote = signatureOpenQuote;

    let signatureBoracle;
    try {
      signatureBoracle = await ethersSigner._signTypedData(
        domainWrapper,
        bOracleSignType,
        bOracleSignValue
      );
      console.log("signatureBoracle", signatureBoracle);
    } catch (error) {
      console.error("Error obtaining signatureBoracle:", error);
      toast.error("Failed to obtain signatureBoracle");
      setLoading(false);
      return;
    }

    quote.signatureBoracle = signatureBoracle;
    quote.signatureOpenQuote = signatureOpenQuote;

    console.log("Updated quote", quote);

    try {
      await sendSignedWrappedOpenQuote(quote, token);
      console.log("Open Quote sent");
      toast.success("Open Quote sent successfully");
    } catch (error) {
      console.error("Error sending Open Quote:", error);
      toast.error(`Error sending Open Quote: ${error}`);
    }

    setLoading(false);
  };

  return (
    <Button
      className="w-full py-6 border-none"
      onClick={handleOpenQuote}
      disabled={
        loading ||
        !sufficientBalance ||
        isBalanceZero ||
        isAmountMinAmount ||
        noQuotesReceived
      }
    >
      {loading ? "Loading..." : "Open Quote"}
    </Button>
  );
};

export default OpenQuoteButton;
