import { fetchKnowledgeBases } from "../api/knowledgeBase";
import { SectionCard } from "../components/SectionCard";
import { useAsync } from "../hooks/useAsync";

export function KnowledgeBasePage() {
  const { data, loading, error } = useAsync(fetchKnowledgeBases, []);

  return (
    <div className="space-y-6">
      <SectionCard
        title="知识库管理"
        description="当前阶段已接通知识库列表接口，文档上传和索引流程将在后续迭代接入。"
      >
        {loading ? <p className="text-sm text-slate-500">Loading knowledge bases...</p> : null}
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        {data ? (
          <div className="overflow-hidden rounded-2xl border border-slate-200">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-medium">名称</th>
                  <th className="px-4 py-3 font-medium">编码</th>
                  <th className="px-4 py-3 font-medium">描述</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {data.map((item) => (
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
      </SectionCard>
    </div>
  );
}
