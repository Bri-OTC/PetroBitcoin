import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import { Fragment } from "react";
import { Button } from "@/components/ui/button";
import { IoMdShare } from "react-icons/io";

interface Order {
  size: number;
  market: string;
  icon: string;
  trigger: number;
  amount: number;
  filled: number;
  remainingSize: number;
  estLiq: number;
  breakEvenPrice: number;
}

interface SectionOrdersProps {
  orders: Order[];
  currentActiveRowOrders: { [key: string]: boolean };
  toggleActiveRow: (label: string) => void;
  hideRow: (label: string) => void;
}

function SectionOrders({
  orders,
  currentActiveRowOrders,
  toggleActiveRow,
  hideRow,
}: SectionOrdersProps) {
  return (
    <Table className="whitespace-nowrap">
      <TableHeader>
        <TableRow className="hover:bg-background border-none">
          <TableHead className="w-[50px] pr-0"></TableHead>
          <TableHead>
            <p className="text-card-foreground">Size / Market</p>
          </TableHead>
          <TableHead>
            <p className="text-card-foreground">Trigger</p>
            <p>/ Amount</p>
          </TableHead>
          <TableHead className="text-right">
            <p className="text-card-foreground">Filled</p>
            <p className="text-card-foreground">/ Remaining Size</p>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((x, index) => {
          return (
            <Fragment key={x.market + "Orders"}>
              {index !== 0 && (
                <TableRow key={x.market + "Positions"} className="border-none">
                  <TableCell className="py-2"></TableCell>
                </TableRow>
              )}
              <TableRow
                onClick={() => toggleActiveRow(x.market)}
                key={x.icon + "Orders"}
                className="bg-card hover:bg-card border-none cursor-pointer"
              >
                <TableCell className="pl-3 pr-0 w-[45px]">
                  <div>
                    <Image src={x.icon} alt={x.market} width={30} height={30} />
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <h3
                      className={`${
                        x.size >= 0 ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {x.size}
                    </h3>
                    <h3 className="text-card-foreground">{x.market}</h3>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <h3>{x.trigger}</h3>
                    <h3 className="text-card-foreground">{x.amount} USD</h3>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div>
                    <h3
                      className={`${
                        x.filled >= 0 ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {x.filled}
                    </h3>
                    <h3 className="text-card-foreground">{x.remainingSize}</h3>
                  </div>
                </TableCell>
              </TableRow>
              {currentActiveRowOrders[x.market] && (
                <>
                  <TableRow
                    key={x.market + "Orders" + "Child"}
                    className="bg-card hover:bg-card border-none"
                  >
                    <TableCell colSpan={4} className="py-1">
                      <div className="w-full flex justify-around">
                        <div className="text-center">
                          <p className="text-card-foreground">Est. Liq</p>
                          <p className="font-medium">{x.estLiq}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-card-foreground">
                            Break-even price
                          </p>
                          <p className="font-medium">{x.breakEvenPrice}</p>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow
                    key={x.market + "Orders" + "Child" + "2"}
                    className="bg-card hover:bg-card border-none"
                  >
                    <TableCell colSpan={4}>
                      <div className="w-full flex justify-center space-x-3">
                        <Button
                          onClick={() => hideRow(x.market)}
                          variant="secondary"
                        >
                          <p>Market Close</p>
                        </Button>
                        <Button variant="secondary">
                          <IoMdShare />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                </>
              )}
            </Fragment>
          );
        })}
      </TableBody>
    </Table>
  );
}

export default SectionOrders;
