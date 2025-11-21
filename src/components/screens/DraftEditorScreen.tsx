import { useState, useMemo, useCallback, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Save, Share2, AlertCircle, HelpCircle, Search, Copy, X, Info, ExternalLink, FileDown, Printer, ClipboardCopy, Star, MessageSquare, CheckCircle2, Bookmark } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useIsMobile } from "@/hooks/use-mobile";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { useAuditLog } from "@/components/AuditLog";
import { formatDistanceToNow } from "date-fns";
import { useDraftSession } from "@/contexts/DraftSessionContext";
import { useFocusBookmarks } from "@/contexts/FocusBookmarksContext";
import { OCRImportModal } from "@/components/OCRImportModal";

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
    { role: "system", text: "I can summarize, explain clauses, and suggest edits. Scripted demo — no real AI call." },
    { role: "user", text: "Is 99.9% uptime standard for us?" },
    { role: "ai", text: "Standard is 99.0%. 99.9% is higher; mark as Medium risk and seek Ops approval." },
    { role: "user", text: "Rewrite the termination clause more simply." },
    { role: "ai", text: "Here's a plain-language version: Either party may end this Agreement with 30 days' notice if the other party materially breaches and doesn't fix it." }
  ]);
  const [chatInput, setChatInput] = useState("");
  
  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");
  
  const [showExportMenu, setShowExportMenu] = useState(false);
  
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const { addEvent } = useAuditLog();
  const { dirty, savedAt, markDirty, save } = useDraftSession();
  const { focusItems, addFocus, removeFocus, toggleResolved, updateNote, findByAnchor, unresolvedCount } = useFocusBookmarks();
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [noteText, setNoteText] = useState("");
  const [focusFilter, setFocusFilter] = useState<"all" | "unresolved" | "resolved">("all");
  const [severityFilter, setSeverityFilter] = useState<"all" | "high" | "medium" | "low">("all");

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

  const handleExportFocusSummary = useCallback(() => {
    const lines = [
      "Focus Items Summary",
      "===================\n",
      ...focusItems.map(item => 
        `Title: ${item.title}\n` +
        `Severity: ${item.severity || 'N/A'}\n` +
        `Status: ${item.resolved ? 'Resolved' : 'Open'}\n` +
        `Note: ${item.note || 'N/A'}\n` +
        `Created: ${new Date(item.createdAt).toLocaleString()}\n`
      )
    ];
    
    const text = lines.join('\n');
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    const date = new Date().toISOString().split('T')[0];
    a.download = `FocusSummary_${date}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Focus summary exported",
      description: "File downloaded successfully.",
    });
    
    setShowExportMenu(false);
    addEvent("Exported Focus summary", "Downloaded as .txt");
  }, [focusItems, toast, addEvent]);

  const handleExportTxt = useCallback(() => {
    const content = document.getElementById('contractContent');
    if (!content) return;
    
    const text = content.innerText;
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    const date = new Date().toISOString().split('T')[0];
    a.download = `SmartDraft_Acme_${date}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Exported as .txt",
      description: "File downloaded successfully.",
    });
    
    setShowExportMenu(false);
    addEvent("Exported contract", "Downloaded as .txt");
  }, [toast, addEvent]);

  const handleExportPrint = useCallback(() => {
    const content = document.getElementById('contractContent');
    if (!content) return;
    
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast({
        variant: "destructive",
        title: "Print blocked",
        description: "Please allow popups to print.",
      });
      return;
    }
    
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Master SaaS Agreement - Print</title>
          <style>
            body { font-family: system-ui, -apple-system, sans-serif; padding: 24px; color: #000; background: #fff; }
            h1 { font-size: 24px; font-weight: bold; margin-bottom: 16px; }
            h3 { font-size: 16px; font-weight: 600; margin-top: 16px; margin-bottom: 8px; }
            p { margin-bottom: 12px; line-height: 1.6; }
            .clause { margin-bottom: 16px; }
          </style>
        </head>
        <body>
          ${content.innerHTML}
        </body>
      </html>
    `;
    
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.print();
    setTimeout(() => printWindow.close(), 500);
    
    toast({
      title: "Opened print dialog",
      description: "Ready to save as PDF.",
    });
    
    setShowExportMenu(false);
    addEvent("Exported contract", "Opened print dialog");
  }, [toast, addEvent]);

  const handleCopyText = useCallback(() => {
    const content = document.getElementById('contractContent');
    if (!content) return;
    
    const text = content.innerText;
    
    if (!navigator.clipboard) {
      toast({
        variant: "destructive",
        title: "Clipboard not available",
        description: "Clipboard API not supported.",
      });
      return;
    }
    
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Contract text copied",
        description: "Text copied to clipboard.",
      });
      setShowExportMenu(false);
      addEvent("Copied contract text", "Copied to clipboard");
    }).catch(() => {
      toast({
        variant: "destructive",
        title: "Copy failed",
        description: "Failed to copy to clipboard.",
      });
    });
  }, [toast, addEvent]);

  // Keyboard shortcut for Save (Ctrl+S / Cmd+S)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (dirty) {
          save();
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dirty, save]);

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
    
    addEvent("Navigated to clause", `Scrolled to: ${clauseId}`);
  }, [addEvent]);

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
    <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col min-h-0">
      <TabsList className="shrink-0 grid w-full grid-cols-4 border-b border-border/20">
        <TabsTrigger value="insights">Insights</TabsTrigger>
        <TabsTrigger value="ask-ai">Ask AI</TabsTrigger>
        <TabsTrigger value="search">Search</TabsTrigger>
        <TabsTrigger value="focus">
          Focus {unresolvedCount > 0 && `(${unresolvedCount})`}
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="insights" forceMount className={`flex-1 flex flex-col min-h-0 ${activeTab !== "insights" ? "hidden" : ""}`}>
        <div className="shrink-0 p-3 md:p-4 border-b border-border/20">
          <h4 className="font-semibold text-sm flex items-center gap-2 text-foreground">
            AI Insights & Analysis
          </h4>
        </div>
        
        <div className="flex-1 min-h-0 overflow-y-auto p-3 md:p-4">
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
      
      <TabsContent value="ask-ai" forceMount className={`flex-1 flex flex-col min-h-0 ${activeTab !== "ask-ai" ? "hidden" : ""}`}>
        <div className="flex-1 min-h-0 overflow-y-auto p-3 md:p-4">
          <div className="space-y-3">
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
        </div>

        <div className="shrink-0 space-y-3 border-t border-border/20 p-3 md:p-4">
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

      <TabsContent value="search" forceMount className={`flex h-full min-h-0 flex-col ${activeTab !== "search" ? "hidden" : ""}`}>
        {/* Sticky header: search input + chips */}
        <div className="sticky top-0 z-10 bg-[hsl(var(--background))] border-b border-border/20 p-3 md:p-4 space-y-2">
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

        {/* Scrollable results */}
        <div className="flex-1 min-h-0 overflow-y-auto p-3 md:p-4 space-y-2">
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

      <TabsContent value="focus" forceMount className={`flex h-full min-h-0 flex-col ${activeTab !== "focus" ? "hidden" : ""}`}>
        {/* Sticky header: filters */}
        <div className="sticky top-0 z-10 bg-[hsl(var(--background))] border-b border-border/20 p-3 md:p-4 space-y-2">
          <h4 className="font-semibold text-sm text-foreground">Focus Bookmarks</h4>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFocusFilter("all")}
              className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                focusFilter === "all"
                  ? "bg-brand-primary text-white border-brand-primary"
                  : "bg-muted/30 border-border hover:bg-muted"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFocusFilter("unresolved")}
              className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                focusFilter === "unresolved"
                  ? "bg-brand-primary text-white border-brand-primary"
                  : "bg-muted/30 border-border hover:bg-muted"
              }`}
            >
              Unresolved
            </button>
            <button
              onClick={() => setFocusFilter("resolved")}
              className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                focusFilter === "resolved"
                  ? "bg-brand-primary text-white border-brand-primary"
                  : "bg-muted/30 border-border hover:bg-muted"
              }`}
            >
              Resolved
            </button>
          </div>
          <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
            <button
              onClick={() => setSeverityFilter("all")}
              className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                severityFilter === "all"
                  ? "bg-brand-primary text-white border-brand-primary"
                  : "bg-muted/30 border-border hover:bg-muted"
              }`}
            >
              All severities
            </button>
            <button
              onClick={() => setSeverityFilter("high")}
              className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                severityFilter === "high"
                  ? "bg-danger text-white border-danger"
                  : "bg-muted/30 border-border hover:bg-muted"
              }`}
            >
              High
            </button>
            <button
              onClick={() => setSeverityFilter("medium")}
              className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                severityFilter === "medium"
                  ? "bg-warn text-white border-warn"
                  : "bg-muted/30 border-border hover:bg-muted"
              }`}
            >
              Medium
            </button>
            <button
              onClick={() => setSeverityFilter("low")}
              className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                severityFilter === "low"
                  ? "bg-ok text-white border-ok"
                  : "bg-muted/30 border-border hover:bg-muted"
              }`}
            >
              Low
            </button>
          </div>
        </div>

        {/* Scrollable list */}
        <div className="flex-1 min-h-0 overflow-y-auto p-3 md:p-4 space-y-3">
          {focusItems
            .filter(item => {
              if (focusFilter === "unresolved" && item.resolved) return false;
              if (focusFilter === "resolved" && !item.resolved) return false;
              if (severityFilter !== "all" && item.severity !== severityFilter) return false;
              return true;
            })
            .length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">
              <Bookmark className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No focus items yet</p>
              <p className="text-xs mt-1">Bookmark key clauses to track them here</p>
            </div>
          ) : (
            focusItems
              .filter(item => {
                if (focusFilter === "unresolved" && item.resolved) return false;
                if (focusFilter === "resolved" && !item.resolved) return false;
                if (severityFilter !== "all" && item.severity !== severityFilter) return false;
                return true;
              })
              .map(item => (
                <div
                  key={item.id}
                  className={`p-4 rounded-lg border ${
                    item.resolved ? "bg-muted/20 border-border" : "bg-surface/50 border-border"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <h5 className="font-semibold text-sm text-foreground flex items-center gap-2">
                          {item.title}
                          {item.severity && (
                            <span
                              className={`w-2 h-2 rounded-full ${
                                item.severity === "high"
                                  ? "bg-danger"
                                  : item.severity === "medium"
                                  ? "bg-warn"
                                  : "bg-ok"
                              }`}
                            />
                          )}
                        </h5>
                        <Badge variant="outline" className="text-xs">
                          {item.source}
                        </Badge>
                      </div>
                      {item.snippet && (
                        <p className="text-sm text-muted-foreground line-clamp-2">{item.snippet}</p>
                      )}
                      {item.note && (
                        <div className="p-2 bg-muted/30 rounded text-xs text-muted-foreground border-l-2 border-brand-primary">
                          {item.note}
                        </div>
                      )}
                      {editingNote === item.id && (
                        <div className="space-y-2">
                          <Textarea
                            value={noteText}
                            onChange={(e) => setNoteText(e.target.value)}
                            placeholder="Add a note (max 140 chars)..."
                            maxLength={140}
                            rows={2}
                            className="text-xs"
                          />
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => {
                                updateNote(item.id, noteText);
                                setEditingNote(null);
                                setNoteText("");
                              }}
                            >
                              Save
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setEditingNote(null);
                                setNoteText("");
                              }}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      )}
                      <div className="flex items-center gap-2 pt-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => scrollToClause(item.anchorId)}
                          className="h-7 text-xs"
                        >
                          Go to clause
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setEditingNote(item.id);
                            setNoteText(item.note || "");
                          }}
                          className="h-7 text-xs"
                        >
                          <MessageSquare className="h-3 w-3 mr-1" />
                          Note
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => toggleResolved(item.id)}
                          className="h-7 text-xs"
                        >
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          {item.resolved ? "Reopen" : "Resolve"}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeFocus(item.id)}
                          className="h-7 text-xs text-danger hover:text-danger"
                        >
                          Remove
                        </Button>
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
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-semibold text-foreground">Contract Draft</h2>
                  {dirty && (
                    <span className="flex items-center gap-1.5 text-xs text-warn">
                      <span className="h-1.5 w-1.5 rounded-full bg-warn animate-pulse" />
                      Unsaved changes
                    </span>
                  )}
                  {!dirty && savedAt && (
                    <span className="text-xs text-muted-foreground">
                      Saved {formatDistanceToNow(savedAt, { addSuffix: true })}
                    </span>
                  )}
                </div>
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
                        <div className="mt-6 h-[calc(100%-4rem)] flex flex-col min-h-0">{rightPanel}</div>
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
                        <span>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            disabled={!dirty}
                            onClick={save}
                          >
                            <Save className="h-4 w-4 mr-2" />
                            Save
                          </Button>
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{dirty ? "Save changes (Ctrl+S)" : "No changes to save"}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <Popover open={showExportMenu} onOpenChange={setShowExportMenu}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Share2 className="h-4 w-4 mr-2" />
                        Export
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-56 p-2">
                      <div className="space-y-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start"
                          onClick={handleExportTxt}
                        >
                          <FileDown className="h-4 w-4 mr-2" />
                          Download .txt
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start"
                          onClick={handleExportPrint}
                        >
                          <Printer className="h-4 w-4 mr-2" />
                          Print / Save as PDF
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start"
                          onClick={handleCopyText}
                        >
                          <ClipboardCopy className="h-4 w-4 mr-2" />
                          Copy contract text
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start"
                          onClick={handleExportFocusSummary}
                        >
                          <Bookmark className="h-4 w-4 mr-2" />
                          Download Focus summary (.txt)
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {/* Document content */}
              <div id="contractContent" className="prose prose-sm max-w-none space-y-4 p-4 bg-surface border border-border rounded-lg min-h-[500px]">
                <h1 className="text-2xl font-bold text-foreground mb-4">Master SaaS Agreement</h1>
                
                <p className="text-muted-foreground leading-relaxed">
                  This Agreement is made on Jan 1, 2026 between SoftCo, Inc. ("Provider") and Acme Corporation ("Customer").
                </p>

                <div className="space-y-3">
                  <div id="clause-2-term" className="transition-all duration-300">
                    <h3 className="text-base font-semibold text-foreground mb-2 flex items-center justify-between group">
                      <span>2. Term</span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              onClick={() => {
                                const existing = findByAnchor("clause-2-term");
                                if (existing) {
                                  removeFocus(existing.id);
                                } else {
                                  addFocus({
                                    anchorId: "clause-2-term",
                                    title: "Term",
                                    snippet: CLAUSES[0].text,
                                    source: 'clause',
                                    severity: 'low'
                                  });
                                }
                              }}
                              className={`p-1 rounded transition-all opacity-0 group-hover:opacity-100 ${
                                findByAnchor("clause-2-term") ? "text-brand-primary" : "text-muted-foreground hover:text-foreground"
                              }`}
                              aria-label={findByAnchor("clause-2-term") ? "Remove bookmark" : "Add bookmark"}
                            >
                              <Star className={`h-4 w-4 ${findByAnchor("clause-2-term") ? "fill-current" : ""}`} />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{findByAnchor("clause-2-term") ? "Remove bookmark" : "Add bookmark"}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </h3>
                    <p className="text-muted-foreground">12 months from Effective Date.</p>
                  </div>

                  <div id="clause-5-service-levels" className="p-3 bg-brand-primary/5 border-l-4 border-brand-primary rounded transition-all duration-300">
                    <h3 className="text-base font-semibold text-foreground mb-2 flex items-center gap-2 justify-between group">
                      <span className="flex items-center gap-2">
                        5. Service Levels
                        <span className="text-xs text-brand-primary bg-brand-primary/10 px-2 py-0.5 rounded">Highlighted</span>
                      </span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              onClick={() => {
                                const existing = findByAnchor("clause-5-service-levels");
                                if (existing) {
                                  removeFocus(existing.id);
                                } else {
                                  addFocus({
                                    anchorId: "clause-5-service-levels",
                                    title: "Service Levels",
                                    snippet: CLAUSES[1].text,
                                    source: 'clause',
                                    severity: 'medium'
                                  });
                                }
                              }}
                              className={`p-1 rounded transition-all opacity-0 group-hover:opacity-100 ${
                                findByAnchor("clause-5-service-levels") ? "text-brand-primary" : "text-muted-foreground hover:text-foreground"
                              }`}
                              aria-label={findByAnchor("clause-5-service-levels") ? "Remove bookmark" : "Add bookmark"}
                            >
                              <Star className={`h-4 w-4 ${findByAnchor("clause-5-service-levels") ? "fill-current" : ""}`} />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{findByAnchor("clause-5-service-levels") ? "Remove bookmark" : "Add bookmark"}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </h3>
                    <p className="text-muted-foreground">
                      Provider maintains 99.9% monthly uptime. Service credits are provided per Schedule A if this threshold is not met.
                    </p>
                  </div>

                  <div id="clause-7-payment" className="transition-all duration-300">
                    <h3 className="text-base font-semibold text-foreground mb-2 flex items-center justify-between group">
                      <span>7. Payment Terms</span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              onClick={() => {
                                const existing = findByAnchor("clause-7-payment");
                                if (existing) {
                                  removeFocus(existing.id);
                                } else {
                                  addFocus({
                                    anchorId: "clause-7-payment",
                                    title: "Payment Terms",
                                    snippet: CLAUSES[2].text,
                                    source: 'clause',
                                    severity: 'low'
                                  });
                                }
                              }}
                              className={`p-1 rounded transition-all opacity-0 group-hover:opacity-100 ${
                                findByAnchor("clause-7-payment") ? "text-brand-primary" : "text-muted-foreground hover:text-foreground"
                              }`}
                              aria-label={findByAnchor("clause-7-payment") ? "Remove bookmark" : "Add bookmark"}
                            >
                              <Star className={`h-4 w-4 ${findByAnchor("clause-7-payment") ? "fill-current" : ""}`} />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{findByAnchor("clause-7-payment") ? "Remove bookmark" : "Add bookmark"}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </h3>
                    <p className="text-muted-foreground">
                      Fees are due within 30 days from invoice date unless otherwise agreed.
                    </p>
                  </div>

                  <div id="clause-8-liability" className="transition-all duration-300">
                    <h3 className="text-base font-semibold text-foreground mb-2 flex items-center justify-between group">
                      <span>8. Limitation of Liability</span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              onClick={() => {
                                const existing = findByAnchor("clause-8-liability");
                                if (existing) {
                                  removeFocus(existing.id);
                                } else {
                                  addFocus({
                                    anchorId: "clause-8-liability",
                                    title: "Limitation of Liability",
                                    snippet: CLAUSES[3].text,
                                    source: 'clause',
                                    severity: 'medium'
                                  });
                                }
                              }}
                              className={`p-1 rounded transition-all opacity-0 group-hover:opacity-100 ${
                                findByAnchor("clause-8-liability") ? "text-brand-primary" : "text-muted-foreground hover:text-foreground"
                              }`}
                              aria-label={findByAnchor("clause-8-liability") ? "Remove bookmark" : "Add bookmark"}
                            >
                              <Star className={`h-4 w-4 ${findByAnchor("clause-8-liability") ? "fill-current" : ""}`} />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{findByAnchor("clause-8-liability") ? "Remove bookmark" : "Add bookmark"}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </h3>
                    <p className="text-muted-foreground">
                      Each party's liability is capped at the total fees paid under this Agreement in the twelve months preceding the claim.
                    </p>
                  </div>

                  <div id="clause-12-governing-law" className="p-3 bg-muted/30 border-l-4 border-muted rounded transition-all duration-300">
                    <h3 className="text-base font-semibold text-foreground mb-2 flex items-center gap-2 justify-between group">
                      <span className="flex items-center gap-2">
                        12. Governing Law
                        <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-0.5 rounded">Assumption</span>
                      </span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              onClick={() => {
                                const existing = findByAnchor("clause-12-governing-law");
                                if (existing) {
                                  removeFocus(existing.id);
                                } else {
                                  addFocus({
                                    anchorId: "clause-12-governing-law",
                                    title: "Governing Law",
                                    snippet: CLAUSES[4].text,
                                    source: 'clause',
                                    severity: 'low'
                                  });
                                }
                              }}
                              className={`p-1 rounded transition-all opacity-0 group-hover:opacity-100 ${
                                findByAnchor("clause-12-governing-law") ? "text-brand-primary" : "text-muted-foreground hover:text-foreground"
                              }`}
                              aria-label={findByAnchor("clause-12-governing-law") ? "Remove bookmark" : "Add bookmark"}
                            >
                              <Star className={`h-4 w-4 ${findByAnchor("clause-12-governing-law") ? "fill-current" : ""}`} />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{findByAnchor("clause-12-governing-law") ? "Remove bookmark" : "Add bookmark"}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
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
              <CardContent className="p-4 h-full flex flex-col min-h-0">
                {rightPanel}
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* OCR Import Modal */}
      <OCRImportModal open={showUploadModal} onOpenChange={setShowUploadModal} />
    </>
  );
}
