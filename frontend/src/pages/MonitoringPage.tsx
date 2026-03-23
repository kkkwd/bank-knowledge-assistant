import { fetchMetricsOverview, fetchRecentQuestions } from "../api/dashboard";
import { SectionCard } from "../components/SectionCard";
import { useAsync } from "../hooks/useAsync";

const metricLabels: Record<string, string> = {
  document_count: "文档总数",
  session_count: "会话数",
  message_count: "消息数",
  indexed_document_count: "已索引文档",
  chunk_count: "Chunk 总数",
};

export function MonitoringPage() {
  const metrics = useAsync(fetchMetricsOverview, []);
  const questions = useAsync(fetchRecentQuestions, []);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-5">
        {metrics.data
          ? Object.entries(metrics.data).map(([key, value]) => (
              <SectionCard key={key} title={metricLabels[key] ?? key}>
                <p className="text-3xl font-bold text-bank-700">{value}</p>
              </SectionCard>
            ))
          : null}
      </div>

      <SectionCard title="最近问题" description="来自会话消息表的最近用户提问。">
        {questions.loading ? <p className="text-sm text-slate-500">Loading recent questions...</p> : null}
        {questions.error ? <p className="text-sm text-red-600">{questions.error}</p> : null}
        <div className="space-y-3">
          {questions.data?.length ? (
            questions.data.map((item) => (
              <div key={item} className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
                {item}
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-500">暂无数据。</p>
          )}
        </div>
      </SectionCard>
    </div>
  );
}
