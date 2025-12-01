"use client";

import { useRouter } from "next/navigation";
import { Moon, Sun, Bell } from "lucide-react";
import { useEffect, useState } from "react";

export function TopNav() {
  const router = useRouter();
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  async function logout() {
    await fetch("/api/auth", {
      method: "POST",
      body: JSON.stringify({ action: "logout" })
    });
    router.push("/login");
  }

  return (
    <header className="nav-glass sticky top-0 z-20 h-16 flex items-center justify-between px-4 md:px-6">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span>Overview</span>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="h-8 w-8 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/10"
        >
          {theme === "dark" ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </button>
        <button className="h-8 w-8 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/10">
          <Bell className="h-4 w-4" />
        </button>
        <button
          onClick={logout}
          className="text-xs px-3 py-1 rounded-full border border-white/10 hover:bg-white/10"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
