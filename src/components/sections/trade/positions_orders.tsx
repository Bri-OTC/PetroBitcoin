"use client";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SectionPositions from "./SectionPositions";
import SectionOrders from "./SectionOrders";
import { Button } from "@/components/ui/button";
import { Order } from "./SectionOrders";
import { Position } from "./SectionPositions";
import {
  signedWrappedOpenQuoteResponse,
  getSignedWrappedOpenQuotes,
} from "@pionerfriends/api-client";
import { useTradeStore } from "@/store/tradeStore";
import { useAuthStore } from "@/store/authStore";
import useBlurEffect from "@/components/hooks/blur";
import { formatUnits } from "viem/utils";
import { convertFromBytes32 } from "@/components/web3/utils";

const getPositions = () => {
  const positions = [
    {
      id: 0,
      size: -0.0048,
      market: "BTC-PERP",
      icon: "/$.svg",
      mark: 45000,
      entryPrice: 312.89,
      pnl: -0.03,
      amount: 233.212,
      type: "Stop Market",
      estLiq: 54427.07,
      entryTime: "1",
    },
  ];
  return positions;
};

const getOrders = async (
  chainId: number,
  issuerAddress: string | undefined = undefined,
  token: string
): Promise<Order[]> => {
  try {
    const response = await getSignedWrappedOpenQuotes("1.0", 64165, token, {
      onlyActive: true,
      issuerAddress: issuerAddress,
    });
    if (response && response.data) {
      const orders: Order[] = response.data.map(
        (quote: signedWrappedOpenQuoteResponse) => {
          const size = String((parseFloat(quote.amount) / 1e18).toFixed(4));
          const trigger = String((parseFloat(quote.price) / 1e18).toFixed(4));
          const amount = String((Number(size) * Number(trigger)).toFixed(4));
          const filled = "0";
          const remainingSize = size;
          const breakEvenPrice = trigger;
          const limitPrice = String(
            (parseFloat(quote.price) / 1e18).toFixed(4)
          );
          const status = quote.messageState === 0 ? "Open" : "Closed";
          const reduceOnly = "No";
          const fillAmount = "No";
          const asset = convertFromBytes32(quote.assetHex);

          const emitTime = new Date(parseInt(quote.emitTime, 10));
          const entryTime = `${emitTime.getFullYear()}/${(
            emitTime.getMonth() + 1
          )
            .toString()
            .padStart(2, "0")}/${emitTime
            .getDate()
            .toString()
            .padStart(2, "0")} ${emitTime
            .getHours()
            .toString()
            .padStart(2, "0")}:${emitTime
            .getMinutes()
            .toString()
            .padStart(2, "0")}:${emitTime
            .getSeconds()
            .toString()
            .padStart(2, "0")}`;
          return {
            id: String(quote.nonceOpenQuote),
            size,
            market: asset,
            icon: "/$.svg",
            trigger: trigger,
            amount: amount,
            filled: filled,
            remainingSize: remainingSize,
            breakEvenPrice: breakEvenPrice,
            limitPrice: limitPrice,
            status,
            reduceOnly,
            fillAmount,
            entryTime,
            targetHash: quote.signatureOpenQuote,
            counterpartyAddress: quote.counterpartyAddress,
          };
        }
      );

      return orders;
    }
  } catch (error) {
    console.error("Error fetching orders:", error);
  }

  return [];
};

interface activeMenu {
  [key: string]: boolean;
}

function SectionTradePositionsOrders() {
  const wallet = useAuthStore((state) => state.wallet);
  const token = useAuthStore((state) => state.token);

  const menu = ["Positions", "Orders"];
  const [currentTab, setCurrentTab] = useState(menu[0]);
  const blur = useBlurEffect();

  const [currentActiveRowPositions, setCurrentActiveRowPositions] =
    useState<activeMenu>({});
  const [currentActiveRowOrders, setCurrentActiveRowOrders] =
    useState<activeMenu>({});

  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!wallet || !token) return;
      const fetchedOrders = await getOrders(64165, wallet.address, token);
      setOrders(fetchedOrders);
    };

    fetchOrders();

    const intervalId = setInterval(() => {
      fetchOrders();
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [wallet, token]);

  if (!wallet || !token) return null;

  const positions = getPositions();

  const toggleActiveRow = (label: string) => {
    if (currentTab === "Positions") {
      setCurrentActiveRowPositions((prevState) => {
        return {
          ...prevState,
          [label]: !prevState[label],
        };
      });
    } else {
      setCurrentActiveRowOrders((prevState) => {
        return {
          ...prevState,
          [label]: !prevState[label],
        };
      });
    }
  };

  const hideRow = (label: string) => {
    if (currentTab === "Positions") {
      setCurrentActiveRowPositions((prevState) => {
        return {
          ...prevState,
          [label]: false,
        };
      });
    } else {
      setCurrentActiveRowOrders((prevState) => {
        return {
          ...prevState,
          [label]: false,
        };
      });
    }
  };

  return (
    <div className={`container ${blur ? "blur" : ""}`}>
      <div className="mt-5 flex flex-col">
        <div className="border-b flex space-x-5 px-5">
          {menu.map((x, index) => {
            return (
              <div key={x + index} onClick={() => setCurrentTab(x)}>
                <h2
                  className={`${
                    currentTab === x ? "text-primary" : "text-card-foreground"
                  } transition-all font-medium cursor-pointer`}
                >
                  {x} ({x === "Positions" ? positions.length : orders.length})
                </h2>
                <div
                  className={`w-[18px] h-[4px] ${
                    currentTab === x ? "bg-primary" : "bg-transparent"
                  } mt-3 transition-all`}
                />
              </div>
            );
          })}
        </div>
        <div className="px-5">
          <AnimatePresence>
            {/* Positions Tab */}
            {currentTab === "Positions" && (
              <motion.div
                key="Positions"
                exit={{ opacity: 0 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <SectionPositions
                  positions={positions}
                  currentActiveRowPositions={currentActiveRowPositions}
                  toggleActiveRow={toggleActiveRow}
                  hideRow={hideRow}
                />
              </motion.div>
            )}
            {/* Positions Tab End */}

            {/* Orders Tab */}
            {currentTab === "Orders" && (
              <motion.div
                key="Orders"
                exit={{ opacity: 0 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <SectionOrders
                  orders={orders}
                  currentActiveRowOrders={currentActiveRowOrders}
                  toggleActiveRow={toggleActiveRow}
                  hideRow={hideRow}
                />
              </motion.div>
            )}
            {/* Orders Tab End */}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default SectionTradePositionsOrders;
