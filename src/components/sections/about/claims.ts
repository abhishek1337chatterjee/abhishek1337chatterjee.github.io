// Turns each highlighted bio phrase's Studio "Proves it" link into a rail row.
// Every proof line is built from live CMS data; a phrase without a link stays plain.
import type {
  HighlightedPhrase,
  PhraseProof,
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

// How each skill group reads in a proof line ("10 cloud services, wired").
const GROUP_NOUN: Record<string, string> = {
  cloud: 'cloud services',
  backend: 'backend skills',
  frontend: 'frontend skills',
  tools: 'tools',
};

type Proven = Omit<Claim, 'n' | 'phrase' | 'color'>;

// One builder per proof kind; Studio decides which phrase uses which kind and record.
// A link to a record that no longer exists drops the claim instead of showing a broken one.
const BUILD: Record<PhraseProof['kind'], (proof: PhraseProof, d: Data) => Proven | null> = {
  role: (proof, { careerPhases }) => {
    const role = careerPhases.find((p) => p._id === proof.role);
    if (!role) return null;
    return {
      target: 'journey',
      section: 'journey',
      proof: `${role.role}, ${role.period}`,
      peek: {
        label: 'journey row',
        nodes: role.highlights ?? [],
        hot: proof.hot,
        note: `${role.companyName ?? role.title} · ${role.period}`,
      },
    };
  },
  study: (proof, { caseStudies }) => {
    const study = caseStudies.find((c) => c.slug === proof.study);
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
  allStudies: (_proof, { caseStudies }) =>
    caseStudies.length
      ? {
          target: 'work',
          section: 'work',
          proof: `${caseStudies.length} services on the platform bus`,
          peek: { label: 'platform bus', nodes: caseStudies.map((c) => `svc/${c.slug}`) },
        }
      : null,
  skillGroup: (proof, { skills }) => {
    const group = skills.filter((s) => s.category === proof.skillGroup);
    if (!group.length || !proof.skillGroup) return null;
    return {
      target: 'skills',
      section: 'skills',
      proof: `${group.length} ${GROUP_NOUN[proof.skillGroup] ?? proof.skillGroup}, wired`,
      peek: { label: 'skills graph', nodes: group.map((s) => s.name) },
    };
  },
};

// Claims in the order their phrases first appear in the bio.
export function buildClaims(bio: string, phrases: HighlightedPhrase[], data: Data): Claim[] {
  return phrases
    .map((p) => ({ p, at: bio.indexOf(p.text) }))
    .filter((x) => x.at >= 0 && x.p.proof?.kind)
    .sort((a, b) => a.at - b.at)
    .flatMap(({ p }) => {
      const proof = p.proof && BUILD[p.proof.kind]?.(p.proof, data);
      return proof ? [{ ...proof, phrase: p.text, color: COLOR_HEX[p.color] ?? '#3ddc97' }] : [];
    })
    .map((c, i) => ({ ...c, n: i + 1 }));
}
