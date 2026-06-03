import React from "react";
import { useEffect, useState } from "react";
import api from "../api/client";
import { categories } from "../utils/categories";

const empty = { title: "", amount: "", type: "expense", category: "Food", date: new Date().toISOString().slice(0, 10), note: "", recurring: { enabled: false, frequency: "monthly" } };

export default function TransactionForm({ accounts, editing, onSaved, onCancel }) {
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setForm(editing ? { ...editing, date: editing.date?.slice(0, 10) } : { ...empty, account: accounts[0]?._id });
  }, [editing, accounts]);

  const change = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const autoCategorize = async () => {
    const { data } = await api.post("/ai/categorize", { title: form.title, note: form.note });
    setForm((current) => ({ ...current, category: data.category, icon: data.icon }));
  };

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const payload = { ...form, amount: Number(form.amount), account: form.account || accounts[0]?._id };
      if (editing?._id) await api.put(`/transactions/${editing._id}`, payload);
      else await api.post("/transactions", payload);
      onSaved();
      setForm({ ...empty, account: accounts[0]?._id });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="card space-y-3">
      <h3 className="font-bold">{editing ? "Edit transaction" : "Add transaction"}</h3>
      <input className="input" placeholder="Title" value={form.title} onChange={(e) => change("title", e.target.value)} required />
      <div className="grid grid-cols-2 gap-3">
        <input className="input" type="number" min="0" step="0.01" placeholder="Amount" value={form.amount} onChange={(e) => change("amount", e.target.value)} required />
        <select className="input" value={form.type} onChange={(e) => change("type", e.target.value)}>
          <option value="expense">Expense</option><option value="income">Income</option>
        </select>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <select className="input" value={form.category} onChange={(e) => change("category", e.target.value)}>
          {categories.map((item) => <option key={item.name}>{item.name}</option>)}
        </select>
        <select className="input" value={form.account || ""} onChange={(e) => change("account", e.target.value)}>
          {accounts.map((account) => <option key={account._id} value={account._id}>{account.name}</option>)}
        </select>
      </div>
      <input className="input" type="date" value={form.date} onChange={(e) => change("date", e.target.value)} />
      <textarea className="input" placeholder="Note" value={form.note || ""} onChange={(e) => change("note", e.target.value)} />
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={form.recurring?.enabled || false} onChange={(e) => change("recurring", { ...form.recurring, enabled: e.target.checked })} />
        Recurring transaction
      </label>
      <div className="flex gap-2">
        <button className="btn-primary" disabled={loading}>{loading ? "Saving..." : "Save"}</button>
        <button type="button" className="btn-secondary" onClick={autoCategorize}>AI categorize</button>
        {editing && <button type="button" className="btn-secondary" onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  );
}
