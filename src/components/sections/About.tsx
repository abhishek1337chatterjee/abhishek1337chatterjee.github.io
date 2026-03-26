import { motion } from 'framer-motion';
import {
  Briefcase,
  Cloud,
  Compass,
  Download,
  Heart,
  Loader2,
  type LucideIcon,
  Terminal,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  getAbout,
  getSiteSettings,
  type HighlightedPhrase,
  type SanityAbout,
  type SanitySiteSettings,
} from '../../lib/sanity';
import type { ExploringItem } from '../../types';
import { handleResumeClick } from '../../utils/resume';

// Icon mapping based on highlight text keywords
const iconMapping: Record<string, { icon: LucideIcon; color: string }> = {
  experience: { icon: Briefcase, color: 'text-[#db2777]' },
  serverless: { icon: Cloud, color: 'text-[#06b6d4]' },
  linux: { icon: Terminal, color: 'text-[#22c55e]' },
  'open source': { icon: Heart, color: 'text-[#f59e0b]' },
};

// Color mapping for highlighted phrases
const highlightColorMap: Record<string, string> = {
  cyan: 'text-[#06b6d4]',
  pink: 'text-[#db2777]',
  green: 'text-[#22c55e]',
  orange: 'text-[#f59e0b]',
  purple: 'text-[#a855f7]',
};

// Color mapping for exploring items (keyed by Sanity color field)
const exploringColorMap: Record<string, { border: string; text: string; bg: string }> = {
  cyan: { border: 'border-l-[#06b6d4]', text: 'text-[#06b6d4]', bg: 'bg-[#06b6d4]/10' },
  pink: { border: 'border-l-[#db2777]', text: 'text-[#db2777]', bg: 'bg-[#db2777]/10' },
  green: { border: 'border-l-[#22c55e]', text: 'text-[#22c55e]', bg: 'bg-[#22c55e]/10' },
  orange: { border: 'border-l-[#f59e0b]', text: 'text-[#f59e0b]', bg: 'bg-[#f59e0b]/10' },
  purple: { border: 'border-l-[#a855f7]', text: 'text-[#a855f7]', bg: 'bg-[#a855f7]/10' },
};

// Function to render text with highlighted phrases
function renderHighlightedText(
  text: string,
  highlights: HighlightedPhrase[] = [],
): React.ReactNode {
  if (!highlights || highlights.length === 0) {
    return text;
  }

  // Sort highlights by length (longest first) to avoid partial matches
  const sortedHighlights = [...highlights].sort((a, b) => b.text.length - a.text.length);

  // Create a regex pattern that matches any of the highlight phrases
  const pattern = sortedHighlights
    .map((h) => h.text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .join('|');

  if (!pattern) return text;

  const regex = new RegExp(`(${pattern})`, 'g');
  const parts = text.split(regex);

  return parts.map((part, index) => {
    const highlight = sortedHighlights.find((h) => h.text === part);
    if (highlight) {
      const colorClass = highlightColorMap[highlight.color] || highlightColorMap.cyan;
      return (
        <span key={index} className={`${colorClass} font-medium`}>
          {part}
        </span>
      );
    }
    return part;
  });
}

function getIconForHighlight(text: string): { icon: LucideIcon; color: string } {
  const lowerText = text.toLowerCase();
  for (const [keyword, config] of Object.entries(iconMapping)) {
    if (lowerText.includes(keyword)) {
      return config;
    }
  }
  // Default fallback
  return { icon: Briefcase, color: 'text-[#8892b0]' };
}

// Loading skeleton
function AboutSkeleton() {
  return (
    <div className="flex items-center justify-center py-20">
      <Loader2 className="w-8 h-8 animate-spin text-[#06b6d4]" />
      <span className="ml-3 text-[#8892b0]">Loading...</span>
    </div>
  );
}

export default function About() {
  const [about, setAbout] = useState<SanityAbout | null>(null);
  const [settings, setSettings] = useState<SanitySiteSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getAbout(), getSiteSettings()])
      .then(([aboutData, settingsData]) => {
        setAbout(aboutData);
        setSettings(settingsData);
      })
      .finally(() => setLoading(false));
  }, []);
  // Parse bio into paragraphs
  const bioParagraphs = about?.bio?.split('\n\n').filter(Boolean) || [];

  return (
    <section id="about" className="py-20 bg-[#0a192f] px-4 lg:px-8 relative overflow-hidden">
      {/* Subtle gradient accent */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#06b6d4]/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#db2777]/5 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
      </div>
      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-[#ccd6f6] mb-2 text-center">
            About Me
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-[#db2777] to-[#06b6d4] mx-auto mb-8 rounded-full" />

          {loading ? (
            <AboutSkeleton />
          ) : about ? (
            <>
              {/* Highlight Cards */}
              {about.highlights && about.highlights.length > 0 && (
                <motion.div
                  className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                >
                  {about.highlights.map((text, index) => {
                    const { icon: Icon, color } = getIconForHighlight(text);
                    return (
                      <motion.div
                        key={text}
                        className="bg-[#112240] rounded-lg p-4 text-center border border-[#8892b0]/10"
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 * index }}
                        whileHover={{ scale: 1.05, y: -3 }}
                      >
                        <Icon className={`w-6 h-6 mx-auto mb-2 ${color}`} />
                        <p className="text-[#ccd6f6] text-sm font-medium">{text}</p>
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}

              {/* Bio */}
              <motion.div
                className="space-y-4 text-[#8892b0] leading-relaxed mb-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                {bioParagraphs.map((paragraph, index) => (
                  <p key={index}>{renderHighlightedText(paragraph, about.highlightedPhrases)}</p>
                ))}
              </motion.div>

              {/* Currently Exploring */}
              {about.currentlyExploring && about.currentlyExploring.length > 0 && (
                <motion.div
                  className="mb-10"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <Compass className="w-5 h-5 text-[#06b6d4]" />
                    <h3 className="text-lg font-semibold text-[#ccd6f6]">Currently Exploring</h3>
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#06b6d4] opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-[#06b6d4]" />
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {about.currentlyExploring.map((item: ExploringItem, index: number) => {
                      const colors = exploringColorMap[item.color] || exploringColorMap.cyan;
                      return (
                        <motion.div
                          key={item.name}
                          className={`${colors.bg} border-l-3 ${colors.border} rounded-r-lg px-4 py-3 backdrop-blur-sm`}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.1 * index + 0.5 }}
                          whileHover={{ x: 4 }}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[#ccd6f6] font-medium text-sm">{item.name}</span>
                            <span
                              className={`text-[10px] uppercase tracking-wider ${colors.text} opacity-70`}
                            >
                              {item.category}
                            </span>
                          </div>
                          {item.description && (
                            <p className="text-[#8892b0] text-xs mt-1">{item.description}</p>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* Download Resume Button */}
              {settings?.resumeUrl && (
                <motion.div
                  className="flex justify-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                >
                  <motion.a
                    href={settings.resumeUrl}
                    onClick={(e) => handleResumeClick(e, settings.resumeUrl!)}
                    className="group relative inline-flex items-center gap-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="absolute -inset-2 bg-gradient-to-r from-[#db2777] to-[#06b6d4] rounded-lg blur opacity-0 group-hover:opacity-50 transition duration-500" />
                    <span className="relative btn btn-accent gap-2">
                      <Download size={18} />
                      Download Resume
                    </span>
                  </motion.a>
                </motion.div>
              )}
            </>
          ) : (
            <p className="text-center text-[#8892b0]">No content available.</p>
          )}
        </motion.div>
      </div>
    </section>
  );
}
