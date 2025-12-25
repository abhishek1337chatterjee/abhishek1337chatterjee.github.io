import { motion } from 'framer-motion';
import { Link } from 'react-scroll';
import { Typewriter } from 'react-simple-typewriter';
import { ArrowDown, Github, Linkedin, Download } from 'lucide-react';
import profilePic from '../../assets/images/profile-pic.png';

export default function Hero() {
  return (
    <section
      id="home"
      className="min-h-screen flex items-center justify-center bg-[#0a192f] pt-20 px-4 lg:px-8"
    >
      <div className="max-w-7xl mx-auto w-full">
        <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-8 lg:gap-16">
          {/* Text Content */}
          <motion.div
            className="flex-1 text-center lg:text-left"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.p
              className="text-lg sm:text-xl text-[#8892b0] mb-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Hi{' '}
              <motion.span
                className="inline-block"
                animate={{ rotate: [0, 20, -20, 20, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
              >
                👋
              </motion.span>
              ,
            </motion.p>

            <motion.h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#ccd6f6] mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              I'm{' '}
              <span className="bg-gradient-to-r from-[#db2777] to-[#06b6d4] bg-clip-text text-transparent">
                Abhishek Chatterjee
              </span>
            </motion.h1>

            <motion.div
              className="text-xl sm:text-2xl lg:text-3xl text-[#db2777] font-medium mb-8 h-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              a{' '}
              <Typewriter
                words={[
                  'Serverless Engineer',
                  'React Developer',
                  'AWS Enthusiast',
                  'Open Source Lover',
                  'Linux Geek',
                  'Cloud Architect',
                  'Problem Solver',
                ]}
                loop={true}
                cursor
                cursorStyle="|"
                typeSpeed={70}
                deleteSpeed={50}
                delaySpeed={2000}
              />
            </motion.div>

            <motion.div
              className="flex flex-wrap gap-4 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Link
                to="projects"
                smooth={true}
                duration={500}
                offset={-80}
                className="btn btn-outline btn-primary gap-2 group cursor-pointer"
              >
                View Work
                <ArrowDown
                  size={16}
                  className="group-hover:translate-y-1 transition-transform"
                />
              </Link>

              <a
                href="/Abhishek-Chatterjee-Resume.pdf"
                download
                className="btn btn-accent gap-2"
              >
                <Download size={16} />
                Resume
              </a>

              <div className="flex gap-2">
                <a
                  href="https://github.com/abhishek1337chatterjee"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-ghost btn-square text-[#ccd6f6]"
                >
                  <Github size={20} />
                </a>
                <a
                  href="https://www.linkedin.com/in/abhishekchatterjee-saheb1337/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-ghost btn-square text-[#ccd6f6]"
                >
                  <Linkedin size={20} />
                </a>
              </div>
            </motion.div>
          </motion.div>

          {/* Profile Image */}
          <motion.div
            className="flex-1 flex justify-center lg:justify-end"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96">
              <svg
                className="absolute inset-0 w-full h-full"
                viewBox="0 0 200 200"
              >
                <polygon
                  points="100,10 180,50 180,150 100,190 20,150 20,50"
                  fill="#06b6d4"
                  className="drop-shadow-lg"
                />
                <line x1="100" y1="10" x2="100" y2="190" stroke="white" strokeWidth="0.5" opacity="0.5" />
                <line x1="20" y1="50" x2="180" y2="150" stroke="white" strokeWidth="0.5" opacity="0.5" />
                <line x1="180" y1="50" x2="20" y2="150" stroke="white" strokeWidth="0.5" opacity="0.5" />
                <line x1="20" y1="50" x2="180" y2="50" stroke="white" strokeWidth="0.5" opacity="0.5" />
                <line x1="20" y1="150" x2="180" y2="150" stroke="white" strokeWidth="0.5" opacity="0.5" />
                <line x1="100" y1="10" x2="20" y2="50" stroke="white" strokeWidth="0.5" opacity="0.5" />
                <line x1="100" y1="10" x2="180" y2="50" stroke="white" strokeWidth="0.5" opacity="0.5" />
                <line x1="100" y1="190" x2="20" y2="150" stroke="white" strokeWidth="0.5" opacity="0.5" />
                <line x1="100" y1="190" x2="180" y2="150" stroke="white" strokeWidth="0.5" opacity="0.5" />
              </svg>
              <img
                src={profilePic}
                alt="Abhishek Chatterjee"
                className="absolute inset-0 w-full h-full object-cover"
                style={{ clipPath: 'polygon(50% 5%, 90% 25%, 90% 75%, 50% 95%, 10% 75%, 10% 25%)' }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
