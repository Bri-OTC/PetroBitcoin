"use client";
// components/sections/markets/list.tsx
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
import { ChangeEvent, useState } from "react";
import { FaSearch } from "react-icons/fa";
import ResearchComponent from "./ResearchComponent";
import PriceComponent from "./PriceComponent";

interface Market {
  name: string;
  price: number;
  icon: string;
}

function SectionMarketsList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMarket, setSelectedMarket] = useState<Market | null>(null);

  const searchHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value.toLowerCase();
    setSearchTerm(searchTerm);
  };

  const handleMarketClick = (market: Market) => {
    setSelectedMarket(market);
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
            <h2 className="font-medium">Forex</h2>
            <div className="w-[36px] mt-3 h-[3px] bg-white"></div>
          </div>
        </div>
        <div className="border-b pb-3 mt-3">
          <div className="flex items-center space-x-2 px-5">
            <Button className="p-2 px-4 rounded-lg text-white border border-card bg-card transition-all hover:bg-card">
              <h3>All</h3>
            </Button>
          </div>
        </div>
      </div>
      <div className="flex-grow overflow-y-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <ResearchComponent
              searchTerm={searchTerm}
              onMarketClick={handleMarketClick}
              selectedMarket={selectedMarket}
            />
          </TableBody>
        </Table>
      </div>
      {selectedMarket && (
        <PriceComponent
          market={selectedMarket}
          onClose={() => setSelectedMarket(null)}
        />
      )}
    </section>
  );
}

export default SectionMarketsList;
