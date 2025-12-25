import { motion } from 'framer-motion';
import { GitHubCalendar } from 'react-github-calendar';
import { Github, Star, GitFork, Users, FolderGit2, Code2 } from 'lucide-react';
import { useGitHubStats } from '../../hooks/useGitHubStats';

const GITHUB_USERNAME = 'abhishek1337chatterjee';

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  gradient: string;
  delay: number;
}

function StatCard({ icon, label, value, gradient, delay }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.05, y: -5 }}
      className="relative group"
    >
      {/* Glow effect */}
      <div
        className={`absolute -inset-0.5 ${gradient} rounded-xl blur opacity-30 group-hover:opacity-60 transition duration-500`}
      />

      {/* Card content */}
      <div className="relative bg-[#112240] rounded-xl p-6 border border-[#8892b0]/10 h-full">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-lg ${gradient}`}>
            {icon}
          </div>
          <div>
            <motion.p
              className="text-3xl font-bold text-[#ccd6f6]"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: delay + 0.2 }}
            >
              {value.toLocaleString()}
            </motion.p>
            <p className="text-[#8892b0] text-sm">{label}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

interface LanguageBarProps {
  languages: { name: string; percentage: number; color: string }[];
}

function LanguageBar({ languages }: LanguageBarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="relative group"
    >
      {/* Glow effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-[#db2777] via-[#06b6d4] to-[#db2777] rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-500" />

      <div className="relative bg-[#112240] rounded-xl p-6 border border-[#8892b0]/10">
        <div className="flex items-center gap-2 mb-4">
          <Code2 size={20} className="text-[#06b6d4]" />
          <h3 className="text-lg font-semibold text-[#ccd6f6]">Top Languages</h3>
        </div>

        {/* Progress bar */}
        <div className="h-4 rounded-full overflow-hidden flex mb-4 bg-[#0a192f]">
          {languages.map((lang, index) => (
            <motion.div
              key={lang.name}
              initial={{ width: 0 }}
              whileInView={{ width: `${lang.percentage}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.5 + index * 0.1 }}
              className="h-full first:rounded-l-full last:rounded-r-full"
              style={{ backgroundColor: lang.color }}
              title={`${lang.name}: ${lang.percentage}%`}
            />
          ))}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4">
          {languages.map((lang) => (
            <div key={lang.name} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: lang.color }}
              />
              <span className="text-[#8892b0] text-sm">
                {lang.name} <span className="text-[#ccd6f6]">{lang.percentage}%</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function LoadingCard() {
  return (
    <div className="bg-[#112240] rounded-xl p-6 border border-[#8892b0]/10 animate-pulse">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-[#8892b0]/20 rounded-lg" />
        <div>
          <div className="w-16 h-8 bg-[#8892b0]/20 rounded mb-2" />
          <div className="w-20 h-4 bg-[#8892b0]/20 rounded" />
        </div>
      </div>
    </div>
  );
}

export default function GitHubStats() {
  const stats = useGitHubStats(GITHUB_USERNAME);

  return (
    <section id="github" className="py-20 bg-[#0a192f] px-4 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-2">
            <Github size={36} className="text-[#ccd6f6]" />
            <h2 className="text-3xl sm:text-4xl font-bold text-[#ccd6f6]">
              GitHub Statistics
            </h2>
          </div>
          <div className="w-20 h-1 bg-gradient-to-r from-[#db2777] to-[#06b6d4] mx-auto rounded-full" />
        </motion.div>

        <div className="space-y-8">
          {/* Stats Grid */}
          {stats.loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <LoadingCard key={i} />
              ))}
            </div>
          ) : stats.error ? (
            <div className="text-center text-[#8892b0] py-8">
              Failed to load GitHub stats. Please try again later.
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                  icon={<FolderGit2 size={24} className="text-white" />}
                  label="Repositories"
                  value={stats.publicRepos}
                  gradient="bg-gradient-to-br from-[#db2777] to-[#f472b6]"
                  delay={0.1}
                />
                <StatCard
                  icon={<Star size={24} className="text-white" />}
                  label="Total Stars"
                  value={stats.totalStars}
                  gradient="bg-gradient-to-br from-[#f59e0b] to-[#fbbf24]"
                  delay={0.2}
                />
                <StatCard
                  icon={<GitFork size={24} className="text-white" />}
                  label="Total Forks"
                  value={stats.totalForks}
                  gradient="bg-gradient-to-br from-[#06b6d4] to-[#22d3ee]"
                  delay={0.3}
                />
                <StatCard
                  icon={<Users size={24} className="text-white" />}
                  label="Followers"
                  value={stats.followers}
                  gradient="bg-gradient-to-br from-[#8b5cf6] to-[#a78bfa]"
                  delay={0.4}
                />
              </div>

              {/* Languages Bar */}
              {stats.topLanguages.length > 0 && (
                <LanguageBar languages={stats.topLanguages} />
              )}
            </>
          )}

          {/* GitHub Calendar */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="relative group"
          >
            {/* Glow effect */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#06b6d4] to-[#db2777] rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-500" />

            <div className="relative p-6 bg-[#112240] rounded-xl border border-[#8892b0]/10 overflow-x-auto">
              <h3 className="text-lg font-semibold text-[#ccd6f6] mb-4 flex items-center gap-2">
                <span className="w-3 h-3 bg-[#06b6d4] rounded-full animate-pulse" />
                Contribution Activity
              </h3>
              <GitHubCalendar
                username={GITHUB_USERNAME}
                colorScheme="dark"
                blockSize={12}
                blockMargin={4}
                fontSize={14}
                style={{ color: '#ccd6f6' }}
              />
            </div>
          </motion.div>

          {/* GitHub Profile Link */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex justify-center"
          >
            <a
              href={`https://github.com/${GITHUB_USERNAME}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex items-center gap-2"
            >
              <span className="absolute -inset-2 bg-gradient-to-r from-[#db2777] to-[#06b6d4] rounded-lg blur opacity-0 group-hover:opacity-50 transition duration-500" />
              <span className="relative btn btn-outline border-[#8892b0]/30 hover:border-[#db2777] hover:bg-[#db2777]/10 gap-2 text-[#ccd6f6]">
                <Github size={18} />
                View Full Profile
              </span>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
