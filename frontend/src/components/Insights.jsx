import React from "react";
export default function Insights({ insights }) {
  return (
    <section className="card">
      <h3 className="mb-2 font-bold">AI Spending Coach</h3>
      <p className="text-sm text-slate-500">{insights?.summary || "Loading insights..."}</p>
      <ul className="mt-3 space-y-2 text-sm">
        {(insights?.tips || []).map((tip) => <li key={tip} className="rounded-xl bg-violet-50 p-2 dark:bg-violet-950">✨ {tip}</li>)}
      </ul>
    </section>
  );
}
