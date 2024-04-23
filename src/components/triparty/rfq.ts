import {
  sendRfq,
  QuoteWebsocketClient,
  QuoteResponse,
} from "@pionerfriends/api-client";
import { useAuthStore } from "@/store/authStore";
import {
  adjustQuantities,
  getPairConfig,
  initializeSymbolList,
  loadPrefixData,
} from "./configReader";
import { useTradeStore } from "@/store/tradeStore";
import { useEffect } from "react";
import { useRfqRequestStore } from "@/store/rfqStore";
import { formatSymbols } from "@/components/triparty/priceUpdater";

export const useRfqRequest = () => {
  const token = useAuthStore((state) => state.token);
  const rfqRequest = useRfqRequestStore((state) => state.rfqRequest);
  const updateRfqRequest = useRfqRequestStore(
    (state) => state.updateRfqRequest
  );
  const entryPrice = useTradeStore((state) => state.entryPrice);
  const amount = useTradeStore((state) => state.amount);
  const symbol = useTradeStore((state) => state.symbol);
  const leverage = useTradeStore((state) => state.leverage);

  const setRfqRequest = async () => {
    const [symbol1, symbol2] = formatSymbols(symbol);

    try {
      const adjustedQuantitiesResult = await adjustQuantities(
        parseFloat(entryPrice),
        parseFloat(entryPrice),
        parseFloat(amount),
        parseFloat(amount),
        symbol1,
        symbol2,
        leverage
      );

      const lConfig = await getPairConfig(
        symbol1,
        symbol2,
        "long",
        leverage,
        parseFloat(entryPrice) * adjustedQuantitiesResult.lQuantity
      );

      const sConfig = await getPairConfig(
        symbol1,
        symbol2,
        "short",
        leverage,
        parseFloat(entryPrice) * adjustedQuantitiesResult.sQuantity
      );

      console.log("sConfig", sConfig);

      updateRfqRequest({
        expiration: "10000",
        assetAId: symbol1,
        assetBId: symbol2,
        sPrice: String(entryPrice),
        sQuantity: amount,
        sInterestRate: sConfig?.funding?.toString(),
        sIsPayingApr: lConfig?.isAPayingApr || true,
        sImA: sConfig?.imA?.toString(),
        sImB: sConfig?.imB?.toString() || "",
        sDfA: sConfig?.dfA?.toString() || "",
        sDfB: sConfig?.dfB?.toString() || "",
        sExpirationA: sConfig?.expiryA?.toString() || "",
        sExpirationB: sConfig?.expiryB?.toString() || "",
        sTimelockA: sConfig?.timeLockA?.toString() || "",
        sTimelockB: sConfig?.timeLockA?.toString() || "",
        lPrice: String(entryPrice),
        lQuantity: amount,
        lInterestRate: lConfig?.funding?.toString() || "",
        lIsPayingApr: lConfig?.isAPayingApr || true,
        lImA: lConfig?.imA?.toString() || "",
        lImB: lConfig?.imB?.toString() || "",
        lDfA: lConfig?.dfA?.toString() || "",
        lDfB: lConfig?.dfB?.toString() || "",
        lExpirationA: lConfig?.expiryA?.toString() || "",
        lExpirationB: lConfig?.expiryB?.toString() || "",
        lTimelockA: lConfig?.timeLockA?.toString() || "",
        lTimelockB: lConfig?.timeLockA?.toString() || "",
      });
    } catch (error) {
      console.error("Error updating RFQ request:", error);
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      initializeSymbolList();
      loadPrefixData();
    }, 500000);

    return () => {
      clearInterval(intervalId);
    };
  }, [rfqRequest, token]);

  useEffect(() => {
    if (token != null) {
      const sendRfqRequest = async () => {
        try {
          await setRfqRequest();

          await sendRfq(rfqRequest, token);
          console.log("RFQ request sent successfully");
        } catch (error) {
          console.error("Error sending RFQ request:", error);
        }
      };

      const intervalId = setInterval(() => {
        sendRfqRequest();
      }, 5000);

      return () => {
        clearInterval(intervalId);
      };
    }
  }, [rfqRequest, token, setRfqRequest]);

  return { rfqRequest, setRfqRequest };
};

export const RfqRequestUpdater: React.FC = () => {
  const { rfqRequest } = useRfqRequest();

  return null;
};
