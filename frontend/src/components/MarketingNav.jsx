import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, WalletCards, X } from "lucide-react";

const links = [
  { label: "Features", href: "#features" },
  { label: "AI Tools", href: "#ai" },
  { label: "Pricing", href: "#pricing" }
];

export default function MarketingNav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/60 bg-white/80 shadow-sm shadow-slate-200/50 backdrop-blur-2xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-3">
          <span className="rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 p-2 text-white shadow-lg shadow-violet-200">
            <WalletCards size={24} />
          </span>
          <span className="text-xl font-black tracking-tight">SpendWise AI</span>
        </Link>

        <div className="hidden items-center gap-1 rounded-full border border-slate-200 bg-white/80 p-1 shadow-sm lg:flex">
          {links.map((link) => (
            <a key={link.href} href={link.href} className="rounded-full px-4 py-2 text-sm font-black text-slate-600 transition hover:bg-violet-50 hover:text-violet-700">
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-3 sm:flex">
          <Link to="/auth" className="rounded-full px-5 py-2.5 text-sm font-black text-slate-700 transition hover:bg-slate-100">
            Login
          </Link>
          <Link to="/auth" className="rounded-full bg-slate-950 px-5 py-2.5 text-sm font-black text-white shadow-xl shadow-slate-300 transition hover:-translate-y-0.5 hover:bg-violet-700">
            Get Started
          </Link>
        </div>

        <button className="rounded-2xl bg-slate-100 p-3 sm:hidden" onClick={() => setOpen((value) => !value)}>
          {open ? <X /> : <Menu />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-slate-100 bg-white px-6 py-4 sm:hidden">
          <div className="grid gap-2">
            {links.map((link) => (
              <a key={link.href} href={link.href} className="rounded-2xl px-4 py-3 font-black text-slate-700 hover:bg-violet-50" onClick={() => setOpen(false)}>
                {link.label}
              </a>
            ))}
            <Link to="/auth" className="mt-2 rounded-2xl bg-violet-600 px-4 py-3 text-center font-black text-white">
              Get Started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
