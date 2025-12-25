import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, FileText } from 'lucide-react';

const socials = [
  { name: 'LinkedIn', url: 'https://www.linkedin.com/in/abhishekchatterjee-saheb1337/', icon: Linkedin, color: 'bg-[#0077B5]' },
  { name: 'GitHub', url: 'https://github.com/abhishek1337chatterjee', icon: Github, color: 'bg-[#333]' },
  { name: 'Email', url: 'mailto:abhishek1337chatterjee@gmail.com', icon: Mail, color: 'bg-[#25D366]' },
  { name: 'Resume', url: '/Abhishek-Chatterjee-Resume.pdf', icon: FileText, color: 'bg-gray-600' },
];

export default function SocialSidebar() {
  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      className="fixed left-0 top-1/3 z-40 hidden lg:flex flex-col"
    >
      {socials.map((social, index) => (
        <motion.a
          key={social.name}
          href={social.url}
          target={social.url.startsWith('http') ? '_blank' : undefined}
          rel={social.url.startsWith('http') ? 'noopener noreferrer' : undefined}
          download={social.name === 'Resume' ? true : undefined}
          className={`group flex items-center ${social.color} w-12 hover:w-32 transition-all duration-300 overflow-hidden`}
          initial={{ x: -50 }}
          animate={{ x: 0 }}
          transition={{ delay: 0.6 + index * 0.1 }}
          whileHover={{ x: 5 }}
        >
          <div className="flex items-center justify-center w-12 h-12 shrink-0">
            <social.icon size={20} className="text-white" />
          </div>
          <span className="text-white text-sm font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {social.name}
          </span>
        </motion.a>
      ))}
    </motion.div>
  );
}
