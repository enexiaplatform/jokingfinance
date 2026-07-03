import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Brain,
  CheckCircle2,
  ListChecks,
  Sparkles,
  Target,
} from "lucide-react";
import { SaveContentButton } from "@/components/app/save-content-button";
import { buildKnowledgeLesson } from "@/data/knowledge-lessons";
import { KnowledgeQuickCheck } from "@/components/marketing/knowledge-quick-check";
import { KnowledgeModuleProgress } from "@/components/marketing/knowledge-module-progress";
import { PublicFooter } from "@/components/marketing/public-footer";
import { PublicNav } from "@/components/marketing/public-nav";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button-link";
import {
  getKnowledgeModule,
  getKnowledgeModuleParams,
  getKnowledgeModuleUrl,
  knowledgeLevelLabels,
} from "@/data/knowledge-library";
import { getSiteUrl } from "@/lib/site-url";

type KnowledgeModulePageProps = {
  params: Promise<{
    pillarSlug: string;
    moduleSlug: string;
  }>;
};

export function generateStaticParams() {
  return getKnowledgeModuleParams();
}

export async function generateMetadata({ params }: KnowledgeModulePageProps) {
  const { pillarSlug, moduleSlug } = await params;
  const result = getKnowledgeModule(pillarSlug, moduleSlug);

  return {
    title: result
      ? `${result.knowledgeModule.title} - ${result.pillar.title} - JokingFinance`
      : "Bài học kiến thức - JokingFinance",
    description: result?.knowledgeModule.goal,
    alternates: {
      canonical: new URL(
        `/knowledge/${pillarSlug}/${moduleSlug}`,
        getSiteUrl(),
      ).toString(),
    },
  };
}

export default async function KnowledgeModulePage({ params }: KnowledgeModulePageProps) {
  const { pillarSlug, moduleSlug } = await params;
  const result = getKnowledgeModule(pillarSlug, moduleSlug);

  if (!result) {
    notFound();
  }

  const { pillar, knowledgeModule } = result;
  const lesson = buildKnowledgeLesson(pillar, knowledgeModule);
  const moduleIndex = pillar.modules.findIndex((item) => item.title === knowledgeModule.title);
  const previousModule = moduleIndex > 0 ? pillar.modules[moduleIndex - 1] : null;
  const nextModule =
    moduleIndex < pillar.modules.length - 1 ? pillar.modules[moduleIndex + 1] : null;
  const keyQuestions = [
    `Vì sao "${knowledgeModule.title}" lại quan trọng trong trụ cột ${pillar.title}?`,
    "Dữ liệu hoặc dấu hiệu nào có thể giúp mình kiểm chứng điều này?",
    "Nếu hiểu sai phần này, quyết định tài chính của mình có thể lệch ở đâu?",
  ];
  const commonMistakes = [
    "Nhớ thuật ngữ nhưng không biết áp dụng vào một tình huống thật.",
    "Kết luận quá nhanh từ một con số hoặc một tin tức riêng lẻ.",
    "Bỏ qua rủi ro và điều kiện làm cho giả thuyết ban đầu sai.",
  ];

  return (
    <>
      <PublicNav />
      <main className="bg-[#fffdf8]">
        <section className="border-b border-[#d9ddd3] bg-[#edf5ee] px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <Link
              href={`/knowledge#${pillar.slug}`}
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#0f766e] hover:text-[#115e59]"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Quay lại thư viện
            </Link>
            <div className="mt-6 flex flex-wrap items-center gap-2">
              <Badge tone="green">{pillar.title}</Badge>
              <Badge tone={pillar.level === "advanced" ? "blue" : "neutral"}>
                {knowledgeLevelLabels[pillar.level]}
              </Badge>
            </div>
            <h1 className="mt-5 text-4xl font-black leading-tight tracking-normal text-[#17201b] md:text-5xl">
              {knowledgeModule.title}
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-[#43534a]">
              {knowledgeModule.goal}
            </p>
            <div className="mt-6">
              <SaveContentButton
                id={`knowledge:${pillar.slug}/${moduleSlug}`}
                kind="knowledge"
                title={knowledgeModule.title}
                summary={knowledgeModule.goal}
                href={`/knowledge/${pillar.slug}/${moduleSlug}`}
              />
            </div>
          </div>
        </section>

        <section className="px-4 py-10 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div className="grid gap-6">
              <article className="rounded-md border border-[#e0e5dc] bg-white p-5 shadow-sm">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-[#0f766e]" aria-hidden="true" />
                  <h2 className="text-2xl font-bold text-[#17201b]">Bạn cần nắm gì?</h2>
                </div>
                <p className="mt-4 leading-7 text-[#4c5d54]">
                  Module này giúp bạn chuyển từ việc nghe một khái niệm sang biết
                  đặt câu hỏi và dùng nó trong quyết định mô phỏng. Hãy đọc chậm,
                  ghi lại điều chưa rõ, rồi áp dụng vào bài thực hành ở cuối trang.
                </p>
                <div className="mt-5 grid gap-3 md:grid-cols-2">
                  {knowledgeModule.topics.map((topic) => (
                    <div key={topic} className="rounded-md border border-[#e0e5dc] bg-[#fffdf8] p-3">
                      <p className="font-semibold text-[#17201b]">{topic}</p>
                      <p className="mt-1 text-sm leading-6 text-[#5b6861]">
                        Hãy tự giải thích khái niệm này bằng một ví dụ gần với tiền,
                        doanh nghiệp hoặc danh mục của bạn.
                      </p>
                    </div>
                  ))}
                </div>
              </article>

              <article className="rounded-md border border-[#d0ded3] bg-[#f2fbf4] p-5 shadow-sm">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-[#0f766e]" aria-hidden="true" />
                  <h2 className="text-2xl font-bold text-[#17201b]">Ý chính của module</h2>
                </div>
                <p className="mt-4 text-lg font-semibold leading-8 text-[#17201b]">
                  {lesson.bigIdea}
                </p>
                <div className="mt-4 rounded-md border border-[#b9d9c5] bg-white p-4">
                  <div className="flex items-start gap-3">
                    <Brain className="mt-0.5 h-5 w-5 shrink-0 text-[#0f766e]" aria-hidden="true" />
                    <div>
                      <h3 className="font-bold text-[#17201b]">Mô hình tư duy</h3>
                      <p className="mt-2 text-sm leading-6 text-[#4c5d54]">{lesson.mentalModel}</p>
                    </div>
                  </div>
                </div>
              </article>

              <article className="rounded-md border border-[#e0e5dc] bg-white p-5 shadow-sm">
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-[#0f766e]" aria-hidden="true" />
                  <h2 className="text-2xl font-bold text-[#17201b]">Khung tư duy</h2>
                </div>
                <div className="mt-4 grid gap-4">
                  <div className="rounded-md border border-[#e0e5dc] bg-[#fffdf8] p-4">
                    <h3 className="font-bold text-[#17201b]">1. Định nghĩa bằng lời của mình</h3>
                    <p className="mt-2 text-sm leading-6 text-[#5b6861]">
                      Trước khi dùng một chỉ số hay khái niệm, hãy viết lại bằng
                      một câu đơn giản. Nếu không giải thích được, chưa nên dùng nó
                      làm lý do mua bán.
                    </p>
                  </div>
                  <div className="rounded-md border border-[#e0e5dc] bg-[#fffdf8] p-4">
                    <h3 className="font-bold text-[#17201b]">2. Gắn với dữ liệu hoặc hành vi</h3>
                    <p className="mt-2 text-sm leading-6 text-[#5b6861]">
                      Một bài học chỉ hữu ích khi nó giúp bạn nhìn dữ liệu rõ hơn:
                      bảng giá, báo cáo tài chính, tin thị trường, dòng tiền hoặc
                      chính cảm xúc của mình.
                    </p>
                  </div>
                  <div className="rounded-md border border-[#e0e5dc] bg-[#fffdf8] p-4">
                    <h3 className="font-bold text-[#17201b]">3. Viết điều kiện sai</h3>
                    <p className="mt-2 text-sm leading-6 text-[#5b6861]">
                      Mỗi kết luận đều cần một điều kiện làm nó sai. Viết điều kiện
                      đó trước khi tăng tỷ trọng hoặc chuyển từ mô phỏng sang tiền thật.
                    </p>
                  </div>
                </div>
              </article>

              <section className="grid gap-4">
                {lesson.sections.map((section) => (
                  <article key={section.title} className="rounded-md border border-[#e0e5dc] bg-white p-5 shadow-sm">
                    <h2 className="text-2xl font-bold text-[#17201b]">{section.title}</h2>
                    <p className="mt-3 leading-7 text-[#4c5d54]">{section.body}</p>
                    <ul className="mt-4 grid gap-3">
                      {section.bullets.map((bullet) => (
                        <li key={bullet} className="flex gap-3 text-sm leading-6 text-[#4c5d54]">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#0f766e]" aria-hidden="true" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </article>
                ))}
              </section>

              <article className="rounded-md border border-[#e0e5dc] bg-white p-5 shadow-sm">
                <div className="flex items-center gap-2">
                  <ListChecks className="h-5 w-5 text-[#0f766e]" aria-hidden="true" />
                  <h2 className="text-2xl font-bold text-[#17201b]">Bài thực hành</h2>
                </div>
                <p className="mt-4 rounded-md border border-[#b9d9c5] bg-[#f2fbf4] p-4 font-semibold leading-7 text-[#17201b]">
                  {knowledgeModule.practice}
                </p>
                <h3 className="mt-6 font-bold text-[#17201b]">Câu hỏi tự kiểm tra</h3>
                <ul className="mt-3 space-y-3">
                  {keyQuestions.map((question) => (
                    <li key={question} className="flex gap-3 text-sm leading-6 text-[#4c5d54]">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#0f766e]" aria-hidden="true" />
                      <span>{question}</span>
                    </li>
                  ))}
                </ul>
                <h3 className="mt-6 font-bold text-[#17201b]">Sai lầm dễ gặp</h3>
                <ul className="mt-3 space-y-3">
                  {commonMistakes.map((mistake) => (
                    <li key={mistake} className="flex gap-3 text-sm leading-6 text-[#4c5d54]">
                      <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#d97706]" />
                      <span>{mistake}</span>
                    </li>
                  ))}
                </ul>
              </article>

              <article className="rounded-md border border-[#b9d9c5] bg-[#f2fbf4] p-5 shadow-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-[#0f766e]" aria-hidden="true" />
                  <h2 className="text-2xl font-bold text-[#17201b]">Checklist hoàn thành</h2>
                </div>
                <ul className="mt-4 grid gap-3">
                  {lesson.checklist.map((item) => (
                    <li key={item} className="flex gap-3 text-sm leading-6 text-[#4c5d54]">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#0f766e]" aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </article>

              <KnowledgeQuickCheck
                pillarSlug={pillar.slug}
                moduleSlug={moduleSlug}
                questions={lesson.quickChecks}
              />
            </div>

            <aside className="space-y-5">
              <KnowledgeModuleProgress pillarSlug={pillar.slug} moduleSlug={moduleSlug} />

              <div className="rounded-md border border-[#d0ded3] bg-white p-5 shadow-sm">
                <h2 className="text-xl font-bold text-[#17201b]">Đi tiếp</h2>
                <div className="mt-4 grid gap-3">
                  {previousModule ? (
                    <ButtonLink
                      href={getKnowledgeModuleUrl(pillar, previousModule)}
                      variant="secondary"
                      className="justify-start"
                    >
                      Bài trước
                    </ButtonLink>
                  ) : null}
                  {nextModule ? (
                    <ButtonLink
                      href={getKnowledgeModuleUrl(pillar, nextModule)}
                      className="justify-start"
                    >
                      Bài tiếp theo
                    </ButtonLink>
                  ) : (
                    <ButtonLink href="/articles" className="justify-start">
                      Sang bài học liên quan
                    </ButtonLink>
                  )}
                </div>
              </div>

              <div className="rounded-md border border-[#e0e5dc] bg-white p-5 shadow-sm">
                <h2 className="text-xl font-bold text-[#17201b]">Liên kết liên quan</h2>
                <div className="mt-4 grid gap-3">
                  {knowledgeModule.relatedArticleSlugs?.map((slug) => (
                    <Link
                      key={slug}
                      href={`/articles/${slug}`}
                      className="inline-flex items-center justify-between gap-2 rounded-md border border-[#e0e5dc] bg-[#fffdf8] px-3 py-2 text-sm font-semibold text-[#0f766e] hover:border-[#0f766e]"
                    >
                      Bài học chi tiết
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  ))}
                  {knowledgeModule.relatedMissionSlugs?.map((slug) => (
                    <Link
                      key={slug}
                      href={`/missions/${slug}`}
                      className="inline-flex items-center justify-between gap-2 rounded-md border border-[#e0e5dc] bg-[#fffdf8] px-3 py-2 text-sm font-semibold text-[#0f766e] hover:border-[#0f766e]"
                    >
                      Nhiệm vụ luyện tập
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  ))}
                  {!knowledgeModule.relatedArticleSlugs?.length && !knowledgeModule.relatedMissionSlugs?.length ? (
                    <p className="text-sm leading-6 text-[#5b6861]">
                      Module này chưa có bài hoặc nhiệm vụ riêng. Nó đã nằm trong
                      roadmap để mở rộng nội dung chi tiết sau.
                    </p>
                  ) : null}
                </div>
              </div>
            </aside>
          </div>
        </section>
      </main>
      <PublicFooter />
    </>
  );
}
