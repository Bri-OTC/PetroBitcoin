"use client";

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
