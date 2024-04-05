"use client";
import Carousel from "@/components/ui/carousel";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { addCommas } from "@/lib/utils";
import { FaSearch } from "react-icons/fa";
import { FaHandHoldingDollar } from "react-icons/fa6";
import { TbCoins } from "react-icons/tb";
import { FiGift } from "react-icons/fi";
import { LiaMoneyBillWaveSolid } from "react-icons/lia";
import {
  MdOutlineGeneratingTokens,
  MdCurrencyExchange,
  MdOutlineAddChart,
} from "react-icons/md";
import { LuBarChart4 } from "react-icons/lu";

function SectionHomeHero() {
  return (
    <section className="flex flex-col space-y-5">
      <div className="flex items-center space-x-1 w-full bg-card rounded-lg px-5">
        <FaSearch className="text-card-foreground" />
        <Input
          className="bg-card border-none"
          placeholder="Search Something..."
        />
      </div>
      <Carousel images={["/home/banner.jpeg", "/home/banner.jpeg"]} />
      <Card>
        <div className="grid grid-cols-4 gap-5 md:gap-8">
          {navigations.map((x, index) => {
            return (
              <div
                key={x.name + index}
                className="flex flex-col items-center space-y-2 text-center group cursor-pointer"
              >
                <div className="text-[1.75rem] lg:text-[2rem] text-white group-hover:text-primary transition-all">
                  {x.icon}
                </div>
                <p className="text-card-foreground group-hover:text-primary transition-all">
                  {x.name}
                </p>
              </div>
            );
          })}
        </div>
      </Card>
      <Card>
        <div className="flex flex-wrap items-center justify-between md:justify-around gap-x-5 gap-y-8 max-w-[92.5%] mx-auto">
          {highlights.map((x, index) => {
            return (
              <div key={x.label + index} className="flex flex-col space-y-2">
                <p>
                  {x.label} <span className="text-green-400">{x.change}%</span>
                </p>
                <h1 className="text-white font-medium">{x.price}</h1>
                <p>US${addCommas(x.value)}</p>
              </div>
            );
          })}
        </div>
      </Card>
    </section>
  );
}

const navigations = [
  {
    name: "Staking",
    link: "/staking",
    icon: <FaHandHoldingDollar />,
  },
  {
    name: "Deposit",
    link: "/deposit",
    icon: <TbCoins />,
  },
  {
    name: "Gift",
    link: "/gift",
    icon: <FiGift />,
  },
  {
    name: "Pay",
    link: "/pay",
    icon: <LiaMoneyBillWaveSolid />,
  },
  {
    name: "Tokenized Stocks",
    link: "/tokenized-stocks",
    icon: <LuBarChart4 />,
  },
  {
    name: "Prediction Marker",
    link: "/prediction-market",
    icon: <MdOutlineAddChart />,
  },
  {
    name: "Leveraged Tokens",
    link: "/leveraged-tokens",
    icon: <MdOutlineGeneratingTokens />,
  },
  {
    name: "Spot Margin Trading",
    link: "/spot-margin-trading",
    icon: <MdCurrencyExchange />,
  },
];

const highlights = [
  {
    label: "PIO/USD",
    change: 1.24,
    price: 41.81,
    value: 562234211,
  },
  {
    label: "PIO/USD",
    change: 1.24,
    price: 41.81,
    value: 562234211,
  },
  {
    label: "PIO/USD",
    change: 1.24,
    price: 41.81,
    value: 562234211,
  },
];

export default SectionHomeHero;
