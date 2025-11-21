export interface WhyContent {
  title: string;
  bullets: string[];
}

export const WHY_TEXT: Record<string, WhyContent> = {
  // INSIGHTS
  "sla-999": {
    title: "Service Level is above standard",
    bullets: [
      "Playbook standard is 99.0% monthly uptime; 99.9% is treated as an enhanced SLA.",
      "Enhanced SLAs increase exposure via service credits; approvals required above 99.0%.",
      "Fallbacks: 99.0% (standard) or 99.5% with credit cap = 1 month fees."
    ]
  },
  "law-default-ny": {
    title: "Default governing law applied",
    bullets: [
      "No jurisdiction set in intake; defaulted to New York per policy.",
      "Customer jurisdiction allowed only with Legal approval in regulated or high‑risk deals.",
      "If counterparty insists on CA/DE, prefer Delaware as neutral alternative."
    ]
  },
  "liability-standard": {
    title: "Liability cap matches policy",
    bullets: [
      "Cap = fees paid in last 12 months; unlimited only for IP infringement, confidentiality breach, or gross negligence.",
      "No action required unless counterparty removes the cap."
    ]
  },

  // REDLINES
  "redline-net45-acceptable": {
    title: "Why Accept Net‑45",
    bullets: [
      "Playbook allows payment terms up to Net‑45 for standard SaaS deals.",
      "Cash impact minimal when ACV ≥ $50k and discount ≤ 15%.",
      "If ACV < $50k, consider countering with Net‑45 + late fee clause."
    ]
  },
  "redline-govlaw-ca-medium": {
    title: "Why Counter Governing Law = CA",
    bullets: [
      "Default is NY; CA tends to increase litigation cost and uncertainty.",
      "Recommend NY or DE as neutral fallback.",
      "If prospect insists on CA, escalate to Legal for approval."
    ]
  },
  "redline-liability-uncapped-high": {
    title: "Why Reject Uncapped Liability",
    bullets: [
      "Uncapped liability violates baseline risk threshold.",
      "Only carve‑outs (IP breach, confidentiality breach, gross negligence) can be unlimited.",
      "Counter with 'cap = 12 months fees' or '2× ACV' depending on risk tier."
    ]
  },
  "redline-liability-1x": {
    title: "Why Counter 1x Liability Cap",
    bullets: [
      "Playbook rule: Liability caps below 1.5x require Legal review; unlimited liability requires rejection.",
      "Standard is 2x annual fees; 1x is below acceptable threshold.",
      "Counter with 1.5x as compromise to protect both parties."
    ]
  },
  "redline-data-residency": {
    title: "Why Accept Data Residency",
    bullets: [
      "Playbook rule: Data residency requirements are acceptable if infrastructure supports them.",
      "EU server requirement is standard GDPR compliance request.",
      "Verify infrastructure capability before accepting."
    ]
  }
};
