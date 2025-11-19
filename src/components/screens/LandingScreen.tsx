import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Zap } from "lucide-react";

export function LandingScreen() {
  return (
    <div className="gradient-hero -m-6 min-h-[calc(100vh-12rem)] flex items-center justify-center py-24">
      <div className="max-w-4xl w-full px-6">
        <div className="text-center space-y-8">
          <div className="flex justify-center">
            <div className="p-4 bg-brand-primary/10 rounded-2xl border border-brand-primary/20">
              <FileText className="h-16 w-16 text-brand-primary" />
            </div>
          </div>
          
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground tracking-wide">
              SmartDraft AI
            </h1>
            <p className="text-xl md:text-2xl text-foreground/80 font-light">
              Draft contracts faster
            </p>
            <p className="text-base text-muted-foreground max-w-2xl mx-auto">
              Provide a few deal details. Get a compliant first draft in minutes.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button
              size="lg"
              variant="gradient"
              className="gap-2 rounded-full px-8 py-6 text-base"
              onClick={() => window.location.hash = "#new"}
            >
              <Zap className="h-5 w-5" />
              Start drafting with AI
            </Button>
            <Button
              size="lg"
              variant="outlineLight"
              className="rounded-full px-8 py-6 text-base"
              onClick={() => window.location.hash = "#about"}
            >
              About this assistant
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
