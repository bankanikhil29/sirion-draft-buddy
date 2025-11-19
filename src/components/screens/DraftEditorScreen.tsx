import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Download, Eye, Settings } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";

export function DraftEditorScreen() {
  const [activeTab, setActiveTab] = useState("insights");
  const isMobile = useIsMobile();

  const rightPanel = (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="insights">Insights</TabsTrigger>
        <TabsTrigger value="ask-ai">Ask AI</TabsTrigger>
      </TabsList>
      
      <TabsContent value="insights" className="flex-1 mt-4 space-y-4">
        <div className="p-4 bg-muted/30 rounded-lg border border-border">
          <h4 className="font-semibold text-sm mb-2 text-foreground">Risk Assessment</h4>
          <p className="text-sm text-muted-foreground">Analysis placeholder</p>
        </div>
        <div className="p-4 bg-muted/30 rounded-lg border border-border">
          <h4 className="font-semibold text-sm mb-2 text-foreground">Compliance Check</h4>
          <p className="text-sm text-muted-foreground">Status placeholder</p>
        </div>
        <div className="p-4 bg-muted/30 rounded-lg border border-border">
          <h4 className="font-semibold text-sm mb-2 text-foreground">Suggestions</h4>
          <p className="text-sm text-muted-foreground">Recommendations placeholder</p>
        </div>
      </TabsContent>
      
      <TabsContent value="ask-ai" className="flex-1 mt-4 space-y-4">
        <div className="p-4 bg-muted/30 rounded-lg border border-border">
          <h4 className="font-semibold text-sm mb-2 text-foreground">AI Assistant</h4>
          <p className="text-sm text-muted-foreground">Chat interface placeholder</p>
        </div>
        <Textarea placeholder="Ask about this contract..." className="min-h-[100px]" />
        <Button className="w-full">Send</Button>
      </TabsContent>
    </Tabs>
  );

  return (
    <div className="h-full flex flex-col lg:flex-row gap-4">
      {/* Left: Editor */}
      <div className="flex-1 flex flex-col gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-foreground">Contract Draft</h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Redlines
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                {isMobile && (
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        Insights
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-full sm:max-w-md">
                      <SheetHeader>
                        <SheetTitle>Analysis</SheetTitle>
                      </SheetHeader>
                      <div className="mt-6">{rightPanel}</div>
                    </SheetContent>
                  </Sheet>
                )}
              </div>
            </div>
            <Textarea
              placeholder="Contract content will appear here..."
              className="min-h-[500px] font-mono text-sm"
            />
          </CardContent>
        </Card>
      </div>

      {/* Right: Insights/AI Panel (Desktop) */}
      {!isMobile && (
        <div className="w-80 xl:w-96">
          <Card className="h-full">
            <CardContent className="p-4 h-full">
              {rightPanel}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
