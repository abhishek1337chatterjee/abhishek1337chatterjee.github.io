import { useSkills } from '../../hooks/useSanityData';
import type { SanitySkill } from '../../lib/sanity';
import Reveal from '../ui/Reveal';
import ServiceGraph from './skills/ServiceGraph';

type Category = SanitySkill['category'];

// Per-runtime accent: amber marks the cloud headline, the rest stay quieter.
const ACCENT: Record<Category, string> = {
  cloud: 'var(--secondary)',
  backend: 'var(--primary)',
  frontend: '#34e5ff',
  tools: '#8a91a0',
};
const LABEL: Record<Category, string> = {
  cloud: 'cloud / serverless',
  backend: 'backend',
  frontend: 'frontend',
  tools: 'tools',
};

function Dot({ category }: { category: Category }) {
  return <span className="size-2 shrink-0 rounded-full" style={{ background: ACCENT[category] }} />;
}

// One runtime as a dense name list; the strip's column rules carry the structure.
function RuntimeColumn({ category, skills }: { category: Category; skills: SanitySkill[] }) {
  return (
    <div className="py-5 md:pt-5 md:pb-1 md:px-6 md:first:pl-0 md:last:pr-0">
      <h3 className="flex items-center gap-2.5 font-mono text-xs uppercase tracking-[0.15em] text-ink">
        <Dot category={category} />
        {LABEL[category]}
        <span className="tracking-normal text-muted">· {skills.length}</span>
      </h3>
      {/* Non-breaking space before each dot: lines wrap after a separator, never start with one. */}
      <ul className="mt-2.5 text-[15px] leading-relaxed text-ink/80">
        {skills.map((s, i) => (
          <li key={s._id} className="inline">
            {s.name}
            {i < skills.length - 1 && (
              <span aria-hidden className="text-muted">
                {'\u00a0· '}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Skills() {
  const { skills } = useSkills();
  if (!skills.length) return null;

  const byCat = (c: Category) => skills.filter((s) => s.category === c);
  const cloud = byCat('cloud');
  const secondary = (['backend', 'frontend', 'tools'] as Category[]).filter(
    (c) => byCat(c).length > 0,
  );
  const runtimes = secondary.length + (cloud.length > 0 ? 1 : 0);

  return (
    <section id="skills" className="content-defer px-5 py-16 sm:px-8 lg:px-16">
      <div className="mx-auto w-full max-w-6xl">
        <Reveal>
          <div className="flex flex-wrap items-baseline gap-x-5 gap-y-2">
            <h2 className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              Skills
            </h2>
            <p className="font-mono text-sm text-muted">
              {skills.length} modules · {runtimes} runtimes
              {cloud.length > 0 && (
                <>
                  {' · '}
                  <span className="whitespace-nowrap text-[color:var(--secondary)]">
                    {cloud.length} cloud services
                  </span>
                </>
              )}
            </p>
          </div>
        </Reveal>

        {cloud.length > 0 && (
          <Reveal className="mt-8">
            <div className="rounded-xl border border-line bg-base-200/40 p-4 sm:p-6">
              <h3 className="mb-8 flex flex-wrap items-center gap-x-2.5 gap-y-1 font-mono text-sm uppercase tracking-[0.15em] text-ink">
                <Dot category="cloud" />
                {LABEL.cloud}
                <span className="basis-full text-xs tracking-normal text-muted normal-case sm:basis-auto">
                  <span aria-hidden className="hidden sm:inline">
                    ·{' '}
                  </span>
                  how the pieces fit in an event-driven backend
                </span>
              </h3>
              <ServiceGraph services={cloud} />
            </div>
          </Reveal>
        )}

        {secondary.length > 0 && (
          <Reveal delay={0.05} className="mt-6">
            <div className="grid divide-y divide-line border-t border-line md:grid-cols-3 md:divide-x md:divide-y-0">
              {secondary.map((c) => (
                <RuntimeColumn key={c} category={c} skills={byCat(c)} />
              ))}
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
