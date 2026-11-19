import { ArrowRight } from 'lucide-react';
import type { PageRef } from './trace';

// Section that holds the case-study tiles (ServiceMap)
const WORK_SECTION_ID = 'work';

/** "on this page": case studies the answer named, each a jump to its tile in Work. */
export default function PageRefs({
  refs,
  onJump,
}: {
  refs: PageRef[];
  onJump: (slug: string) => void;
}) {
  if (refs.length === 0) return null;
  return (
    <div className="mt-2.5 border-t border-line font-mono text-[12.5px] text-muted md:text-xs">
      <p className="pt-[7px] pb-0.5">on this page</p>
      <ul>
        {refs.map((ref) => (
          <li key={ref.slug}>
            {/* a real #work link: the page's anchor-scroll fix lands it exactly */}
            <a
              href={`#${WORK_SECTION_ID}`}
              onClick={() => onJump(ref.slug)}
              aria-label={`Jump to ${ref.title} in Work`}
              className="group mt-1 flex min-h-11 w-full items-center justify-between gap-2.5 rounded-lg border border-line bg-[#13151a] px-2.5 py-[7px] text-left transition-colors hover:border-[#34e5ff] md:min-h-0"
            >
              <span className="truncate text-ink">
                svc/{ref.slug} <span className="text-muted">· work</span>
              </span>
              <span className="inline-flex flex-none items-center gap-[5px] whitespace-nowrap text-[color:var(--primary)] transition-colors group-hover:text-[#34e5ff]">
                jump there
                <ArrowRight aria-hidden className="size-3" />
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
