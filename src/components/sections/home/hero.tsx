"use client";
import { useState } from "react";
import Carousel from "@/components/ui/carousel";
import { Card } from "@/components/ui/card";
import { addCommas } from "@/lib/utils";
import { FaSearch } from "react-icons/fa";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import { BiCoinStack } from "react-icons/bi";
import { GiGiftOfKnowledge } from "react-icons/gi";
import { MdOutlineSwapHoriz } from "react-icons/md";
import { AiOutlineLineChart } from "react-icons/ai";
import { BsFileEarmarkText } from "react-icons/bs";
import { FaHome } from "react-icons/fa";
import { RiExchangeLine } from "react-icons/ri";
import Deposit from "../../../components/popup/Deposit";
import Withdraw from "../../../components/popup/Withdraw";
import Faucet from "../../../components/popup/Faucet";
import useBlurEffect from "@/components/hooks/blur";
import Link from "next/link";

function SectionHomeHero() {
  const blur = useBlurEffect();
  const [showDeposit, setShowDeposit] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [showFaucet, setShowFaucet] = useState(false);

  const handleDepositClick = () => {
    setShowDeposit(true);
  };

  const handleWithdrawClick = () => {
    setShowWithdraw(true);
  };

  const handleFaucetClick = () => {
    setShowFaucet(true);
  };

  const handleClosePopup = () => {
    setShowDeposit(false);
    setShowWithdraw(false);
    setShowFaucet(false);
  };

  return (
    <div className={`container ${blur ? "blur" : ""}`}>
      <section className="flex flex-col space-y-5 w-full">
        <Link href="/markets">
          <div className="flex items-center space-x-1 w-full bg-card rounded-lg px-5 py-3 transition-colors duration-200 ease-in-out hover:bg-card-foreground hover:text-card">
            <FaSearch className="text-card-foreground" />
            <span className="text-card-foreground">Search Something...</span>
          </div>
        </Link>

        <div style={{ zIndex: 1 }}>
          <Carousel images={["/home/banner.jpeg", "/home/banner.jpeg"]} />
        </div>
        <Card>
          <div className="grid grid-cols-4 gap-5 md:gap-8">
            {navigations.map((x, index) => {
              return (
                <div
                  key={x.name + index}
                  className="flex flex-col items-center space-y-2 text-center group cursor-pointer"
                  onClick={() => {
                    if (x.name === "Deposit") handleDepositClick();
                    if (x.name === "Withdraw") handleWithdrawClick();
                    if (x.name === "Faucet") handleFaucetClick();
                  }}
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
                    {x.label}{" "}
                    <span className="text-green-400">{x.change}%</span>
                  </p>
                  <h1 className="text-white font-medium">{x.price}</h1>
                  <p>US${addCommas(x.value)}</p>
                </div>
              );
            })}
          </div>
        </Card>

        {showDeposit && (
          <Deposit open={showDeposit} onClose={handleClosePopup} />
        )}
        {showWithdraw && (
          <Withdraw open={showWithdraw} onClose={handleClosePopup} />
        )}
        {showFaucet && <Faucet open={showFaucet} onClose={handleClosePopup} />}
      </section>
    </div>
  );
}

const navigations = [
  {
    name: "Deposit",
    icon: <RiMoneyDollarCircleLine />,
  },
  {
    name: "Withdraw",
    icon: <BiCoinStack />,
  },
  {
    name: "Faucet",
    icon: <GiGiftOfKnowledge />,
  },
  {
    name: "Trade",
    link: "/trade",
    icon: <MdOutlineSwapHoriz />,
  },
  {
    name: "Presale",
    link: "https://www.pio.finance/Presale",
    icon: <AiOutlineLineChart />,
  },
  {
    name: "Docs",
    link: "https://developer.pio.finance/",
    icon: <BsFileEarmarkText />,
  },
  {
    name: "Home",
    link: "/",
    icon: <FaHome />,
  },
  {
    name: "Spot Trading",
    link: "https://app.1inch.io/#/1/unified/swap/ETH/DAI",
    icon: <RiExchangeLine />,
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
