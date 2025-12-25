import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';

import { projects } from '../../data/projects';

// Custom GitHub icon to avoid deprecation warning
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

export default function Projects() {
  return (
    <section id="projects" className="py-20 bg-[#0a192f] px-4 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-[#ccd6f6] mb-2">
            My Projects
          </h2>
          <div className="w-20 h-1 bg-[#db2777] mx-auto mb-4" />
          <p className="text-[#8892b0]">Checkout some of my recent works</p>
        </motion.div>

        <div className="space-y-16">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`flex flex-col ${
                index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
              } gap-8 items-center`}
            >
              {/* Project Image */}
              <motion.div
                className="flex-1 w-full"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <div className="relative group rounded-lg overflow-hidden border border-[#8892b0]/20">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-auto object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a192f]/90 via-[#0a192f]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-8">
                    <div className="flex gap-4">
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-sm btn-primary gap-2"
                      >
                        <GitHubIcon size={16} />
                        Code
                      </a>
                      <a
                        href={project.deployedUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-sm btn-secondary gap-2"
                      >
                        <ExternalLink size={16} />
                        Live
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Project Details */}
              <div className="flex-1 w-full">
                <h3 className="text-2xl font-bold text-[#ccd6f6] mb-2 flex items-center gap-2">
                  {project.title}
                  <div className="h-px flex-1 bg-[#8892b0]/20" />
                </h3>

                <p className="text-[#8892b0] mb-4">{project.description}</p>

                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-[#db2777] mb-2">Tech Stack:</h4>
                  <div className="flex flex-wrap gap-2">
                    {project.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="badge badge-outline badge-primary text-xs"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-[#06b6d4] mb-2">Features:</h4>
                  <p className="text-[#8892b0] text-sm">
                    {project.features.join(' || ')}
                  </p>
                </div>

                {project.responsibilities && project.responsibilities.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-[#db2777] mb-2">
                      Area of responsibility:
                    </h4>
                    <ul className="text-[#8892b0] text-sm list-disc list-inside">
                      {project.responsibilities.map((resp, i) => (
                        <li key={i}>{resp}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {project.teamSize && (
                  <p className="text-[#8892b0] text-sm mb-4">
                    A collaborative project built by a team of{' '}
                    <span className="text-[#db2777] font-semibold">{project.teamSize}</span>{' '}
                    full stack web developers
                    {project.duration && ` executed in ${project.duration}`}.
                  </p>
                )}

                <div className="flex gap-4">
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm btn-outline btn-primary gap-2"
                  >
                    <GitHubIcon size={16} />
                    GitHub
                  </a>
                  <a
                    href={project.deployedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm btn-outline btn-secondary gap-2"
                  >
                    <ExternalLink size={16} />
                    Deployed
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
