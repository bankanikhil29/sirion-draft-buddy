import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { HelpCircle, Briefcase, User, Calendar, DollarSign, FileText } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function DealDetailsScreen() {
  const [contractType, setContractType] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [acv, setAcv] = useState("");
  const [specialTerms, setSpecialTerms] = useState("");
  const [showGenerating, setShowGenerating] = useState(false);
  const [generatingStep, setGeneratingStep] = useState(0);

  const [errors, setErrors] = useState({
    contractType: "",
    customerName: "",
    startDate: "",
    acv: "",
    specialTerms: "",
  });

  const steps = [
    "Analyzing details",
    "Selecting template",
    "Inserting clauses",
    "Checking policy",
    "Finalizing draft",
  ];

  const validateCustomerName = (value: string) => {
    const valid = /^[a-zA-Z0-9&.\-\s]+$/;
    if (value.length < 2 || value.length > 60) {
      return "Enter 2–60 valid characters (letters/numbers/&/.-/space).";
    }
    if (!valid.test(value)) {
      return "Enter 2–60 valid characters (letters/numbers/&/.-/space).";
    }
    return "";
  };

  const validateStartDate = (value: string) => {
    if (!value) return "";
    const selected = new Date(value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selected < today) {
      return "Use a current or future date.";
    }
    return "";
  };

  const validateAcv = (value: string) => {
    if (!value) return "";
    const num = parseFloat(value);
    if (isNaN(num) || num < 0) {
      return "Enter a valid positive number.";
    }
    return "";
  };

  const validateSpecialTerms = (value: string) => {
    if (value.length < 30 || value.length > 600) {
      return "Provide 30–600 characters describing terms.";
    }
    return "";
  };

  const handleGenerate = () => {
    const newErrors = {
      contractType: contractType ? "" : "Select a contract type.",
      customerName: validateCustomerName(customerName),
      startDate: validateStartDate(startDate),
      acv: validateAcv(acv),
      specialTerms: validateSpecialTerms(specialTerms),
    };

    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some((err) => err !== "");
    if (hasErrors) return;

    // Show generating overlay
    setShowGenerating(true);
    setGeneratingStep(0);

    const interval = setInterval(() => {
      setGeneratingStep((prev) => {
        if (prev >= steps.length - 1) {
          clearInterval(interval);
          setTimeout(() => {
            setShowGenerating(false);
            window.location.hash = "#draft";
          }, 800);
          return prev;
        }
        return prev + 1;
      });
    }, 800);
  };

  return (
    <>
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="space-y-3">
          <p className="text-xs tracking-widest uppercase text-muted-foreground font-semibold">Deal Details</p>
          <h1 className="text-4xl font-bold text-foreground tracking-wide">Deal details for drafting</h1>
          <p className="text-muted-foreground">
            Provide the key details below to generate your first draft.
          </p>
        </div>

        <div className="border-t border-border/20 pt-8" />

        <Card className="bg-surface/10 backdrop-blur-sm shadow-2xl rounded-xl border-border/30">
          <CardHeader className="px-8 pt-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs tracking-widest uppercase text-muted-foreground font-semibold mb-2">Deal Info</p>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  Deal Information
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p>Uses your template & playbook to assemble a draft. This demo is scripted — no real AI calls.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </CardTitle>
              </div>
            </div>
            <CardDescription className="text-muted-foreground/80">
              Basic details about the contract and parties involved
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8 px-8 pb-8">
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label htmlFor="contract-type" className="flex items-center gap-2 text-sm font-medium">
                  <Briefcase className="h-4 w-4 text-brand-primary" />
                  Contract Type *
                </Label>
                <Select value={contractType} onValueChange={setContractType}>
                  <SelectTrigger 
                    id="contract-type" 
                    className={`bg-ink border-border/50 focus:ring-2 focus:ring-brand-primary ${errors.contractType ? "border-danger" : ""}`}
                  >
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="msa">Master SaaS Agreement</SelectItem>
                    <SelectItem value="nda">NDA</SelectItem>
                    <SelectItem value="order">Order Form</SelectItem>
                    <SelectItem value="sow">Statement of Work</SelectItem>
                  </SelectContent>
                </Select>
                {errors.contractType && (
                  <p className="text-xs text-danger">{errors.contractType}</p>
                )}
              </div>
              <div className="space-y-3">
                <Label htmlFor="customer-name" className="flex items-center gap-2 text-sm font-medium">
                  <User className="h-4 w-4 text-brand-primary" />
                  Customer Name *
                </Label>
                <Input
                  id="customer-name"
                  placeholder="e.g., Acme Corporation"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  onBlur={(e) => setErrors({ ...errors, customerName: validateCustomerName(e.target.value) })}
                  className={`bg-ink border-border/50 placeholder:text-muted-foreground/60 focus:ring-2 focus:ring-brand-primary ${errors.customerName ? "border-danger" : ""}`}
                />
                {errors.customerName && (
                  <p className="text-xs text-danger">{errors.customerName}</p>
                )}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label htmlFor="start-date" className="flex items-center gap-2 text-sm font-medium">
                  <Calendar className="h-4 w-4 text-brand-primary" />
                  Start Date
                </Label>
                <Input
                  id="start-date"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  onBlur={(e) => setErrors({ ...errors, startDate: validateStartDate(e.target.value) })}
                  className={`bg-ink border-border/50 focus:ring-2 focus:ring-brand-primary ${errors.startDate ? "border-danger" : ""}`}
                />
                {errors.startDate && (
                  <p className="text-xs text-danger">{errors.startDate}</p>
                )}
              </div>
              <div className="space-y-3">
                <Label htmlFor="acv" className="flex items-center gap-2 text-sm font-medium">
                  <DollarSign className="h-4 w-4 text-brand-primary" />
                  Annual Contract Value, USD
                </Label>
                <Input
                  id="acv"
                  type="number"
                  placeholder="e.g., 100000"
                  value={acv}
                  onChange={(e) => setAcv(e.target.value)}
                  onBlur={(e) => setErrors({ ...errors, acv: validateAcv(e.target.value) })}
                  className={`bg-ink border-border/50 placeholder:text-muted-foreground/60 focus:ring-2 focus:ring-brand-primary ${errors.acv ? "border-danger" : ""}`}
                />
                {errors.acv && (
                  <p className="text-xs text-danger">{errors.acv}</p>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="special-terms" className="flex items-center gap-2 text-sm font-medium">
                <FileText className="h-4 w-4 text-brand-primary" />
                Special Terms *
              </Label>
              <Textarea
                id="special-terms"
                placeholder="e.g., 1‑year SaaS subscription, $100,000/yr, 1,000 users. Customer requests 99.9% uptime SLA."
                value={specialTerms}
                onChange={(e) => setSpecialTerms(e.target.value)}
                onBlur={(e) => setErrors({ ...errors, specialTerms: validateSpecialTerms(e.target.value) })}
                rows={4}
                className={`bg-ink border-border/50 placeholder:text-muted-foreground/60 focus:ring-2 focus:ring-brand-primary ${errors.specialTerms ? "border-danger" : ""}`}
              />
              <div className="flex justify-between items-center">
                {errors.specialTerms ? (
                  <p className="text-xs text-danger">{errors.specialTerms}</p>
                ) : (
                  <p className="text-xs text-muted-foreground/60">
                    {specialTerms.length}/600 characters
                  </p>
                )}
              </div>
            </div>

            <div className="border-t border-border/20 pt-6" />

            <p className="text-xs text-muted-foreground/70">
              Inputs are sanitized and not stored.
            </p>

            <div className="flex gap-4 pt-2">
              <Button size="lg" variant="gradient" className="flex-1" onClick={handleGenerate}>
                Generate draft
              </Button>
              <Button
                size="lg"
                variant="ghost"
                className="border border-brand-primary/50 hover:bg-brand-primary/10"
                onClick={() => (window.location.hash = "#start")}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* S3 Generating Overlay */}
      {showGenerating && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardHeader className="bg-gradient-to-r from-brand-primary/10 to-brand-primary/5 border-b">
              <CardTitle className="text-center">Generating your draft</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
              </div>
              <div className="space-y-2">
                {steps.map((step, index) => (
                  <div
                    key={step}
                    className={`flex items-center gap-2 text-sm ${
                      index === generatingStep
                        ? "text-brand-primary font-medium"
                        : index < generatingStep
                        ? "text-ok"
                        : "text-muted-foreground"
                    }`}
                  >
                    {index < generatingStep && <span>✓</span>}
                    {index === generatingStep && (
                      <div className="w-2 h-2 rounded-full bg-brand-primary animate-pulse"></div>
                    )}
                    {index > generatingStep && <span className="w-2"></span>}
                    <span>{step}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-center text-muted-foreground">
                Simulated generation. No network requests.
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
