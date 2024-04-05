"use client";

import { Card } from "@/components/ui/card";

function SectionUserFees() {
  return (
    <section className="flex flex-col space-y-5 mt-5">
      <div className="border-b px-5">
        <div>
          <h2 className="font-medium pb-3">Fees</h2>
          <div className="w-[34px] h-[3.5px] bg-primary"></div>
        </div>
      </div>
      <div className="px-5">
        <Card>
          <div className="flex flex-col space-y-3">
            <div className="flex items-center space-x-2">
              <h3 className="font-medium text-primary">FTT balance :</h3>
              <h3>0.03482727</h3>
            </div>
            <div className="flex items-center space-x-2">
              <h3 className="font-medium text-white">Maker fee :</h3>
              <h3>0.03482727%</h3>
            </div>
            <div className="flex items-center space-x-2">
              <h3 className="font-medium text-white">Taker fee :</h3>
              <h3>0.03482727%</h3>
            </div>
            <div className="flex items-center space-x-2">
              <h3 className="font-medium text-white">Fee tier :</h3>
              <h3>2</h3>
            </div>
            <div className="flex items-center space-x-2">
              <h3 className="font-medium text-white">30 day volume :</h3>
              <h3>$US1,000,000</h3>
            </div>
            <div className="flex items-center space-x-2">
              <h3 className="font-medium text-white">30 day maker volume :</h3>
              <h3>$US1,000,000</h3>
            </div>
            <div className="w-full h-[1px] bg-border"></div>
            <h3 className="font-semibold text-white">Pioner Statistics</h3>
            <div className="flex items-center space-x-2">
              <h3 className="font-medium text-white">24 h Volume :</h3>
              <h3>$US1,000,000</h3>
            </div>
            <div className="flex items-center space-x-2">
              <h3 className="font-medium text-white">30 d Volume :</h3>
              <h3>$US1,000,000</h3>
            </div>
            <div className="flex items-center space-x-2">
              <h3 className="font-medium text-white">All Time Volume :</h3>
              <h3>$US1,000,000</h3>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}

export default SectionUserFees;
