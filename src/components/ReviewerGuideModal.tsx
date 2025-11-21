import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ReviewerGuideModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ReviewerGuideModal({ open, onOpenChange }: ReviewerGuideModalProps) {
  const [activeSection, setActiveSection] = useState("summary");

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl h-[80vh] p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle className="text-2xl">Reviewer Guide</DialogTitle>
        </DialogHeader>
        
        <div className="flex h-full overflow-hidden">
          {/* Left TOC */}
          <div className="w-64 border-r bg-muted/20 p-4">
            <nav className="space-y-1">
              {[
                { id: "summary", label: "Case Summary" },
                { id: "persona", label: "Persona & Pain" },
                { id: "click", label: "What to Click" },
                { id: "extends", label: "How This Extends Sirion" },
                { id: "kpis", label: "KPIs & Business Outcomes" },
                { id: "under-hood", label: "How It Works" },
                { id: "limitations", label: "Limitations & Human in the Loop" },
                { id: "notes", label: "Reviewer Notes" },
              ].map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                    activeSection === section.id
                      ? "bg-brand-primary text-white"
                      : "hover:bg-muted text-muted-foreground"
                  }`}
                >
                  {section.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Right Content */}
          <ScrollArea className="flex-1 p-6">
            <div className="space-y-8 pb-8">
              {/* Section 1 */}
              <section id="summary" className="space-y-3">
                <h2 className="text-xl font-semibold text-foreground">Case Summary</h2>
                <p className="text-muted-foreground">
                  <strong className="text-foreground">Task:</strong> Design a single-URL clickable prototype of a NEW AI-powered Sirion feature/agent/workflow for a specific persona with an end-to-end flow and embedded context.
                </p>
                <p className="text-muted-foreground">
                  <strong className="text-foreground">My solution:</strong> "SmartDraft AI" — a Sales Ops agent that drafts contracts from deal info, flags risks/assumptions, answers questions in context, analyzes client redlines with suggested responses, and guides finalization.
                </p>
              </section>

              {/* Section 2 */}
              <section id="persona" className="space-y-3">
                <h2 className="text-xl font-semibold text-foreground">Persona & Pain</h2>
                <p className="text-muted-foreground">
                  <strong className="text-foreground">Persona:</strong> Sales Operations Lead (B2B SaaS).
                </p>
                <div>
                  <p className="text-foreground font-medium mb-2">Pains:</p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                    <li>Slow first drafts and copy-paste errors from templates.</li>
                    <li>Back-and-forth with Legal on non-standard clauses.</li>
                    <li>Hard to spot risky deviations during negotiation.</li>
                  </ul>
                </div>
              </section>

              {/* Section 3 */}
              <section id="click" className="space-y-3">
                <h2 className="text-xl font-semibold text-foreground">What to Click (End-to-End)</h2>
                <p className="text-muted-foreground">
                  <strong className="text-foreground">Flow:</strong> Start → New Contract → Generate → Draft → Insights / Ask AI / Search → Upload Redlines → Accept/Counter/Flag → Approvals (if needed) → Finalize → About.
                </p>
                <p className="text-muted-foreground">
                  <strong className="text-foreground">Tip:</strong> Try "liability cap" in Search, change SLA in Metadata, flag High risk in Approvals, then view Finalize metrics and Audit Log.
                </p>
              </section>

              {/* Section 4 */}
              <section id="extends" className="space-y-3">
                <h2 className="text-xl font-semibold text-foreground">How This Extends Sirion</h2>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Runs as a Sales Ops agent on agentOS, orchestrating Store/Repository (templates & clauses), Create (Drafting/Negotiation), and Manage (Risk/Performance).</li>
                  <li>Keeps contracts, permissions, and audit trails fully governed inside Sirion.</li>
                  <li>Improves Drafting/Negotiation adoption in Sales and reduces Legal load on standard deals.</li>
                </ul>
              </section>

              {/* Section 5 */}
              <section id="kpis" className="space-y-3">
                <h2 className="text-xl font-semibold text-foreground">KPIs & Business Outcomes</h2>
                <div className="space-y-2">
                  <p className="text-muted-foreground">
                    <strong className="text-foreground">Primary KPIs:</strong>
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                    <li>Cycle time: "Verbal Yes" → Signed (target −40%).</li>
                    <li>Negotiation iterations (target ≤2 rounds average).</li>
                    <li>% drafts from standard templates (target +30%).</li>
                    <li>Legal-touch rate in mid‑market deals (target −25%).</li>
                  </ul>
                  <p className="text-muted-foreground mt-2">
                    <strong className="text-foreground">Leading indicators:</strong> AI suggestion acceptance rate; time‑to‑first‑draft; % deviations resolved without Legal.
                  </p>
                </div>
              </section>

              {/* Section 6 */}
              <section id="under-hood" className="space-y-3">
                <h2 className="text-xl font-semibold text-foreground">How It Works (Under the Hood)</h2>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>RAG‑lite over in‑memory clause index + the current draft; scripted but functional search and clause jump.</li>
                  <li>Metadata extraction via regex; edits sync back into the clause text.</li>
                  <li>Playbook thresholds compute risk; HIGH risk triggers a simulated approval workflow.</li>
                  <li>Redlines Diff View generates a short "What changed?" summary.</li>
                  <li>Everything runs client-side, with session-only state.</li>
                </ul>
              </section>

              {/* Section 7 */}
              <section id="limitations" className="space-y-3">
                <h2 className="text-xl font-semibold text-foreground">Limitations & Human in the Loop</h2>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>HIGH-risk deviations (e.g., unlimited liability) require Legal approval.</li>
                  <li>Low-confidence or novel clauses prompt the user to specify language.</li>
                  <li>Scope respects permissions (no access to contracts beyond user scope in real product).</li>
                  <li>Prototype note: logic is demonstrative; no external services are called.</li>
                </ul>
              </section>

              {/* Section 8 */}
              <section id="notes" className="space-y-3">
                <h2 className="text-xl font-semibold text-foreground">Reviewer Notes</h2>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>
                    <strong className="text-foreground">Edge states:</strong> try "All‑standard" vs "Non‑standard SLA" chips on Draft; see Approvals for HIGH risk.
                  </li>
                  <li>
                    <strong className="text-foreground">Audit Log:</strong> check the session event list after actions (draft created, metadata edited, approvals, etc.).
                  </li>
                </ul>
              </section>
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
