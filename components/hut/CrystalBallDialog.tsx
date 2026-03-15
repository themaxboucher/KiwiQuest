"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface CrystalBallDialogProps {
  open: boolean;
  onClose: () => void;
}

export function CrystalBallDialog({ open, onClose }: CrystalBallDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent
        className="bg-blue-950/60 backdrop-blur-md ring-0 animate-glow-blue rounded-lg"
        showCloseButton={false}
      >
        <DialogTitle className="sr-only">Crystal Ball</DialogTitle>
        <DialogDescription className="sr-only">
          A mystical crystal ball vision
        </DialogDescription>
        <div className="flex items-center justify-center py-12">
          <p className="font-pixel text-sm text-blue-200/80 text-center pixel-text-shadow">
            The crystal ball swirls with visions...
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
