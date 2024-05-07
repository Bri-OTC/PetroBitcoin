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

const menu = ["Positions", "Orders"];

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
  version: string,
  chainId: number,
  onlyActive: boolean | undefined = undefined,
  start: number | undefined = undefined,
  end: number | undefined = undefined,
  issuerAddress: string | undefined = undefined,
  targetAddress: string | undefined = undefined,
  token: string,
  timeout: number = 3000
): Promise<Order[]> => {
  try {
    const response = await getSignedWrappedOpenQuotes(
      version,
      chainId,
      onlyActive,
      start,
      end,
      issuerAddress,
      targetAddress,
      token,
      timeout
    );

    if (response && response.data) {
      const orders: Order[] = response.data.map(
        (quote: signedWrappedOpenQuoteResponse) => {
          const size = parseFloat(quote.amount);
          const trigger = parseFloat(quote.price);
          const amount = size * trigger;
          const filled = 0; // Assuming no filled amount initially
          const remainingSize = size;
          const breakEvenPrice = trigger; // Assuming break-even price is the same as the quote price
          const limitPrice = quote.price;
          const status = quote.messageState === 0 ? "Open" : "Closed";
          const reduceOnly = "No"; // Assuming not reduce-only by default
          const fillAmount = "No"; // Assuming not filled by default
          const entryTime = new Date(
            parseInt(quote.emitTime, 10)
          ).toISOString();

          return {
            id: quote.nonceOpenQuote,
            size,
            market: quote.assetHex,
            icon: "/$.svg", // Placeholder icon path
            trigger,
            amount,
            filled,
            remainingSize,
            breakEvenPrice,
            limitPrice,
            status,
            reduceOnly,
            fillAmount,
            entryTime,
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

  const [currentTab, setCurrentTab] = useState(menu[0]);
  const [currentActiveRowPositions, setCurrentActiveRowPositions] =
    useState<activeMenu>({});
  const [currentActiveRowOrders, setCurrentActiveRowOrders] =
    useState<activeMenu>({});

  const positions = getPositions();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const fetchedOrders = await getOrders(
        "1.0",
        64165,
        true,
        1714897507 * 1000,
        Date.now() + 1000 * 60,
        undefined,
        wallet?.address,
        "your-token",
        5000
      );
      setOrders(fetchedOrders);
    };

    fetchOrders();

    const intervalId = setInterval(() => {
      fetchOrders();
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

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
              <Button variant="ghost" className="text-primary w-full mt-5">
                <p>Cancel All</p>
              </Button>
            </motion.div>
          )}
          {/* Orders Tab End */}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default SectionTradePositionsOrders;
