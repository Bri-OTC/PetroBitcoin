"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatNumber } from "@/lib/utils";
import { HiOutlineCog6Tooth } from "react-icons/hi2";
import { PiChartPieSlice } from "react-icons/pi";
import { FaSearch } from "react-icons/fa";
import { ChangeEvent, useState } from "react";
import Image from "next/image";

function SectionWalletTable() {
  const [filteredList, setFilteredList] = useState(list);

  const searchHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setFilteredList(
      list.filter((x) =>
        x.market.toLowerCase().includes(e.target.value.toLowerCase())
      )
    );
  };

  return (
    <div className="mt-5 flex flex-col space-y-5">
      <div className="flex items-center space-x-5">
        <div className="flex items-center space-x-1 w-full bg-card rounded-lg px-5">
          <FaSearch className="text-card-foreground" />
          <Input
            onChange={searchHandler}
            className="bg-card border-none"
            placeholder="Search Market"
          />
        </div>
        <Button size="icon" variant="ghost">
          <HiOutlineCog6Tooth className="text-[1.1rem]" />
        </Button>
        <Button size="icon" variant="ghost">
          <PiChartPieSlice className="text-[1.1rem]" />
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow className="border-none">
            <TableHead className="w-[40px]"></TableHead>
            <TableHead>
              <p>Market</p>
            </TableHead>
            <TableHead>
              <p>Balance</p>
            </TableHead>
            <TableHead className="text-right">
              <p>USD Value</p>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredList.map((x) => {
            return (
              <TableRow key={x.market} className="border-none">
                <TableCell className="w-[50px] pr-0">
                  <div className="w-[30px]">
                    <Image src={x.icon} alt={x.market} width={30} height={30} />
                  </div>
                </TableCell>
                <TableCell>
                  <h2>{x.market}</h2>
                </TableCell>
                <TableCell>
                  <h2>{x.balance}</h2>
                </TableCell>
                <TableCell className="text-right">
                  <h2>{formatNumber(x.value)}</h2>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
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

export default SectionWalletTable;
