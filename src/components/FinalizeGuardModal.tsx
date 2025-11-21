import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

interface FinalizeGuardModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  unresolvedCount: number;
  onProceed: () => void;
  onReviewFocus: () => void;
}

export function FinalizeGuardModal({ 
  open, 
  onOpenChange, 
  unresolvedCount, 
  onProceed, 
  onReviewFocus 
}: FinalizeGuardModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-warn/10 rounded-full">
              <AlertCircle className="h-6 w-6 text-warn" />
            </div>
            <DialogTitle>Open Focus items</DialogTitle>
          </div>
          <DialogDescription className="pt-2">
            You have {unresolvedCount} focus item{unresolvedCount !== 1 ? 's' : ''} still open (High/Medium severity). 
            These items may require attention before finalizing the contract.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onReviewFocus}>
            Review Focus
          </Button>
          <Button onClick={onProceed}>
            Proceed anyway
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
