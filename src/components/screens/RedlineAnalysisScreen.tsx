import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AlertCircle, CheckCircle, XCircle, ExternalLink, Star } from "lucide-react";
import { useAuditLog } from "@/components/AuditLog";
import { useDraftSession } from "@/contexts/DraftSessionContext";
import { useFocusBookmarks } from "@/contexts/FocusBookmarksContext";
import { WhyPopover } from "@/components/WhyPopover";

export function RedlineAnalysisScreen() {
  const { addEvent } = useAuditLog();
  const { markDirty } = useDraftSession();
  const { addFocus, removeFocus, findByAnchor } = useFocusBookmarks();

  const scrollToClause = (clauseId: string) => {
    addEvent("Navigated to clause", `Viewed redline clause: ${clauseId}`);
    // In a real implementation, this would scroll to the clause in the document
    window.location.hash = "#draft";
  };

  const handleAction = (action: string, clause: string) => {
    markDirty();
    addEvent(`Redline ${action}`, `${action} change in ${clause}`);
  };

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
            <div className="flex items-center gap-2">
              <Button 
                size="sm" 
                className="transition-all hover:brightness-95"
                onClick={() => handleAction("accepted", "Payment Terms")}
              >
                Accept
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                className="transition-all"
                onClick={() => handleAction("countered", "Payment Terms")}
              >
                Counter
              </Button>
              <WhyPopover reasonKey="redline-net45-acceptable" variant="redline" />
              <Button
                size="sm"
                variant="ghost"
                className="h-8 px-2"
                onClick={() => scrollToClause("clause-7-payment")}
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                Go to clause
              </Button>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 px-2"
                      onClick={() => {
                        const existing = findByAnchor("clause-7-payment");
                        if (existing) {
                          removeFocus(existing.id);
                        } else {
                          addFocus({
                            anchorId: "clause-7-payment",
                            title: "Payment Terms - Net-45",
                            snippet: "Payment due within 45 days",
                            source: 'redline',
                            severity: 'low'
                          });
                        }
                      }}
                    >
                      <Star className={`h-3 w-3 mr-1 ${findByAnchor("clause-7-payment") ? "fill-current text-brand-primary" : ""}`} />
                      {findByAnchor("clause-7-payment") ? "Unbookmark" : "+ Focus"}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{findByAnchor("clause-7-payment") ? "Remove from Focus" : "Add to Focus bookmarks"}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
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
            <div className="flex items-center gap-2">
              <Button 
                size="sm" 
                className="transition-all hover:brightness-95"
                onClick={() => handleAction("accepted", "Liability Cap")}
              >
                Accept
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                className="transition-all"
                onClick={() => handleAction("countered", "Liability Cap")}
              >
                Counter (1.5x)
              </Button>
              <WhyPopover reasonKey="redline-liability-1x" variant="redline" />
              <Button
                size="sm"
                variant="ghost"
                className="h-8 px-2"
                onClick={() => scrollToClause("clause-8-liability")}
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                Go to clause
              </Button>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 px-2"
                      onClick={() => {
                        const existing = findByAnchor("clause-8-liability");
                        if (existing) {
                          removeFocus(existing.id);
                        } else {
                          addFocus({
                            anchorId: "clause-8-liability",
                            title: "Liability Cap - 1x vs 2x",
                            snippet: "Liability capped at 1x annual contract value",
                            source: 'redline',
                            severity: 'medium'
                          });
                        }
                      }}
                    >
                      <Star className={`h-3 w-3 mr-1 ${findByAnchor("clause-8-liability") ? "fill-current text-brand-primary" : ""}`} />
                      {findByAnchor("clause-8-liability") ? "Unbookmark" : "+ Focus"}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{findByAnchor("clause-8-liability") ? "Remove from Focus" : "Add to Focus bookmarks"}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
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
            <div className="flex items-center gap-2">
              <Button 
                size="sm" 
                className="transition-all hover:brightness-95"
                onClick={() => handleAction("accepted", "Data Storage")}
              >
                Accept
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                className="transition-all"
                onClick={() => handleAction("discussed", "Data Storage")}
              >
                Discuss
              </Button>
              <WhyPopover reasonKey="redline-data-residency" variant="redline" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-3">
        <Button size="lg" onClick={() => window.location.hash = "#finalize"} className="transition-all hover:brightness-95">
          Proceed to Finalize
        </Button>
        <Button size="lg" variant="outline" onClick={() => window.location.hash = "#draft"} className="transition-all">
          Back to Draft
        </Button>
      </div>
    </div>
  );
}
