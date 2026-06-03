import React from "react";
import { Download, Pencil, Trash2 } from "lucide-react";
import { currency } from "../utils/categories";

export default function TransactionList({ transactions, filters, setFilters, onEdit, onDelete, onExport }) {
  return (
    <section className="card">
      <div className="mb-3 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <h3 className="font-bold">Transactions</h3>
        <div className="flex flex-wrap gap-2">
          <input className="input h-11 w-44 py-0" placeholder="Search..." value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} />
          <select className="input h-11 w-36 py-0" value={filters.type} onChange={(e) => setFilters({ ...filters, type: e.target.value })}>
            <option value="">All types</option><option value="income">Income</option><option value="expense">Expense</option>
          </select>
          <input className="input h-11 w-36 py-0" type="date" value={filters.startDate} onChange={(e) => setFilters({ ...filters, startDate: e.target.value })} />
          <button className="btn-secondary h-11 py-0" onClick={onExport}><Download size={16} /> CSV</button>
        </div>
      </div>
      <div className="space-y-3">
        {transactions.map((item) => (
          <div key={item._id} className="flex items-center justify-between rounded-2xl bg-slate-100 p-3 dark:bg-slate-800">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{item.icon}</span>
              <div>
                <p className="font-semibold">{item.title}</p>
                <p className="text-xs text-slate-500">{item.category} • {item.account?.name} • {new Date(item.date).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={item.type === "income" ? "text-emerald-500" : "text-rose-500"}>
                {item.type === "income" ? "+" : "-"}{currency(item.amount)}
              </span>
              <button onClick={() => onEdit(item)}><Pencil size={16} /></button>
              <button onClick={() => onDelete(item._id)}><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
        {!transactions.length && <p className="py-8 text-center text-slate-500">No transactions found.</p>}
      </div>
    </section>
  );
}
