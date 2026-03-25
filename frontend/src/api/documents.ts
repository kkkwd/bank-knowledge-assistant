import { apiClient } from "./client";
import { DocumentRecord, ReindexDocumentResponse, UploadDocumentResponse } from "../types/document";

export function fetchDocuments() {
  return apiClient.get<DocumentRecord[]>("/documents");
}

export function uploadDocument(knowledgeBaseId: number, file: File) {
  const formData = new FormData();
  formData.append("knowledge_base_id", String(knowledgeBaseId));
  formData.append("file", file);
  return apiClient.postForm<UploadDocumentResponse>("/documents/upload", formData);
}

export function reindexDocument(documentId: number) {
  return apiClient.post<ReindexDocumentResponse>(`/documents/${documentId}/reindex`, {});
}
