"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = ["#4f46e5", "#22c55e", "#eab308", "#f97316", "#06b6d4", "#ec4899"];

export function CategoryDonut({
  data
}: {
  data: { name: string; value: number }[];
}) {
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            innerRadius={60}
            outerRadius={90}
            paddingAngle={4}
            dataKey="value"
          >
            {data.map((_, idx) => (
              <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "#020617",
              borderRadius: 12,
              border: "1px solid rgba(148,163,184,0.5)"
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
