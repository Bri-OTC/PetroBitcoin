// app/page.tsx
"use client";
import { useState } from "react";
import { GoHomeFill } from "react-icons/go";
import { MdOutlineInsertChart } from "react-icons/md";
import { RiExchangeBoxLine } from "react-icons/ri";
import { IoPersonSharp } from "react-icons/io5";
import { BiSolidWallet } from "react-icons/bi";

// Import your tab content components
import Landing from "./landing/page";
import Markets from "./markets/page";
import Trade from "./trade/page";
import Wallet from "./wallet/page";
import User from "./user/page";

function Global() {
  const [selectedTab, setSelectedTab] = useState("Landing");

  const renderContent = () => {
    switch (selectedTab) {
      case "Landing":
        return <Landing />;
      case "Markets":
        return <Markets />;
      case "Trade":
        return <Trade />;
      case "Wallet":
        return <Wallet />;
      case "User":
        return <User />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full">
      <div className="container bg-background">
        <h3 className="text-center text-white p-3">Account: The Pioner Guy</h3>
      </div>
      <div className="bg-accent text-card-foreground">
        <div className="flex items-center justify-between w-full container py-3 space-x-5">
          {menus.map((x) => {
            return (
              <div
                key={x.name}
                className={`${
                  selectedTab === x.name
                    ? "text-primary"
                    : "text-card-foreground"
                } group flex flex-col items-center text-center space-y-1 hover:text-primary w-full cursor-pointer transition-all`}
                onClick={() => setSelectedTab(x.name)}
              >
                <div className="text-[1.5rem] md:text-[2rem]">{x.icon}</div>
                <p>{x.name}</p>
              </div>
            );
          })}
        </div>
      </div>
      <div className="container">{renderContent()}</div>
    </div>
  );
}

const menus = [
  { name: "Landing", icon: <GoHomeFill /> },
  { name: "Markets", icon: <MdOutlineInsertChart /> },
  { name: "Trade", icon: <RiExchangeBoxLine /> },
  { name: "Wallet", icon: <BiSolidWallet /> },
  { name: "User", icon: <IoPersonSharp /> },
];

function Pages() {
  return (
    <div>
      {/* Your existing page content */}
      <Global />
    </div>
  );
}

export default Pages;
