"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { FaRegStar, FaStar } from "react-icons/fa";
import { MdMenu } from "react-icons/md";

function SectionTradeHeader() {
  const [favorite, setFavorite] = useState(false);
  return (
    <div className="flex justify-between items-center space-x-5 px-5">
      <div className="flex items-center space-x-3">
        <Sheet>
          <SheetTrigger>
            <MdMenu className="text-[1.5rem]" />
          </SheetTrigger>
          <SheetContent side="left">
            <div>
              <h1>Menu</h1>
              <h3 className="mt-5">This is menu.</h3>
            </div>
          </SheetContent>
        </Sheet>
        <div className="flex items-center space-x-2">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>TPG</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-medium">BTC-PERP</h2>
            <p className="text-card-foreground">Bitcoin Perpetual Futures</p>
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <div onClick={() => setFavorite(!favorite)}>
          {favorite ? <FaStar className="text-primary" /> : <FaRegStar />}
        </div>
        <div className="text-right">
          <h2>46745</h2>
          <h2 className="text-green-400">1.56%</h2>
        </div>
      </div>
    </div>
  );
}

export default SectionTradeHeader;
