import { createBrowserRouter } from "react-router-dom";

import { AppLayout } from "../components/layout/AppLayout";
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
      { path: "knowledge-bases", element: <KnowledgeBasePage /> },
      { path: "chat", element: <ChatPage /> },
      { path: "monitoring", element: <MonitoringPage /> },
    ],
  },
]);
