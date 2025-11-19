import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Download, Mail, FileText } from "lucide-react";

export function FinalizeScreen() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
      <Card className="max-w-2xl w-full">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-3 bg-ok/10 rounded-full">
              <CheckCircle className="h-16 w-16 text-ok" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-foreground">
            Contract Ready for Review
          </CardTitle>
          <CardDescription className="text-base text-muted-foreground max-w-lg mx-auto">
            Your contract draft has been finalized and is ready for legal review and signature.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="p-4 bg-muted/30 rounded-lg border border-border space-y-3">
            <h4 className="font-semibold text-foreground">Contract Summary</h4>
            <div className="grid sm:grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-muted-foreground">Client:</span>
                <span className="ml-2 text-foreground font-medium">Acme Corp</span>
              </div>
              <div>
                <span className="text-muted-foreground">Type:</span>
                <span className="ml-2 text-foreground font-medium">Master Service Agreement</span>
              </div>
              <div>
                <span className="text-muted-foreground">Value:</span>
                <span className="ml-2 text-foreground font-medium">$250,000</span>
              </div>
              <div>
                <span className="text-muted-foreground">Term:</span>
                <span className="ml-2 text-foreground font-medium">12 months</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-foreground">Next Steps</h4>
            <div className="space-y-2">
              <div className="flex gap-3 items-start p-3 bg-muted/20 rounded-lg">
                <FileText className="h-5 w-5 text-brand-primary mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">Download for Review</p>
                  <p className="text-xs text-muted-foreground">Export as PDF or Word document</p>
                </div>
              </div>
              <div className="flex gap-3 items-start p-3 bg-muted/20 rounded-lg">
                <Mail className="h-5 w-5 text-brand-primary mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">Send to Legal</p>
                  <p className="text-xs text-muted-foreground">Forward to legal team for final approval</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button size="lg" className="flex-1 gap-2">
              <Download className="h-4 w-4" />
              Download Contract
            </Button>
            <Button size="lg" variant="outline" className="flex-1 gap-2">
              <Mail className="h-4 w-4" />
              Email to Legal
            </Button>
          </div>

          <div className="pt-4 border-t border-border">
            <Button
              variant="ghost"
              className="w-full"
              onClick={() => window.location.hash = "#start"}
            >
              Start Another Contract
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
