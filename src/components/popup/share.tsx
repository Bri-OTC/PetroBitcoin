import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { DialogClose, DialogContent } from "@/components/ui/dialog";
import { FaArrowUp } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";
import Image from "next/image";

function PopupShare() {
  return (
    <DialogContent className="border-none">
      <div className="flex justify-end">
        <DialogClose>
          <AiOutlineClose className="text-[1.5rem]" />
        </DialogClose>
      </div>
      <Image width={150} height={80} src="/logo.svg" alt="Pioner Labs" />
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Image width={28} height={28} src="/markets/bitcoin.svg" alt="BTC" />
          <h2>BTC-PERP</h2>
        </div>
        <Button className="flex items-center space-x-2 text-white bg-green-500 hover:bg-green-600">
          <FaArrowUp />
          <h2>Long</h2>
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-5">
        <div className="w-full min-h-[100px] flex flex-col items-center text-center justify-center bg-card rounded-xl">
          <h1 className="font-medium">1.000$</h1>
          <p className="text-card-foreground">PNL</p>
        </div>
        <div className="w-full min-h-[100px] flex flex-col items-center text-center justify-center bg-card rounded-xl">
          <h1 className="text-green-500 font-medium">0.43%</h1>
          <p className="text-card-foreground">Marked to Last Trade</p>
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <Checkbox className="h-5 w-5" />
        <h3>Share times</h3>
      </div>
      <Card>
        <div className="flex flex-col items-center text-center space-y-2">
          <h3>
            <span className="text-white">Opened at :</span> 01/05/2022 9:08:19
            AM
          </h3>
          <h3>
            <span className="text-white">Closed at :</span> 01/05/2022 9:08:19
            AM
          </h3>
        </div>
      </Card>
      <div className="flex items-center space-x-3">
        <Checkbox className="h-5 w-5" />
        <h3>Share prices</h3>
      </div>
      <Card>
        <div className="flex flex-col items-center text-center space-y-2">
          <h3>
            <span className="text-white">Avg entry price:</span> 27,879
          </h3>
          <h3>
            <span className="text-white">Avg exit price:</span> 48,278
          </h3>
        </div>
      </Card>
      <div className="flex items-center space-x-3">
        <Checkbox className="h-5 w-5" />
        <h3>Share prices</h3>
      </div>
      <Card>
        <div className="flex flex-col items-center text-center space-y-2">
          <h3>
            <span className="text-white">Leverage:</span> 5x
          </h3>
        </div>
      </Card>
      <div className="flex justify-end items-center space-x-5 mt-5">
        <DialogClose>
          <Button variant="outline">Cancel</Button>
        </DialogClose>
        <DialogClose>
          <Button>Save</Button>
        </DialogClose>
      </div>
    </DialogContent>
  );
}

export default PopupShare;
