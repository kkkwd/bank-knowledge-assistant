import { ChangeEvent, useEffect, useMemo, useState } from "react";

import { fetchDocuments, reindexDocument, uploadDocument } from "../api/documents";
import { fetchKnowledgeBases } from "../api/knowledgeBase";
import { SectionCard } from "../components/SectionCard";
import { DocumentRecord } from "../types/document";
import { KnowledgeBase } from "../types/knowledgeBase";

export function KnowledgeBasePage() {
  const [knowledgeBases, setKnowledgeBases] = useState<KnowledgeBase[]>([]);
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [selectedKnowledgeBaseId, setSelectedKnowledgeBaseId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [activeReindexId, setActiveReindexId] = useState<number | null>(null);

  const filteredDocuments = useMemo(
    () =>
      selectedKnowledgeBaseId === null
        ? []
        : documents.filter((item) => item.knowledge_base_id === selectedKnowledgeBaseId),
    [documents, selectedKnowledgeBaseId],
  );

  async function loadData() {
    setLoading(true);
    setError(null);
    try {
      const [knowledgeBaseData, documentData] = await Promise.all([fetchKnowledgeBases(), fetchDocuments()]);
      setKnowledgeBases(knowledgeBaseData);
      setDocuments(documentData);
      setSelectedKnowledgeBaseId((current) => current ?? knowledgeBaseData[0]?.id ?? null);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file || selectedKnowledgeBaseId === null) {
      return;
    }

    setUploading(true);
    setError(null);
    try {
      await uploadDocument(selectedKnowledgeBaseId, file);
      await loadData();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Upload failed");
    } finally {
      event.target.value = "";
      setUploading(false);
    }
  }

  async function handleReindex(documentId: number) {
    setActiveReindexId(documentId);
    setError(null);
    try {
      await reindexDocument(documentId);
      await loadData();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Reindex failed");
    } finally {
      setActiveReindexId(null);
    }
  }

  return (
    <div className="space-y-6">
      <SectionCard
        title="知识库管理"
        description="已接通文档上传、落表和同步索引，可直接用银行资料验证 RAG 主链路。"
      >
        <div className="mb-5 grid gap-4 md:grid-cols-[1fr_auto]">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-600">选择知识库</span>
            <select
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none ring-bank-500 transition focus:ring-2"
              value={selectedKnowledgeBaseId ?? ""}
              onChange={(event) => setSelectedKnowledgeBaseId(Number(event.target.value))}
            >
              {knowledgeBases.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>

          <label className="flex cursor-pointer items-end">
            <span className="w-full rounded-full bg-bank-700 px-5 py-3 text-center text-sm font-semibold text-white md:w-auto">
              {uploading ? "上传并索引中..." : "上传文档"}
            </span>
            <input
              className="hidden"
              type="file"
              accept=".pdf,.docx,.txt,.jpg,.jpeg,.png"
              disabled={uploading || selectedKnowledgeBaseId === null}
              onChange={handleUpload}
            />
          </label>
        </div>

        {loading ? <p className="text-sm text-slate-500">Loading knowledge bases...</p> : null}
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        {knowledgeBases.length > 0 ? (
          <div className="mb-5 overflow-x-auto rounded-2xl border border-slate-200">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-medium">名称</th>
                  <th className="px-4 py-3 font-medium">编码</th>
                  <th className="px-4 py-3 font-medium">描述</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {knowledgeBases.map((item) => (
                  <tr key={item.id}>
                    <td className="px-4 py-3 font-medium text-ink">{item.name}</td>
                    <td className="px-4 py-3 text-slate-500">{item.code}</td>
                    <td className="px-4 py-3 text-slate-500">{item.description ?? "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}

        {selectedKnowledgeBaseId !== null ? (
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-medium">文档</th>
                  <th className="px-4 py-3 font-medium">类型</th>
                  <th className="px-4 py-3 font-medium">解析状态</th>
                  <th className="px-4 py-3 font-medium">索引状态</th>
                  <th className="px-4 py-3 font-medium">Chunks</th>
                  <th className="px-4 py-3 font-medium">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filteredDocuments.length === 0 ? (
                  <tr>
                    <td className="px-4 py-4 text-slate-500" colSpan={6}>
                      当前知识库还没有文档。
                    </td>
                  </tr>
                ) : (
                  filteredDocuments.map((item) => (
                    <tr key={item.id}>
                      <td className="px-4 py-3">
                        <p className="font-medium text-ink">{item.original_name}</p>
                        {item.error_message ? (
                          <p className="mt-1 text-xs text-red-600">{item.error_message}</p>
                        ) : null}
                      </td>
                      <td className="px-4 py-3 text-slate-500">{item.file_type}</td>
                      <td className="px-4 py-3 text-slate-500">{item.parse_status}</td>
                      <td className="px-4 py-3 text-slate-500">{item.index_status}</td>
                      <td className="px-4 py-3 text-slate-500">{item.chunk_count}</td>
                      <td className="px-4 py-3">
                        <button
                          className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 disabled:cursor-not-allowed disabled:text-slate-400"
                          type="button"
                          disabled={activeReindexId === item.id}
                          onClick={() => handleReindex(item.id)}
                        >
                          {activeReindexId === item.id ? "处理中..." : "重建索引"}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        ) : null}
      </SectionCard>
    </div>
  );
}
