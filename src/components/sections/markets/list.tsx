"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { addCommas } from "@/lib/utils";
import Image from "next/image";
import { ChangeEvent, useState } from "react";
import { FaRegStar, FaSearch, FaStar } from "react-icons/fa";
import { LuArrowDown, LuArrowUp } from "react-icons/lu";

interface favoriteType {
  [key: string]: boolean;
}

function SectionMarketsList() {
  const [currentTab, setCurrentTab] = useState("All");
  const [filteredMarkets, setFilteredMarkets] = useState(markets);
  const [favorites, setFavorites] = useState<favoriteType>({});
  const [volumeDescending, setVolumeDescending] = useState(false);

  const toggleFavorite = (key: string) => {
    setFavorites((prevState) => {
      return {
        ...prevState,
        [key]: !prevState[key],
      };
    });
  };

  const toggleTab = (label: string) => {
    if (label === "All") {
      setFilteredMarkets(markets);
    } else {
      setFilteredMarkets(
        markets.filter((x) => x.market.toLowerCase() === label.toLowerCase())
      );
    }
    setCurrentTab(label);
  };

  const toggleVolume = () => {
    setVolumeDescending(!volumeDescending);
    if (volumeDescending) {
      setFilteredMarkets(markets.sort((a, b) => b.volume - a.volume));
    } else {
      setFilteredMarkets(markets.sort((a, b) => a.volume - b.volume));
    }
  };

  const searchHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setFilteredMarkets(
      markets.filter((x) =>
        x.name.toLowerCase().includes(e.target.value.toLowerCase())
      )
    );
  };
  return (
    <section className="flex flex-col h-full">
      <div className="h-[225px] md:h-[240px] sticky top-0 bg-background z-[99]">
        <div className="px-5">
          <h1 className="font-medium mt-5">Markets</h1>
          <div className="flex items-center space-x-1 w-full bg-card rounded-lg px-5 mt-5">
            <FaSearch className="text-card-foreground" />
            <Input
              onChange={searchHandler}
              placeholder="Search"
              className="bg-card border-none"
            />
          </div>
        </div>
        <div className="border-b mt-5">
          <div className="px-5">
            <h2 className="font-medium">Futures</h2>
            <div className="w-[36px] mt-3 h-[3px] bg-white"></div>
          </div>
        </div>
        <div className="border-b pb-3 mt-3">
          <div className="flex items-center space-x-2 px-5">
            {["All", "NYSE", "Nasdaq", "Forex"].map((x, index) => {
              return (
                <Button
                  key={x}
                  onClick={() => toggleTab(x)}
                  className={`p-2 px-4 rounded-lg text-white border border-card ${
                    currentTab === x ? "bg-card" : "bg-transparent"
                  } transition-all hover:bg-card`}
                >
                  <h3>{x}</h3>
                </Button>
              );
            })}
          </div>
        </div>
      </div>
      <div className="flex-grow overflow-y-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40px]"></TableHead>
              <TableHead>
                <div className="flex items-center space-x-2 my-3 md:my-5">
                  <p className="text-card-foreground">Name</p>
                  <p>/</p>
                  <div
                    onClick={toggleVolume}
                    className="flex items-center space-x-2 text-white hover:text-primary cursor-pointer"
                  >
                    {volumeDescending ? <LuArrowDown /> : <LuArrowUp />}
                    <p>Volume</p>
                  </div>
                </div>
              </TableHead>
              <TableHead>
                <p className="text-right whitespace-nowrap text-card-foreground cursor-pointer hover:text-primary">
                  Price / Daily Change
                </p>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMarkets.map((x) => {
              return (
                <TableRow key={x.name} className="border-none">
                  <TableCell className="pl-5">
                    <div className="flex items-center space-x-3 w-[40px]">
                      <div className="text-[1.1rem] transition-all cursor-pointer">
                        {favorites[x.name] ? (
                          <FaStar
                            className="text-primary"
                            onClick={() => toggleFavorite(x.name)}
                          />
                        ) : (
                          <FaRegStar
                            className="text-card-foreground"
                            onClick={() => toggleFavorite(x.name)}
                          />
                        )}
                      </div>
                      <Image width={30} height={30} src={x.icon} alt={x.name} />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="w-full">
                      <h2>{x.name}</h2>
                      <h3 className="text-card-foreground mt-1">
                        US${addCommas(x.volume)}
                      </h3>
                    </div>
                  </TableCell>
                  <TableCell className="text-right pr-5">
                    <div>
                      <h2>{x.price}</h2>
                      <h2
                        className={`${
                          x.dailyChange > 0 ? "text-green-400" : "text-red-400"
                        }`}
                      >
                        {x.dailyChange}%
                      </h2>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}

const markets = [
  {
    name: "BTC-PERP",
    volume: 3933129262,
    icon: "/markets/bitcoin.svg",
    price: 46745,
    dailyChange: 1.56,
    market: "nasdaq",
  },
  {
    name: "ETH-PERP",
    volume: 3002001202,
    icon: "/markets/ethereum.svg",
    price: 3000,
    dailyChange: 1.56,
    market: "nyse",
  },
  {
    name: "FTM-PERP",
    volume: 1000201862,
    icon: "/markets/ftm.svg",
    price: 200,
    dailyChange: 1.56,
    market: "nyse",
  },
  {
    name: "ATOM-PERP",
    volume: 12726152,
    icon: "/markets/atom.svg",
    price: 46745,
    dailyChange: 1.56,
    market: "nyse",
  },
  {
    name: "SOL-PERP",
    volume: 3933129262,
    icon: "/markets/sol.svg",
    price: 46745,
    dailyChange: 1.56,
    market: "forex",
  },
  {
    name: "NEAR-PERP",
    volume: 3933129262,
    icon: "/markets/near.svg",
    price: 46745,
    dailyChange: 1.56,
    market: "nasdaq",
  },
  {
    name: "LUNA-PERP",
    volume: 3933129262,
    icon: "/markets/luna.svg",
    price: 46745,
    dailyChange: 1.56,
    market: "nyse",
  },
  {
    name: "MATIC-PERP",
    volume: 3933129262,
    icon: "/markets/matic.svg",
    price: 46745,
    dailyChange: 1.56,
    market: "nyse",
  },
  {
    name: "DOT-PERP",
    volume: 3933129262,
    icon: "/markets/dot.svg",
    price: 46745,
    dailyChange: 1.56,
    market: "forex",
  },
  {
    name: "LINK-PERP",
    volume: 3933129262,
    icon: "/markets/link.svg",
    price: 46745,
    dailyChange: 1.56,
    market: "nasdaq",
  },
];

export default SectionMarketsList;
