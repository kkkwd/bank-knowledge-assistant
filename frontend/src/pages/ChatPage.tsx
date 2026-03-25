import { FormEvent, useEffect, useState } from "react";

import { askQuestion, createSession, fetchSession } from "../api/chat";
import { fetchKnowledgeBases } from "../api/knowledgeBase";
import { SectionCard } from "../components/SectionCard";
import { Citation, RetrievedChunk, SessionDetail } from "../types/chat";
import { KnowledgeBase } from "../types/knowledgeBase";

export function ChatPage() {
  const [knowledgeBases, setKnowledgeBases] = useState<KnowledgeBase[]>([]);
  const [selectedKnowledgeBaseId, setSelectedKnowledgeBaseId] = useState<number | null>(null);
  const [session, setSession] = useState<SessionDetail | null>(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [citations, setCitations] = useState<Citation[]>([]);
  const [retrievedChunks, setRetrievedChunks] = useState<RetrievedChunk[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchKnowledgeBases().then((items) => {
      setKnowledgeBases(items);
      if (items.length > 0) {
        setSelectedKnowledgeBaseId(items[0].id);
      }
    });
  }, []);

  async function ensureSession(knowledgeBaseId: number) {
    if (session && session.knowledge_base_id === knowledgeBaseId) {
      return session.id;
    }
    const created = await createSession({
      knowledge_base_id: knowledgeBaseId,
      title: "新会话",
    });
    const detail = await fetchSession(created.id);
    setSession(detail);
    return created.id;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!question.trim() || !selectedKnowledgeBaseId) {
      return;
    }
    setSubmitting(true);
    try {
      const sessionId = await ensureSession(selectedKnowledgeBaseId);
      const result = await askQuestion({
        session_id: sessionId,
        knowledge_base_id: selectedKnowledgeBaseId,
        question,
        top_k: 4,
      });
      setAnswer(result.answer);
      setCitations(result.citations);
      setRetrievedChunks(result.retrieved_chunks);
      setQuestion("");
      const detail = await fetchSession(sessionId);
      setSession(detail);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[0.9fr_1.4fr_1fr]">
      <SectionCard title="会话" description="左侧展示会话与消息快照。">
        {session ? (
          <div className="space-y-3">
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="font-semibold text-ink">{session.title}</p>
              <p className="mt-1 text-xs text-slate-500">Session #{session.id}</p>
            </div>
            {session.messages.map((message) => (
              <div key={message.id} className="rounded-2xl border border-slate-200 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{message.role}</p>
                <p className="mt-2 text-sm leading-6 text-slate-700">{message.content}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-500">创建首个提问后会自动生成会话。</p>
        )}
      </SectionCard>

      <SectionCard title="智能问答" description="当前已打通提问、会话创建与占位答案返回。">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-600">知识库</span>
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
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-600">问题</span>
            <textarea
              className="min-h-40 w-full rounded-3xl border border-slate-200 px-4 py-3 outline-none ring-bank-500 transition focus:ring-2"
              placeholder="例如：信用卡年费减免规则是什么？"
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
            />
          </label>
          <button
            className="rounded-full bg-bank-700 px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-300"
            type="submit"
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "提交问题"}
          </button>
        </form>

        {answer ? (
          <div className="mt-6 rounded-3xl bg-slate-50 p-5">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Answer</p>
            <p className="mt-3 text-sm leading-7 text-slate-700">{answer}</p>
          </div>
        ) : null}
      </SectionCard>

      <SectionCard title="引用与检索结果" description="右侧保留 citations 和 retrieved chunks 的渲染位置。">
        <div className="space-y-4">
          <div>
            <p className="mb-2 text-sm font-semibold text-ink">Citations</p>
            <div className="space-y-3">
              {citations.length === 0 ? (
                <p className="text-sm text-slate-500">暂无引用。</p>
              ) : (
                citations.map((item) => (
                  <div key={`${item.document_name}-${item.chunk_index}`} className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-sm font-medium text-ink">{item.document_name}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      Chunk #{item.chunk_index}
                      {item.page_number ? ` · 第 ${item.page_number} 页` : ""}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{item.snippet_text}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          <div>
            <p className="mb-2 text-sm font-semibold text-ink">Retrieved Chunks</p>
            <div className="space-y-3">
              {retrievedChunks.length === 0 ? (
                <p className="text-sm text-slate-500">暂无检索结果。</p>
              ) : (
                retrievedChunks.map((item) => (
                  <div key={`${item.document_name}-${item.chunk_index}`} className="rounded-2xl border border-slate-200 p-4">
                    <p className="text-sm font-medium text-ink">{item.document_name}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      Score {item.score.toFixed(2)}
                      {item.page_number ? ` · 第 ${item.page_number} 页` : ""}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{item.content}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
