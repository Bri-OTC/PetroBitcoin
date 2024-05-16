import { Button } from "@/components/ui/button";
import { PionerV1Compliance, networks } from "@pionerfriends/blockchain-client";
import { Address, encodeFunctionData, parseUnits } from "viem";
import { toast } from "react-toastify";

interface DepositStepProps {
  amount: string;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  provider: any;
  wallet: any;
  onEvent: (amount: number) => void;
}

const pionerV1ComplianceABI = PionerV1Compliance.abi;

function InitWithdraw({
  amount,
  loading,
  setLoading,
  setError,
  provider,
  wallet,
  onEvent,
}: DepositStepProps) {
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
        functionName: "initiateWithdraw",
        args: [parseUnits(amount, 18)],
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

      const toastId = toast.loading("Withdrawing tokens...");

      try {
        await provider.request({
          method: "eth_getTransactionReceipt",
          params: [txDeposit],
        });

        toast.success("Withdraw initiated successfully", { id: toastId });
        onEvent(parseFloat(amount));
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
      <Button
        onClick={handleDeposit}
        disabled={loading || !amount || parseFloat(amount) > 100}
        className="w-full"
      >
        {loading ? "Withdrawing..." : "1. Withdraw"}
      </Button>
    </div>
  );
}

export default InitWithdraw;
