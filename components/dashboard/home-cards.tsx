import { motion } from "framer-motion";

interface StatCardProps {
  label: string;
  value: string;
  hint?: string;
}

export function StatCard({ label, value, hint }: StatCardProps) {
  return (
    <motion.div
      className="rounded-2xl bg-white/5 border border-white/10 p-4 flex flex-col gap-1 shadow-sm"
      whileHover={{ y: -2, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
    >
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-lg font-semibold">{value}</p>
      {hint && <p className="text-[11px] text-muted-foreground">{hint}</p>}
    </motion.div>
  );
}
