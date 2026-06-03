export const categories = [
  { name: "Food", icon: "🍔" },
  { name: "Transport", icon: "🚕" },
  { name: "Shopping", icon: "🛍️" },
  { name: "Bills", icon: "🧾" },
  { name: "Salary", icon: "💼" },
  { name: "Freelance", icon: "🧑‍💻" },
  { name: "Health", icon: "🏥" },
  { name: "Travel", icon: "✈️" },
  { name: "Entertainment", icon: "🎬" },
  { name: "Other", icon: "💸" }
];

export const currency = (value) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value || 0);
