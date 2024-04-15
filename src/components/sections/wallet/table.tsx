"use client";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatNumber } from "@/lib/utils";
import { HiOutlineCog6Tooth } from "react-icons/hi2";
import { PiChartPieSlice } from "react-icons/pi";
import { FaSearch, FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import { ChangeEvent } from "react";
import Image from "next/image";
import { useWalletAndProvider } from "@/components/layout/menu";
import {
  networks,
  FakeUSD,
  PionerV1Compliance,
} from "@pionerfriends/blockchain-client";
import { encodeFunctionData, Address, parseUnits, formatUnits } from "viem";

function SectionWalletTable() {
  const { wallet, provider } = useWalletAndProvider();
  const [gasBalance, setGasBalance] = useState("0");
  const [depositedBalance, setDepositedBalance] = useState("0");
  const [usdcBalance, setUsdcBalance] = useState("0");
  const [sortColumn, setSortColumn] = useState<"balance" | "usdValue" | null>(
    null
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    const fetchBalances = async () => {
      if (wallet && provider) {
        try {
          // Fetch gas token balance
          const gasBalanceResponse = await provider.request({
            method: "eth_getBalance",
            params: [wallet.address, "latest"],
          });
          const gasBalanceInEther = formatUnits(BigInt(gasBalanceResponse), 18);
          setGasBalance(gasBalanceInEther);

          // Fetch deposited token balance
          const dataDeposited = encodeFunctionData({
            abi: PionerV1Compliance.abi,
            functionName: "deposited",
            args: [wallet.address],
          });
          const depositedBalanceResponse = await provider.request({
            method: "eth_call",
            params: [
              {
                to: networks.sonic.contracts.PionerV1Compliance as Address,
                data: dataDeposited,
              },
              "latest",
            ],
          });
          const depositedBalanceInUnits = formatUnits(
            BigInt(depositedBalanceResponse),
            18
          );
          setDepositedBalance(depositedBalanceInUnits);

          // Fetch USDC token balance
          const dataUSDC = encodeFunctionData({
            abi: FakeUSD.abi,
            functionName: "balanceOf",
            args: [wallet.address],
          });
          const usdcBalanceResponse = await provider.request({
            method: "eth_call",
            params: [
              {
                to: networks.sonic.contracts.FakeUSD as Address,
                data: dataUSDC,
              },
              "latest",
            ],
          });
          const usdcBalanceInUnits = formatUnits(
            BigInt(usdcBalanceResponse),
            18
          );
          setUsdcBalance(usdcBalanceInUnits);
        } catch (error) {
          console.error("Error fetching balances:", error);
        }
      }
    };

    fetchBalances();
  }, [wallet, provider]);

  const ftmPrice = 1.2; // Placeholder price for FTM

  const data = [
    {
      icon: "/wallet/ftm.svg",
      market: "FTM (Gas)",
      balance: gasBalance,
      usdValue: Number(gasBalance) * ftmPrice,
    },
    {
      icon: "/wallet/usdc.svg",
      market: "USDC (Wallet)",
      balance: usdcBalance,
      usdValue: Number(usdcBalance),
    },
    {
      icon: "/wallet/usdc.svg",
      market: "USDC (Deposited)",
      balance: depositedBalance,
      usdValue: Number(depositedBalance),
    },
  ];

  const sortedData = [...data].sort((a, b) => {
    if (sortColumn === "balance") {
      return sortOrder === "asc"
        ? a.balance.localeCompare(b.balance)
        : b.balance.localeCompare(a.balance);
    } else if (sortColumn === "usdValue") {
      return sortOrder === "asc"
        ? a.usdValue - b.usdValue
        : b.usdValue - a.usdValue;
    }
    return 0;
  });

  const handleSort = (column: "balance" | "usdValue") => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortOrder("asc");
    }
  };

  return (
    <div className="mt-5 flex flex-col space-y-5">
      <div className="flex items-center space-x-5">
        <div className="flex items-center space-x-1 w-full bg-card rounded-lg px-5">
          <FaSearch className="text-card-foreground" />
          <Input className="bg-card border-none" placeholder="Search Market" />
        </div>
        <Button size="icon" variant="ghost">
          <HiOutlineCog6Tooth className="text-[1.1rem]" />
        </Button>
        <Button size="icon" variant="ghost">
          <PiChartPieSlice className="text-[1.1rem]" />
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow className="border-none">
            <TableHead className="w-[40px]"></TableHead>
            <TableHead>
              <p>Market</p>
            </TableHead>
            <TableHead
              onClick={() => handleSort("balance")}
              className="cursor-pointer"
            >
              <div className="flex items-center">
                <p>Balance</p>
                {sortColumn === "balance" &&
                  (sortOrder === "asc" ? (
                    <FaSortUp className="ml-1" />
                  ) : (
                    <FaSortDown className="ml-1" />
                  ))}
                {sortColumn !== "balance" && <FaSort className="ml-1" />}
              </div>
            </TableHead>
            <TableHead
              onClick={() => handleSort("usdValue")}
              className="text-right cursor-pointer"
            >
              <div className="flex items-center justify-end">
                <p>USD Value</p>
                {sortColumn === "usdValue" &&
                  (sortOrder === "asc" ? (
                    <FaSortUp className="ml-1" />
                  ) : (
                    <FaSortDown className="ml-1" />
                  ))}
                {sortColumn !== "usdValue" && <FaSort className="ml-1" />}
              </div>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedData.map((item) => (
            <TableRow key={item.market} className="border-none">
              <TableCell className="w-[50px] pr-0">
                <div className="w-[30px]">
                  <Image
                    src={item.icon}
                    alt={item.market}
                    width={30}
                    height={30}
                  />
                </div>
              </TableCell>
              <TableCell>
                <h2>{item.market}</h2>
              </TableCell>
              <TableCell>
                <h2>{item.balance}</h2>
              </TableCell>
              <TableCell className="text-right">
                <h2>{formatNumber(item.usdValue)}</h2>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default SectionWalletTable;
