import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface SecurityModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SecurityModal({ open, onOpenChange }: SecurityModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-foreground">
            Security & Privacy Information
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Understanding how this prototype handles your data
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 text-sm text-foreground">
          <section>
            <h3 className="font-semibold text-base mb-2 text-foreground">UI-Only Prototype</h3>
            <p className="text-muted-foreground leading-relaxed">
              This is a user interface prototype only. <strong>No network requests are made from this page.</strong> All functionality occurs entirely in your browser's memory.
            </p>
          </section>

          <section>
            <h3 className="font-semibold text-base mb-2 text-foreground">No Data Storage</h3>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>No cookies are set or read</li>
              <li>No localStorage or sessionStorage is used</li>
              <li>No analytics or tracking scripts are present</li>
              <li>All state is cleared when you refresh or close this page</li>
            </ul>
          </section>

          <section>
            <h3 className="font-semibold text-base mb-2 text-foreground">No External Resources</h3>
            <p className="text-muted-foreground leading-relaxed">
              <strong>No third-party fonts, scripts, images, or CDNs are loaded.</strong> This minimizes potential man-in-the-middle attack surfaces and ensures your interaction with this prototype remains isolated.
            </p>
          </section>

          <section>
            <h3 className="font-semibold text-base mb-2 text-foreground">Input Handling</h3>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>All inputs are handled in memory only and cleared on refresh</li>
              <li><strong>Avoid entering real client or personal data</strong></li>
              <li>User input is sanitized before being rendered in the UI to reduce injection risk</li>
            </ul>
          </section>

          <section>
            <h3 className="font-semibold text-base mb-2 text-foreground">Abuse Prevention</h3>
            <p className="text-muted-foreground leading-relaxed">
              Buttons and flows are debounced and rate-limited visually to discourage automated abuse, though this is a demonstration prototype with no backend.
            </p>
          </section>

          <section className="pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground italic">
              This prototype is for demonstration purposes only. Do not use it for production contract generation or with sensitive business data.
            </p>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}
