import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Zap } from "lucide-react";

export function LandingScreen() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
      <Card className="max-w-2xl w-full">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-3 bg-primary/10 rounded-xl">
              <FileText className="h-12 w-12 text-brand-primary" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-foreground">
            Welcome to Sirion SmartDraft AI
          </CardTitle>
          <CardDescription className="text-base text-muted-foreground max-w-lg mx-auto">
            Create compliant first-draft contracts in minutes with AI-powered guidance. 
            Reduce review cycles and manage risk with playbook-aware suggestions.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              size="lg"
              className="gap-2"
              onClick={() => window.location.hash = "#new"}
            >
              <Zap className="h-4 w-4" />
              Start New Contract
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => window.location.hash = "#about"}
            >
              Learn More
            </Button>
          </div>

          <div className="pt-6 grid sm:grid-cols-3 gap-4 text-center">
            <div className="space-y-2">
              <div className="text-2xl font-bold text-brand-primary">5min</div>
              <div className="text-sm text-muted-foreground">Avg. Draft Time</div>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-brand-primary">70%</div>
              <div className="text-sm text-muted-foreground">Fewer Review Cycles</div>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-brand-primary">100%</div>
              <div className="text-sm text-muted-foreground">Compliance Checked</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
