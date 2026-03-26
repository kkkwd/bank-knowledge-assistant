import { createBrowserRouter } from "react-router-dom";

import { RequireAdminAuth } from "../components/auth/RequireAdminAuth";
import { AppLayout } from "../components/layout/AppLayout";
import { AdminLoginPage } from "../pages/AdminLoginPage";
import { ChatPage } from "../pages/ChatPage";
import { KnowledgeBasePage } from "../pages/KnowledgeBasePage";
import { LandingPage } from "../pages/LandingPage";
import { MonitoringPage } from "../pages/MonitoringPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: "chat", element: <ChatPage /> },
      { path: "monitoring", element: <MonitoringPage /> },
      { path: "admin/login", element: <AdminLoginPage /> },
      {
        element: <RequireAdminAuth />,
        children: [{ path: "admin/knowledge-bases", element: <KnowledgeBasePage /> }],
      },
    ],
  },
]);
