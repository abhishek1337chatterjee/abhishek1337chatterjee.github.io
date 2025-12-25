import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, FileText, Twitter } from 'lucide-react';
import { useState } from 'react';

interface SocialLink {
  name: string;
  url: string;
  icon: typeof Github;
  gradient: string;
  hoverColor: string;
}

const socials: SocialLink[] = [
  {
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/in/abhishekchatterjee-saheb1337/',
    icon: Linkedin,
    gradient: 'from-[#0077B5] to-[#00a0dc]',
    hoverColor: '#0077B5'
  },
  {
    name: 'GitHub',
    url: 'https://github.com/abhishek1337chatterjee',
    icon: Github,
    gradient: 'from-[#333] to-[#6e5494]',
    hoverColor: '#6e5494'
  },
  {
    name: 'Twitter',
    url: 'https://twitter.com/saheb1337',
    icon: Twitter,
    gradient: 'from-[#1DA1F2] to-[#0d8bd9]',
    hoverColor: '#1DA1F2'
  },
  {
    name: 'Email',
    url: 'mailto:abhishek1337chatterjee@gmail.com',
    icon: Mail,
    gradient: 'from-[#db2777] to-[#f472b6]',
    hoverColor: '#db2777'
  },
  {
    name: 'Resume',
    url: '/Abhishek-Chatterjee-Resume.pdf',
    icon: FileText,
    gradient: 'from-[#06b6d4] to-[#22d3ee]',
    hoverColor: '#06b6d4'
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.8,
    },
  },
};

const itemVariants = {
  hidden: { x: -20, opacity: 0 },
  visible: { x: 0, opacity: 1 },
};

function SocialIcon({ social }: { social: SocialLink }) {
  const [isHovered, setIsHovered] = useState(false);
  const Icon = social.icon;

  return (
    <motion.div
      variants={itemVariants}
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Tooltip */}
      <motion.div
        initial={{ opacity: 0, x: 10, scale: 0.8 }}
        animate={{
          opacity: isHovered ? 1 : 0,
          x: isHovered ? 0 : 10,
          scale: isHovered ? 1 : 0.8
        }}
        transition={{ duration: 0.2 }}
        className="absolute left-full ml-4 top-1/2 -translate-y-1/2 pointer-events-none"
      >
        <div className={`px-3 py-1.5 rounded-lg bg-gradient-to-r ${social.gradient} text-white text-sm font-medium whitespace-nowrap shadow-lg`}>
          {social.name}
        </div>
        {/* Arrow */}
        <div
          className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-r-[6px]"
          style={{ borderRightColor: social.hoverColor }}
        />
      </motion.div>

      {/* Icon Button */}
      <motion.a
        href={social.url}
        target={social.url.startsWith('http') ? '_blank' : undefined}
        rel={social.url.startsWith('http') ? 'noopener noreferrer' : undefined}
        download={social.name === 'Resume' ? true : undefined}
        className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-[#112240]/80 backdrop-blur-sm border border-[#8892b0]/10 transition-all duration-300 hover:border-transparent"
        whileHover={{
          scale: 1.15,
          y: -2,
        }}
        whileTap={{ scale: 0.95 }}
        style={{
          boxShadow: isHovered ? `0 0 20px ${social.hoverColor}40, 0 0 40px ${social.hoverColor}20` : 'none',
        }}
      >
        {/* Gradient background on hover */}
        <motion.div
          className={`absolute inset-0 rounded-xl bg-gradient-to-br ${social.gradient} opacity-0 pointer-events-none`}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />

        {/* Icon */}
        <Icon
          size={18}
          className="relative z-10 transition-colors duration-300"
          style={{ color: isHovered ? '#ffffff' : '#8892b0' }}
        />
      </motion.a>

      {/* Pulse ring effect */}
      {isHovered && (
        <motion.div
          className="absolute inset-0 rounded-xl pointer-events-none"
          initial={{ scale: 1, opacity: 0.5 }}
          animate={{ scale: 1.5, opacity: 0 }}
          transition={{ duration: 0.6, repeat: Infinity }}
          style={{ border: `2px solid ${social.hoverColor}` }}
        />
      )}
    </motion.div>
  );
}

export default function SocialSidebar() {
  return (
    <>
      {/* Desktop Sidebar */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="fixed left-6 top-1/2 -translate-y-1/2 z-40 hidden lg:block"
      >
        {/* Glassmorphism container */}
        <div className="relative p-2 rounded-2xl bg-[#0a192f]/60 backdrop-blur-md border border-[#8892b0]/10 shadow-2xl">
          {/* Decorative gradient border */}
          <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-b from-[#db2777]/20 via-transparent to-[#06b6d4]/20 -z-10" />

          {/* Vertical line decoration */}
          <div className="absolute left-1/2 -translate-x-1/2 top-0 h-full w-px bg-gradient-to-b from-transparent via-[#8892b0]/20 to-transparent" />

          <div className="flex flex-col gap-3">
            {socials.map((social) => (
              <SocialIcon key={social.name} social={social} />
            ))}
          </div>
        </div>

        {/* Bottom line */}
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: 80 }}
          transition={{ delay: 1.5, duration: 0.5 }}
          className="absolute left-1/2 -translate-x-1/2 top-full mt-4 w-px bg-gradient-to-b from-[#8892b0]/30 to-transparent"
        />
      </motion.div>

      {/* Mobile Bottom Bar */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="fixed bottom-0 left-0 right-0 z-40 lg:hidden"
      >
        <div className="mx-4 mb-4 p-3 rounded-2xl bg-[#0a192f]/80 backdrop-blur-md border border-[#8892b0]/10 shadow-2xl">
          <div className="flex justify-around items-center">
            {socials.map((social) => {
              const Icon = social.icon;
              return (
                <motion.a
                  key={social.name}
                  href={social.url}
                  target={social.url.startsWith('http') ? '_blank' : undefined}
                  rel={social.url.startsWith('http') ? 'noopener noreferrer' : undefined}
                  download={social.name === 'Resume' ? true : undefined}
                  className="flex flex-col items-center gap-1 p-2"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <div className={`p-2 rounded-xl bg-gradient-to-br ${social.gradient}`}>
                    <Icon size={18} className="text-white" />
                  </div>
                  <span className="text-[10px] text-[#8892b0]">{social.name}</span>
                </motion.a>
              );
            })}
          </div>
        </div>
      </motion.div>
    </>
  );
}
