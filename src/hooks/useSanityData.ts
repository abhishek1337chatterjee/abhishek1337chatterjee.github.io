import { useEffect, useState, useSyncExternalStore } from 'react';
import { cmsStatus } from '../lib/cmsStatus';
import {
  getAbout,
  getCareerPhases,
  getCaseStudies,
  getHomelab,
  getLearning,
  getProjects,
  getSiteSettings,
  getSkills,
  getSocials,
  type SanityAbout,
  type SanityCareerPhase,
  type SanityCaseStudy,
  type SanityHomelab,
  type SanityLearning,
  type SanityProject,
  type SanitySiteSettings,
  type SanitySkill,
  type SanitySocial,
} from '../lib/sanity';

// Shared fetch for every hook below: a failure raises the page-wide notice instead of
// leaving a section blank in silence, and its retry bumps the epoch so this runs again.
function useCms<T>(load: () => Promise<T>, initial: T) {
  const [data, setData] = useState<T>(initial);
  const [loading, setLoading] = useState(true);
  const epoch = useSyncExternalStore(cmsStatus.subscribe, cmsStatus.epoch);

  // biome-ignore lint/correctness/useExhaustiveDependencies: epoch is the retry trigger
  useEffect(() => {
    let live = true;
    setLoading(true);
    load()
      .then((value) => live && setData(value))
      .catch(() => live && cmsStatus.markFailed())
      .finally(() => live && setLoading(false));
    return () => {
      live = false;
    };
  }, [load, epoch]);

  return { data, loading };
}

export function useAbout() {
  const { data: about, loading } = useCms<SanityAbout | null>(getAbout, null);
  return { about, loading };
}

export function useSkills() {
  const { data: skills, loading } = useCms<SanitySkill[]>(getSkills, []);
  return { skills, loading };
}

export function useProjects() {
  const { data: projects, loading } = useCms<SanityProject[]>(getProjects, []);
  return { projects, loading };
}

export function useCareerPhases() {
  const { data: careerPhases, loading } = useCms<SanityCareerPhase[]>(getCareerPhases, []);
  return { careerPhases, loading };
}

export function useSocials() {
  const { data: socials, loading } = useCms<SanitySocial[]>(getSocials, []);
  return { socials, loading };
}

export function useSiteSettings() {
  const { data: settings, loading } = useCms<SanitySiteSettings | null>(getSiteSettings, null);
  return { settings, loading };
}

export function useHomelab() {
  const { data: homelab, loading } = useCms<SanityHomelab | null>(getHomelab, null);
  return { homelab, loading };
}

export function useLearning() {
  const { data: learning, loading } = useCms<SanityLearning[]>(getLearning, []);
  return { learning, loading };
}

export function useCaseStudies() {
  const { data: caseStudies, loading } = useCms<SanityCaseStudy[]>(getCaseStudies, []);
  return { caseStudies, loading };
}
