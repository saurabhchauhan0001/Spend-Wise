import React from "react";
import { currency } from "../utils/categories";

export default function StatCard({ label, value, tone }) {
  const tones = {
    income: "from-emerald-500 to-teal-500",
    expense: "from-rose-500 to-orange-500",
    balance: "from-violet-500 to-indigo-500"
  };
  return (
    <div className={`rounded-[1.75rem] bg-gradient-to-br ${tones[tone]} p-6 text-white shadow-xl shadow-slate-200/60 dark:shadow-none`}>
      <p className="text-sm font-bold opacity-80">{label}</p>
      <h2 className="mt-2 text-3xl font-black tracking-tight">{currency(value)}</h2>
    </div>
  );
}
