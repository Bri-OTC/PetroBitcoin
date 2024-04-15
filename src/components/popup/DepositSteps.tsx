import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import {
  FakeUSD,
  PionerV1Compliance,
  networks,
} from "@pionerfriends/blockchain-client";
import { Address, parseUnits, encodeFunctionData } from "viem";
import { toast } from "sonner";
import { useWalletAndProvider } from "@/components/layout/menu";

interface DepositStepsProps {
  amount: string;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  onClose: () => void;
}

const fakeUSDABI = FakeUSD.abi;
const pionerV1ComplianceABI = PionerV1Compliance.abi;

function DepositSteps({
  amount,
  loading,
  setLoading,
  setError,
  onClose,
}: DepositStepsProps) {
  const { wallet, provider } = useWalletAndProvider();
  const [step, setStep] = useState<"mint" | "approve" | "deposit">("mint");

  useEffect(() => {
    if (!amount) {
      setStep("mint");
    }
  }, [amount]);

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

      const txMint = await provider.request({
        method: "eth_sendTransaction",
        params: [
          {
            from: wallet?.address,
            to: networks.sonic.contracts.FakeUSD as Address,
            data: dataMint,
          },
        ],
      });

      const toastId = toast.loading("Minting tokens...");

      try {
        await provider.request({
          method: "eth_getTransactionReceipt",
          params: [txMint],
        });

        toast.success("Tokens minted successfully", { id: toastId });
        setStep("approve");
      } catch (error) {
        toast.error("Minting failed", { id: toastId });
        setError("Minting failed");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Minting failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleApprove() {
    setLoading(true);
    setError(null);

    try {
      if (!provider) {
        setError("No wallet provider");
        return;
      }

      const dataApprove = encodeFunctionData({
        abi: fakeUSDABI,
        functionName: "approve",
        args: [
          networks.sonic.contracts.PionerV1Compliance as Address,
          parseUnits(amount, 18),
        ],
      });

      const txApprove = await provider.request({
        method: "eth_sendTransaction",
        params: [
          {
            from: wallet?.address,
            to: networks.sonic.contracts.FakeUSD as Address,
            data: dataApprove,
          },
        ],
      });

      const toastId = toast.loading("Approving tokens...");

      try {
        await provider.request({
          method: "eth_getTransactionReceipt",
          params: [txApprove],
        });

        toast.success("Tokens approved successfully", { id: toastId });
        setStep("deposit");
      } catch (error) {
        toast.error("Approval failed", { id: toastId });
        setError("Approval failed");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Approval failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleDeposit() {
    setLoading(true);
    setError(null);

    try {
      if (!provider) {
        setError("No wallet provider");
        return;
      }

      const dataDeposit = encodeFunctionData({
        abi: pionerV1ComplianceABI,
        functionName: "deposit",
        args: [parseUnits(amount, 18), 1, wallet?.address],
      });

      const txDeposit = await provider.request({
        method: "eth_sendTransaction",
        params: [
          {
            from: wallet?.address,
            to: networks.sonic.contracts.PionerV1Compliance as Address,
            data: dataDeposit,
          },
        ],
      });

      const toastId = toast.loading("Depositing tokens...");

      try {
        await provider.request({
          method: "eth_getTransactionReceipt",
          params: [txDeposit],
        });

        toast.success("Tokens deposited successfully", { id: toastId });
        onClose();
      } catch (error) {
        toast.error("Deposit failed", { id: toastId });
        setError("Deposit failed");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Deposit failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex justify-end space-x-3">
      <DialogClose>
        <Button variant="secondary">Cancel</Button>
      </DialogClose>
      {step === "mint" && (
        <Button onClick={handleMint} disabled={loading || !amount}>
          {loading ? "Minting..." : "Mint"}
        </Button>
      )}
      {step === "approve" && (
        <Button onClick={handleApprove} disabled={loading || !amount}>
          {loading ? "Approving..." : "Approve"}
        </Button>
      )}
      {step === "deposit" && (
        <Button onClick={handleDeposit} disabled={loading || !amount}>
          {loading ? "Depositing..." : "Deposit"}
        </Button>
      )}
    </div>
  );
}
export default DepositSteps;
