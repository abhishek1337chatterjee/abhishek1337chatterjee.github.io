import type { SanitySkill } from '../../lib/sanity';
import { useSkills } from '../../hooks/useSanityData';
import Reveal from '../ui/Reveal';
import SectionHeader from '../ui/SectionHeader';

type Category = SanitySkill['category'];

// Per-runtime accent + the registry "unit" each group is counted in.
const ACCENT: Record<Category, string> = {
  cloud: 'var(--secondary)', // amber — the AWS/serverless headline
  backend: 'var(--primary)', // teal
  frontend: '#34e5ff', // cyan
  tools: '#8a91a0', // muted — kept quiet
};
const LABEL: Record<Category, string> = {
  cloud: 'cloud / serverless',
  backend: 'backend',
  frontend: 'frontend',
  tools: 'tools',
};
const UNIT: Record<Category, string> = {
  cloud: 'services',
  backend: 'packages',
  frontend: 'packages',
  tools: 'packages',
};

// Cloud service tile: branded color square (shortName) + service name.
function ServiceTile({ skill }: { skill: SanitySkill }) {
  const color = skill.color || '#f5a623';
  const badge = skill.shortName || skill.name.slice(0, 2).toUpperCase();
  return (
    <div className="group flex items-center gap-2.5 rounded-lg border border-line bg-base-300/40 px-2.5 py-2 transition-colors hover:border-[color:var(--secondary)]/40">
      <span
        className="grid size-7 shrink-0 place-items-center rounded-md font-mono text-[10px] font-bold text-white grayscale transition duration-300 group-hover:grayscale-0"
        style={{ background: color }}
      >
        {badge}
      </span>
      <span className="text-sm text-ink">{skill.name}</span>
    </div>
  );
}

// Generic dependency chip: icon (or monogram fallback) + name.
function DepChip({ skill }: { skill: SanitySkill }) {
  return (
    <div className="group flex items-center gap-2 rounded-lg border border-line bg-base-300/40 px-2.5 py-1.5">
      {skill.iconUrl ? (
        <img
          src={skill.iconUrl}
          alt=""
          width={18}
          height={18}
          loading="lazy"
          decoding="async"
          className="size-[18px] shrink-0 object-contain grayscale opacity-75 transition duration-300 group-hover:grayscale-0 group-hover:opacity-100"
        />
      ) : (
        <span className="grid size-[18px] shrink-0 place-items-center rounded bg-base-100 font-mono text-[9px] text-muted">
          {skill.name.slice(0, 1).toUpperCase()}
        </span>
      )}
      <span className="text-sm text-ink">{skill.name}</span>
    </div>
  );
}

function CategoryPanel({
  category,
  skills,
  cloud = false,
}: {
  category: Category;
  skills: SanitySkill[];
  cloud?: boolean;
}) {
  const accent = ACCENT[category];
  return (
    <div className="h-full rounded-xl border border-line bg-base-200/40 p-5 sm:p-6">
      {/* manifest header: ● label  N unit */}
      <div className="mb-4 flex items-center gap-2.5">
        <span className="size-2 shrink-0 rounded-full" style={{ background: accent }} />
        <h3 className="font-mono text-sm uppercase tracking-[0.15em] text-ink">
          {LABEL[category]}
        </h3>
        <span className="ml-auto font-mono text-xs text-muted">
          {skills.length} {UNIT[category]}
        </span>
      </div>
      <div className={`flex flex-wrap gap-2 ${cloud ? 'sm:gap-2.5' : ''}`}>
        {skills.map((s) =>
          cloud ? <ServiceTile key={s._id} skill={s} /> : <DepChip key={s._id} skill={s} />,
        )}
      </div>
    </div>
  );
}

export default function Skills() {
  const { skills } = useSkills();
  if (!skills.length) return null;

  const byCat = (c: Category) => skills.filter((s) => s.category === c);
  const cloud = byCat('cloud');
  const secondary: Category[] = ['backend', 'frontend', 'tools'];
  const activeRuntimes = (['cloud', ...secondary] as Category[]).filter(
    (c) => byCat(c).length > 0,
  ).length;

  return (
    <section id="skills" className="content-defer px-5 py-16 sm:px-8 lg:px-16">
      <div className="mx-auto w-full max-w-6xl">
        <Reveal>
          <SectionHeader num="03" label="stack" title="Skills" />
          <p className="mt-3 font-mono text-sm text-muted">
            {skills.length} modules across {activeRuntimes} runtimes
          </p>
        </Reveal>

        <div className="mt-10 space-y-6">
          {/* cloud = the headline service registry, full width */}
          {cloud.length > 0 && (
            <Reveal>
              <CategoryPanel category="cloud" skills={cloud} cloud />
            </Reveal>
          )}

          {/* remaining runtimes as compact package lists */}
          <div className="grid items-start gap-6 md:grid-cols-2 lg:grid-cols-3">
            {secondary.map((c, i) => {
              const list = byCat(c);
              if (!list.length) return null;
              return (
                <Reveal key={c} delay={0.05 * (i + 1)}>
                  <CategoryPanel category={c} skills={list} />
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
