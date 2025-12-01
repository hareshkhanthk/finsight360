import { AppShell } from "@/components/layout/shell";
import ImportClient from "@/components/import/import-wizard";

export const runtime = "edge";

export default function ImportPage() {
  return (
    <AppShell>
      <div className="mb-4">
        <h1 className="text-xl font-semibold">Import Center</h1>
        <p className="text-xs text-muted-foreground">
          Upload PDF, Excel or CSV bank and card statements.
        </p>
      </div>
      <ImportClient />
    </AppShell>
  );
}
