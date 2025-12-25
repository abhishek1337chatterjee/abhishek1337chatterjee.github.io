import { motion, AnimatePresence } from 'framer-motion';
import { Mail, FileText, Linkedin } from 'lucide-react';
import { useState, type FC } from 'react';

// Custom icons to avoid deprecation warnings
const GitHubIcon: FC<{ size?: number; className?: string; style?: React.CSSProperties }> = ({ size = 18, className = '', style = {} }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const XIcon: FC<{ size?: number; className?: string; style?: React.CSSProperties }> = ({ size = 18, className = '', style = {} }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} style={style}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

interface SocialLink {
  name: string;
  url: string;
  icon: FC<{ size?: number; className?: string; style?: React.CSSProperties }>;
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
    icon: GitHubIcon,
    gradient: 'from-[#333] to-[#6e5494]',
    hoverColor: '#6e5494'
  },
  {
    name: 'X',
    url: 'https://x.com/saheb1337',
    icon: XIcon,
    gradient: 'from-[#000] to-[#333]',
    hoverColor: '#000'
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

// Mobile FAB Component with vertical stack animation
function MobileSocialFAB() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-40 lg:hidden">
      {/* Vertical stack of social icons going UP */}
      <AnimatePresence>
        {isOpen && socials.map((social, index) => {
          const Icon = social.icon;
          // Stack vertically upward with spacing
          const yOffset = -(index + 1) * 60; // 60px spacing going up

          return (
            <motion.a
              key={social.name}
              href={social.url}
              target={social.url.startsWith('http') ? '_blank' : undefined}
              rel={social.url.startsWith('http') ? 'noopener noreferrer' : undefined}
              download={social.name === 'Resume' ? true : undefined}
              initial={{ scale: 0, y: 0, opacity: 0 }}
              animate={{
                scale: 1,
                y: yOffset,
                opacity: 1
              }}
              exit={{ scale: 0, y: 0, opacity: 0 }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 24,
                delay: index * 0.05
              }}
              className={`absolute bottom-0 right-0 flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br ${social.gradient} shadow-lg`}
              style={{
                boxShadow: `0 4px 15px ${social.hoverColor}40`,
              }}
              whileTap={{ scale: 0.9 }}
            >
              <Icon size={20} className="text-white" />
            </motion.a>
          );
        })}
      </AnimatePresence>

      {/* Main FAB Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-[#db2777] to-[#9333ea] shadow-xl z-10"
        whileTap={{ scale: 0.95 }}
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        style={{
          boxShadow: '0 4px 20px rgba(219, 39, 119, 0.4)',
        }}
      >
        {/* Animated icon - plus to X */}
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.3 }}
          className="relative w-6 h-6"
        >
          {/* Horizontal line */}
          <motion.span
            className="absolute top-1/2 left-0 w-full h-0.5 bg-white rounded-full -translate-y-1/2"
          />
          {/* Vertical line */}
          <motion.span
            className="absolute top-0 left-1/2 h-full w-0.5 bg-white rounded-full -translate-x-1/2"
          />
        </motion.div>

        {/* Pulse ring when closed */}
        {!isOpen && (
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-[#db2777]"
            initial={{ scale: 1, opacity: 0.5 }}
            animate={{ scale: 1.5, opacity: 0 }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        )}
      </motion.button>
    </div>
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

      {/* Mobile FAB with Fan-out */}
      <MobileSocialFAB />
    </>
  );
}
