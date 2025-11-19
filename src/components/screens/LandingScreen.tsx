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
            SmartDraft AI — Draft contracts faster
          </CardTitle>
          <CardDescription className="text-base text-muted-foreground max-w-lg mx-auto">
            Provide a few deal details. Get a compliant first draft in minutes.
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
              Start drafting with AI
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => window.location.hash = "#about"}
            >
              About this assistant
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
