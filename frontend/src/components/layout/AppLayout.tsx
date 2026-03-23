import { NavLink, Outlet } from "react-router-dom";

const navItems = [
  { to: "/", label: "项目概览" },
  { to: "/knowledge-bases", label: "知识库管理" },
  { to: "/chat", label: "智能问答" },
  { to: "/monitoring", label: "系统监控" },
];

export function AppLayout() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(212,166,60,0.18),_transparent_28%),linear-gradient(180deg,_#f9fbfd_0%,_#edf3f8_100%)] text-ink">
      <header className="border-b border-slate-200/70 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-bank-700">
              Banking RAG Demo
            </p>
            <h1 className="text-xl font-bold text-ink">银行知识库智能问答助手</h1>
          </div>
          <nav className="flex gap-2 rounded-full bg-slate-100 p-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `rounded-full px-4 py-2 text-sm font-medium transition ${
                    isActive ? "bg-bank-700 text-white" : "text-slate-600 hover:text-bank-700"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}
