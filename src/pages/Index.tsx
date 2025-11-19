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
import { HelpCircle, Menu } from "lucide-react";

const Index = () => {
  const [currentHash, setCurrentHash] = useState(window.location.hash || "#start");
  const [securityModalOpen, setSecurityModalOpen] = useState(false);

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
    <SidebarProvider defaultOpen={false}>
      <div className="min-h-screen flex w-full bg-background">
        {/* Fixed Purple Banner */}
        <div className="fixed top-0 left-0 right-0 z-50 h-8 bg-brand-primary flex items-center justify-center">
          <p className="text-xs text-white font-medium tracking-wide">
            Prototype — UI only. No data leaves this page.
          </p>
        </div>
        
        <AppSidebar />
        
        <div className="flex-1 flex flex-col mt-8">
          {/* Top App Bar */}
          <header className="sticky top-0 z-40 h-16 border-b border-border bg-ink/95 backdrop-blur supports-[backdrop-filter]:bg-ink/80">
            <div className="flex h-full items-center gap-4 px-4">
              <SidebarTrigger className="lg:hidden shrink-0 transition-all hover:bg-brand-primary/20 rounded-md p-2 focus:ring-2 focus:ring-brand-primary" aria-label="Toggle navigation">
                <Menu className="h-5 w-5 text-foreground" aria-hidden="true" />
              </SidebarTrigger>
              <div className="flex-1">
                <h1 className="text-lg font-semibold text-foreground tracking-wide">
                  Sirion SmartDraft AI
                </h1>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSecurityModalOpen(true)}
                aria-label="Security Information"
                className="rounded-full px-3 py-1 hover:bg-brand-primary/20 transition-all focus:ring-2 focus:ring-brand-primary"
              >
                <HelpCircle className="h-4 w-4 text-muted-foreground transition-transform hover:-translate-y-0.5" />
                <span className="text-xs ml-1">Help</span>
              </Button>
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
    </SidebarProvider>
  );
};

export default Index;
