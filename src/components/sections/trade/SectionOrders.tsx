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
import { FaEdit } from "react-icons/fa";

export interface Order {
  id: number;
  size: number;
  market: string;
  icon: string;
  trigger: number;
  amount: number;
  filled: number;
  remainingSize: number;
  breakEvenPrice: number;
  limitPrice: string;
  status: string;
  reduceOnly: string;
  fillAmount: string;
  entryTime: string;
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
          <TableHead className="pr-0"></TableHead>
          <TableHead>
            <p className="text-card-foreground">Size / Market</p>
          </TableHead>
          <TableHead>
            <p className="text-card-foreground">Trigger / Amount</p>
          </TableHead>
          <TableHead className="text-right">
            <p className="text-card-foreground">Filled / Remaining Size</p>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((x, index) => {
          return (
            <Fragment key={x.market + "Fragment"}>
              {index !== 0 && (
                <TableRow key={x.market + "Orders"} className="border-none">
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
                    <h3 className="text-card-foreground">{x.amount}</h3>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div>
                    <h3>{x.filled}</h3>
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
                      <div className="w-full flex justify-between">
                        <div className="w-full text-center">
                          <p className="text-card-foreground">
                            Break Even Price
                          </p>
                          <p className="font-medium">{x.breakEvenPrice}</p>
                        </div>
                        <div className="text-center w-full">
                          <p className="text-card-foreground">Limit Price</p>
                          <p className="font-medium">{x.limitPrice}</p>
                        </div>
                        <div className="text-right w-full">
                          <p className="text-card-foreground">Status</p>
                          <p className="font-medium">{x.status}</p>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow
                    key={x.market + "Orders" + "Child" + "2"}
                    className="bg-card hover:bg-card border-none"
                  >
                    <TableCell colSpan={4} className="py-1">
                      <div className="w-full flex justify-around">
                        <div className="text-center">
                          <p className="text-card-foreground">Reduce Only</p>
                          <p className="font-medium">{x.reduceOnly}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-card-foreground">Fill Amount</p>
                          <p className="font-medium">{x.fillAmount}</p>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow
                    key={x.market + "Orders" + "Child" + "3"}
                    className="bg-card hover:bg-card border-none"
                  >
                    <TableCell colSpan={4}>
                      <div className="w-full flex justify-center space-x-3">
                        <Button
                          onClick={() => hideRow(x.market)}
                          variant="destructive"
                        >
                          <p>Cancel</p>
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
