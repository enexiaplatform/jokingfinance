import { PublicFooter } from "@/components/marketing/public-footer";
import { PublicNav } from "@/components/marketing/public-nav";
import { Badge } from "@/components/ui/badge";

type InformationSection = {
  title: string;
  paragraphs?: string[];
  items?: string[];
};

type InformationPageProps = {
  eyebrow: string;
  title: string;
  introduction: string;
  sections: InformationSection[];
};

export function InformationPage({
  eyebrow,
  title,
  introduction,
  sections,
}: InformationPageProps) {
  return (
    <>
      <PublicNav />
      <main className="bg-[#fffdf8]">
        <section className="border-b border-[#d9ddd3] bg-[#edf5ee] px-4 py-14 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <Badge tone="green">{eyebrow}</Badge>
            <h1 className="mt-4 text-4xl font-black leading-tight text-[#17201b] md:text-5xl">
              {title}
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-[#43534a]">
              {introduction}
            </p>
          </div>
        </section>
        <section className="px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-4xl gap-8">
            {sections.map((section) => (
              <article key={section.title}>
                <h2 className="text-2xl font-bold text-[#17201b]">{section.title}</h2>
                {section.paragraphs?.map((paragraph) => (
                  <p key={paragraph} className="mt-3 leading-7 text-[#4c5d54]">
                    {paragraph}
                  </p>
                ))}
                {section.items ? (
                  <ul className="mt-4 grid gap-3">
                    {section.items.map((item) => (
                      <li
                        key={item}
                        className="rounded-md border border-[#e0e5dc] bg-white p-4 leading-7 text-[#4c5d54]"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </article>
            ))}
          </div>
        </section>
      </main>
      <PublicFooter />
    </>
  );
}
