import Link from "next/link";
import { ArrowRight, BookOpen, CheckCircle2, Clock, Layers3, Target } from "lucide-react";
import { KnowledgePillarProgress } from "@/components/marketing/knowledge-pillar-progress";
import { PublicFooter } from "@/components/marketing/public-footer";
import { PublicNav } from "@/components/marketing/public-nav";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button-link";
import { knowledgePlaybooks } from "@/data/knowledge-playbooks";
import {
  glossaryTerms,
  createKnowledgeSlug,
  getKnowledgeModuleUrl,
  knowledgeLevelLabels,
  knowledgePillars,
  knowledgeRoadmap,
} from "@/data/knowledge-library";

export const metadata = {
  title: "Thư viện kiến thức - JokingFinance",
  description:
    "Bản đồ kiến thức tài chính, chứng khoán, danh mục, rủi ro và tâm lý đầu tư cho người mới.",
};

function countModules() {
  return knowledgePillars.reduce((total, pillar) => total + pillar.modules.length, 0);
}

function countTopics() {
  return knowledgePillars.reduce(
    (total, pillar) =>
      total +
      pillar.modules.reduce(
        (moduleTotal, knowledgeModule) => moduleTotal + knowledgeModule.topics.length,
        0,
      ),
    0,
  );
}

function totalHours() {
  return knowledgePillars.reduce((total, pillar) => total + pillar.estimatedHours, 0);
}

export default function KnowledgePage() {
  const stats = [
    { label: "Trụ cột kiến thức", value: knowledgePillars.length },
    { label: "Module học", value: countModules() },
    { label: "Chủ đề nhỏ", value: countTopics() },
    { label: "Giờ học ước tính", value: totalHours() },
  ];

  return (
    <>
      <PublicNav />
      <main className="bg-[#fffdf8]">
        <section className="border-b border-[#d9ddd3] bg-[#edf5ee] px-4 py-14 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
            <div>
              <Badge tone="green">Thư viện kiến thức</Badge>
              <h1 className="mt-4 max-w-4xl text-4xl font-black leading-tight tracking-normal text-[#17201b] md:text-5xl">
                Bản đồ học tài chính từ nền tảng đến luyện danh mục.
              </h1>
              <p className="mt-5 max-w-3xl text-lg leading-8 text-[#43534a]">
                Thay vì đọc ngẫu hứng, thư viện này chia kiến thức thành các trụ cột
                rõ ràng: tiền cá nhân, chứng khoán, báo cáo tài chính, định giá,
                ngành, danh mục, rủi ro, tâm lý, dữ liệu và vĩ mô.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <ButtonLink href="/articles">Đọc bài học</ButtonLink>
                <ButtonLink href="/tracks/doc-lai-suat-nhu-nguoi-quan-ly-tien" variant="secondary">
                  Bắt đầu một lộ trình
                </ButtonLink>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {stats.map((item) => (
                <div key={item.label} className="rounded-md border border-[#d0ded3] bg-white p-4 shadow-sm">
                  <p className="text-3xl font-black text-[#0f766e]">{item.value}</p>
                  <p className="mt-1 text-sm leading-5 text-[#5b6861]">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-[#e0e5dc] bg-white px-4 py-10 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-[#0f766e]" aria-hidden="true" />
              <h2 className="text-2xl font-bold text-[#17201b]">Roadmap học logic</h2>
            </div>
            <div className="mt-6 grid gap-4 lg:grid-cols-5">
              {knowledgeRoadmap.map((step, index) => (
                <article key={step.title} className="rounded-md border border-[#dce4da] bg-[#fffdf8] p-4">
                  <p className="text-xs font-bold uppercase text-[#0f766e]">Chặng {index + 1}</p>
                  <h3 className="mt-2 text-base font-bold leading-6 text-[#17201b]">{step.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#5b6861]">{step.description}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {step.pillarSlugs.map((slug) => {
                      const pillar = knowledgePillars.find((item) => item.slug === slug);
                      return pillar ? (
                        <a
                          key={slug}
                          href={`#${slug}`}
                          className="rounded-full border border-[#d7ded5] bg-white px-2.5 py-1 text-xs font-semibold text-[#4a5a52] hover:border-[#0f766e]"
                        >
                          {pillar.title}
                        </a>
                      ) : null;
                    })}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <Badge tone="gold">Kho nội dung lõi</Badge>
                <h2 className="mt-3 text-3xl font-bold tracking-normal text-[#17201b]">
                  10 trụ cột kiến thức chính
                </h2>
              </div>
              <p className="max-w-2xl text-sm leading-6 text-[#5b6861]">
                Mỗi trụ cột có mục tiêu, thời lượng, module, chủ đề nhỏ và bài thực hành.
                Đây là khung để mở rộng thành nhiều bài viết, nhiệm vụ và mô phỏng sau này.
              </p>
            </div>

            <div className="mt-8 grid gap-6">
              {knowledgePillars.map((pillar, index) => (
                <article
                  key={pillar.slug}
                  id={pillar.slug}
                  className="rounded-md border border-[#dce4da] bg-white p-5 shadow-sm scroll-mt-28"
                >
                  <div className="grid gap-5 lg:grid-cols-[280px_minmax(0,1fr)]">
                    <div>
                      <p className="text-xs font-bold uppercase text-[#0f766e]">
                        Trụ cột {index + 1}
                      </p>
                      <h3 className="mt-2 text-2xl font-black leading-8 text-[#17201b]">
                        {pillar.title}
                      </h3>
                      <p className="mt-3 text-sm leading-6 text-[#5b6861]">{pillar.summary}</p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <Badge tone={pillar.level === "advanced" ? "blue" : "green"}>
                          {knowledgeLevelLabels[pillar.level]}
                        </Badge>
                        <span className="inline-flex items-center gap-1 rounded-full border border-[#d7ded5] bg-[#fffdf8] px-2.5 py-1 text-xs font-semibold text-[#4a5a52]">
                          <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                          {pillar.estimatedHours} giờ
                        </span>
                      </div>
                      <div className="mt-4 rounded-md border border-[#b9d9c5] bg-[#f2fbf4] p-3">
                        <p className="flex gap-2 text-sm font-semibold leading-6 text-[#17201b]">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#0f766e]" aria-hidden="true" />
                          {pillar.learnerOutcome}
                        </p>
                      </div>
                      <KnowledgePillarProgress
                        pillarSlug={pillar.slug}
                        moduleSlugs={pillar.modules.map((knowledgeModule) =>
                          createKnowledgeSlug(knowledgeModule.title),
                        )}
                      />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      {pillar.modules.map((knowledgeModule) => (
                        <div key={knowledgeModule.title} className="rounded-md border border-[#e0e5dc] bg-[#fffdf8] p-4">
                          <div className="flex items-center gap-2">
                            <BookOpen className="h-4 w-4 text-[#0f766e]" aria-hidden="true" />
                            <h4 className="text-base font-bold leading-6 text-[#17201b]">
                              {knowledgeModule.title}
                            </h4>
                          </div>
                          <p className="mt-2 text-sm leading-6 text-[#5b6861]">{knowledgeModule.goal}</p>
                          <div className="mt-3 flex flex-wrap gap-2">
                            {knowledgeModule.topics.map((topic) => (
                              <span
                                key={topic}
                                className="rounded-full border border-[#d7ded5] bg-white px-2.5 py-1 text-xs font-semibold text-[#4a5a52]"
                              >
                                {topic}
                              </span>
                            ))}
                          </div>
                          <p className="mt-3 border-t border-[#e0e5dc] pt-3 text-sm leading-6 text-[#314039]">
                            <span className="font-bold">Thực hành: </span>
                            {knowledgeModule.practice}
                          </p>
                          {knowledgeModule.relatedArticleSlugs?.length || knowledgeModule.relatedMissionSlugs?.length ? (
                            <div className="mt-3 flex flex-wrap gap-3 text-sm font-semibold text-[#0f766e]">
                              {knowledgeModule.relatedArticleSlugs?.[0] ? (
                                <Link
                                  href={`/articles/${knowledgeModule.relatedArticleSlugs[0]}`}
                                  className="inline-flex items-center gap-1 hover:text-[#115e59]"
                                >
                                  Bài liên quan
                                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                                </Link>
                              ) : null}
                              {knowledgeModule.relatedMissionSlugs?.[0] ? (
                                <Link
                                  href={`/missions/${knowledgeModule.relatedMissionSlugs[0]}`}
                                  className="inline-flex items-center gap-1 hover:text-[#115e59]"
                                >
                                  Nhiệm vụ
                                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                                </Link>
                              ) : null}
                            </div>
                          ) : null}
                          <Link
                            href={getKnowledgeModuleUrl(pillar, knowledgeModule)}
                            className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#0f766e] hover:text-[#115e59]"
                          >
                            Mở bài học
                            <ArrowRight className="h-4 w-4" aria-hidden="true" />
                          </Link>
                        </div>
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-[#e0e5dc] bg-[#f2fbf4] px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <Badge tone="green">Playbook học sâu</Badge>
                <h2 className="mt-3 text-3xl font-bold tracking-normal text-[#17201b]">
                  Quy trình biến tin tức thành hiểu biết.
                </h2>
              </div>
              <p className="max-w-2xl text-sm leading-6 text-[#5b6861]">
                Mỗi playbook là một quy trình nhỏ: dùng khi nào, làm theo bước nào,
                đầu ra cần có là gì và học tiếp ở module nào.
              </p>
            </div>

            <div className="mt-8 grid gap-5 lg:grid-cols-2">
              {knowledgePlaybooks.map((playbook) => (
                <article key={playbook.slug} className="rounded-md border border-[#d0ded3] bg-white p-5 shadow-sm">
                  <h3 className="text-2xl font-bold leading-8 text-[#17201b]">{playbook.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-[#5b6861]">{playbook.summary}</p>
                  <div className="mt-4 rounded-md border border-[#b9d9c5] bg-[#f2fbf4] p-3">
                    <p className="text-sm leading-6 text-[#314039]">
                      <span className="font-bold">Dùng khi: </span>
                      {playbook.useWhen}
                    </p>
                  </div>
                  <div className="mt-5 grid gap-4 md:grid-cols-2">
                    <div>
                      <h4 className="font-bold text-[#17201b]">Các bước</h4>
                      <ol className="mt-3 grid gap-2">
                        {playbook.steps.map((step, index) => (
                          <li key={step} className="rounded-md border border-[#e0e5dc] bg-[#fffdf8] p-3 text-sm leading-6 text-[#4c5d54]">
                            {index + 1}. {step}
                          </li>
                        ))}
                      </ol>
                    </div>
                    <div>
                      <h4 className="font-bold text-[#17201b]">Đầu ra cần có</h4>
                      <ul className="mt-3 grid gap-2">
                        {playbook.outputs.map((output) => (
                          <li key={output} className="flex gap-2 rounded-md border border-[#e0e5dc] bg-[#fffdf8] p-3 text-sm leading-6 text-[#4c5d54]">
                            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#0f766e]" aria-hidden="true" />
                            <span>{output}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {playbook.links.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="inline-flex items-center gap-1 rounded-full border border-[#d7ded5] bg-[#fffdf8] px-3 py-1.5 text-xs font-bold text-[#0f766e] hover:border-[#0f766e]"
                      >
                        {link.title}
                        <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                      </Link>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-[#e0e5dc] bg-white px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="flex items-center gap-2">
              <Layers3 className="h-5 w-5 text-[#0f766e]" aria-hidden="true" />
              <h2 className="text-2xl font-bold text-[#17201b]">Từ điển nhanh</h2>
            </div>
            <div className="mt-6 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {glossaryTerms.map((item) => (
                <div key={item.term} className="rounded-md border border-[#e0e5dc] bg-[#fffdf8] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-bold text-[#17201b]">{item.term}</h3>
                    <span className="rounded-full border border-[#d7ded5] bg-white px-2 py-0.5 text-xs font-semibold text-[#66736c]">
                      {item.group}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-[#5b6861]">{item.meaning}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <PublicFooter />
    </>
  );
}
