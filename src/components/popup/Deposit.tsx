/*import { useState } from "react";
import { useWallets } from "@privy-io/react-auth";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { AiOutlineClose } from "react-icons/ai";
import { FakeUSD, networks } from "@pionerfriends/blockchain-client";
import { getContract } from "viem";
import { sonicClient } from "./Faucet";
import { Toaster, toast } from "sonner";
import { WalletLoader } from "../web3/WalletLoader";

interface DepositProps {
  open: boolean;
  onClose: () => void;
}

const transformedAbi = FakeUSD.abi.map((item) => {
  if (item.type === "function") {
    return {
      type: "function",
      name: item.name,
      inputs: item.inputs,
      outputs: item.outputs,
      stateMutability: item.stateMutability,
    };
  } else if (item.type === "event") {
    return {
      type: "event",
      name: item.name,
      inputs: item.inputs,
      anonymous: item.anonymous,
    };
  } else {
    return item;
  }
});

function Deposit({ open, onClose }: DepositProps) {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { wallets } = useWallets();

  async function handleDeposit() {
    if (wallets.length === 0) {
      setError("Wallet not connected");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const address = wallets[0].address as `0x${string}`;
      console.log("Recipient address:", address);

      await WalletLoader.writeContract({
        address: networks.sonic.contracts.FakeUSD as `0x${string}`,
        abi: transformedAbi,
        functionName: "mint",
        args: [69420],
        sonicClient,
      });

      const toastId = toast.loading("Minting tokens...", {
        duration: Infinity,
        classNames: {
          toast: "bg-gray-900 text-white",
          title: "text-lg font-bold",
          description: "text-base",
        },
      });

      try {
        const transaction = await transactionPromise;
        console.log("Transaction object:", transaction);

        if (
          transaction &&
          typeof transaction === "object" &&
          "hash" in transaction
        ) {
          toast.success(`Tokens minted: ${transaction}`, {
            id: toastId,
            duration: 10000,
            classNames: {
              toast: "bg-green-500 text-white",
              title: "text-lg font-bold",
              description: "text-base",
            },
          });
        } else {
          toast.success("Tokens minted", {
            id: toastId,
            duration: 10000,
            classNames: {
              toast: "bg-green-500 text-white",
              title: "text-lg font-bold",
              description: "text-base",
            },
          });
        }
      } catch (error) {
        console.error("Transaction error:", error);
        toast.error("Token minting failed", {
          id: toastId,
          duration: 10000,
          classNames: {
            toast: "bg-red-500 text-white",
            title: "text-lg font-bold",
            description: "text-base",
          },
        });
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Deposit failed");
    } finally {
      setLoading(false);
    }
  }

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
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              <h3>USDC</h3>
            </div>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </div>
          <div className="flex justify-end space-x-3">
            <DialogClose>
              <Button variant="secondary">Cancel</Button>
            </DialogClose>
            <Button onClick={handleDeposit} disabled={loading}>
              {loading ? "Loading..." : "Confirm"}
            </Button>
          </div>
        </div>
      </DialogContent>
      <Toaster />
    </Dialog>
  );
}
*/
