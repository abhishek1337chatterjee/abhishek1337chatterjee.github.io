// Which section proves each highlighted bio phrase, and the proof line shown for it.
// Every proof is built from live CMS data; a phrase with no rule (or no data) stays plain.
import type {
  HighlightedPhrase,
  SanityCareerPhase,
  SanityCaseStudy,
  SanitySkill,
} from '../../../lib/sanity';

export interface Claim {
  n: number; // footnote number, in reading order
  phrase: string;
  color: string;
  target: string; // section id the claim jumps to
  section: string; // short label for the rail
  proof: string;
  peek: Peek; // mini picture of the proof, shown under the hovered rail row
  study?: string; // case study to pre-select when the claim jumps to #work
}

// Nodes on a small trace bus; `hot` is the node the claim points at.
export interface Peek {
  label: string;
  nodes: string[];
  hot?: string;
  note?: string;
}

interface Data {
  skills: SanitySkill[];
  caseStudies: SanityCaseStudy[];
  careerPhases: SanityCareerPhase[];
}

// Sanity colour names → theme hexes (green = teal, orange = amber).
export const COLOR_HEX: Record<string, string> = {
  cyan: '#34e5ff',
  pink: '#ff7ac6',
  green: '#3ddc97',
  orange: '#f5a623',
  purple: '#a78bfa',
};

// Hover / focus colour. Amber stays reserved for the selected claim.
export const HOVER_HEX = COLOR_HEX.cyan;

const has = (list: string[] | undefined, word: string) =>
  (list ?? []).some((x) => x.toLowerCase() === word.toLowerCase());

type Rule = (d: Data) => Omit<Claim, 'n' | 'phrase' | 'color'> | null;

const RULES: Record<string, Rule> = {
  react: ({ careerPhases }) => {
    const role = careerPhases.find(
      (p) => !p.isEducation && (has(p.highlights, 'React') || has(p.keyTechnologies, 'React')),
    );
    if (!role) return null;
    return {
      target: 'journey',
      section: 'journey',
      proof: `${role.role}, ${role.period}`,
      peek: {
        label: 'journey row',
        nodes: role.highlights ?? [],
        hot: 'React',
        note: `${role.companyName ?? role.title} · ${role.period}`,
      },
    };
  },
  'serverless engineer': ({ caseStudies }) =>
    caseStudies.length
      ? {
          target: 'work',
          section: 'work',
          proof: `${caseStudies.length} services on the platform bus`,
          peek: { label: 'platform bus', nodes: caseStudies.map((c) => `svc/${c.slug}`) },
        }
      : null,
  aws: ({ skills }) => {
    const cloud = skills.filter((s) => s.category === 'cloud');
    if (!cloud.length) return null;
    return {
      target: 'skills',
      section: 'skills',
      proof: `${cloud.length} cloud services, wired`,
      peek: { label: 'skills graph', nodes: cloud.map((s) => s.name) },
    };
  },
  sanity: ({ caseStudies }) => {
    const study = caseStudies.find((c) => has(c.domainTags, 'sanity-cms'));
    if (!study) return null;
    return {
      target: 'work',
      section: 'work',
      proof: study.title,
      peek: {
        label: 'platform bus',
        nodes: caseStudies.map((c) => `svc/${c.slug}`),
        hot: `svc/${study.slug}`,
        note: study.oneLiner,
      },
      study: study.slug,
    };
  },
};

// Claims in the order their phrases first appear in the bio.
export function buildClaims(bio: string, phrases: HighlightedPhrase[], data: Data): Claim[] {
  return phrases
    .map((p) => ({ p, at: bio.indexOf(p.text), rule: RULES[p.text.toLowerCase()] }))
    .filter((x) => x.at >= 0 && x.rule)
    .sort((a, b) => a.at - b.at)
    .flatMap(({ p, rule }) => {
      const proof = rule?.(data);
      return proof ? [{ ...proof, phrase: p.text, color: COLOR_HEX[p.color] ?? '#3ddc97' }] : [];
    })
    .map((c, i) => ({ ...c, n: i + 1 }));
}
