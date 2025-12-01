import type { Alert } from "@/lib/models";

export function AlertsPanel({ alerts }: { alerts: Alert[] }) {
  if (!alerts.length) {
    return (
      <div className="rounded-2xl bg-white/5 border border-dashed border-white/20 p-4 text-xs text-muted-foreground flex flex-col items-center justify-center gap-2">
        <p>No alerts. You are on track ✅</p>
      </div>
    );
  }
  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 p-4 space-y-2 text-xs">
      {alerts.map((a) => (
        <div key={a.id} className="flex justify-between gap-2">
          <span>{a.message}</span>
          <span className="text-muted-foreground">{a.createdAt.slice(0, 10)}</span>
        </div>
      ))}
    </div>
  );
}
