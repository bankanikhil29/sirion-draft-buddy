export interface WhyContent {
  title: string;
  bullets: string[];
}

export const WHY_TEXT: Record<string, WhyContent> = {
  // INSIGHTS
  "sla-999": {
    title: "SLA above standard",
    bullets: [
      "Our playbook standard is 99.0%; 99.9% triggers Ops approval.",
      "Higher SLA ⇒ service‑credit exposure. Consider 99.0% or 99.5% cap."
    ]
  },
  "law-default-ny": {
    title: "Default jurisdiction",
    bullets: [
      "No input provided; defaulted to New York per policy.",
      "If customer insists, prefer Delaware; escalate if needed."
    ]
  },
  "liability-standard": {
    title: "Liability cap is compliant",
    bullets: [
      "Cap = fees (12 months). Unlimited only for IP/confidentiality/gross negligence."
    ]
  },

  // REDLINES
  "redline-net45-acceptable": {
    title: "Why accept Net‑45",
    bullets: [
      "Playbook allows up to Net‑45 for standard SaaS deals.",
      "If ACV < $50k, consider late‑fee clause."
    ]
  },
  "redline-govlaw-ca-medium": {
    title: "Why counter CA law",
    bullets: [
      "Default is NY; CA can increase litigation cost.",
      "Counter with NY or DE; escalate if customer insists."
    ]
  },
  "redline-liability-uncapped-high": {
    title: "Why reject uncapped",
    bullets: [
      "Violates baseline risk thresholds.",
      "Counter with 12‑month fees or 2× ACV cap."
    ]
  },
  "redline-liability-1x": {
    title: "Why counter 1x cap",
    bullets: [
      "Standard is 2x annual fees; 1x is below threshold.",
      "Counter with 1.5x as compromise."
    ]
  },
  "redline-data-residency": {
    title: "Why accept residency",
    bullets: [
      "Data residency is acceptable if infrastructure supports it.",
      "Verify capability before accepting."
    ]
  }
};
