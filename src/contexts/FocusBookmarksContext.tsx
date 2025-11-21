import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { useAuditLog } from "@/components/AuditLog";

export type FocusItem = {
  id: string;
  anchorId: string;
  title: string;
  snippet?: string;
  source: 'clause' | 'insight' | 'redline' | 'search' | 'ocr';
  severity?: 'low' | 'medium' | 'high';
  note?: string;
  createdAt: number;
  resolved: boolean;
};

interface FocusBookmarksContextType {
  focusItems: FocusItem[];
  addFocus: (item: Omit<FocusItem, 'id' | 'createdAt' | 'resolved'>) => void;
  removeFocus: (id: string) => void;
  toggleResolved: (id: string) => void;
  updateNote: (id: string, note: string) => void;
  findByAnchor: (anchorId: string) => FocusItem | undefined;
  unresolvedCount: number;
  hasUnresolvedHighOrMedium: boolean;
}

const FocusBookmarksContext = createContext<FocusBookmarksContextType | undefined>(undefined);

export function FocusBookmarksProvider({ children }: { children: ReactNode }) {
  const [focusItems, setFocusItems] = useState<FocusItem[]>([]);
  const { addEvent } = useAuditLog();

  const addFocus = useCallback((item: Omit<FocusItem, 'id' | 'createdAt' | 'resolved'>) => {
    const newItem: FocusItem = {
      ...item,
      id: `focus-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: Date.now(),
      resolved: false,
    };
    setFocusItems(prev => [...prev, newItem]);
    addEvent("Added Focus bookmark", `${item.title} (${item.source})`);
  }, [addEvent]);

  const removeFocus = useCallback((id: string) => {
    const item = focusItems.find(f => f.id === id);
    setFocusItems(prev => prev.filter(f => f.id !== id));
    if (item) {
      addEvent("Removed Focus bookmark", item.title);
    }
  }, [focusItems, addEvent]);

  const toggleResolved = useCallback((id: string) => {
    setFocusItems(prev => prev.map(f => 
      f.id === id ? { ...f, resolved: !f.resolved } : f
    ));
    const item = focusItems.find(f => f.id === id);
    if (item) {
      addEvent(item.resolved ? "Reopened Focus item" : "Resolved Focus item", item.title);
    }
  }, [focusItems, addEvent]);

  const updateNote = useCallback((id: string, note: string) => {
    setFocusItems(prev => prev.map(f => 
      f.id === id ? { ...f, note } : f
    ));
  }, []);

  const findByAnchor = useCallback((anchorId: string) => {
    return focusItems.find(f => f.anchorId === anchorId);
  }, [focusItems]);

  const unresolvedCount = focusItems.filter(f => !f.resolved).length;
  const hasUnresolvedHighOrMedium = focusItems.some(
    f => !f.resolved && (f.severity === 'high' || f.severity === 'medium')
  );

  return (
    <FocusBookmarksContext.Provider value={{ 
      focusItems, 
      addFocus, 
      removeFocus, 
      toggleResolved, 
      updateNote, 
      findByAnchor,
      unresolvedCount,
      hasUnresolvedHighOrMedium
    }}>
      {children}
    </FocusBookmarksContext.Provider>
  );
}

export function useFocusBookmarks() {
  const context = useContext(FocusBookmarksContext);
  if (!context) {
    throw new Error("useFocusBookmarks must be used within FocusBookmarksProvider");
  }
  return context;
}
