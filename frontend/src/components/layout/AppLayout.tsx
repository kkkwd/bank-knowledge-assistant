import { NavLink, Outlet } from "react-router-dom";

import { useAdminAuth } from "../../auth/AdminAuthContext";

const navItems = [
  { to: "/", label: "项目概览" },
  { to: "/chat", label: "智能问答" },
  { to: "/monitoring", label: "系统监控" },
];

export function AppLayout() {
  const { isAuthenticated, logout } = useAdminAuth();

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(212,166,60,0.18),_transparent_28%),linear-gradient(180deg,_#f9fbfd_0%,_#edf3f8_100%)] text-ink">
      <header className="border-b border-slate-200/70 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-bank-700 sm:text-sm sm:tracking-[0.28em]">
              Banking RAG Demo
            </p>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <h1 className="text-lg font-bold text-ink sm:text-xl">银行知识库智能问答助手</h1>
              <span className="rounded-full border border-bank-200 bg-bank-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-bank-800">
                Resume Project
              </span>
            </div>
            <p className="mt-2 max-w-2xl text-xs leading-5 text-slate-500 sm:text-sm">
              个人简历展示项目，仅用于银行知识库智能问答能力演示与个人技术作品陈列。
            </p>
          </div>
          <div className="flex w-full flex-col gap-3 lg:w-auto lg:flex-row lg:items-center lg:gap-4">
            <nav className="-mx-1 flex overflow-x-auto rounded-full bg-slate-100 p-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${
                      isActive ? "bg-bank-700 text-white" : "text-slate-600 hover:text-bank-700"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <NavLink
                to={isAuthenticated ? "/admin/knowledge-bases" : "/admin/login"}
                className="rounded-full px-3 py-2 text-slate-500 transition hover:bg-slate-100 hover:text-bank-700"
              >
                管理入口
              </NavLink>
              {isAuthenticated ? (
                <button
                  className="rounded-full px-3 py-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                  type="button"
                  onClick={logout}
                >
                  退出
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
        <Outlet />
      </main>
      <footer className="border-t border-slate-200/70 bg-white/70 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-5 text-xs leading-6 text-slate-500 sm:px-6 sm:text-sm lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="font-semibold uppercase tracking-[0.18em] text-slate-600">BANKING RAG DEMO</p>
            <p>银行知识库智能问答助手 | 个人简历展示项目 | 非商业用途</p>
          </div>
          <p className="max-w-2xl lg:text-right">
            Copyright © 2026 本站内容仅限个人作品展示与技术演示，禁止摘抄、搬运、宣传或用于任何商业场景。
          </p>
        </div>
      </footer>
    </div>
  );
}
