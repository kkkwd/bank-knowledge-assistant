import { apiClient } from "./client";
import { KnowledgeBase } from "../types/knowledgeBase";

export function fetchKnowledgeBases() {
  return apiClient.get<KnowledgeBase[]>("/knowledge-bases");
}
