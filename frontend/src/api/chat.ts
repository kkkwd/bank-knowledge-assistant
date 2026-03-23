import { apiClient } from "./client";
import { ChatAskRequest, ChatAskResponse, SessionDetail, SessionPayload } from "../types/chat";

export function createSession(payload: SessionPayload) {
  return apiClient.post<{ id: number; title: string; knowledge_base_id: number; created_at: string; updated_at: string }>(
    "/sessions",
    payload,
  );
}

export function fetchSession(sessionId: number) {
  return apiClient.get<SessionDetail>(`/sessions/${sessionId}`);
}

export function askQuestion(payload: ChatAskRequest) {
  return apiClient.post<ChatAskResponse>("/chat/ask", payload);
}
