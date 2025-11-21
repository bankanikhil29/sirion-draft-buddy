import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Zap, Target, TrendingUp, Database, FileText, Network } from "lucide-react";
import { AuditLog } from "@/components/AuditLog";
export function AboutScreen() {
  return <div className="max-w-4xl mx-auto space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">About SmartDraft AI</h1>
        <p className="text-muted-foreground">
          AI-powered contract generation for modern sales teams
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>What is SmartDraft AI?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>
            SmartDraft AI is designed to help Sales Operations teams create compliant, high-quality 
            contract first drafts in minutes instead of hours. By leveraging your organization's 
            playbooks and compliance requirements, SmartDraft ensures every contract starts from a 
            position of strength.
          </p>
          <p>
            The platform guides you through the entire contract lifecycle—from initial draft creation 
            to redline analysis and finalization—with intelligent suggestions that balance business 
            needs with risk management.
          </p>
        </CardContent>
      </Card>

      <div className="grid sm:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-brand-primary/10 rounded-lg">
                <Zap className="h-5 w-5 text-brand-primary" />
              </div>
              <CardTitle className="text-lg">Speed</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Generate compliant first drafts in under 5 minutes, reducing contract turnaround time 
              by up to 70%.
            </CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-brand-primary/10 rounded-lg">
                <Shield className="h-5 w-5 text-brand-primary" />
              </div>
              <CardTitle className="text-lg">Compliance</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Every draft is checked against your organization's playbooks and compliance requirements 
              automatically.
            </CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-brand-primary/10 rounded-lg">
                <Target className="h-5 w-5 text-brand-primary" />
              </div>
              <CardTitle className="text-lg">Guidance</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Receive playbook-aware suggestions during redline negotiations to maintain favorable 
              terms while closing deals.
            </CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-brand-primary/10 rounded-lg">
                <TrendingUp className="h-5 w-5 text-brand-primary" />
              </div>
              <CardTitle className="text-lg">ROI</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Reduce review cycles, minimize legal escalations, and accelerate deal velocity with 
              better first drafts.
            </CardDescription>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>How It Works</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-4">
            <li className="flex gap-3">
              <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-brand-primary text-white text-sm font-semibold">
                1
              </span>
              <div>
                <p className="font-medium text-foreground">Enter Deal Details</p>
                <p className="text-sm text-muted-foreground">
                  Provide basic information about the client, contract type, and special requirements.
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-brand-primary text-white text-sm font-semibold">
                2
              </span>
              <div>
                <p className="font-medium text-foreground">AI Generates Draft</p>
                <p className="text-sm text-muted-foreground">
                  SmartDraft creates a compliant first draft using your organization's templates and playbooks.
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-brand-primary text-white text-sm font-semibold">
                3
              </span>
              <div>
                <p className="font-medium text-foreground">Review & Edit</p>
                <p className="text-sm text-muted-foreground">
                  Use the inline editor with AI-powered insights to refine the contract before sending.
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-brand-primary text-white text-sm font-semibold">
                4
              </span>
              <div>
                <p className="font-medium text-foreground">Analyze Redlines</p>
                <p className="text-sm text-muted-foreground">
                  Upload counterparty redlines and receive intelligent suggestions for each change.
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-brand-primary text-white text-sm font-semibold">
                5
              </span>
              <div>
                <p className="font-medium text-foreground">Finalize & Close</p>
                <p className="text-sm text-muted-foreground">
                  Export the final version and move forward with confidence.
                </p>
              </div>
            </li>
          </ol>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Business Fit & KPIs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold text-foreground mb-2">How This Extends Sirion</h3>
            <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
              <li>Runs as a Sales Ops agent on agentOS, orchestrating Store/Repository (templates & clauses), Create (Drafting/Negotiation), and Manage (Risk/Performance).</li>
              <li>Keeps contracts, permissions, and audit trails fully governed inside Sirion.</li>
              <li>Improves Drafting/Negotiation adoption in Sales and reduces Legal load on standard deals.</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-2">Key Performance Indicators</h3>
            <ul className="space-y-1 text-sm text-muted-foreground list-disc list-inside">
              <li>Cycle time: "Verbal Yes" → Signed (target −40%)</li>
              <li>Negotiation iterations (target ≤2 rounds average)</li>
              <li>% drafts from standard templates (target +30%)</li>
              <li>Legal-touch rate in mid‑market deals (target −25%)</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>









OCR Import & Focus Bookmarks</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold text-foreground mb-2">OCR Import (scanned documents → searchable text)</h3>
            <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
              <li><strong>Problem:</strong> Third-party or legacy scans block search, risk checks, and metadata extraction.</li>
              <li><strong>What this does:</strong> Simulates OCR, confidence scores, quick edits, and one-click "Apply to Draft".</li>
              <li><strong>Value:</strong> Unlocks repository searchability and downstream extraction/analysis for inbound non-searchable contracts.</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-2">Focus Bookmarks (watchlist)</h3>
            <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
              <li><strong>Problem:</strong> During drafting/negotiation, Sales Ops needs a simple way to track "must resolve" items.</li>
              <li><strong>What this does:</strong> Bookmark clauses/findings, add notes, jump back, and resolve before finalizing.</li>
              <li><strong>Value:</strong> Reduces handoffs, keeps attention on risk-bearing terms, and improves close readiness.</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>How these features fit Sirion (Business sense)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <ul className="space-y-2 text-sm list-disc list-inside">
            <li>Runs as a Sales Ops agent on agentOS, orchestrating Store/Repository (templates/clauses), Create (Drafting/Negotiation), and Manage (Risk/Performance).</li>
            <li><strong>KPIs influenced:</strong> Cycle time "Verbal Yes → Signed" (down), Negotiation iterations (down), % drafts from standard templates (up), Legal-touch rate on mid-market deals (down)</li>
            <li><strong>Guardrails:</strong> Low-confidence OCR blocks are flagged in Insights. Bookmarks are non-blocking but surfaced at Finalize if unresolved.</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>What to click (Reviewer path)</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
            <li>Draft Editor → Upload redlines → "Scanned PDF/Image (OCR)" → Apply to Draft</li>
            <li>Focus tab → Add a few bookmarks from clauses, insights, or redlines</li>
            <li>Finalize → See the guard modal for unresolved items</li>
          </ol>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Powered by Sirion</CardTitle>
          <CardDescription>SmartDraft AI orchestrates across the Sirion platform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center space-y-2">
              <div className="flex justify-center">
                <div className="p-3 bg-brand-primary/10 rounded-lg">
                  <Database className="h-6 w-6 text-brand-primary" />
                </div>
              </div>
              <div>
                <p className="font-medium text-sm text-foreground">Repository</p>
                <p className="text-xs text-muted-foreground">Templates & clauses</p>
              </div>
            </div>
            <div className="text-center space-y-2">
              <div className="flex justify-center">
                <div className="p-3 bg-brand-primary/10 rounded-lg">
                  <FileText className="h-6 w-6 text-brand-primary" />
                </div>
              </div>
              <div>
                <p className="font-medium text-sm text-foreground">Drafting</p>
                <p className="text-xs text-muted-foreground">AI-powered creation</p>
              </div>
            </div>
            <div className="text-center space-y-2">
              <div className="flex justify-center">
                <div className="p-3 bg-brand-primary/10 rounded-lg">
                  <Network className="h-6 w-6 text-brand-primary" />
                </div>
              </div>
              <div>
                <p className="font-medium text-sm text-foreground">Negotiation</p>
                <p className="text-xs text-muted-foreground">Redline analysis</p>
              </div>
            </div>
            <div className="text-center space-y-2">
              <div className="flex justify-center">
                <div className="p-3 bg-brand-primary/10 rounded-lg">
                  <Shield className="h-6 w-6 text-brand-primary" />
                </div>
              </div>
              <div>
                <p className="font-medium text-sm text-foreground">Risk</p>
                <p className="text-xs text-muted-foreground">Compliance & approval</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <AuditLog />

      <Card>
        <CardHeader>
          <CardTitle>Validations & Guardrails</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <div>
            <h3 className="font-semibold text-foreground mb-2">Form-level checks</h3>
            <ul className="space-y-2 text-sm list-disc list-inside">
              <li>Customer Name: 2–60 valid characters (letters/numbers/&/.-/space).</li>
              <li>Special Terms: 30–600 characters (live counter).</li>
              <li>Start Date: must be today or later (if provided).</li>
              <li>Effective Year (YYYY): optional; must be 4 digits (2000–2100). If Start Date is set, the year must match Start Date's year.</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-2">Draft & negotiation checks</h3>
            <ul className="space-y-2 text-sm list-disc list-inside">
              <li>Non-standard terms: flagged in Insights (e.g., SLA 99.9% vs playbook 99.0%).</li>
              <li>Low-confidence OCR: auto-creates a warning Insight and can be bookmarked as "Needs review."</li>
              <li>Human-in-the-loop: High/Medium-risk items can be sent to Legal; Finalize shows a soft reminder if important Focus items are still open.</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-2">Data handling (prototype)</h3>
            <ul className="space-y-2 text-sm list-disc list-inside">
              <li>UI-only demo; all logic runs client-side; no external requests or persistence.</li>
              <li>Session state resets on refresh. (Security details remain in the Help → Security modal.)</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>How This Fits Sirion (Business Sense)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <ul className="space-y-2 text-sm list-disc list-inside">
            <li>SmartDraft runs as a Sales Ops agent on agentOS, orchestrating Store/Repository (templates & clause variants), Create (Drafting & Negotiation), and Manage (Risk/Performance).</li>
            <li>OCR unlocks search/risk analysis for inbound third‑party scans and legacy contracts, expanding the searchable repository.</li>
            <li>Focus Bookmarks reduce handoffs and keep attention on risk-bearing terms, improving close readiness.</li>
            <li><strong>KPIs influenced:</strong>
              <ul className="ml-6 mt-1 space-y-1 list-[circle] list-inside">
                <li>Cycle time "Verbal Yes → Signed" (down)</li>
                <li>Negotiation iterations (down)</li>
                <li>% drafts from standard templates (up)</li>
                <li>Legal-touch rate on mid-market deals (down)</li>
              </ul>
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Security & Privacy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-muted-foreground">
          <p className="font-medium text-foreground">This is a UI-only prototype.</p>
          <ul className="space-y-2 text-sm list-disc list-inside">
            <li>No data is transmitted over the network</li>
            <li>No cookies, localStorage, or tracking mechanisms</li>
            <li>All state exists in memory only and is cleared on refresh</li>
            <li>No external resources (fonts, scripts, CDNs) are loaded</li>
            <li>Input is sanitized before rendering to prevent injection attacks</li>
          </ul>
          <p className="text-sm italic pt-2">
            For demonstration purposes only. Do not enter real client or sensitive business data.
          </p>
        </CardContent>
      </Card>
    </div>;
}