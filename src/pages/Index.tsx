import { useState, useEffect } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { AppSidebar } from "@/components/AppSidebar";
import { SecurityModal } from "@/components/SecurityModal";
import { LandingScreen } from "@/components/screens/LandingScreen";
import { DealDetailsScreen } from "@/components/screens/DealDetailsScreen";
import { DraftEditorScreen } from "@/components/screens/DraftEditorScreen";
import { RedlineAnalysisScreen } from "@/components/screens/RedlineAnalysisScreen";
import { FinalizeScreen } from "@/components/screens/FinalizeScreen";
import { AboutScreen } from "@/components/screens/AboutScreen";
import { HelpCircle, X } from "lucide-react";

const Index = () => {
  const [currentHash, setCurrentHash] = useState(window.location.hash || "#start");
  const [securityModalOpen, setSecurityModalOpen] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(false);

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
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          {/* Top App Bar */}
          <header className="sticky top-0 z-50 h-16 border-b border-border bg-surface/95 backdrop-blur supports-[backdrop-filter]:bg-surface/60">
            <div className="flex h-full items-center gap-4 px-4">
              <SidebarTrigger className="shrink-0" />
              <div className="flex-1">
                <h1 className="text-lg font-semibold text-foreground">
                  Sirion SmartDraft AI
                </h1>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSecurityModalOpen(true)}
                aria-label="Security Information"
              >
                <HelpCircle className="h-5 w-5" />
              </Button>
            </div>
          </header>

          {/* Global Banner */}
          {!bannerDismissed && (
            <div className="bg-warn/10 border-b border-warn/20 px-4 py-3">
              <div className="flex items-center gap-3 max-w-7xl mx-auto">
                <div className="flex-1 text-sm text-foreground">
                  <strong>Prototype — UI only.</strong> Do not enter real client data. No network requests are made.
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="shrink-0 h-6 w-6"
                  onClick={() => setBannerDismissed(true)}
                  aria-label="Dismiss banner"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

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
          <footer className="border-t border-border bg-surface py-4 px-6">
            <div className="text-center text-sm text-muted-foreground">
              © Sirion • Prototype • No tracking • No external requests
            </div>
          </footer>
        </div>
      </div>

      <SecurityModal open={securityModalOpen} onOpenChange={setSecurityModalOpen} />
    </SidebarProvider>
  );
};

export default Index;
