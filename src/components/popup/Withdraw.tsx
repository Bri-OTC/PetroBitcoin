// Withdraw.tsx
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { AiOutlineClose } from "react-icons/ai";

interface WithdrawProps {
  open: boolean;
  onClose: () => void;
}

function Withdraw({ open, onClose }: WithdrawProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-card border-none p-2 md:p-4">
        <div className="p-5 rounded-lg flex flex-col space-y-5">
          <div className="flex items-center justify-between">
            <h1>Withdraw</h1>
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

export default Withdraw;
