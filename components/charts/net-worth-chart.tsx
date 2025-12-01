"use client";

import { LineChart, Line, ResponsiveContainer, Tooltip, CartesianGrid, YAxis, XAxis } from "recharts";

interface Props {
  data: { label: string; value: number }[];
}

export function NetWorthChart({ data }: Props) {
  return (
    <div className="h-52">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid stroke="rgba(148,163,184,0.2)" strokeDasharray="3 3" />
          <XAxis dataKey="label" hide />
          <YAxis hide />
          <Tooltip
            contentStyle={{
              backgroundColor: "#020617",
              border: "1px solid rgba(148,163,184,0.5)",
              borderRadius: 12
            }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#4f46e5"
            strokeWidth={2.4}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
