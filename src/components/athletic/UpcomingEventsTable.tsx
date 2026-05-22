import { UpcomingEvent } from "@/types/resume";

/** Sort events chronologically, format date nicely */
function sortedEvents(events: UpcomingEvent[]): UpcomingEvent[] {
  return [...events]
    .filter(e => e.eventName || e.date || e.location)
    .sort((a, b) => {
      if (!a.date) return 1;
      if (!b.date) return -1;
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  } catch {
    return dateStr;
  }
}

/** Inline table for PDF templates (font sizes set by parent) */
export function EventsTablePdf({ events, accent }: { events: UpcomingEvent[]; accent: string }) {
  const sorted = sortedEvents(events);
  if (sorted.length === 0) return null;

  return (
    <table className="w-full text-[10px]" style={{ borderCollapse: "collapse" }}>
      <thead>
        <tr style={{ background: "#f4f5f7" }}>
          <th className="text-left py-1.5 px-2 font-semibold" style={{ color: "#666", fontSize: "8px", letterSpacing: "0.08em", textTransform: "uppercase" }}>Event</th>
          <th className="text-left py-1.5 px-2 font-semibold" style={{ color: "#666", fontSize: "8px", letterSpacing: "0.08em", textTransform: "uppercase" }}>Date</th>
          <th className="text-left py-1.5 px-2 font-semibold" style={{ color: "#666", fontSize: "8px", letterSpacing: "0.08em", textTransform: "uppercase" }}>Location</th>
        </tr>
      </thead>
      <tbody>
        {sorted.map(evt => (
          <tr key={evt.id} style={{ borderBottom: "1px solid #e5e7eb" }}>
            <td className="py-1.5 px-2">
              <span className="font-medium">{evt.eventName}</span>
              {evt.eventType && <span style={{ color: "#999" }}> · {evt.eventType}</span>}
              {evt.note && <span style={{ color: "#999" }}> — {evt.note}</span>}
            </td>
            <td className="py-1.5 px-2" style={{ color: "#444", whiteSpace: "nowrap" }}>{formatDate(evt.date)}</td>
            <td className="py-1.5 px-2" style={{ color: "#444" }}>{evt.location}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/** Web view table for shareable link */
export function EventsTableWeb({ events }: { events: UpcomingEvent[] }) {
  const sorted = sortedEvents(events);
  if (sorted.length === 0) return null;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm" style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr className="bg-muted/50">
            <th className="text-left py-2.5 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Event</th>
            <th className="text-left py-2.5 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Date</th>
            <th className="text-left py-2.5 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Location</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map(evt => (
            <tr key={evt.id} className="border-b border-border">
              <td className="py-2.5 px-3">
                <span className="font-medium text-foreground">{evt.eventName}</span>
                {evt.eventType && <span className="text-muted-foreground"> · {evt.eventType}</span>}
                {evt.note && <p className="text-xs text-muted-foreground mt-0.5">{evt.note}</p>}
              </td>
              <td className="py-2.5 px-3 text-muted-foreground whitespace-nowrap">{formatDate(evt.date)}</td>
              <td className="py-2.5 px-3 text-muted-foreground">{evt.location}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
