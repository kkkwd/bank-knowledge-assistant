import { FormEvent, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { useAdminAuth } from "../auth/AdminAuthContext";

function useNextPath() {
  const location = useLocation();
  const next = new URLSearchParams(location.search).get("next");
  return next && next.startsWith("/") ? next : "/admin/knowledge-bases";
}

export function AdminLoginPage() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAdminAuth();
  const nextPath = useNextPath();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      navigate(nextPath, { replace: true });
    }
  }, [isAuthenticated, navigate, nextPath]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const passed = login(username, password);
    if (!passed) {
      setError("账号或密码错误");
      return;
    }
    navigate(nextPath, { replace: true });
  }

  return (
    <div className="mx-auto flex min-h-[72vh] max-w-md items-center">
      <div className="w-full rounded-[2rem] border border-slate-200/80 bg-white/90 p-8 shadow-panel backdrop-blur">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Admin Access</p>
        <h2 className="mt-3 text-3xl font-bold text-ink">知识库管理登录</h2>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          当前为本地前端隔离入口，默认管理员账号密码均为 <span className="font-semibold">admin</span>。
        </p>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-600">管理员账号</span>
            <input
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-bank-500 focus:bg-white focus:ring-2 focus:ring-bank-100"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-600">密码</span>
            <input
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-bank-500 focus:bg-white focus:ring-2 focus:ring-bank-100"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>

          {error ? <p className="text-sm text-red-600">{error}</p> : null}

          <button
            className="w-full rounded-full bg-bank-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-bank-900"
            type="submit"
          >
            进入管理后台
          </button>
        </form>

        <div className="mt-6 flex items-center justify-between text-sm">
          <Link className="text-slate-500 transition hover:text-bank-700" to="/">
            返回首页
          </Link>
          <Link className="text-slate-500 transition hover:text-bank-700" to="/chat">
            前往问答页
          </Link>
        </div>
      </div>
    </div>
  );
}
