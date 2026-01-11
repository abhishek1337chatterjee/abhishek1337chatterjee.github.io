import { motion } from 'framer-motion';
import { Cloud, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getSkills, type SanitySkill } from '../../lib/sanity';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

// Skill card with icon URL
function SkillCard({ skill }: { skill: SanitySkill }) {
  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ scale: 1.05, y: -5 }}
      className="group relative"
    >
      <div className="absolute -inset-0.5 bg-gradient-to-r from-[#db2777] to-[#06b6d4] rounded-xl blur opacity-0 group-hover:opacity-30 transition duration-500" />

      <div className="relative card bg-[#112240] hover:bg-[#112240]/80 border border-[#8892b0]/10 hover:border-[#db2777]/30 transition-all duration-300">
        <div className="card-body items-center text-center p-4 sm:p-6">
          {skill.iconUrl && (
            <motion.img
              src={skill.iconUrl}
              alt={skill.name}
              className="w-10 h-10 sm:w-12 sm:h-12"
              whileHover={{ rotate: 10 }}
              transition={{ type: 'spring', stiffness: 300 }}
            />
          )}
          <h3 className="card-title text-xs sm:text-sm text-[#ccd6f6] mt-2">{skill.name}</h3>
        </div>
      </div>
    </motion.div>
  );
}

// AWS/Cloud service card with shortName and color
function CloudServiceCard({ skill }: { skill: SanitySkill }) {
  const color = skill.color || '#FF9900';

  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ scale: 1.05, y: -5 }}
      className="group relative"
    >
      <div
        className="absolute -inset-0.5 rounded-xl blur opacity-0 group-hover:opacity-40 transition duration-500"
        style={{ backgroundColor: color }}
      />

      <div className="relative card bg-[#112240] hover:bg-[#112240]/80 border border-[#8892b0]/10 hover:border-[#FF9900]/30 transition-all duration-300">
        <div className="card-body items-center text-center p-4 sm:p-6">
          <div
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center font-bold text-white text-lg"
            style={{ backgroundColor: color }}
          >
            {skill.shortName || skill.name.substring(0, 2)}
          </div>
          <h3 className="card-title text-xs sm:text-sm text-[#ccd6f6] mt-2">{skill.name}</h3>
        </div>
      </div>
    </motion.div>
  );
}

interface SkillSectionProps {
  title: string;
  skills: SanitySkill[];
  columns?: string;
  delay?: number;
  isCloud?: boolean;
}

function SkillSection({
  title,
  skills,
  columns = 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5',
  delay = 0,
  isCloud = false,
}: SkillSectionProps) {
  return (
    <div className="mb-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay }}
        className="mb-6"
      >
        {isCloud ? (
          <div className="flex items-center justify-center gap-2 mb-2">
            <Cloud size={24} className="text-[#FF9900]" />
            <h3 className="text-xl sm:text-2xl font-bold text-[#ccd6f6]">{title}</h3>
          </div>
        ) : (
          <h3 className="text-xl sm:text-2xl font-bold text-[#ccd6f6] mb-2 text-center">{title}</h3>
        )}
        <div className={`w-12 h-0.5 mx-auto ${isCloud ? 'bg-[#FF9900]' : 'bg-[#db2777]'}`} />
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className={`grid ${columns} gap-3 sm:gap-4`}
      >
        {skills.map((skill) =>
          isCloud ? (
            <CloudServiceCard key={skill._id} skill={skill} />
          ) : (
            <SkillCard key={skill._id} skill={skill} />
          ),
        )}
      </motion.div>
    </div>
  );
}

// Loading skeleton
function SkillsSkeleton() {
  return (
    <div className="flex items-center justify-center py-20">
      <Loader2 className="w-8 h-8 animate-spin text-[#06b6d4]" />
      <span className="ml-3 text-[#8892b0]">Loading skills...</span>
    </div>
  );
}

export default function Skills() {
  const [skills, setSkills] = useState<SanitySkill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSkills()
      .then(setSkills)
      .finally(() => setLoading(false));
  }, []);

  // Group skills by category
  const frontendSkills = skills.filter((s) => s.category === 'frontend');
  const backendSkills = skills.filter((s) => s.category === 'backend');
  const cloudSkills = skills.filter((s) => s.category === 'cloud');
  const toolSkills = skills.filter((s) => s.category === 'tools');

  return (
    <section id="skills" className="py-20 bg-[#112240]/30 px-4 lg:px-8 relative overflow-hidden">
      {/* Subtle diagonal accent line */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 -right-20 w-[600px] h-px bg-gradient-to-r from-transparent via-[#06b6d4]/20 to-transparent rotate-12" />
        <div className="absolute bottom-1/3 -left-20 w-[500px] h-px bg-gradient-to-r from-transparent via-[#db2777]/15 to-transparent -rotate-12" />
      </div>
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-[#ccd6f6] mb-2">My Skills</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-[#db2777] to-[#06b6d4] mx-auto rounded-full" />
        </motion.div>

        {loading ? (
          <SkillsSkeleton />
        ) : (
          <>
            {/* Cloud & Serverless Section */}
            {cloudSkills.length > 0 && (
              <SkillSection
                title="Cloud & Serverless"
                skills={cloudSkills}
                columns="grid-cols-2 sm:grid-cols-4 lg:grid-cols-4"
                delay={0.1}
                isCloud
              />
            )}

            {/* Backend Section */}
            {backendSkills.length > 0 && (
              <SkillSection
                title="Backend"
                skills={backendSkills}
                columns="grid-cols-2 sm:grid-cols-4"
                delay={0.2}
              />
            )}

            {/* Tools & Platforms Section */}
            {toolSkills.length > 0 && (
              <SkillSection
                title="Tools & Platforms"
                skills={toolSkills}
                columns="grid-cols-2 sm:grid-cols-5 lg:grid-cols-5"
                delay={0.3}
              />
            )}

            {/* Frontend Section */}
            {frontendSkills.length > 0 && (
              <SkillSection
                title="Frontend"
                skills={frontendSkills}
                columns="grid-cols-2 sm:grid-cols-4 lg:grid-cols-4"
                delay={0.4}
              />
            )}
          </>
        )}
      </div>
    </section>
  );
}
