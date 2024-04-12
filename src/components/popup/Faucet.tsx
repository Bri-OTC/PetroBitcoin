// Faucet.tsx
import { useState } from "react";
import { useWallets } from "@privy-io/react-auth";
import {
  createPublicClient,
  http,
  parseEther,
  createWalletClient,
  parseGwei,
  defineChain,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent } from "@/components/ui/dialog";
import { AiOutlineClose } from "react-icons/ai";
import { Toaster, toast } from "sonner";

export const fantomSonicTestnet = defineChain({
  id: 64165,
  name: "Fantom Sonic Testnet",
  network: "fantom-sonic-testnet",
  nativeCurrency: {
    name: "Fantom",
    symbol: "FTM",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://rpcapi.sonic.fantom.network/"],
    },
    public: {
      http: ["https://rpcapi.sonic.fantom.network/"],
    },
  },
});

export const sonicClient = createPublicClient({
  chain: fantomSonicTestnet,
  transport: http(),
});

interface FaucetProps {
  open: boolean;
  onClose: () => void;
}

function Faucet({ open, onClose }: FaucetProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { wallets } = useWallets();

  async function handleFaucet() {
    if (wallets.length === 0) {
      setError("Wallet not connected");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const address = wallets[0].address as `0x${string}`;
      console.log("Recipient address:", address);

      const chainId = await sonicClient.getChainId();
      console.log("Connected chain ID:", chainId);

      if (chainId !== fantomSonicTestnet.id) {
        setError("Please switch to the Fantom Sonic Testnet in your wallet.");
        setLoading(false);
        return;
      }

      const balance = await sonicClient.getBalance({ address });
      console.log("Recipient balance:", balance);

      if (balance >= parseEther("0.05")) {
        setError("You already have enough balance");
      } else {
        const privateKey = process.env
          .NEXT_PUBLIC_FAUCET_PRIVATE_KEY as `0x${string}`;

        if (!privateKey) {
          throw new Error(
            "Faucet private key not found in environment variables"
          );
        }

        console.log("Faucet private key:", privateKey);

        const faucetAccount = privateKeyToAccount(privateKey);
        const faucetBalance = await sonicClient.getBalance({
          address: faucetAccount.address,
        });
        console.log("Faucet balance:", faucetBalance);

        const faucetWalletClient = createWalletClient({
          chain: fantomSonicTestnet,
          transport: http(),
          account: privateKey,
        });

        const transactionPromise = faucetWalletClient.sendTransaction({
          to: address,
          value: parseEther("0.1"),
          gasLimit: 100000,
          gasPrice: parseGwei("20"),
        });

        const toastId = toast.loading("Sending transaction...", {
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
            toast.success(`Transaction sent: ${transaction}`, {
              id: toastId,
              duration: 10000,
              classNames: {
                toast: "bg-green-500 text-white",
                title: "text-lg font-bold",
                description: "text-base",
              },
            });
          } else {
            toast.success("Transaction sent", {
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
          toast.error("Transaction failed", {
            id: toastId,
            duration: 10000,
            classNames: {
              toast: "bg-red-500 text-white",
              title: "text-lg font-bold",
              description: "text-base",
            },
          });
        }
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Faucet transaction failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-card border-none p-2 md:p-4">
        <div className="p-5 rounded-lg flex flex-col space-y-5">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Faucet</h1>
            <DialogClose>
              <AiOutlineClose className="text-gray-500 hover:text-gray-700" />
            </DialogClose>
          </div>
          <div>
            <p className="text-gray-700">
              Click the button below to receive free tokens.
            </p>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </div>
          <div className="flex justify-end space-x-3">
            <DialogClose>
              <Button variant="secondary">Cancel</Button>
            </DialogClose>
            <Button onClick={handleFaucet} disabled={loading}>
              {loading ? "Loading..." : "Claim Tokens"}
            </Button>
          </div>
        </div>
      </DialogContent>
      <Toaster />
    </Dialog>
  );
}

export default Faucet;
