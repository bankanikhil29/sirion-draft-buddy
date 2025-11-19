import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

export function FinalizeScreen() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
      <Card className="max-w-2xl w-full">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-3 bg-brand-primary/10 rounded-full">
              <CheckCircle className="h-16 w-16 text-brand-primary" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-foreground">
            Contract ready for approval
          </CardTitle>
          <CardDescription className="text-base text-muted-foreground max-w-lg mx-auto">
            Drafting and negotiation completed using SmartDraft. Your contract is ready for final review and signature.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="p-4 bg-muted/30 rounded-lg border border-border space-y-3">
            <h4 className="font-semibold text-foreground">Contract Summary</h4>
            <div className="grid sm:grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-muted-foreground">Client:</span>
                <span className="ml-2 text-foreground font-medium">Acme Corporation</span>
              </div>
              <div>
                <span className="text-muted-foreground">Type:</span>
                <span className="ml-2 text-foreground font-medium">Master SaaS Agreement</span>
              </div>
              <div>
                <span className="text-muted-foreground">Term:</span>
                <span className="ml-2 text-foreground font-medium">12 months</span>
              </div>
              <div>
                <span className="text-muted-foreground">Status:</span>
                <span className="ml-2 text-ok font-medium">Ready</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-brand-primary/5 rounded-lg border border-brand-primary/20">
            <h4 className="font-semibold text-foreground mb-2">Impact Note</h4>
            <p className="text-sm text-muted-foreground">
              Prototype metric: time saved vs. manual drafting (illustrative). In production, SmartDraft helps teams draft 50% faster and reduce negotiation cycles by 30%.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              size="lg"
              className="flex-1 transition-all hover:brightness-95"
              onClick={() => (window.location.hash = "#draft")}
            >
              Back to Draft
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="flex-1 transition-all"
              onClick={() => (window.location.hash = "#about")}
            >
              About SmartDraft
            </Button>
          </div>

          <div className="pt-4 border-t border-border">
            <Button
              variant="ghost"
              className="w-full transition-all"
              onClick={() => (window.location.hash = "#start")}
            >
              Start Another Contract
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
