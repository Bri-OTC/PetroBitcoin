// openQuote.tsx
import React, { useState } from "react";
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
  parseDecimalValue,
  generateRandomNonce,
} from "@/components/web3/utils";
import { useOpenQuoteChecks } from "@/hooks/useOpenQuoteChecks";

interface OpenQuoteButtonProps {
  request: SignedWrappedOpenQuoteRequest;
}

const OpenQuoteButton: React.FC<OpenQuoteButtonProps> = ({ request }) => {
  const { quotes } = useQuoteStore();
  const chainId = String(64165);
  const [loading, setLoading] = useState(false);
  const walletClient = useAuthStore((state) => state.walletClient);
  const { wallet } = useWalletAndProvider();
  const token = useAuthStore((state) => state.token);
  const symbol: string = useTradeStore((state) => state.symbol);
  const rfqRequest = useRfqRequestStore((state) => state.rfqRequest);
  const currentMethod: string = useTradeStore((state) => state.currentMethod);
  const entryPrice: string = useTradeStore((state) => state.entryPrice);
  const amount: string = useTradeStore((state) => state.amount);

  const {
    sufficientBalance,
    isBalanceZero,
    isAmountMinAmount,
    noQuotesReceived,
    lastValidBalance,
    recommendedAmount,
  } = useOpenQuoteChecks(amount, entryPrice);

  const handleOpenQuote = async () => {
    if (!wallet || !token || !walletClient || !wallet.address) {
      console.error("Missing wallet, token, walletClient or wallet.address");
      return;
    }

    setLoading(true);

    // Inform the user about the two required signatures
    toast.info("This action requires two signatures. Please approve both.");

    try {
      const ethersProvider = await (wallet as any).getEthersProvider();
      const ethersSigner = await ethersProvider.getSigner();
      const formatedSymbol = await formatPair(symbol);

      const nonce = String(generateRandomNonce());
      recommendedAmount;
      const quote: SignedWrappedOpenQuoteRequest = {
        issuerAddress: wallet.address,
        counterpartyAddress: request.counterpartyAddress,
        version: "1.0",
        chainId: 64165,
        verifyingContract:
          networks[chainId as unknown as NetworkKey].contracts.PionerV1Open,
        x: "0x20568a84796e6ade0446adfd2d8c4bba2c798c2af0e8375cc3b734f71b17f5fd",
        parity: String(0),
        maxConfidence: "5",
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
          currentMethod === "Buy"
            ? rfqRequest.lTimelockA
            : rfqRequest.sTimelockA,
        nonceBoracle: nonce,
        signatureBoracle: "",
        isLong: currentMethod === "Buy" ? true : false,
        price: parseDecimalValue(entryPrice),
        amount: parseDecimalValue(String(recommendedAmount)),
        interestRate:
          currentMethod === "Buy"
            ? parseDecimalValue(rfqRequest.lInterestRate)
            : parseDecimalValue(rfqRequest.sInterestRate),
        isAPayingApr: true,
        frontEnd: "0xd0dDF915693f13Cf9B3b69dFF44eE77C901882f8",
        affiliate: "0xd0dDF915693f13Cf9B3b69dFF44eE77C901882f8",
        authorized: request.authorized,
        nonceOpenQuote: nonce,
        signatureOpenQuote: "",
        emitTime: String(Date.now()),
        messageState: 1,
      };

      console.log("quote", quote);

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
        name: "PionerV1Wrapper",
        version: "1.0",
        chainId: 64165,
        verifyingContract:
          networks[chainId as unknown as NetworkKey].contracts.PionerV1Wrapper,
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

      let signatureOpenQuote: string;
      let signatureBoracle: string = "";

      // First signature
      console.log("Preparing to sign openQuote...");
      console.log("Domain:", domainOpen);
      console.log("Types:", openQuoteSignType);
      console.log("Values:", openQuoteSignValue);

      signatureOpenQuote = await ethersSigner._signTypedData(
        domainOpen,
        openQuoteSignType,
        openQuoteSignValue
      );

      console.log(
        "signatureOpenQuote obtained successfully:",
        signatureOpenQuote
      );

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
        signatureHashOpenQuote: signatureOpenQuote,
        nonce: quote.nonceBoracle,
      };

      // Second signature
      const getSecondSignature = async (): Promise<string> => {
        try {
          console.log("Requesting signatureBoracle...");
          console.log("Domain:", domainWrapper);
          console.log("Types:", bOracleSignType);
          console.log("Values:", bOracleSignValue);
          return await ethersSigner._signTypedData(
            domainWrapper,
            bOracleSignType,
            bOracleSignValue
          );
        } catch (error) {
          //throw error;
          signatureBoracle = await getSecondSignature();
          return signatureBoracle;
        }
      };

      signatureBoracle = await getSecondSignature();

      console.log("signatureBoracle obtained successfully:", signatureBoracle);

      // Proceed with the quote
      quote.signatureOpenQuote = signatureOpenQuote;
      quote.signatureBoracle = signatureBoracle;

      console.log("Both signatures obtained. Sending Open Quote...");

      await sendSignedWrappedOpenQuote(quote, token);
      console.log("Open Quote sent successfully");
      toast.success("Open Quote sent successfully");
    } catch (error) {
      console.error("Error in handleOpenQuote:", error);
      if (error instanceof Error) {
        if (error.message.includes("User cancelled the second signature")) {
          toast.error("Open Quote cancelled. Both signatures are required.");
        } else {
          toast.error(`Error: ${error.message}`);
        }
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const isButtonDisabled = false;
  /*
    !sufficientBalance ||
    isBalanceZero ||
    isAmountMinAmount ||
    noQuotesReceived;*/

  return (
    <Button
      className="w-full py-6 border-none"
      onClick={handleOpenQuote}
      disabled={isButtonDisabled}
    >
      {loading ? "Loading..." : "Open Quote"}
    </Button>
  );
};

export default OpenQuoteButton;
