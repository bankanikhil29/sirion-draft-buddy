import { useState, useMemo, useCallback, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Upload, Save, Share2, AlertCircle, HelpCircle, Search, Copy, X } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useIsMobile } from "@/hooks/use-mobile";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";

// In-memory contract clause index
const CLAUSES = [
  { id: "clause-2-term", title: "Term", type: "Term", text: "The term is 12 months from the Effective Date." },
  { id: "clause-5-service-levels", title: "Service Levels", type: "Service Levels", text: "Provider maintains 99.9% monthly uptime. Service credits are provided per Schedule A if this threshold is not met." },
  { id: "clause-7-payment", title: "Payment Terms", type: "Payment", text: "Fees are due within 30 days from invoice date unless otherwise agreed." },
  { id: "clause-8-liability", title: "Limitation of Liability", type: "Liability", text: "Each party's liability is capped at the total fees paid under this Agreement in the twelve months preceding the claim." },
  { id: "clause-12-governing-law", title: "Governing Law", type: "Governing Law", text: "This Agreement shall be governed by the laws of the State of New York, USA." },
];

const CLAUSE_TYPES = ["All", "Term", "Service Levels", "Liability", "Governing Law", "Payment"];

export function DraftEditorScreen() {
  const [activeTab, setActiveTab] = useState("insights");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadedFile, setUploadedFile] = useState("");
  const [chatMessages, setChatMessages] = useState([
    { role: "system", text: "I can summarize, explain clauses, and suggest edits. Scripted demo — no real AI call." }
  ]);
  const [chatInput, setChatInput] = useState("");
  
  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");
  
  const isMobile = useIsMobile();
  const { toast } = useToast();

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

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 250);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Search logic
  const searchResults = useMemo(() => {
    if (!debouncedQuery.trim()) return [];

    const query = debouncedQuery.toLowerCase().trim();
    const tokens = query.split(/\s+/).filter(t => t.length >= 2);
    
    if (tokens.length === 0) return [];

    const scored = CLAUSES.map(clause => {
      // Filter by type
      if (selectedFilter !== "All" && clause.type !== selectedFilter) {
        return null;
      }

      const titleLower = clause.title.toLowerCase();
      const textLower = clause.text.toLowerCase();
      
      let score = 0;
      tokens.forEach(token => {
        // Count occurrences in text
        const regex = new RegExp(token, 'gi');
        const textMatches = (textLower.match(regex) || []).length;
        score += textMatches;
        
        // Bonus for title match
        if (titleLower.includes(token)) {
          score += 3;
        }
      });

      if (score === 0) return null;

      // Create snippet with highlights
      const snippetLength = 120;
      let snippet = clause.text;
      if (snippet.length > snippetLength) {
        snippet = snippet.substring(0, snippetLength) + "…";
      }

      return { clause, score, snippet };
    }).filter(Boolean) as { clause: typeof CLAUSES[0], score: number, snippet: string }[];

    return scored.sort((a, b) => b.score - a.score).slice(0, 5);
  }, [debouncedQuery, selectedFilter]);

  const handleSuggestedSearch = (query: string) => {
    setSearchQuery(query);
    setActiveTab("search");
  };

  const scrollToClause = useCallback((clauseId: string) => {
    const element = document.getElementById(clauseId);
    if (!element) return;

    element.scrollIntoView({ behavior: "smooth", block: "center" });
    
    // Add pulse animation
    element.classList.add("clause-pulse");
    setTimeout(() => {
      element.classList.remove("clause-pulse");
    }, 800);
  }, []);

  const copyExcerpt = useCallback((text: string) => {
    if (!navigator.clipboard) {
      toast({
        variant: "destructive",
        title: "Clipboard not available",
        description: "Clipboard not available on this browser.",
      });
      return;
    }

    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Excerpt copied",
        description: "The excerpt has been copied to your clipboard.",
      });
    }).catch(() => {
      toast({
        variant: "destructive",
        title: "Copy failed",
        description: "Failed to copy excerpt to clipboard.",
      });
    });
  }, [toast]);

  const highlightMatches = (text: string, query: string) => {
    if (!query.trim()) return text;
    
    const tokens = query.toLowerCase().split(/\s+/).filter(t => t.length >= 2);
    let result = text;
    
    tokens.forEach(token => {
      const regex = new RegExp(`(${token})`, 'gi');
      result = result.replace(regex, '<mark class="bg-brand-primary/20 rounded px-0.5">$1</mark>');
    });
    
    return result;
  };

  const rightPanel = (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="insights">Insights</TabsTrigger>
        <TabsTrigger value="ask-ai">Ask AI</TabsTrigger>
        <TabsTrigger value="search">Search</TabsTrigger>
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

      <TabsContent value="search" className="flex-1 mt-4 flex flex-col overflow-hidden">
        <div className="space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search the contract… (e.g., uptime, liability cap, governing law)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10"
              aria-label="Search contract"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Suggested searches */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleSuggestedSearch("liability cap")}
              className="text-xs px-3 py-1.5 bg-muted/50 hover:bg-muted rounded-full border border-border transition-colors"
            >
              liability cap
            </button>
            <button
              onClick={() => handleSuggestedSearch("uptime")}
              className="text-xs px-3 py-1.5 bg-muted/50 hover:bg-muted rounded-full border border-border transition-colors"
            >
              uptime
            </button>
            <button
              onClick={() => handleSuggestedSearch("governing law")}
              className="text-xs px-3 py-1.5 bg-muted/50 hover:bg-muted rounded-full border border-border transition-colors"
            >
              governing law
            </button>
          </div>

          {/* Filter chips */}
          <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
            {CLAUSE_TYPES.map(type => (
              <button
                key={type}
                onClick={() => setSelectedFilter(type)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                  selectedFilter === type
                    ? "bg-brand-primary text-white border-brand-primary"
                    : "bg-muted/30 border-border hover:bg-muted"
                }`}
                aria-pressed={selectedFilter === type}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        <div className="flex-1 mt-4 space-y-3 overflow-auto">
          {!debouncedQuery.trim() ? (
            <div className="text-center py-8 text-muted-foreground text-sm">
              <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>Search across the contract</p>
            </div>
          ) : searchResults.length === 0 ? (
            <div className="p-4 bg-muted/30 rounded-lg border border-border text-center">
              <p className="text-sm text-muted-foreground">
                No matches. Try 'liability cap', 'uptime', or 'governing law'.
              </p>
            </div>
          ) : (
            searchResults.map(({ clause, score, snippet }) => (
              <div
                key={clause.id}
                className="p-4 bg-surface/50 rounded-lg border border-border hover:border-brand-primary/50 transition-all"
              >
                <div className="flex items-start gap-3">
                  <Search className="h-4 w-4 text-brand-primary mt-1 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h5 className="font-semibold text-sm text-foreground">{clause.title}</h5>
                      <span className="text-xs text-brand-primary font-medium whitespace-nowrap">
                        {Math.min(Math.round((score / 10) * 100), 99)}% match
                      </span>
                    </div>
                    <p
                      className="text-sm text-muted-foreground line-clamp-2"
                      dangerouslySetInnerHTML={{ __html: highlightMatches(snippet, debouncedQuery) }}
                    />
                    <div className="flex items-center gap-2 pt-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => scrollToClause(clause.id)}
                        className="h-7 text-xs transition-all hover:-translate-y-0.5"
                        role="button"
                        onKeyDown={(e) => e.key === "Enter" && scrollToClause(clause.id)}
                      >
                        View
                      </Button>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              onClick={() => copyExcerpt(clause.text)}
                              className="h-7 w-7 flex items-center justify-center rounded border border-border hover:bg-muted transition-colors"
                              aria-label="Copy excerpt"
                            >
                              <Copy className="h-3 w-3" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Copy excerpt</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
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
                  <div id="clause-2-term" className="transition-all duration-300">
                    <h3 className="text-base font-semibold text-foreground mb-2">2. Term</h3>
                    <p className="text-muted-foreground">12 months from Effective Date.</p>
                  </div>

                  <div id="clause-5-service-levels" className="p-3 bg-brand-primary/5 border-l-4 border-brand-primary rounded transition-all duration-300">
                    <h3 className="text-base font-semibold text-foreground mb-2 flex items-center gap-2">
                      5. Service Levels
                      <span className="text-xs text-brand-primary bg-brand-primary/10 px-2 py-0.5 rounded">Highlighted</span>
                    </h3>
                    <p className="text-muted-foreground">
                      Provider maintains 99.9% monthly uptime. Service credits are provided per Schedule A if this threshold is not met.
                    </p>
                  </div>

                  <div id="clause-7-payment" className="transition-all duration-300">
                    <h3 className="text-base font-semibold text-foreground mb-2">7. Payment Terms</h3>
                    <p className="text-muted-foreground">
                      Fees are due within 30 days from invoice date unless otherwise agreed.
                    </p>
                  </div>

                  <div id="clause-8-liability" className="transition-all duration-300">
                    <h3 className="text-base font-semibold text-foreground mb-2">8. Limitation of Liability</h3>
                    <p className="text-muted-foreground">
                      Each party's liability is capped at the total fees paid under this Agreement in the twelve months preceding the claim.
                    </p>
                  </div>

                  <div id="clause-12-governing-law" className="p-3 bg-muted/30 border-l-4 border-muted rounded transition-all duration-300">
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
