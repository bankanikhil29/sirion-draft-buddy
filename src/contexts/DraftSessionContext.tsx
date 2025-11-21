import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuditLog } from "@/components/AuditLog";

interface DraftSessionContextType {
  dirty: boolean;
  savedAt: Date | null;
  markDirty: () => void;
  save: () => void;
}

const DraftSessionContext = createContext<DraftSessionContextType | undefined>(undefined);

export function DraftSessionProvider({ children }: { children: ReactNode }) {
  const [dirty, setDirty] = useState(false);
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const { toast } = useToast();
  const { addEvent } = useAuditLog();

  const markDirty = useCallback(() => {
    setDirty(true);
  }, []);

  const save = useCallback(() => {
    if (!dirty) return;
    
    const now = new Date();
    setSavedAt(now);
    setDirty(false);
    
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    toast({
      title: `Draft saved • ${timeStr}`,
    });
    
    addEvent("Saved draft", `Saved at ${timeStr}`);
  }, [dirty, toast, addEvent]);

  return (
    <DraftSessionContext.Provider value={{ dirty, savedAt, markDirty, save }}>
      {children}
    </DraftSessionContext.Provider>
  );
}

export function useDraftSession() {
  const context = useContext(DraftSessionContext);
  if (!context) {
    throw new Error("useDraftSession must be used within DraftSessionProvider");
  }
  return context;
}
