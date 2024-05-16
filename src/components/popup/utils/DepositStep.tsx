import { Button } from "@/components/ui/button";
import {
  PionerV1Compliance,
  networks,
  NetworkKey,
} from "@pionerfriends/blockchain-client";
import { Address, encodeFunctionData, parseUnits } from "viem";
import { toast } from "react-toastify";

interface DepositStepProps {
  amount: string;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  provider: any;
  wallet: any;
  onDeposit: (amount: number) => void;
  onClose: () => void;
}
import { useAuthStore } from "@/store/authStore";

const pionerV1ComplianceABI = PionerV1Compliance.abi;

function DepositStep({
  amount,
  loading,
  setLoading,
  setError,
  provider,
  wallet,
  onDeposit,
  onClose,
}: DepositStepProps) {
  const chainId = useAuthStore((state) => state.chainId);

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
            to: networks[chainId as NetworkKey].contracts
              .PionerV1Compliance as Address,
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

        toast.success("Tokens deposited successfully");
        onDeposit(parseFloat(amount));
        onClose();
      } catch (error) {
        toast.error("Deposit failed");
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
        {loading ? "Depositing..." : "3. Deposit"}
      </Button>
    </div>
  );
}

export default DepositStep;
