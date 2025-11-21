import { useState, useRef, useEffect, ReactNode } from "react";
import { HelpCircle, AlertCircle } from "lucide-react";
import { WHY_TEXT } from "@/lib/whyContent";

interface WhyPopoverProps {
  reasonKey: string;
  children?: ReactNode;
  placement?: "top" | "bottom" | "left" | "right";
  offset?: number;
  variant?: "insight" | "redline";
}

export function WhyPopover({ 
  reasonKey, 
  children, 
  placement = "bottom", 
  offset = 8,
  variant = "insight"
}: WhyPopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  const content = WHY_TEXT[reasonKey] || {
    title: "No additional rationale",
    bullets: ["This item has no stored explanation in the prototype."]
  };

  const headerText = variant === "insight" ? "Why this is flagged" : "Why this suggestion";

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        popoverRef.current &&
        triggerRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && popoverRef.current) {
      const firstFocusable = popoverRef.current.querySelector<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      firstFocusable?.focus();
    }
  }, [isOpen]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleToggle();
    }
  };

  const popoverId = `popover-${reasonKey}`;

  return (
    <div className="relative inline-block">
      <button
        ref={triggerRef}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        className="text-xs text-brand-primary hover:underline flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 rounded transition-all"
        aria-controls={popoverId}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
      >
        {children || (
          <>
            <HelpCircle className="h-3 w-3" />
            Why?
          </>
        )}
      </button>

      {isOpen && (
        <div
          ref={popoverRef}
          id={popoverId}
          role="dialog"
          aria-labelledby={`${popoverId}-title`}
          className={`absolute z-50 rounded-lg border border-border/30 bg-[hsl(var(--background))]/95 shadow-xl backdrop-blur p-3 w-[320px] text-sm leading-5 ${
            placement === "bottom" ? `top-full mt-${offset / 4}` :
            placement === "top" ? `bottom-full mb-${offset / 4}` :
            placement === "right" ? `left-full ml-${offset / 4}` :
            `right-full mr-${offset / 4}`
          }`}
          style={{
            [placement === "bottom" ? "marginTop" : placement === "top" ? "marginBottom" : placement === "right" ? "marginLeft" : "marginRight"]: `${offset}px`
          }}
        >
          <div className="space-y-2">
            <div className="flex items-start gap-2 pb-2 border-b border-border/20">
              <AlertCircle className="h-4 w-4 text-brand-primary shrink-0 mt-0.5" />
              <h3 id={`${popoverId}-title`} className="font-semibold text-foreground">
                {headerText}
              </h3>
            </div>
            <div className="space-y-1.5">
              <p className="font-medium text-foreground">{content.title}</p>
              <ul className="space-y-1 text-muted-foreground">
                {content.bullets.map((bullet, idx) => (
                  <li key={idx} className="flex gap-2">
                    <span className="text-brand-primary shrink-0">•</span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-full mt-2 text-xs text-muted-foreground hover:text-foreground transition-colors text-center py-1"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
