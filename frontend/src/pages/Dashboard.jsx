import React from "react";
import { useEffect, useState } from "react";
import api from "../api/client";
import BudgetPanel from "../components/BudgetPanel";
import Charts from "../components/Charts";
import Insights from "../components/Insights";
import Layout from "../components/Layout";
import StatCard from "../components/StatCard";
import TransactionForm from "../components/TransactionForm";
import TransactionList from "../components/TransactionList";

export default function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({ income: 0, expenses: 0, balance: 0, categoryTotals: {}, monthlyTrends: [], warnings: [] });
  const [accounts, setAccounts] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [insights, setInsights] = useState(null);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({ search: "", type: "", startDate: "" });

  const load = async () => {
    setError("");
    try {
      const params = Object.fromEntries(Object.entries(filters).filter(([, value]) => value));
      const [txRes, summaryRes, accountRes, budgetRes, insightRes] = await Promise.all([
        api.get("/transactions", { params }),
        api.get("/transactions/summary", { params }),
        api.get("/accounts"),
        api.get("/budgets"),
        api.get("/ai/insights")
      ]);
      setTransactions(txRes.data);
      setSummary(summaryRes.data);
      setAccounts(accountRes.data);
      setBudgets(budgetRes.data);
      setInsights(insightRes.data);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [filters.search, filters.type, filters.startDate]);

  const remove = async (id) => {
    await api.delete(`/transactions/${id}`);
    load();
  };

  const exportCsv = async () => {
    const params = Object.fromEntries(Object.entries(filters).filter(([, value]) => value));
    const { data } = await api.get("/transactions/export", { params, responseType: "blob" });
    const url = URL.createObjectURL(data);
    const link = document.createElement("a");
    link.href = url;
    link.download = "transactions.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Layout>
      {error && <div className="mb-4 rounded-2xl bg-rose-100 p-3 text-rose-700">{error}</div>}
      {loading ? (
        <div className="card animate-pulse">Loading your money map...</div>
      ) : (
        <div className="space-y-5">
          <div className="grid gap-4 md:grid-cols-3">
            <StatCard label="Total Income" value={summary.income} tone="income" />
            <StatCard label="Total Expenses" value={summary.expenses} tone="expense" />
            <StatCard label="Balance" value={summary.balance} tone="balance" />
          </div>
          <Charts summary={summary} />
          <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
            <TransactionList transactions={transactions} filters={filters} setFilters={setFilters} onEdit={setEditing} onDelete={remove} onExport={exportCsv} />
            <div className="space-y-4">
              <TransactionForm accounts={accounts} editing={editing} onSaved={() => { setEditing(null); load(); }} onCancel={() => setEditing(null)} />
              <BudgetPanel budgets={budgets} warnings={summary.warnings || []} refresh={load} />
              <Insights insights={insights} />
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
