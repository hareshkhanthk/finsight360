"use client";

import { ResponsiveContainer, LineChart, CartesianGrid, Tooltip, Legend, XAxis, YAxis, Line } from "recharts";

export function SpendingVsIncomeChart({
  data
}: {
  data: { month: string; income: number; expense: number }[];
}) {
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid stroke="rgba(148,163,184,0.2)" strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip
            contentStyle={{
              backgroundColor: "#020617",
              borderRadius: 12,
              border: "1px solid rgba(148,163,184,0.5)"
            }}
          />
          <Legend />
          <Line type="monotone" dataKey="income" stroke="#22c55e" strokeWidth={2} />
          <Line type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
