"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SectionPositions from "./SectionPositions";
import SectionOrders from "./SectionOrders";
import { Button } from "@/components/ui/button";

const menu = ["Orders", "Positions"];

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
      limitPrice: "N/A",
      status: "Open",
      reduceOnly: "No",
      fillAmount: "Yes",
      entryTime: "1",
    },
  ];
  return positions;
};

const getOrders = () => {
  const orders = [
    {
      id: 0,
      size: -0.0048,
      market: "BTC-PERP",
      icon: "/trade/bitcoin.svg",
      trigger: 45000,
      amount: 312.89,
      filled: -0.03,
      remainingSize: 233.212,
      estLiq: 54427.07,
      breakEvenPrice: 49921.0,
    },
  ];

  return orders;
};

interface activeMenu {
  [key: string]: boolean;
}

async function SectionTradePositionsOrders() {
  const [currentTab, setCurrentTab] = useState(menu[0]);
  const [currentActiveRowPositions, setCurrentActiveRowPositions] =
    useState<activeMenu>({});
  const [currentActiveRowOrders, setCurrentActiveRowOrders] =
    useState<activeMenu>({});

  const positions = getPositions();
  const orders = getOrders();

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
        </AnimatePresence>
      </div>
    </div>
  );
}

export default SectionTradePositionsOrders;
