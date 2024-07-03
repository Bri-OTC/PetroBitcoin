"use client";

import { useState } from "react";

export default function Information() {
  const [openInfoMenu, setOpenInfoMenu] = useState(true);

  return (
    <>
      {openInfoMenu && (
        <div className="bg-[#D7C04C] py-[8px] sticky inset-x-0 top-[45px] z-[49] w-full">
          <div className="lg:max-w-[1280px] mx-[auto] px-[15px]">
            <div className="relative">
              <div className="flex items-center justify-center">
                <p className="text-[#1a1a1a] md:text-[16px] text-[14px]">
                  Testnet under maintenance. Resuming shortly.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
