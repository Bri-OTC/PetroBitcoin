"use client";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import { useState } from "react";

function SectionHomeRanking() {
  const [currentTab, setCurrentTab] = useState("Winners");
  const [filteredRanking, setFilteredRanking] = useState(
    rankingData.filter((x) => x.type.toLowerCase() === "winners")
  );

  const toggleTab = (label: string) => {
    setCurrentTab(label);
    if (label === "All") {
      setFilteredRanking(rankingData);
    } else {
      setFilteredRanking(
        rankingData.filter((x) => x.type.toLowerCase() === label.toLowerCase())
      );
    }
  };
  return (
    <section className="flex flex-col space-y-5 mt-5">
      <div className="flex items-center space-x-3">
        <div className="w-[7px] h-[24px] bg-primary rounded-full"></div>
        <h1 className="font-medium">Ranking List</h1>
      </div>
      <Card className="p-0">
        <div className="flex flex-col items-center justify-center space-x-3">
          <div className="flex items-center space-x-3 justify-center mt-5">
            {["Winners", "Losers", "Volume"].map((x, index) => {
              return (
                <h3
                  onClick={() => toggleTab(x)}
                  key={x}
                  className={`px-4 py-2 border ${
                    currentTab == x ? "text-primary bg-[#2B3139]" : "text-white"
                  } rounded-xl cursor-pointer transition-all`}
                >
                  {x}
                </h3>
              );
            })}
          </div>
          <Table className="mt-5">
            <TableHeader>
              <TableRow>
                <TableHead className="w-full">
                  <h2 className="text-white font-medium">Futures</h2>
                </TableHead>
                <TableHead className="text-right">
                  <p>Price</p>
                </TableHead>
                <TableHead className="text-right">
                  <p>Change</p>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRanking.map((x, index) => {
                return (
                  <TableRow key={x.icon + index}>
                    <TableCell className="text-left">
                      <div className="flex items-center space-x-2">
                        <Image
                          width={29}
                          height={29}
                          src={x.icon}
                          alt={x.futures}
                        />
                        <h2 className="text-white">{x.futures}</h2>
                      </div>
                    </TableCell>
                    <TableCell
                      className={`text-right ${
                        x.change > 0 ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      <p>{x.price}</p>
                    </TableCell>
                    <TableCell
                      className={`text-right ${
                        x.change > 0 ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      <p>{x.change}%</p>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </Card>
    </section>
  );
}

const rankingData = [
  {
    icon: "/home/$.svg",
    futures: "C98-PERP",
    price: 2.527,
    change: 132.34,
    type: "winners",
  },
  {
    icon: "/home/$.svg",
    futures: "XYZ-PERP",
    price: 2.827,
    change: -20.34,
    type: "losers",
  },
  {
    icon: "/home/$.svg",
    futures: "C98-PERP",
    price: 3.111,
    change: 120.34,
    type: "winners",
  },
  {
    icon: "/home/$.svg",
    futures: "C98-PERP",
    price: 2.827,
    change: 132.34,
    type: "volume",
  },
  {
    icon: "/home/$.svg",
    futures: "C98-PERP",
    price: 3.111,
    change: 120.34,
    type: "winners",
  },
  {
    icon: "/home/$.svg",
    futures: "C98-PERP",
    price: 2.827,
    change: 132.34,
    type: "volume",
  },
  {
    icon: "/home/$.svg",
    futures: "C98-PERP",
    price: 2.222,
    change: 132.34,
    type: "volume",
  },
  {
    icon: "/home/$.svg",
    futures: "C98-PERP",
    price: 2.443,
    change: -20.34,
    type: "losers",
  },
  {
    icon: "/home/$.svg",
    futures: "C98-PERP",
    price: 2.827,
    change: 132.34,
    type: "volume",
  },
  {
    icon: "/home/$.svg",
    futures: "C98-PERP",
    price: 2.222,
    change: 132.34,
    type: "volume",
  },
  {
    icon: "/home/$.svg",
    futures: "C98-PERP",
    price: 2.443,
    change: -20.34,
    type: "losers",
  },
];

export default SectionHomeRanking;
