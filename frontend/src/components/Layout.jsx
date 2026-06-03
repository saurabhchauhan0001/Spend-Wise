import React from "react";
import { LogOut, Moon, Sun, WalletCards } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const [dark, setDark] = useState(() => localStorage.theme === "dark");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.theme = dark ? "dark" : "light";
  }, [dark]);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <header className="sticky top-0 z-20 border-b border-slate-200/70 bg-white/85 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/85">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-violet-600 p-2 text-white"><WalletCards /></div>
            <div>
              <h1 className="text-xl font-black tracking-tight">SpendWise AI</h1>
              <p className="text-sm font-medium text-slate-500">Welcome, {user?.name}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="btn-secondary" onClick={() => setDark((value) => !value)}>
              {dark ? <Sun size={18} /> : <Moon size={18} />} Theme
            </button>
            <button className="btn-secondary" onClick={logout}><LogOut size={18} /> Logout</button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6">{children}</main>
      <footer className="mx-auto max-w-7xl px-4 pb-8 pt-2 text-center text-sm font-bold text-slate-400">
        SpendWise AI keeps your budgets and insights in one clean workspace.
      </footer>
    </div>
  );
}
