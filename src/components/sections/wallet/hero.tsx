"use client";
import { Button } from "@/components/ui/button";
import { TbNotes, TbCoins, TbUpload, TbArrowsExchange } from "react-icons/tb";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { MdOutlineTrendingUp } from "react-icons/md";
import { useState } from "react";

const menu = [
  {
    name: "Deposit",
    icon: <TbCoins />,
    link: "/deposit",
  },
  {
    name: "Withdraw",
    icon: <TbUpload />,
    link: "/withdraw",
  },
  {
    name: "Get Gaz",
    icon: <TbArrowsExchange />,
    link: "/get-gaz",
  },
];

function SectionWalletHero() {
  const [showBalance, setShowBalance] = useState(true);
  return (
    <section className="flex flex-col space-y-5">
      <div className="flex items-center justify-between">
        <h1>Wallet</h1>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon">
            <MdOutlineTrendingUp />
          </Button>
          <Button variant="ghost" className="flex items-center space-x-2">
            <TbNotes />
            <p className="font-medium">History</p>
          </Button>
        </div>
      </div>
      <div className="flex flex-col">
        <div className="flex items-center justify-between">
          <div
            onClick={() => setShowBalance(!showBalance)}
            className="flex items-center space-x-2 hover:brightness-[0.8] transition-all cursor-pointer"
          >
            <p className="text-card-foreground">Total Net USD Value</p>
            <div className="cursor-pointer">
              {showBalance ? <FaEye /> : <FaEyeSlash />}
            </div>
          </div>
          <p className="text-card-foreground">Convert Dust</p>
        </div>
        <div
          className={`${
            showBalance ? "max-h-[10rem]" : "max-h-0"
          } overflow-hidden transition-all`}
        >
          <div className="flex items-center justify-between mt-5">
            <div className="flex items-center space-x-1">
              <span className="text-card-foreground">≈</span>
              <h1>US$440,000,00,000.55</h1>
            </div>
            <p className="text-card-foreground text-right">
              View All Account Balance
            </p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-5 mt-5">
          {menu.map((x) => {
            return (
              <Button
                key={x.name}
                variant="ghost"
                className="flex items-center space-x-3 hover:text-primary"
              >
                <div className="text-[1.25rem]">{x.icon}</div>
                <p>{x.name}</p>
              </Button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

const list = [
  {
    icon: "/wallet/usd.svg",
    market: "USD",
    balance: 4538.81,
    value: 1000000,
  },
  {
    icon: "/wallet/ftt.svg",
    market: "FTT",
    balance: 4538.81,
    value: 1000000,
  },
  {
    icon: "/wallet/bitcoin.svg",
    market: "Bitcoin",
    balance: 4538.81,
    value: 1000000,
  },
  {
    icon: "/wallet/tether.svg",
    market: "USD Tether",
    balance: 4538.81,
    value: 1000000,
  },
  {
    icon: "/wallet/ethereum.svg",
    market: "Ethereum",
    balance: 4538.81,
    value: 1000000,
  },
  {
    icon: "/wallet/cash.svg",
    market: "Bitcoin Cash",
    balance: 4538.81,
    value: 1000000,
  },
  {
    icon: "/wallet/litecoin.svg",
    market: "Litecoin",
    balance: 4538.81,
    value: 1000000,
  },
  {
    icon: "/wallet/xrp.svg",
    market: "XRP",
    balance: 4538.81,
    value: 1000000,
  },
  {
    icon: "/wallet/ascendex.svg",
    market: "Ascendex Token (BTMX)",
    balance: 4538.81,
    value: 1000000,
  },
];

export default SectionWalletHero;
