import type { ReactNode } from "react";
import { Sidebar } from "./sidebar";
import { TopNav } from "./top-nav";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-foreground">
      <div className="flex">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <TopNav />
          <main className="px-4 md:px-8 pb-8 pt-4">{children}</main>
        </div>
      </div>
    </div>
  );
}
