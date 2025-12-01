import { AppShell } from "@/components/layout/shell";
import { AiAssistantPlaceholder } from "@/components/ai/ai-assistant-placeholder";

export const runtime = "edge";

export default function SettingsPage() {
  return (
    <AppShell>
      <div className="mb-4">
        <h1 className="text-xl font-semibold">Settings</h1>
        <p className="text-xs text-muted-foreground">
          Budgets, category rules and exports.
        </p>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <AiAssistantPlaceholder />
        <div className="rounded-2xl bg-white/5 border border-white/10 p-4 text-xs text-muted-foreground">
          <p className="font-medium mb-1">Database export</p>
          <p className="mb-2">
            Download a full JSON snapshot of your FinSight 360 data for backup.
          </p>
          <a
            href="/api/db/export"
            className="inline-flex items-center px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium"
          >
            Export JSON
          </a>
        </div>
      </div>
    </AppShell>
  );
}
