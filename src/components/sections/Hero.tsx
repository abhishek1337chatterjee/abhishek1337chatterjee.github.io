import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-scroll';
import { Typewriter } from 'react-simple-typewriter';
import { ArrowDown, Download } from 'lucide-react';
import profilePic from '../../assets/images/profile-pic.png';

// Custom icons to avoid deprecation warnings
function GithubIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

function LinkedinIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

// Particle field data
const particles = [
  { x: 5, y: 90, size: 3, duration: 15, delay: 0, color: 'cyan' },
  { x: 12, y: 85, size: 2, duration: 18, delay: 2, color: 'pink' },
  { x: 20, y: 95, size: 4, duration: 14, delay: 1, color: 'cyan' },
  { x: 28, y: 88, size: 2, duration: 20, delay: 3, color: 'cyan' },
  { x: 35, y: 92, size: 3, duration: 16, delay: 0.5, color: 'pink' },
  { x: 42, y: 87, size: 2, duration: 19, delay: 4, color: 'cyan' },
  { x: 50, y: 93, size: 4, duration: 15, delay: 1.5, color: 'pink' },
  { x: 58, y: 89, size: 2, duration: 17, delay: 2.5, color: 'cyan' },
  { x: 65, y: 94, size: 3, duration: 18, delay: 0, color: 'cyan' },
  { x: 72, y: 86, size: 2, duration: 14, delay: 3.5, color: 'pink' },
  { x: 80, y: 91, size: 4, duration: 16, delay: 1, color: 'cyan' },
  { x: 88, y: 88, size: 2, duration: 20, delay: 2, color: 'pink' },
  { x: 95, y: 95, size: 3, duration: 15, delay: 4.5, color: 'cyan' },
  { x: 8, y: 82, size: 2, duration: 22, delay: 5, color: 'pink' },
  { x: 25, y: 80, size: 3, duration: 17, delay: 6, color: 'cyan' },
  { x: 45, y: 85, size: 2, duration: 21, delay: 7, color: 'cyan' },
  { x: 62, y: 83, size: 3, duration: 16, delay: 5.5, color: 'pink' },
  { x: 78, y: 81, size: 2, duration: 19, delay: 6.5, color: 'cyan' },
  { x: 92, y: 84, size: 3, duration: 18, delay: 7.5, color: 'pink' },
  { x: 15, y: 78, size: 2, duration: 23, delay: 8, color: 'cyan' },
];

// Particle Field background component
function AnimatedBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Subtle gradient base */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a192f] via-[#0a192f] to-[#0d1f3c]" />

      {/* Floating particles */}
      {particles.map((particle, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.x}%`,
            bottom: `${100 - particle.y}%`,
            background: particle.color === 'cyan'
              ? 'radial-gradient(circle, #06b6d4 0%, rgba(6, 182, 212, 0) 70%)'
              : 'radial-gradient(circle, #db2777 0%, rgba(219, 39, 119, 0) 70%)',
            boxShadow: particle.color === 'cyan'
              ? '0 0 6px 2px rgba(6, 182, 212, 0.4)'
              : '0 0 6px 2px rgba(219, 39, 119, 0.4)',
          }}
          animate={{
            y: [0, -800],
            opacity: [0, 1, 1, 0],
            scale: [0.5, 1, 1, 0.5],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: 'linear',
            times: [0, 0.1, 0.9, 1],
          }}
        />
      ))}

      {/* Subtle ambient glow at bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 h-40"
        style={{
          background: 'linear-gradient(to top, rgba(6, 182, 212, 0.05) 0%, transparent 100%)',
        }}
      />

      {/* Subtle ambient glow at top corners */}
      <div
        className="absolute top-0 right-0 w-96 h-96 opacity-30"
        style={{
          background: 'radial-gradient(circle, rgba(6, 182, 212, 0.1) 0%, transparent 70%)',
        }}
      />
      <div
        className="absolute top-0 left-0 w-80 h-80 opacity-20"
        style={{
          background: 'radial-gradient(circle, rgba(219, 39, 119, 0.1) 0%, transparent 70%)',
        }}
      />
    </div>
  );
}

export default function Hero() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const hexFill = svgRef.current.querySelector('.hex-fill');
    const lines = svgRef.current.querySelectorAll('.hex-line');

    // Animate hexagon fill
    if (hexFill) {
      (hexFill as SVGElement).animate([{ opacity: 0 }, { opacity: 1 }], {
        duration: 600,
        delay: 400,
        fill: 'forwards',
        easing: 'ease-out',
      });
    }

    // Animate lines with staggered line-drawing effect
    lines.forEach((line, index) => {
      const svgLine = line as SVGLineElement;
      const length = svgLine.getTotalLength();

      svgLine.style.strokeDasharray = `${length}`;

      const lineAnim = svgLine.animate(
        [
          { strokeDashoffset: length, opacity: 0 },
          { strokeDashoffset: 0, opacity: 0.7 },
        ],
        {
          duration: 800,
          delay: 600 + index * 80,
          fill: 'forwards',
          easing: 'ease-out',
        }
      );

      // Continuous shimmer
      lineAnim.onfinish = () => {
        svgLine.animate(
          [{ opacity: 0.5 }, { opacity: 0.9 }, { opacity: 0.5 }],
          {
            duration: 2500 + index * 150,
            iterations: Infinity,
            easing: 'ease-in-out',
          }
        );
      };
    });
  }, []);

  return (
    <section
      id="home"
      className="min-h-screen flex items-center justify-center bg-[#0a192f] pt-20 px-4 lg:px-8 relative overflow-hidden"
    >
      {/* Animated Background */}
      <AnimatedBackground />

      <div className="max-w-7xl mx-auto w-full relative z-10">
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
              <motion.span
                className="bg-gradient-to-r from-[#db2777] to-[#06b6d4] bg-clip-text text-transparent"
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
                style={{ backgroundSize: '200% 200%' }}
              >
                Abhishek Chatterjee
              </motion.span>
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
              {/* Option 4: Border animation - Traveling border */}
              <Link
                to="projects"
                smooth={true}
                duration={500}
                offset={-80}
                className="relative group cursor-pointer"
              >
                <span className="relative inline-flex overflow-hidden rounded-lg p-[2px]">
                  {/* Animated gradient border */}
                  <motion.span
                    className="absolute inset-0 rounded-lg"
                    style={{
                      background: 'conic-gradient(from 0deg, #06b6d4, #db2777, #06b6d4)',
                    }}
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                  />
                  <span className="relative btn btn-ghost bg-[#0a192f] hover:bg-[#112240] text-[#06b6d4] gap-2 rounded-[6px]">
                    View Work
                    <ArrowDown size={16} className="group-hover:translate-y-1 transition-transform" />
                  </span>
                </span>
              </Link>

              <a href="/Abhishek-Chatterjee-Resume.pdf" download className="btn btn-accent gap-2">
                <Download size={16} />
                Resume
              </a>

              <div className="flex gap-2">
                <a
                  href="https://github.com/abhishek1337chatterjee"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-ghost btn-square text-[#ccd6f6] hover:text-[#06b6d4] transition-colors"
                >
                  <GithubIcon size={20} />
                </a>
                <a
                  href="https://www.linkedin.com/in/abhishekchatterjee-saheb1337/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-ghost btn-square text-[#ccd6f6] hover:text-[#06b6d4] transition-colors"
                >
                  <LinkedinIcon size={20} />
                </a>
              </div>
            </motion.div>
          </motion.div>

          {/* Profile Image with Hexagon and Glow */}
          <motion.div
            className="flex-1 flex justify-center lg:justify-end"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96">
              {/* Outer glow ring - color shifting */}
              <motion.div
                className="absolute -inset-4"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: [0.2, 0.4, 0.4, 0.2],
                  scale: [1, 1.02, 1.02, 1],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: 1,
                  times: [0, 0.3, 0.7, 1],
                }}
              >
                <svg className="w-full h-full" viewBox="0 0 200 200">
                  <defs>
                    <filter id="glowOuter" x="-100%" y="-100%" width="300%" height="300%">
                      <feGaussianBlur stdDeviation="10" result="blur" />
                    </filter>
                    <linearGradient id="glowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#06b6d4">
                        <animate attributeName="stop-color" values="#06b6d4;#db2777;#06b6d4" dur="6s" repeatCount="indefinite" />
                      </stop>
                      <stop offset="100%" stopColor="#db2777">
                        <animate attributeName="stop-color" values="#db2777;#06b6d4;#db2777" dur="6s" repeatCount="indefinite" />
                      </stop>
                    </linearGradient>
                  </defs>
                  <polygon
                    points="100,10 180,50 180,150 100,190 20,150 20,50"
                    fill="url(#glowGradient)"
                    filter="url(#glowOuter)"
                  />
                </svg>
              </motion.div>

              {/* Inner glow - cyan pulse */}
              <motion.div
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.3, 0.5, 0.5, 0.3] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: 1.2,
                  times: [0, 0.3, 0.7, 1],
                }}
              >
                <svg className="w-full h-full" viewBox="0 0 200 200">
                  <defs>
                    <filter id="glowInner" x="-50%" y="-50%" width="200%" height="200%">
                      <feGaussianBlur stdDeviation="5" result="blur" />
                    </filter>
                  </defs>
                  <polygon
                    points="100,10 180,50 180,150 100,190 20,150 20,50"
                    fill="#06b6d4"
                    filter="url(#glowInner)"
                  />
                </svg>
              </motion.div>

              {/* Main SVG with hexagon and lines */}
              <svg
                ref={svgRef}
                className="absolute inset-0 w-full h-full"
                viewBox="0 0 200 200"
              >
                <polygon
                  points="100,10 180,50 180,150 100,190 20,150 20,50"
                  fill="#06b6d4"
                  className="hex-fill"
                  style={{ opacity: 0 }}
                />
                <line className="hex-line" x1="100" y1="10" x2="100" y2="190" stroke="white" strokeWidth="0.5" style={{ opacity: 0 }} />
                <line className="hex-line" x1="20" y1="50" x2="180" y2="150" stroke="white" strokeWidth="0.5" style={{ opacity: 0 }} />
                <line className="hex-line" x1="180" y1="50" x2="20" y2="150" stroke="white" strokeWidth="0.5" style={{ opacity: 0 }} />
                <line className="hex-line" x1="20" y1="50" x2="180" y2="50" stroke="white" strokeWidth="0.5" style={{ opacity: 0 }} />
                <line className="hex-line" x1="20" y1="150" x2="180" y2="150" stroke="white" strokeWidth="0.5" style={{ opacity: 0 }} />
                <line className="hex-line" x1="100" y1="10" x2="20" y2="50" stroke="white" strokeWidth="0.5" style={{ opacity: 0 }} />
                <line className="hex-line" x1="100" y1="10" x2="180" y2="50" stroke="white" strokeWidth="0.5" style={{ opacity: 0 }} />
                <line className="hex-line" x1="100" y1="190" x2="20" y2="150" stroke="white" strokeWidth="0.5" style={{ opacity: 0 }} />
                <line className="hex-line" x1="100" y1="190" x2="180" y2="150" stroke="white" strokeWidth="0.5" style={{ opacity: 0 }} />
              </svg>

              {/* Profile image */}
              <img
                src={profilePic}
                alt="Abhishek Chatterjee"
                className="absolute inset-0 w-full h-full object-cover"
                style={{ clipPath: 'polygon(50% 5%, 90% 25%, 90% 75%, 50% 95%, 10% 75%, 10% 25%)' }}
              />

              {/* Hexagon border overlay */}
              <motion.div
                className="absolute inset-0 pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 0.5 }}
              >
                <svg className="w-full h-full" viewBox="0 0 200 200">
                  <polygon
                    points="100,10 180,50 180,150 100,190 20,150 20,50"
                    fill="none"
                    stroke="rgba(6, 182, 212, 0.3)"
                    strokeWidth="1"
                  />
                </svg>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
