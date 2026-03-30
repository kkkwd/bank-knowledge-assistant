import { PointerEvent, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

const featureCards = [
  {
    eyebrow: "Current Stage",
    title: "前后端基础骨架已经打通",
    description:
      "当前版本已完成前后端脚手架初始化、页面路由组织、问答入口联调与管理侧基础结构，适合作为后续能力接入的稳定底座。",
    accent: "from-bank-900 via-bank-700 to-bank-500",
  },
  {
    eyebrow: "Next Step",
    title: "文档解析与向量检索即将接入",
    description:
      "后续将在此基础上补全文档解析、文本切块、Embedding、召回排序与知识库粒度隔离，形成完整的检索增强问答链路。",
    accent: "from-slate-900 via-slate-700 to-slate-500",
  },
  {
    eyebrow: "Traceability",
    title: "模型回答与引用追溯能力预留完成",
    description:
      "页面结构已为模型调用、引用片段展示和可追溯答案留出展示区，后续可直接扩展来源定位、证据高亮与结果审计。",
    accent: "from-[#7c5b12] via-[#b88921] to-gold",
  },
];

const scenarioCards = [
  {
    title: "员工制度问答",
    description: "聚合人事、财务、IT 与合规制度，降低内部流程咨询的响应成本。",
  },
  {
    title: "产品知识问答",
    description: "统一存款、贷款、理财与信用卡资料，支持客户经理快速给出一致口径。",
  },
  {
    title: "客服辅助应答",
    description: "基于标准话术和业务规则检索答案，减少一线客服在多系统之间跳转。",
  },
  {
    title: "运营知识检索",
    description: "针对活动、风控、渠道与配置手册建立知识视图，提升运营排障效率。",
  },
  {
    title: "合规制度查询",
    description: "围绕监管要求、内控流程与审计材料提供可追溯查询入口。",
  },
];

const metrics = [
  { label: "交互入口", value: "3+" },
  { label: "主流程页面", value: "问答 / 监控 / 管理" },
  { label: "下一阶段", value: "检索增强 + 引用回溯" },
];

export function LandingPage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef<number | null>(null);
  const dragDeltaX = useRef(0);

  useEffect(() => {
    if (isDragging) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % featureCards.length);
    }, 3600);

    return () => window.clearInterval(timer);
  }, [isDragging]);

  function clampIndex(index: number) {
    return Math.max(0, Math.min(featureCards.length - 1, index));
  }

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    dragStartX.current = event.clientX;
    dragDeltaX.current = 0;
    setIsDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (dragStartX.current === null) {
      return;
    }

    const deltaX = event.clientX - dragStartX.current;
    dragDeltaX.current = deltaX;
    setDragOffset(deltaX);
  }

  function finishDrag(pointerId?: number, currentTarget?: HTMLDivElement) {
    if (dragStartX.current === null) {
      return;
    }

    const swipeThreshold = 70;
    const deltaX = dragDeltaX.current;

    if (pointerId !== undefined && currentTarget?.hasPointerCapture(pointerId)) {
      currentTarget.releasePointerCapture(pointerId);
    }

    if (Math.abs(deltaX) > swipeThreshold) {
      setActiveIndex((current) => clampIndex(current + (deltaX < 0 ? 1 : -1)));
    }

    dragStartX.current = null;
    dragDeltaX.current = 0;
    setDragOffset(0);
    setIsDragging(false);
  }

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-[2rem] border border-white/70 bg-[linear-gradient(135deg,_rgba(16,47,36,0.98)_0%,_rgba(21,83,61,0.94)_35%,_rgba(239,247,243,0.96)_130%)] shadow-panel">
        <div className="grid gap-8 px-5 py-7 sm:px-8 sm:py-10 lg:grid-cols-[1.2fr_0.8fr] lg:px-10 lg:py-12">
          <div className="relative">
            <div className="pointer-events-none absolute -left-16 top-0 h-40 w-40 rounded-full bg-gold/20 blur-3xl" />
            <p className="relative text-xs uppercase tracking-[0.24em] text-gold sm:text-sm sm:tracking-[0.34em]">
              Banking RAG Demo
            </p>
            <div className="relative mt-4 flex flex-wrap gap-2">
              <span className="rounded-full border border-gold/40 bg-gold/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-gold sm:text-xs">
                个人简历展示项目
              </span>
              <span className="rounded-full border border-white/16 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-50/90 sm:text-xs">
                Non-Commercial Use Only
              </span>
            </div>
            <h2 className="relative mt-4 max-w-3xl text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
              银行知识库智能问答助手
            </h2>
            <p className="relative mt-5 max-w-2xl text-sm leading-7 text-emerald-50/90 lg:text-base">
              该站点用于展示银行知识库问答、检索增强与前后端联调能力，定位为个人简历项目作品集页面。
              当前版本已完成基础页面联调与交互骨架搭建，后续可继续扩展文档解析、向量检索、模型调用与可追溯引用能力。
            </p>
            <div className="relative mt-5 rounded-[1.5rem] border border-white/12 bg-black/10 px-4 py-4 backdrop-blur-sm">
              <p className="text-sm font-semibold text-white">使用说明</p>
              <p className="mt-2 text-sm leading-7 text-emerald-50/85">
                本项目仅供个人学习、作品展示与简历投递场景使用，无商业用途；页面内容与文案禁止摘抄、搬运或对外宣传。
              </p>
            </div>
            <div className="relative mt-8 flex flex-wrap gap-3">
              <Link
                className="rounded-full bg-gold px-5 py-3 text-sm font-semibold text-bank-900 transition hover:scale-[1.03] hover:shadow-lg"
                to="/chat"
              >
                进入问答页
              </Link>
              <Link
                className="rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/16"
                to="/monitoring"
              >
                查看监控页
              </Link>
            </div>
            <div className="relative mt-10 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
              {metrics.map((item) => (
                <div key={item.label} className="rounded-3xl border border-white/12 bg-white/10 px-4 py-4 backdrop-blur-sm">
                  <p className="text-xs uppercase tracking-[0.18em] text-emerald-100/70">{item.label}</p>
                  <p className="mt-2 text-sm font-semibold text-white">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute right-0 top-0 h-36 w-36 rounded-full bg-white/10 blur-3xl" />
            <div className="relative rounded-[2rem] border border-white/12 bg-white/10 p-4 backdrop-blur-md sm:p-5">
              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white">能力演进</p>
                  <p className="mt-1 text-xs text-emerald-100/70">当前阶段与下一步重点能力</p>
                </div>
                <div className="flex gap-2">
                  {featureCards.map((_, index) => (
                    <button
                      key={index}
                      aria-label={`切换到第 ${index + 1} 张卡片`}
                      className={[
                        "h-2.5 rounded-full transition-all",
                        activeIndex === index ? "w-8 bg-gold" : "w-2.5 bg-white/35 hover:bg-white/55",
                      ].join(" ")}
                      type="button"
                      onClick={() => setActiveIndex(index)}
                    />
                  ))}
                </div>
              </div>

              <div
                className="landing-carousel overflow-hidden"
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={(event) => finishDrag(event.pointerId, event.currentTarget)}
                onPointerCancel={(event) => finishDrag(event.pointerId, event.currentTarget)}
                onPointerLeave={(event) => {
                  if (isDragging) {
                    finishDrag(event.pointerId, event.currentTarget);
                  }
                }}
              >
                <div
                  className={`flex ${isDragging ? "" : "transition-transform duration-700 ease-out"}`}
                  style={{
                    transform: `translateX(calc(-${activeIndex * 100}% + ${dragOffset}px))`,
                  }}
                >
                  {featureCards.map((card) => (
                    <article key={card.title} className="w-full shrink-0 pr-1">
                      <div className={`rounded-[1.75rem] bg-gradient-to-br ${card.accent} p-[1px]`}>
                        <div className="rounded-[calc(1.75rem-1px)] bg-slate-950/72 px-4 py-5 sm:px-5 sm:py-6">
                          <p className="text-xs uppercase tracking-[0.2em] text-white/55">{card.eyebrow}</p>
                          <h3 className="mt-3 text-xl font-semibold leading-tight text-white sm:text-2xl">{card.title}</h3>
                          <p className="mt-4 text-sm leading-7 text-slate-200">{card.description}</p>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.82fr_1.18fr]">
        <div className="rounded-[2rem] border border-white/70 bg-white/80 p-5 shadow-panel backdrop-blur sm:p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-bank-700">Roadmap Snapshot</p>
          <h3 className="mt-3 text-xl font-semibold text-ink sm:text-2xl">从脚手架到银行级知识问答闭环</h3>
          <div className="mt-6 space-y-4">
            <div className="rounded-3xl border border-bank-100 bg-bank-50/70 p-4">
              <p className="text-sm font-semibold text-bank-900">已完成</p>
              <p className="mt-2 text-sm leading-7 text-slate-700">
                前端工作台、问答页、监控页、管理入口与基础 API 联调已经完成，当前可作为持续扩展的演示底座。
              </p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50/80 p-4">
              <p className="text-sm font-semibold text-ink">规划中</p>
              <p className="mt-2 text-sm leading-7 text-slate-700">
                文档上传解析、切块向量化、召回重排、模型接入、来源引用、片段定位与结果审计能力将逐步补齐。
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/70 bg-white/85 p-5 shadow-panel backdrop-blur sm:p-6">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div className="min-w-0">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-bank-700">核心场景</p>
              <h3 className="mt-3 text-xl font-semibold text-ink sm:text-2xl">围绕银行内部知识协同设计的典型落点</h3>
            </div>
            <p className="hidden max-w-xs text-sm leading-6 text-slate-500 lg:block">
              将鼠标移动到卡片上查看放大聚焦效果，便于突出主场景优先级。
            </p>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {scenarioCards.map((item) => (
              <article
                key={item.title}
                className="group relative overflow-hidden rounded-[1.75rem] border border-slate-200 bg-[linear-gradient(180deg,_rgba(255,255,255,0.96)_0%,_rgba(241,247,244,0.92)_100%)] p-5 transition duration-300 hover:-translate-y-1 hover:scale-[1.035] hover:border-bank-100 hover:shadow-[0_18px_45px_rgba(21,83,61,0.15)]"
              >
                <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-bank-100/40 blur-2xl transition duration-300 group-hover:bg-gold/20" />
                <p className="relative text-lg font-semibold text-ink transition duration-300 group-hover:text-bank-900">
                  {item.title}
                </p>
                <p className="relative mt-3 text-sm leading-7 text-slate-600 transition duration-300 group-hover:text-slate-700">
                  {item.description}
                </p>
                <div className="relative mt-5 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-bank-700/80">
                  <span className="h-2 w-2 rounded-full bg-bank-500 transition duration-300 group-hover:scale-125 group-hover:bg-gold" />
                  场景聚焦
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
