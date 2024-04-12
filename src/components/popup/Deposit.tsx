// Deposit.tsx
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { AiOutlineClose } from "react-icons/ai";
import {
  PionerV1Compliance,
  FakeUSD,
  networks,
} from "@pionerfriends/blockchain-client";
import { getContract } from "viem";
import { createPublicClient, http } from "viem";
import { sonicClient } from "./Faucet";
import { WalletLoader } from "../web3/WalletLoader";

const fakeUSD = getContract({
  address: networks.sonic.contracts.FakeUSD as `0x${string}`,
  abi: FakeUSD,
  client: {
    public: sonicClient,
    wallet: WalletLoader,
  },
});

const balance = await fakeUSD.read.balanceOf([
  "0xa5cc3c03994DB5b0d9A5eEdD10CabaB0813678AC",
]);
const hash = await fakeUSD.write.mint([100]);
const logs = await fakeUSD.getEvents.Transfer();
const unwatch = fakeUSD.watchEvent.Transfer(
  {
    from: "0xd8da6bf26964af9d7eed9e03e53415d37aa96045",
    to: "0xa5cc3c03994db5b0d9a5eedd10cabab0813678ac",
  },
  { onLogs: (logs) => console.log(logs) }
);

interface DepositProps {
  open: boolean;
  onClose: () => void;
}

function Deposit({ open, onClose }: DepositProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-card border-none p-2 md:p-4">
        <div className="p-5 rounded-lg flex flex-col space-y-5">
          <div className="flex items-center justify-between">
            <h1>Deposit</h1>
            <DialogClose>
              <AiOutlineClose />
            </DialogClose>
          </div>
          <div>
            <h3 className="text-card-foreground">Amount</h3>
            <div className="flex items-center space-x-5 bg-card pb-3 mt-3 border-b">
              <Input
                placeholder="Enter amount"
                className="bg-transparent outline-none border-none underline-none pl-0"
              />
              <h3>USDC</h3>
            </div>
          </div>
          <div className="flex justify-end space-x-3">
            <DialogClose>
              <Button variant="secondary">Cancel</Button>
            </DialogClose>
            <Button>Confirm</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default Deposit;
