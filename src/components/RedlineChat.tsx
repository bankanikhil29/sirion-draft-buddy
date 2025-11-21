import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Send, ChevronDown, ChevronUp, Info, Copy, Star } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { useFocusBookmarks } from "@/contexts/FocusBookmarksContext";

export type RedlineChatMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
  tags?: string[];
  createdAt: number;
};

type RedlineChatProps = {
  changeId: string;
  risk: "low" | "medium" | "high";
  clauseType: "Payment" | "Governing Law" | "Liability" | "SLA" | "Data Residency" | "Other";
  originalText: string;
  proposedText: string;
  anchorId?: string;
  onCounterApply?: (counterText: string) => void;
};

export function RedlineChat({
  changeId,
  risk,
  clauseType,
  originalText,
  proposedText,
  anchorId,
  onCounterApply
}: RedlineChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<RedlineChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [counterDraft, setCounterDraft] = useState<string | undefined>();
  const [emailDraft, setEmailDraft] = useState<string | undefined>();
  const [showCounterEditor, setShowCounterEditor] = useState(false);
  const [counterEditorText, setCounterEditorText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();
  const { addFocus } = useFocusBookmarks();

  const addMessage = (role: "user" | "assistant", text: string, tags?: string[]) => {
    const msg: RedlineChatMessage = {
      id: `msg-${Date.now()}-${Math.random()}`,
      role,
      text,
      tags,
      createdAt: Date.now()
    };
    setMessages(prev => [...prev, msg]);
  };

  const explainRisk = () => {
    let explanation = "";
    let tags: string[] = [];

    if (clauseType === "Payment" && risk === "low") {
      explanation = "Within playbook for standard SaaS; cash impact minimal.";
    } else if (clauseType === "Governing Law" && risk === "medium") {
      explanation = "Default is NY; CA may increase cost—counter with NY/DE.";
    } else if (clauseType === "Liability" && risk === "high") {
      explanation = "Violates baseline; only carve-outs can be unlimited—needs Legal approval.";
      tags = ["Needs Legal approval"];
    } else if (clauseType === "Liability" && risk === "medium") {
      explanation = "Lower than standard 2x multiplier; consider countering with 1.5x compromise.";
    } else if (clauseType === "SLA" && risk === "medium") {
      explanation = "Above standard; increases credit exposure—seek Ops approval.";
    } else if (clauseType === "Data Residency" && risk === "low") {
      explanation = "Standard GDPR compliance request; acceptable if infrastructure supports EU hosting.";
    } else {
      explanation = `${risk.charAt(0).toUpperCase() + risk.slice(1)} risk level detected for this change.`;
    }

    addMessage("user", "Explain risk (1 line)");
    setTimeout(() => addMessage("assistant", explanation, tags), 150);
  };

  const draftCounter = () => {
    let counter = "";

    switch (clauseType) {
      case "Payment":
        counter = "Fees are due within 45 days of invoice. A 1% monthly late fee applies to overdue amounts.";
        break;
      case "Governing Law":
        counter = "This Agreement is governed by the laws of New York, USA. Each party submits to NY courts.";
        break;
      case "Liability":
        counter = "Each party's liability is capped at fees paid in the 12 months preceding the claim, except for IP/confidentiality breaches or gross negligence.";
        break;
      case "SLA":
        counter = "Provider maintains 99.5% monthly uptime. Credits per Schedule A; liability limited as set out herein.";
        break;
      case "Data Residency":
        counter = "Customer data shall be stored in Provider's EU data centers, subject to Section 6 data protection terms.";
        break;
      default:
        counter = "Counter language based on standard playbook terms for this clause type.";
    }

    setCounterDraft(counter);
    addMessage("user", "Draft counter from playbook");
    setTimeout(() => addMessage("assistant", "Counter drafted from playbook."), 150);
  };

  const writeEmail = () => {
    let email = "";

    switch (clauseType) {
      case "Payment":
        email = "Hi team — thanks for the redline. Net-45 is workable on our standard SaaS terms. We'll include a 1% monthly late fee to align with policy. Please confirm and we'll update the draft.";
        break;
      case "Governing Law":
        email = "Hi — we appreciate the proposed changes. Our standard agreement uses New York law for consistency. Would NY or Delaware work as a neutral alternative? Let me know if you'd like to discuss.";
        break;
      case "Liability":
        email = "Thanks for sharing your redline. We'd like to propose a 1.5x cap as a middle ground that protects both parties. This aligns with our standard risk framework. Can we move forward with this compromise?";
        break;
      case "Data Residency":
        email = "Hi team — we can accommodate EU data residency for your data. We'll confirm infrastructure capacity and update the agreement accordingly. Please let us know if you need any additional compliance documentation.";
        break;
      default:
        email = "Hi — thanks for the proposed changes. We've reviewed them and would like to discuss a few points. Let me know when you're available for a quick call.";
    }

    setEmailDraft(email);
    addMessage("user", "Write customer email");
    setTimeout(() => addMessage("assistant", "Email drafted. Ready to copy or add to Focus."), 150);
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userInput = input.trim();
    addMessage("user", userInput);
    setInput("");

    // Route based on keywords
    setTimeout(() => {
      const lower = userInput.toLowerCase();
      if (lower.includes("risk")) {
        explainRisk();
      } else if (lower.includes("counter")) {
        draftCounter();
      } else if (lower.includes("email")) {
        writeEmail();
      } else {
        addMessage("assistant", "I can explain risk, draft a counter from playbook, or write a customer email about this change.");
      }
    }, 200);
  };

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({ title: `${label} copied to clipboard` });
    } catch {
      toast({ title: "Clipboard not available", variant: "destructive" });
    }
  };

  const handleInsertCounter = () => {
    if (counterDraft) {
      setCounterEditorText(counterDraft.slice(0, 700));
      setShowCounterEditor(true);
    }
  };

  const handleApplyCounter = () => {
    if (onCounterApply && counterEditorText.trim()) {
      onCounterApply(counterEditorText);
      setShowCounterEditor(false);
      toast({ title: "Counter applied" });
    }
  };

  const handleAddEmailToFocus = () => {
    if (anchorId && emailDraft) {
      const severityMap = { low: "low", medium: "medium", high: "high" } as const;
      addFocus({
        anchorId,
        title: `${clauseType} - Email Draft`,
        snippet: emailDraft.slice(0, 100) + "...",
        source: "redline",
        severity: severityMap[risk]
      });
      toast({ title: "Added to Focus bookmarks" });
    }
  };

  return (
    <div className="border-t border-border/30 pt-3 mt-3">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="flex items-center justify-between">
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="text-sm font-medium hover:bg-muted/50 transition-colors"
            >
              Ask about this change
              {isOpen ? <ChevronUp className="ml-1 h-3 w-3" /> : <ChevronDown className="ml-1 h-3 w-3" />}
            </Button>
          </CollapsibleTrigger>
        </div>

        <CollapsibleContent className="mt-3 space-y-3">
          {/* Header */}
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <span>AI Assistant</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-3 w-3 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Scripted demo — no external calls.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              className="text-xs h-7"
              onClick={explainRisk}
            >
              Explain risk (1 line)
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-xs h-7"
              onClick={draftCounter}
            >
              Draft counter from playbook
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-xs h-7"
              onClick={writeEmail}
            >
              Write customer email
            </Button>
          </div>

          {/* Messages Thread */}
          {messages.length > 0 && (
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {messages.slice(-4).map((msg) => (
                <div
                  key={msg.id}
                  className={`p-2 rounded-lg text-sm ${
                    msg.role === "user"
                      ? "bg-brand-primary/10 ml-6"
                      : "bg-muted/50 mr-6"
                  }`}
                >
                  <div className="text-xs text-muted-foreground mb-1">
                    {msg.role === "user" ? "You" : "AI Assistant"}
                  </div>
                  <div className="text-foreground leading-relaxed">{msg.text}</div>
                  {msg.tags && msg.tags.length > 0 && (
                    <div className="flex gap-1 mt-1">
                      {msg.tags.map((tag, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Show action buttons for counter/email drafts */}
                  {msg.role === "assistant" && msg.text.includes("Counter drafted") && counterDraft && (
                    <div className="flex gap-2 mt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs h-7"
                        onClick={handleInsertCounter}
                      >
                        Insert into Counter
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs h-7"
                        onClick={() => copyToClipboard(counterDraft, "Counter clause")}
                      >
                        <Copy className="h-3 w-3 mr-1" />
                        Copy text
                      </Button>
                    </div>
                  )}

                  {msg.role === "assistant" && msg.text.includes("Email drafted") && emailDraft && (
                    <div className="flex gap-2 mt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs h-7"
                        onClick={() => copyToClipboard(emailDraft, "Email")}
                      >
                        <Copy className="h-3 w-3 mr-1" />
                        Copy email
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs h-7"
                        onClick={handleAddEmailToFocus}
                      >
                        <Star className="h-3 w-3 mr-1" />
                        Add to Focus
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Composer */}
          <div className="flex gap-2">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Ask about this change…"
              className="resize-none min-h-[36px] max-h-[84px] text-sm"
              rows={1}
            />
            <Button
              size="sm"
              onClick={handleSend}
              disabled={!input.trim()}
              className="px-3"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Counter Editor */}
      {showCounterEditor && (
        <div className="mt-3 p-3 bg-muted/30 border border-border rounded-lg space-y-2">
          <label className="text-sm font-medium text-foreground">Counter proposal</label>
          <Textarea
            value={counterEditorText}
            onChange={(e) => setCounterEditorText(e.target.value.slice(0, 700))}
            className="text-sm min-h-[80px]"
            placeholder="Edit counter text..."
          />
          <div className="flex gap-2">
            <Button size="sm" onClick={handleApplyCounter}>
              Apply counter
            </Button>
            <Button size="sm" variant="outline" onClick={() => setShowCounterEditor(false)}>
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
