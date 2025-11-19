import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Zap, Target, TrendingUp } from "lucide-react";

export function AboutScreen() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
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
    </div>
  );
}
