import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Upload, Save, Share2, AlertCircle, HelpCircle } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useIsMobile } from "@/hooks/use-mobile";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function DraftEditorScreen() {
  const [activeTab, setActiveTab] = useState("insights");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadedFile, setUploadedFile] = useState("");
  const [chatMessages, setChatMessages] = useState([
    { role: "system", text: "I can summarize, explain clauses, and suggest edits. Scripted demo — no real AI call." }
  ]);
  const [chatInput, setChatInput] = useState("");
  const isMobile = useIsMobile();

  const handleSuggestionClick = (question: string) => {
    setChatMessages([...chatMessages, { role: "user", text: question }]);
    
    setTimeout(() => {
      let response = "";
      if (question.includes("99.9%")) {
        response = "Standard is 99.0%. 99.9% is higher; mark as Medium risk and seek Ops approval.";
      } else if (question.includes("Summarize")) {
        response = "This is a Master SaaS Agreement between SoftCo and Acme Corporation for a 12-month term with 99.9% uptime SLA and liability capped at fees paid.";
      } else if (question.includes("Explain Clause 5")) {
        response = "Clause 5 (Service Levels) guarantees 99.9% monthly uptime. If we miss this target, the customer receives service credits per Schedule A.";
      } else if (question.includes("risky")) {
        response = "The 99.9% uptime SLA is above our standard 99.0% and poses medium risk. The governing law assumption should be confirmed with the customer.";
      } else {
        response = "Here's a plain-language version: Either party may end this Agreement with 30 days' notice if the other party materially breaches and doesn't fix it.";
      }
      setChatMessages((prev) => [...prev, { role: "ai", text: response }]);
    }, 600);
  };

  const handleChatSubmit = () => {
    if (!chatInput.trim()) return;
    handleSuggestionClick(chatInput);
    setChatInput("");
  };

  const handleFileUpload = () => {
    if (!uploadedFile.trim()) return;
    setShowUploadModal(false);
    setTimeout(() => {
      window.location.hash = "#redlines";
    }, 300);
  };

  const rightPanel = (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="insights">Insights</TabsTrigger>
        <TabsTrigger value="ask-ai">Ask AI</TabsTrigger>
      </TabsList>
      
      <TabsContent value="insights" className="flex-1 mt-4 space-y-4 overflow-auto">
        <div>
          <h4 className="font-semibold text-sm mb-3 flex items-center gap-2 text-foreground">
            AI Insights & Analysis
          </h4>
          
          <div className="space-y-3">
            <div className="p-4 bg-warn/10 border border-warn/20 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-warn mt-0.5 shrink-0" />
                <div className="flex-1 space-y-1">
                  <h5 className="font-medium text-sm text-foreground">Non-Standard</h5>
                  <p className="text-sm text-muted-foreground">
                    Service Level (99.9%) — Above standard (99.0%). Risk: Medium. May need Ops approval.
                  </p>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button className="text-xs text-brand-primary hover:underline flex items-center gap-1">
                          <HelpCircle className="h-3 w-3" />
                          Why?
                        </button>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p>Higher SLA commitments increase operational risk and may require additional infrastructure investment.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </div>

            <div className="p-4 bg-muted/30 rounded-lg border border-border">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                <div className="flex-1 space-y-1">
                  <h5 className="font-medium text-sm text-foreground">Assumptions</h5>
                  <p className="text-sm text-muted-foreground">
                    Governing Law — Assumed New York (default). Please confirm.
                  </p>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button className="text-xs text-brand-primary hover:underline flex items-center gap-1">
                          <HelpCircle className="h-3 w-3" />
                          Why?
                        </button>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p>Default jurisdiction was used. Customer may prefer their own state or country for dispute resolution.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </div>

            <div className="p-4 bg-ok/10 border border-ok/20 rounded-lg">
              <div className="flex items-start gap-2">
                <span className="text-ok text-lg shrink-0">✓</span>
                <div className="flex-1 space-y-1">
                  <h5 className="font-medium text-sm text-foreground">Standards</h5>
                  <p className="text-sm text-muted-foreground">
                    Liability cap — Matches policy.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </TabsContent>
      
      <TabsContent value="ask-ai" className="flex-1 mt-4 flex flex-col overflow-hidden">
        <div className="flex-1 space-y-3 overflow-auto mb-4">
          {chatMessages.map((msg, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-lg ${
                msg.role === "system"
                  ? "bg-muted/30 border border-border text-sm text-muted-foreground"
                  : msg.role === "user"
                  ? "bg-brand-primary/10 text-foreground ml-4"
                  : "bg-muted/50 text-foreground mr-4"
              }`}
            >
              {msg.text}
            </div>
          ))}
        </div>

        <div className="space-y-3 border-t pt-3">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleSuggestionClick("Summarize this contract")}
              className="text-xs px-3 py-1.5 bg-muted/50 hover:bg-muted rounded-full border border-border"
            >
              Summarize this contract
            </button>
            <button
              onClick={() => handleSuggestionClick("Explain Clause 5 in plain English")}
              className="text-xs px-3 py-1.5 bg-muted/50 hover:bg-muted rounded-full border border-border"
            >
              Explain Clause 5 in plain English
            </button>
            <button
              onClick={() => handleSuggestionClick("Any risky terms?")}
              className="text-xs px-3 py-1.5 bg-muted/50 hover:bg-muted rounded-full border border-border"
            >
              Any risky terms?
            </button>
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Ask about this contract..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleChatSubmit()}
              className="flex-1"
            />
            <Button onClick={handleChatSubmit} size="sm">Send</Button>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );

  return (
    <>
      <div className="h-full flex flex-col lg:flex-row gap-4">
        {/* Left: Editor */}
        <div className="flex-1 flex flex-col gap-4">
          {/* Info banner */}
          <div className="bg-warn/10 border border-warn/20 px-4 py-3 rounded-lg">
            <p className="text-sm text-foreground">
              <strong>Draft generated by SmartDraft AI</strong> — review before sharing.
            </p>
          </div>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                <h2 className="text-xl font-semibold text-foreground">Contract Draft</h2>
                <div className="flex gap-2 flex-wrap">
                  {isMobile && (
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button variant="outline" size="sm">
                          AI Insights
                        </Button>
                      </SheetTrigger>
                      <SheetContent side="right" className="w-full sm:max-w-md">
                        <SheetHeader>
                          <SheetTitle>Analysis</SheetTitle>
                        </SheetHeader>
                        <div className="mt-6 h-[calc(100%-4rem)]">{rightPanel}</div>
                      </SheetContent>
                    </Sheet>
                  )}
                  <Button variant="outline" size="sm" onClick={() => setShowUploadModal(true)}>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload redlines
                  </Button>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="sm" disabled>
                          <Save className="h-4 w-4 mr-2" />
                          Save
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Prototype — saving disabled</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="sm" disabled>
                          <Share2 className="h-4 w-4 mr-2" />
                          Export
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Prototype — disabled</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>

              {/* Document content */}
              <div className="prose prose-sm max-w-none space-y-4 p-4 bg-surface border border-border rounded-lg min-h-[500px]">
                <h1 className="text-2xl font-bold text-foreground mb-4">Master SaaS Agreement</h1>
                
                <p className="text-muted-foreground leading-relaxed">
                  This Agreement is made on Jan 1, 2026 between SoftCo, Inc. ("Provider") and Acme Corporation ("Customer").
                </p>

                <div className="space-y-3">
                  <div>
                    <h3 className="text-base font-semibold text-foreground mb-2">2. Term</h3>
                    <p className="text-muted-foreground">12 months from Effective Date.</p>
                  </div>

                  <div className="p-3 bg-brand-primary/5 border-l-4 border-brand-primary rounded">
                    <h3 className="text-base font-semibold text-foreground mb-2 flex items-center gap-2">
                      5. Service Levels
                      <span className="text-xs text-brand-primary bg-brand-primary/10 px-2 py-0.5 rounded">Highlighted</span>
                    </h3>
                    <p className="text-muted-foreground">
                      Provider maintains 99.9% monthly uptime. Service credits are provided per Schedule A if this threshold is not met.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-base font-semibold text-foreground mb-2">8. Limitation of Liability</h3>
                    <p className="text-muted-foreground">
                      Each party's liability is capped at the total fees paid under this Agreement in the twelve months preceding the claim.
                    </p>
                  </div>

                  <div className="p-3 bg-muted/30 border-l-4 border-muted rounded">
                    <h3 className="text-base font-semibold text-foreground mb-2 flex items-center gap-2">
                      12. Governing Law
                      <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-0.5 rounded">Assumption</span>
                    </h3>
                    <p className="text-muted-foreground">
                      This Agreement shall be governed by the laws of the State of New York, USA.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: Insights/AI Panel (Desktop) */}
        {!isMobile && (
          <div className="w-80 xl:w-96">
            <Card className="h-full">
              <CardContent className="p-4 h-full overflow-hidden">
                {rightPanel}
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* S7 Upload Redlines Modal */}
      <Dialog open={showUploadModal} onOpenChange={setShowUploadModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload client's redlined contract</DialogTitle>
            <DialogDescription>
              Select the redlined document to analyze changes and get AI recommendations.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
              <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground mb-3">
                Drag and drop your file here, or click to browse
              </p>
              <Input
                type="text"
                placeholder="Enter file name (demo)"
                value={uploadedFile}
                onChange={(e) => setUploadedFile(e.target.value)}
                className="max-w-xs mx-auto"
              />
            </div>
            <p className="text-xs text-muted-foreground text-center">
              Files are not transmitted — UI simulation only.
            </p>
            <div className="flex gap-3">
              <Button className="flex-1" onClick={handleFileUpload} disabled={!uploadedFile.trim()}>
                Analyze changes
              </Button>
              <Button variant="outline" onClick={() => setShowUploadModal(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
