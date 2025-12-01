"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Wallet, CreditCard, Import, Settings } from "lucide-react";
import clsx from "clsx";

const items = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/accounts", label: "Accounts", icon: Wallet },
  { href: "/credit-cards", label: "Credit Cards", icon: CreditCard },
  { href: "/import", label: "Import Center", icon: Import },
  { href: "/settings", label: "Settings", icon: Settings }
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="hidden md:flex flex-col w-60 bg-black/40 border-r border-white/10 backdrop-blur-xl">
      <div className="h-16 flex items-center px-4 border-b border-white/10">
        <div className="h-9 w-9 rounded-2xl bg-primary/20 flex items-center justify-center mr-2">
          <span className="text-lg font-bold text-primary">F</span>
        </div>
        <div>
          <p className="text-sm font-semibold">FinSight 360</p>
          <p className="text-[10px] text-muted-foreground">Personal Finance</p>
        </div>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {items.map((item) => {
          const Icon = item.icon;
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition",
                active
                  ? "bg-white/10 text-white"
                  : "text-muted-foreground hover:bg-white/5 hover:text-white"
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
