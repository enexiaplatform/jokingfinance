import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  Lightbulb,
  Target,
} from "lucide-react";
import { SaveContentButton } from "@/components/app/save-content-button";
import { PracticeCasePlayer } from "@/components/practice-cases/practice-case-player";
import { PublicFooter } from "@/components/marketing/public-footer";
import { PublicNav } from "@/components/marketing/public-nav";
import { Badge } from "@/components/ui/badge";
import { Disclaimer } from "@/components/ui/disclaimer";
import {
  getPracticeCaseBySlug,
  practiceCaseDifficultyLabels,
  practiceCases,
} from "@/data/practice-cases";
import { getSiteUrl } from "@/lib/site-url";

type PracticeCasePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return practiceCases.map((item) => ({
    slug: item.slug,
  }));
}

export async function generateMetadata({ params }: PracticeCasePageProps) {
  const { slug } = await params;
  const practiceCase = getPracticeCaseBySlug(slug);

  return {
    title: practiceCase
      ? `${practiceCase.title} - Tình huống thực hành - JokingFinance`
      : "Tình huống thực hành - JokingFinance",
    description: practiceCase?.summary,
    alternates: {
      canonical: new URL(`/cases/${slug}`, getSiteUrl()).toString(),
    },
  };
}

export default async function PracticeCasePage({ params }: PracticeCasePageProps) {
  const { slug } = await params;
  const practiceCase = getPracticeCaseBySlug(slug);

  if (!practiceCase) {
    notFound();
  }

  const caseIndex = practiceCases.findIndex((item) => item.slug === practiceCase.slug);
  const nextCase = practiceCases[(caseIndex + 1) % practiceCases.length];

  return (
    <>
      <PublicNav />
      <main className="bg-[#fffdf8]">
        <section className="border-b border-[#d9ddd3] bg-[#edf5ee] px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <Link
              href="/cases"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#0f766e] hover:text-[#115e59]"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Quay lại thư viện tình huống
            </Link>
            <div className="mt-6 flex flex-wrap items-center gap-2">
              <Badge tone="green">{practiceCase.theme}</Badge>
              <Badge tone="neutral">
                {practiceCaseDifficultyLabels[practiceCase.difficulty]}
              </Badge>
              <span className="inline-flex items-center gap-1 text-sm font-semibold text-[#66736c]">
                <Clock className="h-4 w-4" aria-hidden="true" />
                {practiceCase.duration} phút
              </span>
            </div>
            <h1 className="mt-5 text-4xl font-black leading-tight tracking-normal text-[#17201b] md:text-5xl">
              {practiceCase.title}
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-[#43534a]">
              {practiceCase.summary}
            </p>
            <div className="mt-6">
              <SaveContentButton
                id={`case:${practiceCase.slug}`}
                kind="case"
                title={practiceCase.title}
                summary={practiceCase.summary}
                href={`/cases/${practiceCase.slug}`}
              />
            </div>
          </div>
        </section>

        <section className="px-4 py-10 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div className="grid gap-6">
              <article className="rounded-md border border-[#e0e5dc] bg-white p-5 shadow-sm">
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-[#0f766e]" aria-hidden="true" />
                  <h2 className="text-2xl font-bold text-[#17201b]">Nhiệm vụ của bạn</h2>
                </div>
                <p className="mt-4 font-semibold leading-7 text-[#17201b]">
                  {practiceCase.learnerRole}
                </p>
                <ul className="mt-4 grid gap-3">
                  {practiceCase.objectives.map((objective) => (
                    <li key={objective} className="flex gap-3 text-sm leading-6 text-[#4c5d54]">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#0f766e]" aria-hidden="true" />
                      <span>{objective}</span>
                    </li>
                  ))}
                </ul>
              </article>

              <article className="rounded-md border border-[#e2d3a7] bg-[#fff8df] p-5">
                <div className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-[#8a5a0a]" aria-hidden="true" />
                  <h2 className="text-2xl font-bold text-[#5b420b]">Dữ kiện ban đầu</h2>
                </div>
                <ul className="mt-4 grid gap-3">
                  {practiceCase.startingFacts.map((fact) => (
                    <li key={fact} className="flex gap-3 text-sm leading-6 text-[#5b420b]">
                      <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#b7791f]" />
                      <span>{fact}</span>
                    </li>
                  ))}
                </ul>
              </article>

              <PracticeCasePlayer practiceCase={practiceCase} />
            </div>

            <aside className="space-y-5">
              <div className="rounded-md border border-[#d0ded3] bg-white p-5 shadow-sm">
                <h2 className="text-xl font-bold text-[#17201b]">Học trước hoặc xem lại</h2>
                <div className="mt-4 grid gap-3">
                  {practiceCase.knowledgeLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="inline-flex items-center justify-between gap-2 rounded-md border border-[#e0e5dc] bg-[#fffdf8] px-3 py-2 text-sm font-semibold text-[#0f766e] hover:border-[#0f766e]"
                    >
                      <span>{link.title}</span>
                      <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                    </Link>
                  ))}
                </div>
              </div>

              <div className="rounded-md border border-[#e0e5dc] bg-white p-5 shadow-sm">
                <h2 className="text-xl font-bold text-[#17201b]">Case tiếp theo</h2>
                <h3 className="mt-3 font-bold leading-6 text-[#17201b]">
                  {nextCase.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[#5b6861]">
                  {nextCase.summary}
                </p>
                <Link
                  href={`/cases/${nextCase.slug}`}
                  className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#0f766e]"
                >
                  Mở tình huống
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </aside>
          </div>
          <Disclaimer className="mx-auto mt-8 max-w-5xl" />
        </section>
      </main>
      <PublicFooter />
    </>
  );
}
