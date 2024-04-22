import {
  sendRfq,
  QuoteWebsocketClient,
  QuoteResponse,
} from "@pionerfriends/api-client";
import { useAuthStore } from "@/store/authStore";
import { adjustQuantities, getPairConfig } from "./configReader";
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
        "long",
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
        sInterestRate: "",
        sIsPayingApr: false,
        sImA: "",
        sImB: sConfig?.funding?.toString() || "",
        sDfA: sConfig?.funding?.toString() || "",
        sDfB: sConfig?.funding?.toString() || "",
        sExpirationA: sConfig?.funding?.toString() || "",
        sExpirationB: sConfig?.funding?.toString() || "",
        sTimelockA: sConfig?.funding?.toString() || "",
        sTimelockB: sConfig?.funding?.toString() || "",
        lPrice: String(entryPrice),
        lQuantity: amount,
        lInterestRate: lConfig?.funding?.toString() || "",
        lIsPayingApr: false,
        lImA: lConfig?.funding?.toString() || "",
        lImB: lConfig?.funding?.toString() || "",
        lDfA: lConfig?.funding?.toString() || "",
        lDfB: lConfig?.funding?.toString() || "",
        lExpirationA: lConfig?.funding?.toString() || "",
        lExpirationB: lConfig?.funding?.toString() || "",
        lTimelockA: lConfig?.funding?.toString() || "",
        lTimelockB: lConfig?.funding?.toString() || "",
      });
    } catch (error) {
      console.error("Error updating RFQ request:", error);
    }
  };

  useEffect(() => {
    if (token != null) {
      setRfqRequest();

      const sendRfqRequest = async () => {
        try {
          await sendRfq(rfqRequest, token);
          console.log("RFQ request sent successfully");
        } catch (error) {
          console.error("Error sending RFQ request:", error);
        }
      };

      const intervalId = setInterval(() => {
        sendRfqRequest();
      }, 1000);

      return () => {
        clearInterval(intervalId);
      };
    }
  }, [rfqRequest, token]);

  return { rfqRequest, setRfqRequest };
};

export const RfqRequestUpdater: React.FC = () => {
  const { rfqRequest } = useRfqRequest();

  return null;
};
