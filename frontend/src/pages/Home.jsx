import React from "react";
import { ArrowRight, BarChart3, BrainCircuit, ShieldCheck, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import MarketingNav from "../components/MarketingNav";

const features = [
  {
    icon: <BarChart3 />,
    title: "Visual Money Clarity",
    text: "Track income, expenses, budgets, and monthly trends from one calm dashboard."
  },
  {
    icon: <BrainCircuit />,
    title: "AI Spending Coach",
    text: "Get mock AI categorization, spending pattern analysis, and saving suggestions."
  },
  {
    icon: <ShieldCheck />,
    title: "Secure By Design",
    text: "JWT authentication keeps your dashboard and API data protected."
  }
];

export default function Home() {
  return (
    <div className="min-h-screen overflow-hidden bg-[#f8fafc] text-slate-950">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,#ddd6fe,transparent_34%),radial-gradient(circle_at_80%_20%,#bae6fd,transparent_28%),linear-gradient(180deg,#ffffff,#f8fafc)]" />
      <MarketingNav />

      <main className="mx-auto max-w-7xl px-6 pb-16 pt-28">
        <section className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-100 bg-white/80 px-4 py-2 text-sm font-bold text-violet-700 shadow-sm backdrop-blur">
              <Sparkles size={16} /> Smart MERN expense tracking
            </div>
            <h1 className="max-w-4xl text-5xl font-black leading-[0.98] tracking-[-0.05em] text-slate-950 sm:text-6xl lg:text-7xl">
              Make your money feel less mysterious.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
              A modern expense tracker with budgets, charts, multi-account tracking, CSV export, dark mode, and smart AI-style insights.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/auth" className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 px-7 py-4 text-base font-black text-white shadow-2xl shadow-violet-200 transition hover:-translate-y-1">
                Start Tracking <ArrowRight size={20} />
              </Link>
              <a href="#features" className="inline-flex items-center justify-center rounded-full bg-white px-7 py-4 text-base font-black text-slate-800 shadow-lg shadow-slate-200 transition hover:-translate-y-1">
                Explore Features
              </a>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-6 -z-10 rounded-[3rem] bg-gradient-to-br from-violet-200 via-sky-100 to-emerald-100 blur-2xl" />
            <div className="rounded-[2rem] border border-white/70 bg-white/85 p-5 shadow-2xl shadow-slate-300 backdrop-blur">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-slate-400">Current Balance</p>
                  <h2 className="text-4xl font-black tracking-tight">$8,420</h2>
                </div>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-black text-emerald-700">+12.4%</span>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-3xl bg-violet-600 p-4 text-white">
                  <p className="text-xs font-bold opacity-70">Income</p>
                  <p className="mt-2 text-2xl font-black">$4,200</p>
                </div>
                <div className="rounded-3xl bg-rose-500 p-4 text-white">
                  <p className="text-xs font-bold opacity-70">Expenses</p>
                  <p className="mt-2 text-2xl font-black">$1,580</p>
                </div>
                <div className="rounded-3xl bg-slate-900 p-4 text-white">
                  <p className="text-xs font-bold opacity-70">Saved</p>
                  <p className="mt-2 text-2xl font-black">$920</p>
                </div>
              </div>
              <div className="mt-5 space-y-3">
                {[
                  ["🍔", "Food budget", "78% used"],
                  ["🚕", "Transport", "Under control"],
                  ["✨", "AI tip", "Cancel unused subscriptions"]
                ].map(([icon, title, meta]) => (
                  <div key={title} className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{icon}</span>
                      <span className="font-black">{title}</span>
                    </div>
                    <span className="text-sm font-bold text-slate-500">{meta}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="mt-20">
          <div className="mx-auto mb-10 max-w-3xl text-center">
            <p className="text-sm font-black uppercase tracking-[0.25em] text-violet-600">Everything Included</p>
            <h2 className="mt-3 text-4xl font-black tracking-[-0.04em] sm:text-5xl">A complete finance control room.</h2>
            <p className="mt-4 text-lg leading-8 text-slate-600">Designed for real daily use: fast entries, clean charts, strong filtering, and helpful warnings before spending gets spicy.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.title} className="rounded-[1.75rem] border border-white bg-white/80 p-6 shadow-xl shadow-slate-200/70 backdrop-blur transition hover:-translate-y-1">
              <div className="mb-5 inline-flex rounded-2xl bg-violet-50 p-3 text-violet-700">{feature.icon}</div>
              <h3 className="text-lg font-black tracking-tight">{feature.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{feature.text}</p>
            </div>
          ))}
          </div>
        </section>

        <section id="ai" className="mt-20 grid items-center gap-8 rounded-[2.5rem] bg-slate-950 p-8 text-white shadow-2xl shadow-slate-300 lg:grid-cols-2 lg:p-12">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.25em] text-violet-300">AI Features</p>
            <h2 className="mt-3 text-4xl font-black tracking-[-0.04em] sm:text-5xl">Smart suggestions without the overwhelm.</h2>
            <p className="mt-5 text-lg leading-8 text-slate-300">
              SpendWise AI analyzes category patterns, suggests savings, and auto-categorizes transactions without overwhelming your workflow.
            </p>
          </div>
          <div className="grid gap-3">
            {["Auto categorize groceries, transport, bills, and salary", "Detect your largest spending category", "Suggest practical saving tips"].map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-white/10 p-4 text-sm font-bold text-slate-100">
                ✨ {item}
              </div>
            ))}
          </div>
        </section>

        <section id="pricing" className="mt-20 rounded-[2.5rem] border border-violet-100 bg-white p-8 text-center shadow-2xl shadow-violet-100 lg:p-12">
          <p className="text-sm font-black uppercase tracking-[0.25em] text-violet-600">Pricing</p>
          <h2 className="mt-3 text-4xl font-black tracking-[-0.04em] sm:text-5xl">Free for your project demo.</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-slate-600">
            Full-stack source code, modern UI, protected APIs, dashboard charts, budgets, AI mocks, and CSV export.
          </p>
          <Link to="/auth" className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 px-8 py-4 font-black text-white shadow-2xl shadow-violet-200 transition hover:-translate-y-1">
            Open the App <ArrowRight size={20} />
          </Link>
        </section>
      </main>
      <Footer />
    </div>
  );
}
