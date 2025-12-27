import { motion } from 'framer-motion';
import { Cloud } from 'lucide-react';

interface SkillItem {
  name: string;
  icon: string;
}

interface AwsService {
  name: string;
  shortName: string;
  color: string;
}

const frontendSkills: SkillItem[] = [
  {
    name: 'HTML',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg',
  },
  {
    name: 'CSS',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg',
  },
  {
    name: 'JavaScript',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg',
  },
  {
    name: 'TypeScript',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg',
  },
  {
    name: 'React.js',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
  },
  {
    name: 'Next.js',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg',
  },
  {
    name: 'Redux',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redux/redux-original.svg',
  },
  {
    name: 'Tailwind',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg',
  },
];

const backendSkills: SkillItem[] = [
  {
    name: 'Node.js',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
  },
  {
    name: 'Express',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg',
  },
  {
    name: 'MongoDB',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg',
  },
  {
    name: 'DynamoDB',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/dynamodb/dynamodb-original.svg',
  },
];

const awsServices: AwsService[] = [
  { name: 'Lambda', shortName: 'λ', color: '#FF9900' },
  { name: 'Step Functions', shortName: 'SF', color: '#FF4F8B' },
  { name: 'EventBridge', shortName: 'EB', color: '#FF4F8B' },
  { name: 'SQS', shortName: 'SQS', color: '#FF4F8B' },
  { name: 'SNS', shortName: 'SNS', color: '#DD344C' },
  { name: 'Cognito', shortName: 'COG', color: '#DD344C' },
  { name: 'SES', shortName: 'SES', color: '#DD344C' },
  { name: 'Temporal.io', shortName: 'T', color: '#06b6d4' },
];

const tools: SkillItem[] = [
  { name: 'Git', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg' },
  {
    name: 'GitHub',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg',
  },
  {
    name: 'Docker',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg',
  },
  {
    name: 'Ubuntu',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ubuntu/ubuntu-original.svg',
  },
  {
    name: 'Linux',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg',
  },
  {
    name: 'VS Code',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg',
  },
  {
    name: 'Sanity',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/sanity/sanity-original.svg',
  },
  {
    name: 'NPM',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/npm/npm-original-wordmark.svg',
  },
  {
    name: 'Vercel',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vercel/vercel-original.svg',
  },
  {
    name: 'Cypress',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cypressio/cypressio-original.svg',
  },
  {
    name: 'Serverless',
    icon: 'https://user-images.githubusercontent.com/2752551/30405068-a7733b34-989e-11e7-8f66-7badaf1373ed.png',
  },
  {
    name: 'AWS SAM',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-original-wordmark.svg',
  },
  {
    name: 'Biome',
    icon: 'https://biomejs.dev/img/favicon.svg',
  },
];

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

function SkillCard({ skill }: { skill: SkillItem }) {
  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ scale: 1.05, y: -5 }}
      className="group relative"
    >
      <div className="absolute -inset-0.5 bg-gradient-to-r from-[#db2777] to-[#06b6d4] rounded-xl blur opacity-0 group-hover:opacity-30 transition duration-500" />

      <div className="relative card bg-[#112240] hover:bg-[#112240]/80 border border-[#8892b0]/10 hover:border-[#db2777]/30 transition-all duration-300">
        <div className="card-body items-center text-center p-4 sm:p-6">
          <motion.img
            src={skill.icon}
            alt={skill.name}
            className="w-10 h-10 sm:w-12 sm:h-12"
            whileHover={{ rotate: 10 }}
            transition={{ type: 'spring', stiffness: 300 }}
          />
          <h3 className="card-title text-xs sm:text-sm text-[#ccd6f6] mt-2">{skill.name}</h3>
        </div>
      </div>
    </motion.div>
  );
}

function AwsServiceCard({ service }: { service: AwsService }) {
  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ scale: 1.05, y: -5 }}
      className="group relative"
    >
      <div
        className="absolute -inset-0.5 rounded-xl blur opacity-0 group-hover:opacity-40 transition duration-500"
        style={{ backgroundColor: service.color }}
      />

      <div className="relative card bg-[#112240] hover:bg-[#112240]/80 border border-[#8892b0]/10 hover:border-[#FF9900]/30 transition-all duration-300">
        <div className="card-body items-center text-center p-4 sm:p-6">
          <div
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center font-bold text-white text-lg"
            style={{ backgroundColor: service.color }}
          >
            {service.shortName}
          </div>
          <h3 className="card-title text-xs sm:text-sm text-[#ccd6f6] mt-2">{service.name}</h3>
        </div>
      </div>
    </motion.div>
  );
}

interface SkillSectionProps {
  title: string;
  skills: SkillItem[];
  columns?: string;
  delay?: number;
}

function SkillSection({
  title,
  skills,
  columns = 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5',
  delay = 0,
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
        <h3 className="text-xl sm:text-2xl font-bold text-[#ccd6f6] mb-2 text-center">{title}</h3>
        <div className="w-12 h-0.5 bg-[#db2777] mx-auto" />
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className={`grid ${columns} gap-3 sm:gap-4`}
      >
        {skills.map((skill) => (
          <SkillCard key={skill.name} skill={skill} />
        ))}
      </motion.div>
    </div>
  );
}

export default function Skills() {
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

        {/* Cloud & Serverless Section */}
        <div className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-6"
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <Cloud size={24} className="text-[#FF9900]" />
              <h3 className="text-xl sm:text-2xl font-bold text-[#ccd6f6]">Cloud & Serverless</h3>
            </div>
            <div className="w-12 h-0.5 bg-[#FF9900] mx-auto" />
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-3 sm:gap-4"
          >
            {awsServices.map((service) => (
              <AwsServiceCard key={service.name} service={service} />
            ))}
          </motion.div>
        </div>

        <SkillSection title="Backend" skills={backendSkills} columns="grid-cols-2 sm:grid-cols-4" delay={0.2} />

        <SkillSection
          title="Tools & Platforms"
          skills={tools}
          columns="grid-cols-2 sm:grid-cols-5 lg:grid-cols-5"
          delay={0.3}
        />

        <SkillSection
          title="Frontend"
          skills={frontendSkills}
          columns="grid-cols-2 sm:grid-cols-4 lg:grid-cols-4"
          delay={0.4}
        />
      </div>
    </section>
  );
}
