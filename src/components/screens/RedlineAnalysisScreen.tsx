import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle, XCircle } from "lucide-react";

export function RedlineAnalysisScreen() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Redline Analysis</h1>
        <p className="text-muted-foreground">
          Review counterparty changes and suggested responses
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Analysis Summary</CardTitle>
          <CardDescription>3 changes detected in uploaded redline</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="p-4 bg-ok/10 border border-ok/20 rounded-lg text-center">
              <CheckCircle className="h-6 w-6 text-ok mx-auto mb-2" />
              <div className="text-2xl font-bold text-ok">2</div>
              <div className="text-sm text-muted-foreground">Acceptable</div>
            </div>
            <div className="p-4 bg-warn/10 border border-warn/20 rounded-lg text-center">
              <AlertCircle className="h-6 w-6 text-warn mx-auto mb-2" />
              <div className="text-2xl font-bold text-warn">1</div>
              <div className="text-sm text-muted-foreground">Needs Review</div>
            </div>
            <div className="p-4 bg-danger/10 border border-danger/20 rounded-lg text-center">
              <XCircle className="h-6 w-6 text-danger mx-auto mb-2" />
              <div className="text-2xl font-bold text-danger">0</div>
              <div className="text-sm text-muted-foreground">Reject</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-foreground">Detected Changes</h3>
        
        {/* Change Card 1 */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <CardTitle className="text-base">Payment Terms - Section 4.2</CardTitle>
                <CardDescription>Changed from Net-30 to Net-45</CardDescription>
              </div>
              <Badge variant="default" className="bg-ok text-white">Acceptable</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 bg-muted/30 rounded border border-border">
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">Original:</strong> Payment due within 30 days
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                <strong className="text-foreground">Proposed:</strong> Payment due within 45 days
              </p>
            </div>
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">AI Suggestion:</strong> Accept this change. Extended payment terms are common and within acceptable risk threshold.
            </p>
            <div className="flex gap-2">
              <Button size="sm">Accept</Button>
              <Button size="sm" variant="outline">Counter</Button>
            </div>
          </CardContent>
        </Card>

        {/* Change Card 2 */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <CardTitle className="text-base">Liability Cap - Section 8.1</CardTitle>
                <CardDescription>Changed from 2x to 1x annual fees</CardDescription>
              </div>
              <Badge variant="default" className="bg-warn text-white">Needs Review</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 bg-muted/30 rounded border border-border">
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">Original:</strong> Liability capped at 2x annual contract value
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                <strong className="text-foreground">Proposed:</strong> Liability capped at 1x annual contract value
              </p>
            </div>
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">AI Suggestion:</strong> Counter with 1.5x compromise. This protects both parties while addressing their concern.
            </p>
            <div className="flex gap-2">
              <Button size="sm">Accept</Button>
              <Button size="sm" variant="outline">Counter (1.5x)</Button>
            </div>
          </CardContent>
        </Card>

        {/* Change Card 3 */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <CardTitle className="text-base">Data Storage - Section 6.3</CardTitle>
                <CardDescription>Added "EU servers only" requirement</CardDescription>
              </div>
              <Badge variant="default" className="bg-ok text-white">Acceptable</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 bg-muted/30 rounded border border-border">
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">Proposed:</strong> All customer data must be stored on servers located within the European Union
              </p>
            </div>
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">AI Suggestion:</strong> Accept if infrastructure supports it. This is a standard GDPR compliance request.
            </p>
            <div className="flex gap-2">
              <Button size="sm">Accept</Button>
              <Button size="sm" variant="outline">Discuss</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-3">
        <Button size="lg" onClick={() => window.location.hash = "#finalize"}>
          Proceed to Finalize
        </Button>
        <Button size="lg" variant="outline" onClick={() => window.location.hash = "#draft"}>
          Back to Draft
        </Button>
      </div>
    </div>
  );
}
