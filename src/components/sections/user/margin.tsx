"use client";

import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";

const leverageValue = [1, 10, 25, 50, 100, 500];
function SectionUserMargin() {
  return (
    <section className="flex flex-col space-y-5 mt-5">
      <div className="border-b px-5">
        <div>
          <h2 className="font-medium pb-3">Margin</h2>
          <div className="w-[34px] h-[3.5px] bg-primary"></div>
        </div>
      </div>
      <div className="px-5">
        <Card>
          <div className="flex flex-col space-y-5">
            <h3 className="text-white">Leverage</h3>
            <div>
              <Slider defaultValue={[6]} min={1} max={6} step={1} />
              <div className="flex items-center justify-between mt-5">
                {leverageValue.map((x, index) => {
                  return (
                    <h2
                      className={`${
                        index !== 0 || index + 1 !== leverageValue.length
                          ? "ml-2"
                          : ""
                      }`}
                      key={x}
                    >
                      {x}x
                    </h2>
                  );
                })}
              </div>
            </div>
            <h3 className="text-white">Collateral</h3>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud Lorem ipsum dolor sit amet,
              consectetur adipiscing elit
            </p>
          </div>
        </Card>
      </div>
    </section>
  );
}

export default SectionUserMargin;
