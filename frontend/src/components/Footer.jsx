import React from "react";
import { Link } from "react-router-dom";
import { Github, Linkedin, Mail, WalletCards } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-950 text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Link to="/" className="flex items-center gap-3">
            <span className="rounded-2xl bg-violet-600 p-2 text-white">
              <WalletCards size={24} />
            </span>
            <span className="text-xl font-black tracking-tight">SpendWise AI</span>
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-7 text-slate-400">
            A modern MERN expense tracker for budgets, transactions, charts, and AI-style money insights.
          </p>
          <div className="mt-5 flex gap-3 text-slate-400">
            <Github size={20} />
            <Linkedin size={20} />
            <Mail size={20} />
          </div>
        </div>
        <div>
          <h4 className="font-black">Product</h4>
          <div className="mt-4 grid gap-3 text-sm text-slate-400">
            <a href="#features">Features</a>
            <a href="#ai">AI Tools</a>
            <a href="#pricing">Pricing</a>
          </div>
        </div>
        <div>
          <h4 className="font-black">App</h4>
          <div className="mt-4 grid gap-3 text-sm text-slate-400">
            <Link to="/auth">Login</Link>
            <Link to="/auth">Create Account</Link>
          </div>
        </div>
        <div>
          <h4 className="font-black">Built With</h4>
          <div className="mt-4 grid gap-3 text-sm text-slate-400">
            <span>MongoDB + Express</span>
            <span>React + Tailwind</span>
            <span>Node.js + JWT</span>
          </div>
        </div>
      </div>
      <div className="border-t border-slate-800 px-6 py-5 text-center text-sm font-bold text-slate-500">
        © {new Date().getFullYear()} SpendWise AI. Built for smarter spending.
      </div>
    </footer>
  );
}
