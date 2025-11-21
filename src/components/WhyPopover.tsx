import { useState, useRef, useEffect, ReactNode } from "react";
import { createPortal } from "react-dom";
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
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const openDebounceRef = useRef<NodeJS.Timeout | null>(null);

  const content = WHY_TEXT[reasonKey] || {
    title: "No stored rationale",
    bullets: ["Prototype note: rationale text not configured."]
  };

  const headerText = variant === "insight" ? "Why this is flagged" : "Why this suggestion";

  // Detect if hover is available
  const isHoverable = typeof window !== "undefined" && 
    window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  const calculatePosition = () => {
    if (!triggerRef.current) return;
    
    const triggerRect = triggerRef.current.getBoundingClientRect();
    const popoverWidth = 280;
    const popoverHeight = 200; // approximate
    
    let top = 0;
    let left = 0;
    
    // Calculate position based on placement
    if (placement === "bottom") {
      top = triggerRect.bottom + offset;
      left = triggerRect.left;
      
      // Flip to top if not enough space
      if (top + popoverHeight > window.innerHeight) {
        top = triggerRect.top - popoverHeight - offset;
      }
    } else if (placement === "top") {
      top = triggerRect.top - popoverHeight - offset;
      left = triggerRect.left;
      
      // Flip to bottom if not enough space
      if (top < 0) {
        top = triggerRect.bottom + offset;
      }
    } else if (placement === "right") {
      top = triggerRect.top;
      left = triggerRect.right + offset;
      
      // Adjust if off screen
      if (left + popoverWidth > window.innerWidth) {
        left = triggerRect.left - popoverWidth - offset;
      }
    } else { // left
      top = triggerRect.top;
      left = triggerRect.left - popoverWidth - offset;
      
      // Adjust if off screen
      if (left < 0) {
        left = triggerRect.right + offset;
      }
    }
    
    // Ensure left doesn't go off screen
    if (left + popoverWidth > window.innerWidth) {
      left = window.innerWidth - popoverWidth - 10;
    }
    if (left < 10) {
      left = 10;
    }
    
    setPosition({ top, left });
  };

  const handleOpen = () => {
    if (openDebounceRef.current) {
      clearTimeout(openDebounceRef.current);
    }
    openDebounceRef.current = setTimeout(() => {
      setIsOpen(true);
      calculatePosition();
    }, 75);
  };

  const handleClose = () => {
    if (openDebounceRef.current) {
      clearTimeout(openDebounceRef.current);
    }
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
    }
    hideTimeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 150);
  };

  const cancelClose = () => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
  };

  const handleToggle = () => {
    if (isOpen) {
      setIsOpen(false);
    } else {
      handleOpen();
    }
  };

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

    const handleResize = () => {
      if (isOpen) {
        calculatePosition();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleResize, true);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleResize, true);
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
      if (openDebounceRef.current) {
        clearTimeout(openDebounceRef.current);
      }
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

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleToggle();
    }
  };

  const popoverId = `popover-${reasonKey}`;

  const triggerHandlers = isHoverable ? {
    onMouseEnter: () => {
      cancelClose();
      handleOpen();
    },
    onMouseLeave: handleClose,
    onClick: handleToggle
  } : {
    onClick: handleToggle
  };

  const popoverPanel = isOpen ? (
    <div
      ref={popoverRef}
      id={popoverId}
      role="dialog"
      aria-labelledby={`${popoverId}-title`}
      className="fixed z-[1000] rounded-lg border border-border/30 bg-[hsl(var(--background))]/95 shadow-xl backdrop-blur p-3 w-[280px] text-sm leading-5"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`
      }}
      onMouseEnter={cancelClose}
      onMouseLeave={isHoverable ? handleClose : undefined}
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
  ) : null;

  return (
    <div className="relative inline-block">
      <button
        ref={triggerRef}
        {...triggerHandlers}
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

      {popoverPanel && createPortal(popoverPanel, document.body)}
    </div>
  );
}
