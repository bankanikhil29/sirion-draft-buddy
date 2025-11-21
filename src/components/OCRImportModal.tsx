import { useState, useCallback } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Upload, CheckCircle, FileImage, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuditLog } from "@/components/AuditLog";
import { useDraftSession } from "@/contexts/DraftSessionContext";
import { useFocusBookmarks } from "@/contexts/FocusBookmarksContext";

interface OCRBlock {
  id: string;
  title: string;
  text: string;
  confidence: number;
  anchorId: string;
}

interface OCRImportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SAMPLE_OCR_BLOCKS: OCRBlock[] = [
  {
    id: "ocr-1",
    title: "Service Levels",
    text: "Provider maintains 99.9% monthly uptime. Service credits are provided per Schedule A if this threshold is not met.",
    confidence: 0.92,
    anchorId: "clause-5-service-levels"
  },
  {
    id: "ocr-2",
    title: "Limitation of Liability",
    text: "Each party's liability is capped at the fees paid in the twelve months preceding the claim.",
    confidence: 0.88,
    anchorId: "clause-8-liability"
  },
  {
    id: "ocr-3",
    title: "Governing Law",
    text: "This Agreement shall be governed by the laws of the State of New York.",
    confidence: 0.79,
    anchorId: "clause-12-governing-law"
  }
];

export function OCRImportModal({ open, onOpenChange }: OCRImportModalProps) {
  const [activeTab, setActiveTab] = useState("editable");
  const [uploadedFile, setUploadedFile] = useState("");
  const [ocrFile, setOcrFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [ocrBlocks, setOcrBlocks] = useState<OCRBlock[]>(SAMPLE_OCR_BLOCKS);
  const [editingBlock, setEditingBlock] = useState<string | null>(null);
  
  const { toast } = useToast();
  const { addEvent } = useAuditLog();
  const { markDirty } = useDraftSession();
  const { addFocus } = useFocusBookmarks();

  const processingSteps = [
    "Preprocess (deskew & enhance)",
    "Recognize text",
    "Segment into clauses",
    "Extract key metadata"
  ];

  const handleEditableUpload = useCallback(() => {
    if (!uploadedFile.trim()) return;
    onOpenChange(false);
    markDirty();
    setTimeout(() => {
      window.location.hash = "#redlines";
    }, 300);
  }, [uploadedFile, onOpenChange, markDirty]);

  const handleOCRFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setOcrFile(file);
    setProcessing(true);
    setProcessingStep(0);

    const interval = setInterval(() => {
      setProcessingStep(prev => {
        if (prev >= processingSteps.length - 1) {
          clearInterval(interval);
          setTimeout(() => {
            setProcessing(false);
            setShowPreview(true);
            addEvent("OCR processing completed", file.name);
          }, 800);
          return prev;
        }
        return prev + 1;
      });
    }, 1000);
  }, [addEvent, processingSteps.length]);

  const handleBlockEdit = useCallback((blockId: string, newText: string) => {
    setOcrBlocks(prev => prev.map(block => 
      block.id === blockId ? { ...block, text: newText } : block
    ));
  }, []);

  const handleApplyToDraft = useCallback(() => {
    ocrBlocks.forEach(block => {
      const element = document.getElementById(block.anchorId);
      if (element) {
        const paragraph = element.querySelector('p');
        if (paragraph) {
          paragraph.textContent = block.text;
          element.classList.add('clause-pulse');
          setTimeout(() => {
            element.classList.remove('clause-pulse');
          }, 800);
        }
      }

      if (block.confidence < 0.85) {
        addFocus({
          anchorId: block.anchorId,
          title: `Low confidence OCR: ${block.title}`,
          snippet: block.text.substring(0, 120),
          source: 'ocr',
          severity: 'medium'
        });
      }
    });

    markDirty();
    onOpenChange(false);
    
    toast({
      title: "OCR import applied",
      description: `${ocrBlocks.length} clauses updated from ${ocrFile?.name}`,
    });

    addEvent("OCR import applied", `Applied ${ocrBlocks.length} clauses from ${ocrFile?.name}`);
    
    setOcrFile(null);
    setShowPreview(false);
    setProcessing(false);
    setProcessingStep(0);
  }, [ocrBlocks, ocrFile, markDirty, onOpenChange, toast, addEvent, addFocus]);

  const handleDiscard = useCallback(() => {
    setOcrFile(null);
    setShowPreview(false);
    setProcessing(false);
    setProcessingStep(0);
    setOcrBlocks(SAMPLE_OCR_BLOCKS);
    onOpenChange(false);
  }, [onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Import Contract</DialogTitle>
          <DialogDescription>
            Upload an editable document or scan to extract text with OCR
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="editable">Editable PDF/Docx</TabsTrigger>
            <TabsTrigger value="ocr">Scanned PDF/Image (OCR)</TabsTrigger>
          </TabsList>

          <TabsContent value="editable" className="space-y-4 py-4">
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
              <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground mb-3">
                Drag and drop your file here, or click to browse
              </p>
              <Input
                type="text"
                placeholder="Enter file name (demo)"
                value={uploadedFile}
                onChange={(e) => setUploadedFile(e.target.value)}
                className="max-w-xs mx-auto"
              />
            </div>
            <p className="text-xs text-muted-foreground text-center">
              Files are not transmitted — UI simulation only.
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button onClick={handleEditableUpload} disabled={!uploadedFile.trim()}>
                Upload & Analyze
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="ocr" className="space-y-4 py-4">
            {!processing && !showPreview && (
              <>
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                  <FileImage className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                  <p className="text-sm text-muted-foreground mb-3">
                    Upload a scanned PDF or image (.pdf, .png, .jpg, .jpeg)
                  </p>
                  <Input
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg"
                    onChange={handleOCRFileSelect}
                    className="max-w-xs mx-auto"
                  />
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  Simulated OCR — no actual file processing
                </p>
              </>
            )}

            {processing && (
              <div className="space-y-4 py-8">
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-transparent border-t-brand-primary border-r-cyan-500"></div>
                </div>
                <div className="space-y-2">
                  {processingSteps.map((step, index) => (
                    <div
                      key={step}
                      className={`flex items-center gap-2 text-sm transition-colors ${
                        index === processingStep
                          ? "text-cyan-500 font-medium"
                          : index < processingStep
                          ? "text-ok"
                          : "text-muted-foreground"
                      }`}
                    >
                      {index < processingStep && <CheckCircle className="h-4 w-4" />}
                      {index === processingStep && (
                        <div className="w-4 h-4 rounded-full border-2 border-cyan-500 border-t-transparent animate-spin"></div>
                      )}
                      {index > processingStep && <span className="w-4"></span>}
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {showPreview && (
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Left: Preview */}
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Document Preview</h4>
                    <div className="border border-border rounded-lg p-4 bg-muted/20 text-center min-h-[300px] flex items-center justify-center">
                      <div className="space-y-2">
                        <FileText className="h-16 w-16 mx-auto text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          {ocrFile?.name || "Document preview"}
                        </p>
                        <p className="text-xs text-muted-foreground">Page 1 of 1</p>
                      </div>
                    </div>
                  </div>

                  {/* Right: Recognized Text */}
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Recognized Text Blocks</h4>
                    <div className="space-y-3 max-h-[400px] overflow-y-auto">
                      {ocrBlocks.map((block) => (
                        <div key={block.id} className="border border-border rounded-lg p-3 space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <h5 className="font-medium text-sm">{block.title}</h5>
                            <Badge 
                              variant={block.confidence >= 0.85 ? "default" : "secondary"}
                              className={block.confidence >= 0.85 ? "bg-ok" : "bg-warn"}
                            >
                              {block.confidence >= 0.85 ? "High" : "Needs review"}
                            </Badge>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Confidence: {(block.confidence * 100).toFixed(0)}%
                          </div>
                          {editingBlock === block.id ? (
                            <div className="space-y-2">
                              <Textarea
                                value={block.text}
                                onChange={(e) => handleBlockEdit(block.id, e.target.value)}
                                rows={3}
                                className="text-sm"
                              />
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setEditingBlock(null)}
                              >
                                Done
                              </Button>
                            </div>
                          ) : (
                            <>
                              <p className="text-sm text-muted-foreground">{block.text}</p>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setEditingBlock(block.id)}
                              >
                                Edit
                              </Button>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4 flex justify-between">
                  <Button variant="outline" onClick={handleDiscard}>Discard</Button>
                  <Button onClick={handleApplyToDraft}>Apply to Draft</Button>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
