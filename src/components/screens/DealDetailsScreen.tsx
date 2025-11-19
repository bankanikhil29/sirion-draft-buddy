import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function DealDetailsScreen() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">New Contract</h1>
        <p className="text-muted-foreground">
          Enter the deal details to generate your first draft
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Deal Information</CardTitle>
          <CardDescription>
            Basic details about the contract and parties involved
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="client-name">Client Name</Label>
              <Input id="client-name" placeholder="e.g., Acme Corp" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contract-type">Contract Type</Label>
              <Select>
                <SelectTrigger id="contract-type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="msa">Master Service Agreement</SelectItem>
                  <SelectItem value="sow">Statement of Work</SelectItem>
                  <SelectItem value="nda">Non-Disclosure Agreement</SelectItem>
                  <SelectItem value="sla">Service Level Agreement</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="deal-value">Deal Value (USD)</Label>
              <Input id="deal-value" type="number" placeholder="e.g., 250000" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="term-length">Term Length (months)</Label>
              <Input id="term-length" type="number" placeholder="e.g., 12" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="special-terms">Special Terms & Requirements</Label>
            <Textarea
              id="special-terms"
              placeholder="Any specific clauses, compliance requirements, or custom terms..."
              rows={4}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button size="lg" className="flex-1">
              Generate Draft
            </Button>
            <Button size="lg" variant="outline">
              Save for Later
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
