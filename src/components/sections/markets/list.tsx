"use client";
// components/sections/markets/list.tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useBlurEffect from "@/hooks/blur";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChangeEvent, useState } from "react";
import { FaSearch } from "react-icons/fa";
import ResearchComponent from "./ResearchComponentold";

interface Market {
  name: string;
  price: number;
  icon: string;
}

function SectionMarketsList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMarket, setSelectedMarket] = useState<Market | null>(null);
  const blur = useBlurEffect();
  const searchHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value.toLowerCase();
    setSearchTerm(searchTerm);
  };

  const handleMarketClick = (market: Market) => {
    setSelectedMarket(market);
  };

  return (
    <div className={`container ${blur ? "blur" : ""}`}>
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
          <div className="flex-grow overflow-y-auto mt-5">
            <Table>
              <TableHeader></TableHeader>
              <TableBody>
                <ResearchComponent
                  searchTerm={searchTerm}
                  onMarketClick={handleMarketClick}
                  selectedMarket={selectedMarket}
                  activeTab="all"
                  sortByPrice={false}
                  handleTabClick={() => {}}
                  toggleSortByPrice={() => {}}
                />
              </TableBody>
            </Table>
          </div>
        </div>
      </section>
    </div>
  );
}

export default SectionMarketsList;
