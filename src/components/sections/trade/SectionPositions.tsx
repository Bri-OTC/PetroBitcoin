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

interface Position {
  size: number;
  market: string;
  icon: string;
  mark: number;
  entryPrice: number;
  pnl: number;
  amount: number;
  type: string;
  limitPrice: string;
  status: string;
  reduceOnly: string;
  fillAmount: string;
}

interface SectionPositionsProps {
  positions: Position[];
  currentActiveRowPositions: { [key: string]: boolean };
  toggleActiveRow: (label: string) => void;
  hideRow: (label: string) => void;
}

function SectionPositions({
  positions,
  currentActiveRowPositions,
  toggleActiveRow,
  hideRow,
}: SectionPositionsProps) {
  return (
    <Table className="whitespace-nowrap">
      <TableHeader>
        <TableRow className="hover:bg-background border-none">
          <TableHead className="pr-0"></TableHead>
          <TableHead>
            <p className="text-card-foreground">Size / Market</p>
          </TableHead>
          <TableHead>
            <p className="text-card-foreground">Mark / Entry Price</p>
          </TableHead>
          <TableHead className="text-right">
            <p className="text-card-foreground">Pnl. Amount</p>
            <p>(USD)</p>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {positions.map((x, index) => {
          return (
            <Fragment key={x.market + "Fragment"}>
              {index !== 0 && (
                <TableRow key={x.market + "Positions"} className="border-none">
                  <TableCell className="py-2"></TableCell>
                </TableRow>
              )}
              <TableRow
                onClick={() => toggleActiveRow(x.market)}
                key={x.icon + "Positions"}
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
                    <h3>{x.mark}</h3>
                    <h3 className="text-card-foreground">{x.entryPrice} USD</h3>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div>
                    <h3
                      className={`${
                        x.pnl >= 0 ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {x.pnl}
                    </h3>
                    <h3 className="text-card-foreground">{x.amount}</h3>
                  </div>
                </TableCell>
              </TableRow>
              {currentActiveRowPositions[x.market] && (
                <>
                  <TableRow
                    key={x.market + "Positions" + "Child"}
                    className="bg-card hover:bg-card border-none"
                  >
                    <TableCell colSpan={4} className="py-1">
                      <div className="w-full flex justify-between">
                        <div className="w-full">
                          <p className="text-card-foreground">Type</p>
                          <p className="font-medium">{x.type}</p>
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
                    key={x.market + "Positions" + "Child" + "2"}
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
                    key={x.market + "Positions" + "Child" + "3"}
                    className="bg-card hover:bg-card border-none"
                  >
                    <TableCell colSpan={4}>
                      <div className="w-full flex justify-center space-x-3">
                        <Button variant="secondary" className="flex space-x-2">
                          <FaEdit />
                          <p>Modify</p>
                        </Button>
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

export default SectionPositions;
