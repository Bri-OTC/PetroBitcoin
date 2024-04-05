"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useRef } from "react";
import { toast } from "react-toastify";

function SectionUserReferrals() {
  const inputRef = useRef<HTMLInputElement>(null);

  const copyHandler = () => {
    navigator.clipboard.writeText(inputRef.current!.value);
    toast("Copied to clipboard");
  };

  return (
    <div className="flex flex-col space-y-5 mt-5">
      <div className="border-b px-5">
        <div>
          <h2 className="font-medium pb-3">Referrals</h2>
          <div className="w-[34px] h-[3.5px] bg-primary"></div>
        </div>
      </div>
      <div className="px-5">
        <Card>
          <div className="flex flex-col">
            <h3 className="text-white leading-none">
              Enjoy discounted fees and get paid referral rebates. For more
              info, visit Referrals page
            </h3>
            <p className="mt-3">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation{" "}
            </p>
            <div className="flex items-center space-x-4 mt-5">
              <Input
                value={"https://www.pioner.io/"}
                ref={inputRef}
                className="outline-none"
                placeholder="Input referrals code"
              />
              <Button onClick={copyHandler}>Copy</Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default SectionUserReferrals;
