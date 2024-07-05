"use client";

import { useState } from "react";
import { VelocityScroll } from "@/components/magicui/scroll-based-velocity";

export default function Information() {
  const [openInfoMenu, setOpenInfoMenu] = useState(true);

  return (
    <>
      {openInfoMenu && (
        <div className="bg-[#D7C04C] py-[8px] fixed top-0 left-0 right-0 z-[50] w-full">
          <div className="lg:max-w-[1280px] mx-[auto] px-[15px]">
            <div className="relative">
              <div className="flex items-center justify-center">
                <VelocityScroll
                  text=" Upgrading Testnet Intents Systems | Resuming Shortly | Collaterals are not Affected | Positions can be managed from explorer |            "
                  default_velocity={5}
                  className=" text-center text-2xl font-bold tracking-[-0.02em] text-black drop-shadow-sm dark:text-white "
                  /*
                  text=" Testnet    |       "
                  default_velocity={10}
                  className="text-xs tracking-[-0.02em] text-black drop-shadow-sm dark:text-white "*/
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
/*           <div className="bg-transparent fixed top-0 left-0 right-0 z-[50] w-full">
         
              */
