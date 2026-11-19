import { useEffect, useState } from 'react';

interface GitHubData {
  publicRepos: number;
  followers: number;
  following: number;
  totalStars: number;
  totalForks: number;
  topLanguages: { name: string; percentage: number; color: string }[];
}

interface GitHubStats extends GitHubData {
  loading: boolean;
  error: string | null;
  staleAt: number | null; // set when GitHub refused and an older saved copy is shown
}

interface GitHubUser {
  public_repos: number;
  followers: number;
  following: number;
}

interface GitHubRepo {
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  size: number;
}

const LANGUAGE_COLORS: Record<string, string> = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  Python: '#3572A5',
  Java: '#b07219',
  'C++': '#f34b7d',
  C: '#555555',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Ruby: '#701516',
  Go: '#00ADD8',
  Rust: '#dea584',
  Swift: '#F05138',
  Kotlin: '#A97BFF',
  PHP: '#4F5D95',
  Shell: '#89e051',
  Vue: '#41b883',
  React: '#61dafb',
};

// Unauthenticated GitHub API = 60 requests/hour per IP. Saving the last good result
// for an hour keeps repeat visits off the API, and is the fallback when GitHub says no.
const CACHE_MS = 60 * 60 * 1000;
const cacheKey = (username: string) => `gh-stats:${username}`;

interface Saved {
  at: number;
  data: GitHubData;
}

function readSaved(username: string): Saved | null {
  try {
    const raw = localStorage.getItem(cacheKey(username));
    return raw ? (JSON.parse(raw) as Saved) : null;
  } catch {
    return null;
  }
}

function save(username: string, data: GitHubData) {
  try {
    localStorage.setItem(cacheKey(username), JSON.stringify({ at: Date.now(), data }));
  } catch {
    // private mode or full storage: the page still works, it just asks GitHub next time
  }
}

async function fetchFresh(username: string): Promise<GitHubData> {
  const [userResponse, reposResponse] = await Promise.all([
    fetch(`https://api.github.com/users/${username}`),
    fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`),
  ]);
  if (!userResponse.ok || !reposResponse.ok) {
    throw new Error('Failed to fetch GitHub data');
  }
  const userData: GitHubUser = await userResponse.json();
  const reposData: GitHubRepo[] = await reposResponse.json();

  let totalStars = 0;
  let totalForks = 0;
  const languageBytes: Record<string, number> = {};
  for (const repo of reposData) {
    totalStars += repo.stargazers_count;
    totalForks += repo.forks_count;
    if (repo.language && repo.size > 0) {
      languageBytes[repo.language] = (languageBytes[repo.language] || 0) + repo.size;
    }
  }

  const totalBytes = Object.values(languageBytes).reduce((a, b) => a + b, 0);
  const topLanguages = Object.entries(languageBytes)
    .map(([name, bytes]) => ({
      name,
      percentage: Math.round((bytes / totalBytes) * 100),
      color: LANGUAGE_COLORS[name] || '#8892b0',
    }))
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, 5);

  return {
    publicRepos: userData.public_repos,
    followers: userData.followers,
    following: userData.following,
    totalStars,
    totalForks,
    topLanguages,
  };
}

type Result = { data: GitHubData; staleAt: number | null };

// One request per page load, even with StrictMode's double effect or several readers.
const requests = new Map<string, Promise<Result>>();
function load(username: string): Promise<Result> {
  let req = requests.get(username);
  if (!req) {
    const saved = readSaved(username);
    req =
      saved && Date.now() - saved.at < CACHE_MS
        ? Promise.resolve({ data: saved.data, staleAt: null })
        : fetchFresh(username).then(
            (data) => {
              save(username, data);
              return { data, staleAt: null };
            },
            (err) => {
              if (saved) return { data: saved.data, staleAt: saved.at };
              requests.delete(username); // nothing to show: let a later mount retry
              throw err;
            },
          );
    requests.set(username, req);
  }
  return req;
}

export function useGitHubStats(username: string): GitHubStats {
  const [stats, setStats] = useState<GitHubStats>({
    publicRepos: 0,
    followers: 0,
    following: 0,
    totalStars: 0,
    totalForks: 0,
    topLanguages: [],
    loading: true,
    error: null,
    staleAt: null,
  });

  useEffect(() => {
    let alive = true;
    load(username).then(
      ({ data, staleAt }) => {
        if (alive) setStats({ ...data, loading: false, error: null, staleAt });
      },
      (err) => {
        if (!alive) return;
        setStats((prev) => ({
          ...prev,
          loading: false,
          error: err instanceof Error ? err.message : 'Unknown error',
        }));
      },
    );
    return () => {
      alive = false;
    };
  }, [username]);

  return stats;
}
