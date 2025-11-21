import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Clock } from "lucide-react";
import { create } from "zustand";

interface AuditEvent {
  id: string;
  timestamp: string;
  action: string;
  details: string;
}

interface AuditLogStore {
  events: AuditEvent[];
  addEvent: (action: string, details: string) => void;
  clearEvents: () => void;
}

export const useAuditLog = create<AuditLogStore>((set) => ({
  events: [],
  addEvent: (action, details) => {
    const event: AuditEvent = {
      id: Math.random().toString(36).substring(7),
      timestamp: new Date().toLocaleTimeString(),
      action,
      details,
    };
    set((state) => ({ events: [...state.events, event] }));
  },
  clearEvents: () => set({ events: [] }),
}));

export function AuditLog() {
  const { events, clearEvents } = useAuditLog();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-brand-primary" />
          Audit Log
        </CardTitle>
        {events.length > 0 && (
          <Button 
            size="sm" 
            variant="outline" 
            onClick={clearEvents}
            className="transition-all"
          >
            Clear
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {events.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No events recorded in this session.
          </p>
        ) : (
          <ScrollArea className="h-64">
            <div className="space-y-2">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="p-3 bg-muted/30 rounded border border-border text-sm"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{event.action}</p>
                      <p className="text-muted-foreground text-xs mt-1">
                        {event.details}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {event.timestamp}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
