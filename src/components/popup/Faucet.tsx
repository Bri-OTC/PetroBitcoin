// Faucet.tsx
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent } from "@/components/ui/dialog";
import { AiOutlineClose } from "react-icons/ai";

interface FaucetProps {
  open: boolean;
  onClose: () => void;
}

function Faucet({ open, onClose }: FaucetProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-card border-none p-2 md:p-4">
        <div className="p-5 rounded-lg flex flex-col space-y-5">
          <div className="flex items-center justify-between">
            <h1>Faucet</h1>
            <DialogClose>
              <AiOutlineClose />
            </DialogClose>
          </div>
          <div>
            <p>Click the button below to receive free tokens.</p>
          </div>
          <div className="flex justify-end space-x-3">
            <DialogClose>
              <Button variant="secondary">Cancel</Button>
            </DialogClose>
            <Button>Claim Tokens</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default Faucet;
