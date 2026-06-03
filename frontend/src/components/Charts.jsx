import React from "react";
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const colors = ["#7c3aed", "#06b6d4", "#22c55e", "#f59e0b", "#ef4444", "#ec4899"];

export default function Charts({ summary }) {
  const pie = Object.entries(summary.categoryTotals || {}).map(([name, value]) => ({ name, value }));
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <section className="card flex h-96 flex-col">
        <h3 className="mb-4 font-bold">Category Breakdown</h3>
        <div className="min-h-0 flex-1">
        <ResponsiveContainer>
          <PieChart>
            <Pie data={pie} dataKey="value" nameKey="name" outerRadius={85}>
              {pie.map((_, index) => <Cell key={index} fill={colors[index % colors.length]} />)}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
        </div>
      </section>
      <section className="card flex h-96 flex-col">
        <h3 className="mb-4 font-bold">Monthly Trends</h3>
        <div className="min-h-0 flex-1">
        <ResponsiveContainer>
          <BarChart data={summary.monthlyTrends || []}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="income" fill="#22c55e" />
            <Bar dataKey="expense" fill="#ef4444" />
          </BarChart>
        </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}
