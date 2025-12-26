import { useState } from 'react';
import { Link } from 'react-scroll';
import { Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Modern animated hamburger component
function AnimatedHamburger({ isOpen, onClick }: { isOpen: boolean; onClick: () => void }) {
  return (
    <button
      className="relative w-10 h-10 flex items-center justify-center lg:hidden focus:outline-none"
      onClick={onClick}
      aria-label="Toggle menu"
    >
      <div className="relative w-6 h-5 flex flex-col justify-between">
        {/* Top line */}
        <motion.span
          className="absolute h-0.5 w-full bg-[#ccd6f6] rounded-full origin-left"
          style={{ top: 0 }}
          animate={{
            rotate: isOpen ? 45 : 0,
            y: isOpen ? 0 : 0,
            width: isOpen ? '100%' : '100%',
          }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        />
        {/* Middle line */}
        <motion.span
          className="absolute h-0.5 bg-[#db2777] rounded-full"
          style={{ top: '50%', translateY: '-50%' }}
          animate={{
            opacity: isOpen ? 0 : 1,
            scaleX: isOpen ? 0 : 1,
            width: '75%',
          }}
          transition={{ duration: 0.2 }}
        />
        {/* Bottom line */}
        <motion.span
          className="absolute h-0.5 w-full bg-[#ccd6f6] rounded-full origin-left"
          style={{ bottom: 0 }}
          animate={{
            rotate: isOpen ? -45 : 0,
            y: isOpen ? -2 : 0,
            width: isOpen ? '100%' : '50%',
          }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        />
      </div>
    </button>
  );
}

const navLinks = [
  { name: 'Home', to: 'home' },
  { name: 'About', to: 'about' },
  { name: 'Skills', to: 'skills' },
  { name: 'Projects', to: 'projects' },
  { name: 'GitHub', to: 'github' },
  { name: 'Contact', to: 'contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="navbar fixed top-0 left-0 right-0 z-50 bg-[#0a192f]/95 backdrop-blur-md border-b border-[#8892b0]/10 px-4 lg:px-8">
      <div className="navbar-start">
        <Link to="home" smooth={true} duration={500} className="cursor-pointer">
          <motion.div className="text-2xl font-bold" whileHover={{ scale: 1.05 }}>
            <span className="text-[#ccd6f6]">&lt;</span>
            <span className="text-[#db2777]">AC</span>
            <span className="text-[#ccd6f6]">/&gt;</span>
          </motion.div>
        </Link>
      </div>

      {/* Desktop Navigation */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 gap-1">
          {navLinks.map((link) => (
            <li key={link.to}>
              <Link
                to={link.to}
                smooth={true}
                duration={500}
                offset={-80}
                spy={true}
                activeClass="!text-[#db2777]"
                className="text-[#ccd6f6] hover:text-[#db2777] transition-colors cursor-pointer font-medium"
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="navbar-end gap-2">
        <a
          href="/Abhishek-Chatterjee-Resume.pdf"
          download
          className="btn btn-primary btn-sm gap-2 hidden sm:flex"
        >
          <Download size={16} />
          Resume
        </a>

        {/* Mobile menu button - Modern animated hamburger */}
        <AnimatedHamburger isOpen={isOpen} onClick={() => setIsOpen(!isOpen)} />
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 bg-[#112240] border-b border-[#8892b0]/10 lg:hidden"
          >
            <ul className="menu p-4">
              {navLinks.map((link, index) => (
                <motion.li
                  key={link.to}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    to={link.to}
                    smooth={true}
                    duration={500}
                    offset={-80}
                    onClick={() => setIsOpen(false)}
                    className="text-[#ccd6f6] hover:text-[#db2777] transition-colors cursor-pointer"
                  >
                    {link.name}
                  </Link>
                </motion.li>
              ))}
              <motion.li
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: navLinks.length * 0.05 }}
              >
                <a
                  href="/Abhishek-Chatterjee-Resume.pdf"
                  download
                  className="btn btn-primary btn-sm gap-2 mt-2"
                >
                  <Download size={16} />
                  Resume
                </a>
              </motion.li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
