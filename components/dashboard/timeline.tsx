import type { TimelineEvent } from "@/lib/models";

export function Timeline({ events }: { events: TimelineEvent[] }) {
  if (!events.length) {
    return (
      <div className="rounded-2xl bg-white/5 border border-dashed border-white/20 p-4 text-xs text-muted-foreground">
        No life events yet. Add milestones as you go.
      </div>
    );
  }
  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 p-4 text-xs space-y-3">
      {events.map((e) => (
        <div key={e.id} className="flex gap-3">
          <div className="w-1 bg-primary rounded-full mt-1" />
          <div>
            <p className="text-[11px] text-muted-foreground">{e.date}</p>
            <p className="font-medium">{e.title}</p>
            <p className="text-[11px] text-muted-foreground">{e.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
