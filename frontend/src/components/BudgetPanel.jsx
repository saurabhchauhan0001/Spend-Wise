import React from "react";
import { useState } from "react";
import api from "../api/client";
import { categories, currency } from "../utils/categories";

export default function BudgetPanel({ budgets, warnings, refresh }) {
  const [form, setForm] = useState({ month: new Date().toISOString().slice(0, 7), category: "overall", limit: "" });

  const save = async (event) => {
    event.preventDefault();
    await api.post("/budgets", { ...form, limit: Number(form.limit) });
    setForm((current) => ({ ...current, limit: "" }));
    refresh();
  };

  return (
    <section className="card space-y-4">
      <h3 className="font-bold">Budgets</h3>
      {warnings.map((warning) => (
        <div key={warning.category} className="rounded-2xl border border-rose-300 bg-rose-50 p-3 text-sm text-rose-700 dark:bg-rose-950 dark:text-rose-200">
          {warning.category} budget exceeded: {currency(warning.spent)} / {currency(warning.limit)}
        </div>
      ))}
      <form onSubmit={save} className="grid gap-2">
        <input className="input" type="month" value={form.month} onChange={(e) => setForm({ ...form, month: e.target.value })} />
        <select className="input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
          <option value="overall">Overall</option>
          {categories.map((item) => <option key={item.name}>{item.name}</option>)}
        </select>
        <input className="input" type="number" placeholder="Budget limit" value={form.limit} onChange={(e) => setForm({ ...form, limit: e.target.value })} required />
        <button className="btn-primary">Set budget</button>
      </form>
      <div className="space-y-2">
        {budgets.slice(0, 5).map((budget) => (
          <div key={budget._id} className="flex justify-between text-sm">
            <span>{budget.month} • {budget.category}</span>
            <strong>{currency(budget.limit)}</strong>
          </div>
        ))}
      </div>
    </section>
  );
}
