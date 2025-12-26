import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, ChevronDown, AlertTriangle, Lock, Beaker, Building2 } from 'lucide-react';

import {
  careerPhases,
  personalProjects,
  type Project,
  type CareerPhase,
  type CompanyInfo,
} from '../../data/projects';

// Custom GitHub icon
function GitHubIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

// Git Branch icon
function GitBranchIcon({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="6" x2="6" y1="3" y2="15" />
      <circle cx="18" cy="6" r="3" />
      <circle cx="6" cy="18" r="3" />
      <path d="M18 9a9 9 0 0 1-9 9" />
    </svg>
  );
}

// Company Badge with Website Link
function CompanyBadge({ company }: { company: CompanyInfo }) {
  return (
    <span className="inline-flex items-baseline">
      <span className="mx-2 text-[#8892b0]">•</span>
      <a
        href={company.website}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-baseline gap-1.5 text-[#8892b0] hover:text-[#06b6d4] transition-colors"
      >
        <Building2 size={13} className="text-[#db2777] translate-y-[1px]" />
        <span>{company.name}</span>
      </a>
    </span>
  );
}

// Phase Header Component
function PhaseHeader({ phase }: { phase: CareerPhase }) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="git-node w-4 h-4 rounded-full bg-[#db2777] border-2 border-[#0a192f] shadow-[0_0_10px_rgba(219,39,119,0.5)] z-10" />
        <h3 className="text-xl sm:text-2xl font-bold text-[#ccd6f6]">{phase.title}</h3>
      </div>

      <div className="ml-7 pl-4 border-l-2 border-[#8892b0]/30">
        <p className="text-[#06b6d4] text-sm font-mono mb-1">
          {phase.role}
          {phase.company && <CompanyBadge company={phase.company} />}
        </p>
        <p className="text-[#8892b0] text-xs mb-3">{phase.period}</p>
        <p className="text-[#8892b0] text-sm mb-3">{phase.description}</p>

        {/* Highlight badges */}
        <div className="flex flex-wrap gap-2">
          {phase.highlights.map((highlight) => (
            <span
              key={highlight}
              className="px-2 py-0.5 text-xs rounded bg-[#112240] text-[#06b6d4] border border-[#06b6d4]/30"
            >
              {highlight}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// Expandable Commit Card Component
function CommitCard({ project, isLast }: { project: Project; isLast: boolean }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="relative">
      {/* Git line connector */}
      {!isLast && <div className="absolute left-[7px] top-4 bottom-0 w-0.5 bg-[#8892b0]/30" />}

      <div className="flex gap-3">
        {/* Commit node */}
        <div className="relative z-10 flex-shrink-0">
          <div
            className={`w-4 h-4 rounded-full border-2 ${
              project.type === 'showcase'
                ? 'bg-[#06b6d4] border-[#06b6d4]'
                : project.type === 'personal'
                  ? 'bg-[#10b981] border-[#10b981]'
                  : 'bg-[#8892b0] border-[#8892b0]'
            } shadow-[0_0_8px_rgba(6,182,212,0.4)]`}
          />
        </div>

        {/* Card content */}
        <motion.div layout className="flex-1 mb-4">
          {/* Collapsed header (always visible) */}
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full text-left group"
          >
            <div className="bg-[#112240] rounded-lg p-4 border border-[#8892b0]/20 hover:border-[#06b6d4]/40 transition-colors">
              {/* Title row */}
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <h4 className="text-[#ccd6f6] font-semibold group-hover:text-[#06b6d4] transition-colors">
                  {project.title}
                </h4>
                {project.isDiscontinued && (
                  <span className="flex items-center gap-1 text-xs text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded">
                    <AlertTriangle size={12} />
                    Discontinued
                  </span>
                )}
                {!project.hasCode && project.type === 'personal' && (
                  <span className="flex items-center gap-1 text-xs text-[#8892b0] bg-[#8892b0]/10 px-2 py-0.5 rounded">
                    <Lock size={12} />
                    Protected
                  </span>
                )}
              </div>

              {/* Tech stack badges */}
              <div className="flex flex-wrap gap-1.5 mb-2">
                {project.techStack.slice(0, 5).map((tech) => (
                  <span
                    key={tech}
                    className="px-2 py-0.5 text-xs rounded bg-[#0a192f] text-[#8892b0] border border-[#8892b0]/20"
                  >
                    {tech}
                  </span>
                ))}
                {project.techStack.length > 5 && (
                  <span className="px-2 py-0.5 text-xs rounded bg-[#0a192f] text-[#8892b0]">
                    +{project.techStack.length - 5}
                  </span>
                )}
              </div>

              {/* Action buttons row */}
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  {project.hasCode && project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="btn btn-xs btn-ghost gap-1 text-[#8892b0] hover:text-[#db2777]"
                    >
                      <GitHubIcon size={14} />
                      Code
                    </a>
                  )}
                  {project.hasDemo && project.deployedUrl && (
                    <a
                      href={project.deployedUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="btn btn-xs btn-ghost gap-1 text-[#8892b0] hover:text-[#06b6d4]"
                    >
                      <ExternalLink size={14} />
                      Live
                    </a>
                  )}
                </div>

                <motion.div
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown size={18} className="text-[#8892b0]" />
                </motion.div>
              </div>
            </div>
          </button>

          {/* Expanded content */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="bg-[#0a192f] border border-t-0 border-[#8892b0]/20 rounded-b-lg p-4 -mt-2">
                  {/* Project image */}
                  {project.image && (
                    <div className="mb-4 rounded-lg overflow-hidden border border-[#8892b0]/20">
                      <img src={project.image} alt={project.title} className="w-full h-auto" />
                    </div>
                  )}

                  {/* Description */}
                  <p className="text-[#8892b0] text-sm mb-4">{project.description}</p>

                  {/* Features */}
                  {project.features.length > 0 && (
                    <div className="mb-4">
                      <h5 className="text-xs font-semibold text-[#06b6d4] mb-2">Features:</h5>
                      <div className="flex flex-wrap gap-2">
                        {project.features.map((feature, i) => (
                          <span
                            key={i}
                            className="text-xs text-[#8892b0] bg-[#112240] px-2 py-1 rounded"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Responsibilities */}
                  {project.responsibilities.length > 0 && (
                    <div className="mb-4">
                      <h5 className="text-xs font-semibold text-[#db2777] mb-2">My Role:</h5>
                      <ul className="text-xs text-[#8892b0] list-disc list-inside space-y-1">
                        {project.responsibilities.map((resp, i) => (
                          <li key={i}>{resp}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Team info */}
                  {project.teamSize && (
                    <p className="text-xs text-[#8892b0]">
                      Team of{' '}
                      <span className="text-[#db2777] font-semibold">{project.teamSize}</span>{' '}
                      developers
                      {project.duration && ` • ${project.duration}`}
                    </p>
                  )}

                  {/* Full action buttons */}
                  <div className="flex gap-3 mt-4 pt-4 border-t border-[#8892b0]/20">
                    {project.hasCode && project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-sm btn-outline btn-primary gap-2"
                      >
                        <GitHubIcon size={16} />
                        View Code
                      </a>
                    )}
                    {project.hasDemo && project.deployedUrl && (
                      <a
                        href={project.deployedUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-sm btn-outline btn-secondary gap-2"
                      >
                        <ExternalLink size={16} />
                        Live Demo
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}

// Phase Section Component
function PhaseSection({ phase, index }: { phase: CareerPhase; index: number }) {
  const hasProjects = phase.projects.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative"
    >
      {/* Phase container */}
      <div className="bg-[#0a192f]/50 rounded-xl p-4 sm:p-6 border border-[#8892b0]/10">
        <PhaseHeader phase={phase} />

        {/* Projects list or empty state */}
        <div className="ml-7 pl-4">
          {hasProjects ? (
            phase.projects.map((project, i) => (
              <CommitCard
                key={project.id}
                project={project}
                isLast={i === phase.projects.length - 1}
              />
            ))
          ) : (
            <div className="py-4 text-sm text-[#8892b0] italic border-l-2 border-[#8892b0]/20 pl-4">
              Company projects are confidential. Check highlights above for technologies used.
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// Tab type
type TabType = 'career' | 'personal';

// Personal Projects Content
function PersonalProjectsContent() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      <div className="bg-[#0a192f]/50 rounded-xl p-4 sm:p-6 border border-[#10b981]/20">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-[#10b981]/20 flex items-center justify-center">
            <Beaker size={18} className="text-[#10b981]" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[#ccd6f6]">Side Projects & Experiments</h3>
            <p className="text-xs text-[#8892b0]">Things I'm building outside of work</p>
          </div>
        </div>

        <div className="ml-2 pl-4 border-l-2 border-[#10b981]/30">
          {personalProjects.map((project, i) => (
            <CommitCard
              key={project.id}
              project={project}
              isLast={i === personalProjects.length - 1}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// Main Projects Component
export default function Projects() {
  const [activeTab, setActiveTab] = useState<TabType>('career');

  return (
    <section id="projects" className="py-20 bg-[#0a192f] px-4 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-2">
            <GitBranchIcon size={28} />
            <h2 className="text-3xl sm:text-4xl font-bold text-[#ccd6f6]">My Journey</h2>
          </div>
          <div className="w-20 h-1 bg-[#db2777] mx-auto mb-4" />
          <p className="text-[#8892b0]">Projects & experiences along the way</p>
        </motion.div>

        {/* Tab Switcher */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="flex justify-center mb-8"
        >
          <div className="inline-flex bg-[#112240] rounded-lg p-1 border border-[#8892b0]/20">
            <button
              type="button"
              onClick={() => setActiveTab('career')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                activeTab === 'career'
                  ? 'bg-[#db2777] text-white shadow-[0_0_15px_rgba(219,39,119,0.4)]'
                  : 'text-[#8892b0] hover:text-[#ccd6f6]'
              }`}
            >
              Career
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('personal')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                activeTab === 'personal'
                  ? 'bg-[#10b981] text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                  : 'text-[#8892b0] hover:text-[#ccd6f6]'
              }`}
            >
              Personal
            </button>
          </div>
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'career' ? (
            <motion.div
              key="career"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              {careerPhases.map((phase, index) => (
                <PhaseSection key={phase.id} phase={phase} index={index} />
              ))}
            </motion.div>
          ) : (
            <PersonalProjectsContent key="personal" />
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
