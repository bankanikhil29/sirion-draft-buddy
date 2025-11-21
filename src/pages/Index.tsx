import { useState, useEffect } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { AppSidebar } from "@/components/AppSidebar";
import { SecurityModal } from "@/components/SecurityModal";
import { ReviewerGuideModal } from "@/components/ReviewerGuideModal";
import { LandingScreen } from "@/components/screens/LandingScreen";
import { DealDetailsScreen } from "@/components/screens/DealDetailsScreen";
import { DraftEditorScreen } from "@/components/screens/DraftEditorScreen";
import { RedlineAnalysisScreen } from "@/components/screens/RedlineAnalysisScreen";
import { FinalizeScreen } from "@/components/screens/FinalizeScreen";
import { AboutScreen } from "@/components/screens/AboutScreen";
import { HelpCircle, X } from "lucide-react";
import { DraftSessionProvider } from "@/contexts/DraftSessionContext";

const Index = () => {
  const [currentHash, setCurrentHash] = useState(window.location.hash || "#start");
  const [securityModalOpen, setSecurityModalOpen] = useState(false);
  const [guideModalOpen, setGuideModalOpen] = useState(false);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash || "#start";
      setCurrentHash(hash);
      window.scrollTo(0, 0);
    };

    window.addEventListener("hashchange", handleHashChange);
    
    // Set initial hash if none exists
    if (!window.location.hash) {
      window.location.hash = "#start";
    }

    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const renderScreen = () => {
    switch (currentHash) {
      case "#start":
        return <LandingScreen />;
      case "#new":
        return <DealDetailsScreen />;
      case "#draft":
        return <DraftEditorScreen />;
      case "#redlines":
        return <RedlineAnalysisScreen />;
      case "#finalize":
        return <FinalizeScreen />;
      case "#about":
        return <AboutScreen />;
      default:
        return <LandingScreen />;
    }
  };

  return (
    <DraftSessionProvider>
      <SidebarProvider defaultOpen={true}>
        <div className="min-h-screen flex w-full bg-background">
          <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          {/* Top App Bar */}
          <header className="sticky top-0 z-40 h-16 border-b border-border bg-ink/95 backdrop-blur supports-[backdrop-filter]:bg-ink/80">
            <div className="flex h-full items-center gap-4 px-4">
              <SidebarTrigger className="shrink-0 lg:hidden" />
              <div className="flex-1">
                <h1 className="text-lg font-semibold text-foreground tracking-wide">
                  Sirion SmartDraft AI
                </h1>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setGuideModalOpen(true)}
                  className="rounded-full p-2 transition-all hover:bg-brand-primary/10 focus:ring-2 focus:ring-brand-primary"
                  aria-label="Reviewer Guide"
                >
                  <HelpCircle className="h-5 w-5 text-brand-primary" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSecurityModalOpen(true)}
                  className="flex items-center gap-2 rounded-full px-4 py-2 transition-all hover:brightness-95 hover:shadow-md focus:ring-2 focus:ring-brand-primary"
                >
                  <HelpCircle className="h-4 w-4" />
                  <span className="hidden sm:inline">Security</span>
                </Button>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-6">
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md"
            >
              Skip to main content
            </a>
            <div id="main-content">
              {renderScreen()}
            </div>
          </main>

          {/* Footer */}
          <footer className="border-t border-border bg-ink/50 py-4 px-6">
            <div className="text-center text-sm text-muted-foreground">
              © Sirion • Prototype • No tracking • No external requests
            </div>
          </footer>
        </div>
      </div>

        <SecurityModal open={securityModalOpen} onOpenChange={setSecurityModalOpen} />
        <ReviewerGuideModal open={guideModalOpen} onOpenChange={setGuideModalOpen} />
      </SidebarProvider>
    </DraftSessionProvider>
  );
};

export default Index;
