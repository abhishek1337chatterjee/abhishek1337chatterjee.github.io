import { useState, useEffect } from 'react';

interface GitHubStats {
  publicRepos: number;
  followers: number;
  following: number;
  totalStars: number;
  totalForks: number;
  topLanguages: { name: string; percentage: number; color: string }[];
  loading: boolean;
  error: string | null;
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
  });

  useEffect(() => {
    async function fetchGitHubData() {
      try {
        // Fetch user data and repos in parallel
        const [userResponse, reposResponse] = await Promise.all([
          fetch(`https://api.github.com/users/${username}`),
          fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`),
        ]);

        if (!userResponse.ok || !reposResponse.ok) {
          throw new Error('Failed to fetch GitHub data');
        }

        const userData: GitHubUser = await userResponse.json();
        const reposData: GitHubRepo[] = await reposResponse.json();

        // Calculate totals
        let totalStars = 0;
        let totalForks = 0;
        const languageBytes: Record<string, number> = {};

        reposData.forEach((repo) => {
          totalStars += repo.stargazers_count;
          totalForks += repo.forks_count;

          if (repo.language && repo.size > 0) {
            languageBytes[repo.language] = (languageBytes[repo.language] || 0) + repo.size;
          }
        });

        // Calculate language percentages
        const totalBytes = Object.values(languageBytes).reduce((a, b) => a + b, 0);
        const topLanguages = Object.entries(languageBytes)
          .map(([name, bytes]) => ({
            name,
            percentage: Math.round((bytes / totalBytes) * 100),
            color: LANGUAGE_COLORS[name] || '#8892b0',
          }))
          .sort((a, b) => b.percentage - a.percentage)
          .slice(0, 5);

        setStats({
          publicRepos: userData.public_repos,
          followers: userData.followers,
          following: userData.following,
          totalStars,
          totalForks,
          topLanguages,
          loading: false,
          error: null,
        });
      } catch (err) {
        setStats((prev) => ({
          ...prev,
          loading: false,
          error: err instanceof Error ? err.message : 'Unknown error',
        }));
      }
    }

    fetchGitHubData();
  }, [username]);

  return stats;
}
