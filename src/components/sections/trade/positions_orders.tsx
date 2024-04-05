"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import { Fragment, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { FaEdit } from "react-icons/fa";
import { IoMdShare } from "react-icons/io";

const menu = ["Positions", "Orders"];

const positions = [
  {
    size: -0.0048,
    market: "BTC-PERP",
    icon: "/trade/bitcoin.svg",
    mark: 45000,
    entryPrice: 312.89,
    pnl: -0.03,
    amount: 233.212,
    type: "Stop Market",
    limitPrice: "N/A",
    status: "Open",
    reduceOnly: "No",
    fillAmount: "Yes",
  },
  {
    size: -0.0048,
    market: "ETH-PERP",
    icon: "/trade/ethereum.svg",
    mark: 45000,
    entryPrice: 312.89,
    pnl: -0.03,
    amount: 233.212,
    type: "Stop Market",
    limitPrice: "N/A",
    status: "Open",
    reduceOnly: "No",
    fillAmount: "Yes",
  },
  {
    size: 1.222,
    market: "ATOM-PERP",
    icon: "/trade/atom.svg",
    mark: 45000,
    entryPrice: 312.89,
    pnl: -0.03,
    amount: 233.212,
    type: "Stop Market",
    limitPrice: "N/A",
    status: "Open",
    reduceOnly: "No",
    fillAmount: "Yes",
  },
];

const orders = [
  {
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
  {
    size: -0.0048,
    market: "ETHEREUM-PERP",
    icon: "/trade/ethereum.svg",
    trigger: 45000,
    amount: 312.89,
    filled: -0.03,
    remainingSize: 233.212,
    estLiq: 54427.07,
    breakEvenPrice: 49921.0,
  },
];

interface activeMenu {
  [key: string]: boolean;
}

function SectionTradePositionsOrders() {
  const [currentTab, setCurrentTab] = useState(menu[0]);
  const [currentActiveRowPositions, setCurrentActiveRowPositions] =
    useState<activeMenu>({});
  const [currentActiveRowOrders, setCurrentActiveRowOrders] =
    useState<activeMenu>({});

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
          {/* Positions Tab End  */}
          {currentTab === "Positions" && (
            <motion.div
              key="Positions"
              exit={{ opacity: 0 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Table className="whitespace-nowrap">
                <TableHeader>
                  <TableRow className="hover:bg-background border-none">
                    <TableHead className="pr-0"></TableHead>
                    <TableHead>
                      <p className="text-card-foreground">Size / Market</p>
                    </TableHead>
                    <TableHead>
                      <p className="text-card-foreground">Mark / Entry Price</p>
                    </TableHead>
                    <TableHead className="text-right">
                      <p className="text-card-foreground">Pnl. Amount</p>
                      <p>(USD)</p>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {positions.map((x, index) => {
                    return (
                      <Fragment key={x.market + "Fragment"}>
                        {index !== 0 && (
                          <TableRow
                            key={x.market + "Positions"}
                            className="border-none"
                          >
                            <TableCell className="py-2"></TableCell>
                          </TableRow>
                        )}
                        <TableRow
                          onClick={() => toggleActiveRow(x.market)}
                          key={x.icon + "Positions"}
                          className="bg-card hover:bg-card border-none cursor-pointer"
                        >
                          <TableCell className="pl-3 pr-0 w-[45px]">
                            <div>
                              <Image
                                src={x.icon}
                                alt={x.market}
                                width={30}
                                height={30}
                              />
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <h3
                                className={`${
                                  x.size >= 0
                                    ? "text-green-400"
                                    : "text-red-400"
                                }`}
                              >
                                {x.size}
                              </h3>
                              <h3 className="text-card-foreground">
                                {x.market}
                              </h3>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <h3>{x.mark}</h3>
                              <h3 className="text-card-foreground">
                                {x.entryPrice} USD
                              </h3>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div>
                              <h3
                                className={`${
                                  x.pnl >= 0 ? "text-green-400" : "text-red-400"
                                }`}
                              >
                                {x.pnl}
                              </h3>
                              <h3 className="text-card-foreground">
                                {x.amount}
                              </h3>
                            </div>
                          </TableCell>
                        </TableRow>
                        {currentActiveRowPositions[x.market] && (
                          <>
                            <TableRow
                              key={x.market + "Positions" + "Child"}
                              className="bg-card hover:bg-card border-none"
                            >
                              <TableCell colSpan={4} className="py-1">
                                <div className="w-full flex justify-between">
                                  <div className="w-full">
                                    <p className="text-card-foreground">Type</p>
                                    <p className="font-medium">{x.type}</p>
                                  </div>
                                  <div className="text-center w-full">
                                    <p className="text-card-foreground">
                                      Limit Price
                                    </p>
                                    <p className="font-medium">
                                      {x.limitPrice}
                                    </p>
                                  </div>
                                  <div className="text-right w-full">
                                    <p className="text-card-foreground">
                                      Status
                                    </p>
                                    <p className="font-medium">{x.status}</p>
                                  </div>
                                </div>
                              </TableCell>
                            </TableRow>
                            <TableRow
                              key={x.market + "Positions" + "Child" + "2"}
                              className="bg-card hover:bg-card border-none"
                            >
                              <TableCell colSpan={4} className="py-1">
                                <div className="w-full flex justify-around">
                                  <div className="text-center">
                                    <p className="text-card-foreground">
                                      Reduce Only
                                    </p>
                                    <p className="font-medium">
                                      {x.reduceOnly}
                                    </p>
                                  </div>
                                  <div className="text-center">
                                    <p className="text-card-foreground">
                                      Fill Amount
                                    </p>
                                    <p className="font-medium">
                                      {x.fillAmount}
                                    </p>
                                  </div>
                                </div>
                              </TableCell>
                            </TableRow>
                            <TableRow
                              key={x.market + "Positions" + "Child" + "3"}
                              className="bg-card hover:bg-card border-none"
                            >
                              <TableCell colSpan={4}>
                                <div className="w-full flex justify-center space-x-3">
                                  <Button
                                    variant="secondary"
                                    className="flex space-x-2"
                                  >
                                    <FaEdit />
                                    <p>Modify</p>
                                  </Button>
                                  <Button
                                    onClick={() => hideRow(x.market)}
                                    variant="destructive"
                                  >
                                    <p>Cancel</p>
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          </>
                        )}
                      </Fragment>
                    );
                  })}
                </TableBody>
              </Table>
            </motion.div>
          )}
          {/* Positions Tab End  */}

          {/* Orders Tab  */}

          {currentTab === "Orders" && (
            <motion.div
              key="Orders"
              exit={{ opacity: 0 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Table className="whitespace-nowrap">
                <TableHeader>
                  <TableRow className="hover:bg-background border-none">
                    <TableHead className="w-[50px] pr-0"></TableHead>
                    <TableHead>
                      <p className="text-card-foreground">Size / Market</p>
                    </TableHead>
                    <TableHead>
                      <p className="text-card-foreground">Trigger</p>
                      <p>/ Amount</p>
                    </TableHead>
                    <TableHead className="text-right">
                      <p className="text-card-foreground">Filled</p>
                      <p className="text-card-foreground">/ Remaining Size</p>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((x, index) => {
                    return (
                      <Fragment key={x.market + "Orders"}>
                        {index !== 0 && (
                          <TableRow
                            key={x.market + "Positions"}
                            className="border-none"
                          >
                            <TableCell className="py-2"></TableCell>
                          </TableRow>
                        )}
                        <TableRow
                          onClick={() => toggleActiveRow(x.market)}
                          key={x.icon + "Orders"}
                          className="bg-card hover:bg-card border-none cursor-pointer"
                        >
                          <TableCell className="pl-3 pr-0 w-[45px]">
                            <div>
                              <Image
                                src={x.icon}
                                alt={x.market}
                                width={30}
                                height={30}
                              />
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <h3
                                className={`${
                                  x.size >= 0
                                    ? "text-green-400"
                                    : "text-red-400"
                                }`}
                              >
                                {x.size}
                              </h3>
                              <h3 className="text-card-foreground">
                                {x.market}
                              </h3>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <h3>{x.trigger}</h3>
                              <h3 className="text-card-foreground">
                                {x.amount} USD
                              </h3>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div>
                              <h3
                                className={`${
                                  x.filled >= 0
                                    ? "text-green-400"
                                    : "text-red-400"
                                }`}
                              >
                                {x.filled}
                              </h3>
                              <h3 className="text-card-foreground">
                                {x.remainingSize}
                              </h3>
                            </div>
                          </TableCell>
                        </TableRow>
                        {currentActiveRowOrders[x.market] && (
                          <>
                            <TableRow
                              key={x.market + "Orders" + "Child"}
                              className="bg-card hover:bg-card border-none"
                            >
                              <TableCell colSpan={4} className="py-1">
                                <div className="w-full flex justify-around">
                                  <div className="text-center">
                                    <p className="text-card-foreground">
                                      Est. Liq
                                    </p>
                                    <p className="font-medium">{x.estLiq}</p>
                                  </div>
                                  <div className="text-center">
                                    <p className="text-card-foreground">
                                      Break-even price
                                    </p>
                                    <p className="font-medium">
                                      {x.breakEvenPrice}
                                    </p>
                                  </div>
                                </div>
                              </TableCell>
                            </TableRow>
                            <TableRow
                              key={x.market + "Orders" + "Child" + "2"}
                              className="bg-card hover:bg-card border-none"
                            >
                              <TableCell colSpan={4}>
                                <div className="w-full flex justify-center space-x-3">
                                  <Button
                                    onClick={() => hideRow(x.market)}
                                    variant="secondary"
                                  >
                                    <p>Market Close</p>
                                  </Button>
                                  <Button variant="secondary">
                                    <IoMdShare />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          </>
                        )}
                      </Fragment>
                    );
                  })}
                </TableBody>
              </Table>
              <Button variant="ghost" className="text-primary w-full mt-5">
                <p>Cancel All</p>
              </Button>
            </motion.div>
          )}
          {/* Orders Tab End  */}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default SectionTradePositionsOrders;
