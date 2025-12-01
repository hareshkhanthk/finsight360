import "./globals.css";
import type { ReactNode } from "react";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "FinSight 360",
  description: "Personal Finance Manager"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
