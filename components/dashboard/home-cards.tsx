"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

export default function HomeCards() {
  const metrics = [
    {
      label: "Total Income",
      value: "₹145,200",
      change: "+12.4%",
      positive: true,
    },
    {
      label: "Total Expense",
      value: "₹92,800",
      change: "-4.2%",
      positive: false,
    },
    {
      label: "Net Savings",
      value: "₹52,400",
      change: "+18.1%",
      positive: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {metrics.map((m, i) => (
        <Card
          key={i}
          className="
            p-4 
            transition-all duration-300 
            hover:shadow-xl 
            hover:-translate-y-1
            rounded-xl
          "
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">{m.label}</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="text-2xl font-bold">{m.value}</div>

            <div
              className={`flex items-center gap-1 mt-1 text-sm font-medium ${
                m.positive ? "text-green-600" : "text-red-600"
              }`}
            >
              {m.positive ? (
                <ArrowUpRight size={18} />
              ) : (
                <ArrowDownRight size={18} />
              )}
              {m.change}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
