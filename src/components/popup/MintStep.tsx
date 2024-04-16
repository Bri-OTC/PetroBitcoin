import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { FakeUSD, networks } from "@pionerfriends/blockchain-client";
import {
  Address,
  encodeFunctionData,
  parseUnits,
  decodeFunctionResult,
} from "viem";
import { toast } from "sonner";

interface MintStepProps {
  amount: string;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  provider: any;
  wallet: any;
  onMint: (amount: number) => void;
}

const fakeUSDABI = FakeUSD.abi;

function MintStep({
  amount,
  loading,
  setLoading,
  setError,
  provider,
  wallet,
  onMint,
}: MintStepProps) {
  const [mintedAmount, setMintedAmount] = useState(0);

  useEffect(() => {
    const fetchMintedAmount = async () => {
      try {
        if (!provider || !wallet?.address) {
          return;
        }

        const data = encodeFunctionData({
          abi: fakeUSDABI,
          functionName: "balanceOf",
          args: [wallet.address],
        });

        const result = await provider.request({
          method: "eth_call",
          params: [
            {
              to: networks.sonic.contracts.FakeUSD as Address,
              data,
            },
            "latest",
          ],
        });

        const decodedResult = decodeFunctionResult({
          abi: fakeUSDABI,
          functionName: "balanceOf",
          data: result,
        });

        if (Array.isArray(decodedResult) && decodedResult.length > 0) {
          setMintedAmount(parseFloat(decodedResult[0]));
        }
      } catch (error) {
        console.error("Error fetching minted amount:", error);
      }
    };

    fetchMintedAmount();
  }, [provider, wallet]);

  async function handleMint() {
    setLoading(true);
    setError(null);

    try {
      if (!provider) {
        setError("No wallet provider");
        return;
      }

      await provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0xFAA5" }],
      });

      const dataMint = encodeFunctionData({
        abi: fakeUSDABI,
        functionName: "mint",
        args: [parseUnits(amount, 18)],
      });

      const toastId = toast.loading("Minting tokens...");

      try {
        const transaction = await provider.request({
          method: "eth_sendTransaction",
          params: [
            {
              from: wallet?.address,
              to: networks.sonic.contracts.FakeUSD as Address,
              data: dataMint,
            },
          ],
        });

        toast.success(
          `Tokens minted successfully. Transaction hash: ${transaction}`,
          {
            id: toastId,
            duration: 10000,
          }
        );

        setMintedAmount((prevAmount) => prevAmount + parseFloat(amount));
        onMint(parseFloat(amount));
      } catch (error) {
        console.error("Minting error:", error);
        toast.error("Minting failed", {
          id: toastId,
          duration: 10000,
        });
        setError("Minting failed");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Minting failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex justify-end space-x-3">
      <Button onClick={handleMint} disabled={loading || !amount}>
        {loading ? "Minting..." : "Mint"}
      </Button>
    </div>
  );
}

export default MintStep;
