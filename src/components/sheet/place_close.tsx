import React, { useCallback, useState, useEffect } from "react";
import { DrawerClose, DrawerContent, DrawerTitle } from "../ui/drawer";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";
import { Card } from "../ui/card";
import { useAuthStore } from "@/store/authStore";
import { useWalletAndProvider } from "@/components/layout/menu";
import { networks, NetworkKey } from "@pionerfriends/blockchain-client";
import { parseUnits } from "viem";
import {
  sendSignedCloseQuote,
  SignedCloseQuoteRequest,
} from "@pionerfriends/api-client";
import { removePrefix } from "@/components/web3/utils";
import { toast } from "react-toastify";

interface SheetPlaceOrderProps {
  position: {
    id: string;
    size: string;
    market: string;
    icon: string;
    mark: string;
    entryPrice: string;
    pnl: string;
    amount: string;
    amountContract: string;
    type: string;
    estLiq: string;
    entryTime: string;
    mtm: string;
    imA: string;
    dfA: string;
    imB: string;
    dfB: string;
    openTime: string;
    isAPayingAPR: boolean;
    interestRate: string;
    bContractId: number;
  };
  onClose: () => void;
}

const SheetPlaceClose: React.FC<SheetPlaceOrderProps> = ({
  position,
  onClose,
}) => {
  const [loading, setLoading] = useState(false);
  const [takeProfit, setTakeProfit] = useState("");
  const [takeProfitPercentage, setTakeProfitPercentage] = useState("");
  const [stopLoss, setStopLoss] = useState("");
  const [stopLossPercentage, setStopLossPercentage] = useState("");
  const [isReduceTP, setIsReduceTP] = useState(false);
  const [isReduceSL, setIsReduceSL] = useState(false);
  const [exitPnL, setExitPnL] = useState(0);
  const [stopPnL, setStopPnL] = useState(0);
  const [riskRewardPnL, setRiskRewardPnL] = useState(0);

  const { token, walletClient, chainId } = useAuthStore();
  const { wallet, provider } = useWalletAndProvider();

  const isLong = position.type === "Long";
  const entryPrice = parseFloat(position.entryPrice);
  const markPrice = parseFloat(position.mark);

  useEffect(() => {
    computePnL(takeProfit, stopLoss);
  }, []);

  const handleTakeProfitChange = useCallback(
    (value: string) => {
      setTakeProfit(value);
      if (!isReduceTP) {
        const percentage = isLong
          ? ((parseFloat(value) - entryPrice) / entryPrice) * 100
          : ((entryPrice - parseFloat(value)) / entryPrice) * 100;
        setTakeProfitPercentage(percentage.toFixed(2));
      }
      computePnL(value, stopLoss);
    },
    [isReduceTP, stopLoss, entryPrice, isLong]
  );

  const handleStopLossChange = useCallback(
    (value: string) => {
      setStopLoss(value);
      if (!isReduceSL) {
        const percentage = isLong
          ? ((entryPrice - parseFloat(value)) / entryPrice) * 100
          : ((parseFloat(value) - entryPrice) / entryPrice) * 100;
        setStopLossPercentage(percentage.toFixed(2));
      }
      computePnL(takeProfit, value);
    },
    [isReduceSL, takeProfit, entryPrice, isLong]
  );

  const handleTakeProfitPercentageChange = useCallback(
    (value: string) => {
      setTakeProfitPercentage(value);
      const price = isLong
        ? entryPrice * (1 + parseFloat(value) / 100)
        : entryPrice * (1 - parseFloat(value) / 100);
      setTakeProfit(price.toFixed(2));
      computePnL(price.toString(), stopLoss);
    },
    [stopLoss, entryPrice, isLong]
  );

  const handleStopLossPercentageChange = useCallback(
    (value: string) => {
      setStopLossPercentage(value);
      const price = isLong
        ? entryPrice * (1 - parseFloat(value) / 100)
        : entryPrice * (1 + parseFloat(value) / 100);
      setStopLoss(price.toFixed(2));
      computePnL(takeProfit, price.toString());
    },
    [takeProfit, entryPrice, isLong]
  );

  const handleTPCheckboxChange = useCallback(
    (checked: boolean) => {
      setIsReduceTP(checked);
      if (checked) {
        setTakeProfitPercentage("10");
        handleTakeProfitPercentageChange("10");
      } else {
        setTakeProfitPercentage("");
        setTakeProfit("");
      }
    },
    [handleTakeProfitPercentageChange]
  );

  const handleSLCheckboxChange = useCallback(
    (checked: boolean) => {
      setIsReduceSL(checked);
      if (checked) {
        setStopLossPercentage("10");
        handleStopLossPercentageChange("10");
      } else {
        setStopLossPercentage("");
        setStopLoss("");
      }
    },
    [handleStopLossPercentageChange]
  );

  const handleLastPrice = useCallback(() => {
    setTakeProfit(markPrice.toString());
    setStopLoss(markPrice.toString());
    computePnL(markPrice.toString(), markPrice.toString());
  }, [markPrice]);

  const computePnL = useCallback(
    (tp: string, sl: string) => {
      const takeProfitValue = parseFloat(tp);
      const stopLossValue = parseFloat(sl);

      if (isNaN(takeProfitValue) || isNaN(stopLossValue)) {
        setExitPnL(0);
        setStopPnL(0);
        setRiskRewardPnL(0);
        return;
      }

      const exitPnLValue = isLong
        ? ((takeProfitValue - entryPrice) / entryPrice) * 100
        : ((entryPrice - takeProfitValue) / entryPrice) * 100;

      const stopPnLValue = isLong
        ? ((entryPrice - stopLossValue) / entryPrice) * 100
        : ((stopLossValue - entryPrice) / entryPrice) * 100;

      const riskRewardRatio = Math.abs(exitPnLValue / stopPnLValue);

      setExitPnL(exitPnLValue);
      setStopPnL(stopPnLValue);
      setRiskRewardPnL(riskRewardRatio);
    },
    [isLong, entryPrice]
  );

  const handleCloseQuote = async (price: string, isTP: boolean) => {
    if (!wallet || !wallet.address || !token || !walletClient) {
      console.error(
        "Wallet, wallet address, token, or walletClient is missing"
      );
      return;
    }

    setLoading(true);

    try {
      const ethersProvider = await (wallet as any).getEthersProvider();
      const ethersSigner = await ethersProvider.getSigner();

      const domainClose = {
        name: "PionerV1Close",
        version: "1.0",
        chainId: 64165,
        verifyingContract:
          networks[chainId as unknown as NetworkKey].contracts.PionerV1Close,
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

      const nonce = Date.now().toString();
      const limitOrStop = isTP ? 0 : parseUnits(price, 18).toString();
      const openCloseQuoteValue = {
        bContractId: position.bContractId,
        price: parseUnits(price, 18).toString(),
        amount: position.amountContract,
        limitOrStop: limitOrStop,
        expiry: 315350000000,
        authorized: wallet.address,
        nonce: nonce,
      };
      console.log("openCloseQuoteValue", openCloseQuoteValue);

      const signatureClose = await ethersSigner._signTypedData(
        domainClose,
        OpenCloseQuoteType,
        openCloseQuoteValue
      );

      const closeQuote: SignedCloseQuoteRequest = {
        issuerAddress: wallet.address,
        counterpartyAddress: wallet.address,
        version: "1.0",
        chainId: Number(chainId),
        verifyingContract:
          networks[chainId as unknown as NetworkKey].contracts.PionerV1Close,
        bcontractId: position.bContractId,
        isLong: isLong,
        price: parseUnits(price, 18).toString(),
        amount: position.amountContract,
        limitOrStop: Number(limitOrStop),
        expiry: String(315350000000),
        authorized: wallet.address,
        nonce: nonce,
        signatureClose: signatureClose,
        emitTime: Date.now().toString(),
        messageState: 0,
      };
      console.log("closeQuote", closeQuote);

      await sendSignedCloseQuote(closeQuote, token);
      toast.success("Close quote sent successfully", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      onClose();
    } catch (error) {
      console.error("Error in handleCloseQuote:", error);

      toast.error("Failed to send close quote", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const renderPriceInput = useCallback(
    (
      label: string,
      value: string,
      onChange: (value: string) => void,
      isDisabled: boolean,
      onActivate: () => void
    ) => (
      <div className="flex flex-col space-y-2 w-full">
        <h3 className="text-left text-card-foreground">{label}</h3>
        <div className="flex items-center space-x-5 border-b">
          <Input
            className={`pb-3 outline-none w-full border-b-[0px] bg-transparent hover:shadow-[0_0_0_2px_rgba(256,200,52,1)] ${
              parseFloat(value) <= 0 ? "text-red-500" : ""
            }`}
            placeholder="Input Price"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={isDisabled}
            onClick={() => {
              if (isDisabled) onActivate();
            }}
          />
          <p>USD</p>
        </div>
      </div>
    ),
    []
  );

  const renderPercentageInput = useCallback(
    (
      label: string,
      value: string,
      onChange: (value: string) => void,
      isDisabled: boolean
    ) => (
      <div className="flex flex-col space-y-2 w-full">
        <h3 className="text-left text-card-foreground">{label}</h3>
        <div className="flex items-center space-x-5 border-b">
          <Input
            className="pb-3 outline-none w-full border-b-[0px] bg-transparent hover:shadow-[0_0_0_2px_rgba(256,200,52,1)]"
            placeholder="Input Percentage"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={isDisabled}
          />
          <p>%</p>
        </div>
      </div>
    ),
    []
  );

  const canCloseQuote = isReduceTP || isReduceSL;

  const formattedMarket = removePrefix(position.market);

  const handleDrawerClose = () => {
    setLoading(false);
    onClose();
  };

  return (
    <DrawerContent>
      <DrawerTitle className="text-center mt-3">{formattedMarket}</DrawerTitle>
      <div className="flex flex-col space-y-3 p-5">
        <div className="flex items-center justify-center mt-5 space-x-5">
          <Card className="py-4">
            <p className="text-white">Entry Price: {position.entryPrice}</p>
          </Card>
          <Card className="py-4">
            <p className="text-white">Mark Price: {position.mark}</p>
          </Card>
        </div>

        <div className="flex space-x-5 justify-between items-end">
          <Button
            onClick={handleLastPrice}
            className="w-full bg-card text-[rgba(256,200,52,1)] hover:bg-card hover:text-white"
          >
            Last Price
          </Button>
        </div>

        <div className="flex space-x-5 justify-between items-end">
          {renderPriceInput(
            "Take profit exit",
            takeProfit,
            handleTakeProfitChange,
            !isReduceTP,
            () => handleTPCheckboxChange(true)
          )}
          {renderPercentageInput(
            "% Gain",
            takeProfitPercentage,
            handleTakeProfitPercentageChange,
            !isReduceTP
          )}
          <div className="flex flex-col items-center space-y-1">
            <p>TP</p>
            <Checkbox
              checked={isReduceTP}
              onCheckedChange={handleTPCheckboxChange}
            />
          </div>
        </div>

        <div className="flex space-x-5 justify-between items-end">
          {renderPriceInput(
            "Stop loss",
            stopLoss,
            handleStopLossChange,
            !isReduceSL,
            () => handleSLCheckboxChange(true)
          )}
          {renderPercentageInput(
            "% Loss",
            stopLossPercentage,
            handleStopLossPercentageChange,
            !isReduceSL
          )}
          <div className="flex flex-col items-center space-y-1">
            <p>SL</p>
            <Checkbox
              checked={isReduceSL}
              onCheckedChange={handleSLCheckboxChange}
            />
          </div>
        </div>

        <h3 className="text-left text-card-foreground">
          Est. Liquidation Price: {position.estLiq}
        </h3>

        <div className="flex items-center justify-between p-5 px-8 bg-card">
          <div className="flex flex-col items-center space-y-2 text-center">
            <h3>Exit PnL</h3>
            <h3>{exitPnL.toFixed(2)} %</h3>
          </div>
          <div className="flex flex-col items-center space-y-2 text-center">
            <h3>Stop PnL</h3>
            <h3>{stopPnL.toFixed(2)} %</h3>
          </div>
          <div className="flex flex-col items-center space-y-2 text-center">
            <h3>Risk Reward</h3>
            <h3>{riskRewardPnL.toFixed(2)}</h3>
          </div>
        </div>

        {canCloseQuote && (
          <div className="flex space-x-3">
            {isReduceTP && (
              <Button
                className="w-full"
                onClick={() => handleCloseQuote(takeProfit, true)}
                disabled={loading}
              >
                {loading ? "Loading..." : "Close TP"}
              </Button>
            )}
            {isReduceSL && (
              <Button
                className="w-full"
                onClick={() => handleCloseQuote(stopLoss, false)}
                disabled={loading}
              >
                {loading ? "Loading..." : "Close SL"}
              </Button>
            )}
          </div>
        )}

        <DrawerClose onClick={handleDrawerClose}>
          <Button
            className="w-full"
            disabled={!canCloseQuote || loading}
            onClick={() => {
              if (isReduceTP) handleCloseQuote(takeProfit, true);
              else if (isReduceSL) handleCloseQuote(stopLoss, false);
            }}
          >
            {loading ? "Loading..." : "Close Quote"}
          </Button>
        </DrawerClose>
      </div>
    </DrawerContent>
  );
};

export default SheetPlaceClose;
