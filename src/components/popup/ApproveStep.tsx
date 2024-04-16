import { Button } from "@/components/ui/button";
import {
  FakeUSD,
  PionerV1Compliance,
  networks,
} from "@pionerfriends/blockchain-client";
import { Address, encodeFunctionData, parseUnits } from "viem";
import { toast } from "sonner";

interface ApproveStepProps {
  amount: string;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  provider: any;
  wallet: any;
  onApprove: (amount: number) => void;
}

const fakeUSDABI = FakeUSD.abi;

function ApproveStep({
  amount,
  loading,
  setLoading,
  setError,
  provider,
  wallet,
  onApprove,
}: ApproveStepProps) {
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

      const toastId = toast.loading("Approving tokens...");

      try {
        const transaction = await provider.request({
          method: "eth_sendTransaction",
          params: [
            {
              from: wallet?.address,
              to: networks.sonic.contracts.FakeUSD as Address,
              data: dataApprove,
            },
          ],
        });

        toast.success(
          `Tokens approved successfully. Transaction hash: ${transaction}`,
          {
            id: toastId,
            duration: 10000,
          }
        );
        onApprove(parseFloat(amount));
      } catch (error) {
        console.error("Approval error:", error);
        toast.error("Approval failed", {
          id: toastId,
          duration: 10000,
        });
        setError("Approval failed");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Approval failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex justify-end space-x-3">
      <Button onClick={handleApprove} disabled={loading || !amount}>
        {loading ? "Approving..." : "Approve"}
      </Button>
    </div>
  );
}

export default ApproveStep;
