import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAdminAuth } from "../../auth/AdminAuthContext";

export function RequireAdminAuth() {
  const { isAuthenticated } = useAdminAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    const next = encodeURIComponent(`${location.pathname}${location.search}`);
    return <Navigate replace to={`/admin/login?next=${next}`} />;
  }

  return <Outlet />;
}
