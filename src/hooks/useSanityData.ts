import { useEffect, useState } from 'react';
import {
  getAbout,
  getCareerPhases,
  getHomelab,
  getLearning,
  getProjects,
  getSiteSettings,
  getSkills,
  getSocials,
  type SanityAbout,
  type SanityCareerPhase,
  type SanityHomelab,
  type SanityLearning,
  type SanityProject,
  type SanitySiteSettings,
  type SanitySkill,
  type SanitySocial,
} from '../lib/sanity';

interface SanityDataState {
  about: SanityAbout | null;
  settings: SanitySiteSettings | null;
  skills: SanitySkill[];
  projects: SanityProject[];
  careerPhases: SanityCareerPhase[];
  socials: SanitySocial[];
  loading: boolean;
  error: Error | null;
}

// Hook to fetch all Sanity data
export function useSanityData() {
  const [state, setState] = useState<SanityDataState>({
    about: null,
    settings: null,
    skills: [],
    projects: [],
    careerPhases: [],
    socials: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const [about, settings, skills, projects, careerPhases, socials] = await Promise.all([
          getAbout(),
          getSiteSettings(),
          getSkills(),
          getProjects(),
          getCareerPhases(),
          getSocials(),
        ]);

        setState({
          about,
          settings,
          skills,
          projects,
          careerPhases,
          socials,
          loading: false,
          error: null,
        });
      } catch (err) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error: err instanceof Error ? err : new Error('Failed to fetch Sanity data'),
        }));
      }
    }

    fetchData();
  }, []);

  return state;
}

// Individual hooks for specific data types (more efficient when you only need one type)
export function useAbout() {
  const [about, setAbout] = useState<SanityAbout | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAbout()
      .then(setAbout)
      .finally(() => setLoading(false));
  }, []);

  return { about, loading };
}

export function useSkills() {
  const [skills, setSkills] = useState<SanitySkill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSkills()
      .then(setSkills)
      .finally(() => setLoading(false));
  }, []);

  return { skills, loading };
}

export function useProjects() {
  const [projects, setProjects] = useState<SanityProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProjects()
      .then(setProjects)
      .finally(() => setLoading(false));
  }, []);

  return { projects, loading };
}

export function useCareerPhases() {
  const [careerPhases, setCareerPhases] = useState<SanityCareerPhase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCareerPhases()
      .then(setCareerPhases)
      .finally(() => setLoading(false));
  }, []);

  return { careerPhases, loading };
}

export function useSocials() {
  const [socials, setSocials] = useState<SanitySocial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSocials()
      .then(setSocials)
      .finally(() => setLoading(false));
  }, []);

  return { socials, loading };
}

export function useSiteSettings() {
  const [settings, setSettings] = useState<SanitySiteSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSiteSettings()
      .then(setSettings)
      .finally(() => setLoading(false));
  }, []);

  return { settings, loading };
}

export function useHomelab() {
  const [homelab, setHomelab] = useState<SanityHomelab | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getHomelab()
      .then(setHomelab)
      .finally(() => setLoading(false));
  }, []);

  return { homelab, loading };
}

export function useLearning() {
  const [learning, setLearning] = useState<SanityLearning[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLearning()
      .then(setLearning)
      .finally(() => setLoading(false));
  }, []);

  return { learning, loading };
}
