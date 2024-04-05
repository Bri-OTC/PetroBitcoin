"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { CgMaximizeAlt } from "react-icons/cg";
import { FaRegClock, FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { HiOutlineCog6Tooth } from "react-icons/hi2";
import { BsThreeDotsVertical } from "react-icons/bs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PopupShare from "../../popup/share";
import PopupChart from "@/components/popup/chart";
import PopupModify from "@/components/popup/modify";

function SectionTradeChart() {
  const [showChart, setShowChart] = useState(true);
  return (
    <div className="flex flex-col space-y-3 mt-2 px-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-accent-foreground">24h volume</p>
          <p>US$2,455,213,189</p>
        </div>
        <div>
          <p className="text-accent-foreground">Predicted funding rate</p>
          <p>
            <span className="text-red-500">0.0022%</span> in 47 min
          </p>
        </div>
        <div className="flex items-center space-x-5">
          <Dialog>
            <DialogTrigger className="bg-card p-2">
              <BsThreeDotsVertical className="text-[1.1rem]" />
            </DialogTrigger>
            <PopupShare />
          </Dialog>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <Select>
          <SelectTrigger className="w-fit flex items-center space-x-2">
            <FaRegClock />
            <SelectValue placeholder="1D" className="outline-none" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1D">1D</SelectItem>
            <SelectItem value="1H">1H</SelectItem>
            <SelectItem value="1W">1W</SelectItem>
            <SelectItem value="1M">1M</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex items-center space-x-2">
          <Dialog>
            <DialogTrigger className="bg-card p-2">
              <HiOutlineCog6Tooth className="text-[1.1rem]" />
            </DialogTrigger>
            <PopupModify />
          </Dialog>
          <Button
            onClick={() => setShowChart(!showChart)}
            size="icon"
            variant="ghost"
          >
            {showChart ? <FaRegEye /> : <FaRegEyeSlash />}
          </Button>
          <Dialog>
            <DialogTrigger className="bg-card p-2">
              <CgMaximizeAlt className="text-[1.1rem]" />
            </DialogTrigger>
            <PopupChart />
          </Dialog>
        </div>
      </div>
      <div
        className={`${
          showChart ? "max-h-[50rem]" : "max-h-0"
        } overflow-hidden transition-all bg-card text-white`}
      >
        <div className="min-h-[225px] flex items-center justify-center">
          <h1>Chart</h1>
        </div>
      </div>
    </div>
  );
}

export default SectionTradeChart;
