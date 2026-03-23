import { Link } from "react-router-dom";

import { SectionCard } from "../components/SectionCard";

const features = [
  "文档上传、解析、切块、索引的完整 RAG 入口",
  "基于知识库选择的多轮问答与引用展示",
  "会话持久化、文档管理和监控指标预留",
];

const useCases = [
  "员工制度问答",
  "产品知识问答",
  "客服辅助应答",
  "运营知识检索",
  "合规制度查询",
];

export function LandingPage() {
  return (
    <div className="space-y-8">
      <section className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="rounded-[2rem] bg-bank-900 px-8 py-10 text-white shadow-panel">
          <p className="text-sm uppercase tracking-[0.34em] text-gold">Project Overview</p>
          <h2 className="mt-4 max-w-2xl text-4xl font-bold leading-tight">
            面向银行业务场景的可部署知识库问答系统
          </h2>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-200">
            当前版本已完成前后端脚手架初始化，后续可在此基础上接入文档解析、向量检索、
            模型调用与可追溯引用能力。
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link className="rounded-full bg-gold px-5 py-3 text-sm font-semibold text-bank-900" to="/chat">
              进入问答页
            </Link>
            <Link
              className="rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white"
              to="/knowledge-bases"
            >
              管理知识库
            </Link>
          </div>
        </div>
        <SectionCard title="核心场景" description="业务范围已按规划文件拆分为可扩展页面。">
          <div className="grid gap-3">
            {useCases.map((item) => (
              <div key={item} className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
                {item}
              </div>
            ))}
          </div>
        </SectionCard>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        {features.map((feature) => (
          <SectionCard key={feature} title="能力占位">
            <p className="text-sm leading-7 text-slate-600">{feature}</p>
          </SectionCard>
        ))}
      </section>
    </div>
  );
}
