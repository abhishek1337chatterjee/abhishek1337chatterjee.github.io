import { useEffect, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-scroll';
import { Typewriter } from 'react-simple-typewriter';
import { ArrowDown, Download } from 'lucide-react';
import profilePic from '../../assets/images/profile-pic.png';

// ============================================
// SEASONAL PARTICLE SYSTEM
// ============================================

type Season = 'winter' | 'spring' | 'summer' | 'autumn';
type SpecialEvent = 'christmas' | 'newyear' | 'diwali' | null;

interface SeasonConfig {
  season: Season;
  event: SpecialEvent;
  colors: string[];
  particleCount: number;
  direction: 'up' | 'down' | 'float';
  speed: { min: number; max: number };
  shapes: ('circle' | 'snowflake' | 'leaf' | 'petal' | 'sparkle')[];
  glowColors: string[];
}

// Detect current season and special events
function getSeasonConfig(): SeasonConfig {
  const now = new Date();
  const month = now.getMonth(); // 0-11
  const day = now.getDate();

  // ============================================
  // DEV MODE: Override season via URL params
  // Usage: ?season=spring or ?season=autumn&event=diwali
  // ============================================
  const urlParams = new URLSearchParams(window.location.search);
  const seasonOverride = urlParams.get('season') as Season | null;
  const eventOverride = urlParams.get('event') as SpecialEvent | null;

  // Check for special events first
  let event: SpecialEvent = eventOverride;

  if (!eventOverride) {
    // Christmas: Dec 15 - Dec 31
    if (month === 11 && day >= 15) {
      event = 'christmas';
    }
    // New Year: Jan 1 - Jan 7
    else if (month === 0 && day <= 7) {
      event = 'newyear';
    }
    // Diwali: Roughly Oct 15 - Nov 15 (varies yearly, but this is approximate)
    else if ((month === 9 && day >= 15) || (month === 10 && day <= 15)) {
      event = 'diwali';
    }
  }

  // Determine season based on month (or use override)
  let season: Season;
  if (seasonOverride && ['winter', 'spring', 'summer', 'autumn'].includes(seasonOverride)) {
    season = seasonOverride;
  } else if (month >= 2 && month <= 4) {
    season = 'spring'; // Mar, Apr, May
  } else if (month >= 5 && month <= 7) {
    season = 'summer'; // Jun, Jul, Aug
  } else if (month >= 8 && month <= 10) {
    season = 'autumn'; // Sep, Oct, Nov
  } else {
    season = 'winter'; // Dec, Jan, Feb
  }

  // Return config based on season and event
  const configs: Record<Season, SeasonConfig> = {
    winter: {
      season: 'winter',
      event,
      colors: event === 'christmas'
        ? ['#ffffffcc', '#a5f3fccc', '#fca5a5aa', '#86efacaa'] // Softer with transparency
        : event === 'newyear'
          ? ['#fbbf24cc', '#f59e0bcc', '#ec4899aa', '#8b5cf6aa', '#06b6d4aa'] // Softer golds/pinks
          : ['#ffffffbb', '#e0f2febb', '#bae6fdaa', '#7dd3fcaa'], // Soft ice blues
      particleCount: event === 'newyear' ? 25 : 20,
      direction: event === 'newyear' ? 'up' : 'down',
      speed: { min: 18, max: 28 }, // Slower, more gentle
      shapes: event === 'newyear'
        ? ['sparkle', 'sparkle', 'circle', 'circle'] // Balanced mix
        : ['snowflake', 'snowflake', 'circle', 'circle'],
      glowColors: event === 'christmas'
        ? ['rgba(239, 68, 68, 0.06)', 'rgba(34, 197, 94, 0.06)']
        : event === 'newyear'
          ? ['rgba(251, 191, 36, 0.08)', 'rgba(236, 72, 153, 0.06)']
          : ['rgba(186, 230, 253, 0.06)', 'rgba(255, 255, 255, 0.03)'],
    },
    spring: {
      season: 'spring',
      event: null,
      colors: ['#ff69b4aa', '#ff85c1aa', '#f9a8d4aa', '#e879f9aa', '#a7f3d0aa'], // Softer pinks
      particleCount: 20,
      direction: 'float',
      speed: { min: 20, max: 30 }, // Slower float
      shapes: ['petal', 'petal', 'circle', 'circle'],
      glowColors: ['rgba(249, 168, 212, 0.08)', 'rgba(232, 121, 249, 0.06)'],
    },
    summer: {
      season: 'summer',
      event: null,
      colors: ['#fef08acc', '#fde047aa', '#facc15aa', '#fb923caa'], // Softer yellows
      particleCount: 18,
      direction: 'up',
      speed: { min: 22, max: 32 }, // Gentle rise
      shapes: ['sparkle', 'sparkle', 'circle', 'circle'],
      glowColors: ['rgba(250, 204, 21, 0.08)', 'rgba(251, 146, 60, 0.06)'],
    },
    autumn: {
      season: 'autumn',
      event,
      colors: event === 'diwali'
        ? ['#fbbf24cc', '#f59e0baa', '#ef4444aa', '#e879f9aa', '#06b6d4aa'] // Softer Diwali colors
        : ['#fed7aaaa', '#fdba74aa', '#fb923caa', '#dc2626aa', '#b45309aa'], // Soft fall colors
      particleCount: event === 'diwali' ? 25 : 18,
      direction: event === 'diwali' ? 'up' : 'down',
      speed: { min: 16, max: 26 }, // Gentler fall
      shapes: event === 'diwali'
        ? ['sparkle', 'sparkle', 'circle', 'circle']
        : ['leaf', 'leaf', 'circle', 'circle'],
      glowColors: event === 'diwali'
        ? ['rgba(251, 191, 36, 0.1)', 'rgba(232, 121, 249, 0.06)']
        : ['rgba(251, 146, 60, 0.06)', 'rgba(180, 83, 9, 0.05)'],
    },
  };

  return configs[season];
}

// Generate particles based on season config
function generateSeasonalParticles(config: SeasonConfig) {
  const particles = [];

  for (let i = 0; i < config.particleCount; i++) {
    const color = config.colors[Math.floor(Math.random() * config.colors.length)];
    const shape = config.shapes[Math.floor(Math.random() * config.shapes.length)];

    // Determine size based on shape type - kept subtle to avoid distraction
    let size: number;
    switch (shape) {
      case 'snowflake':
        size = 6 + Math.random() * 6; // 6-12px (subtle)
        break;
      case 'leaf':
        size = 8 + Math.random() * 6; // 8-14px (subtle)
        break;
      case 'petal':
        size = 6 + Math.random() * 6; // 6-12px (subtle)
        break;
      case 'sparkle':
        size = 5 + Math.random() * 6; // 5-11px (subtle)
        break;
      default: // circle
        size = 1.5 + Math.random() * 2; // 1.5-3.5px (tiny glowing dots)
    }

    particles.push({
      id: i,
      x: Math.random() * 100,
      y: config.direction === 'down' ? Math.random() * 30 : 70 + Math.random() * 30,
      size,
      duration: config.speed.min + Math.random() * (config.speed.max - config.speed.min),
      delay: Math.random() * 10,
      color,
      shape,
      rotation: Math.random() * 360,
      wobble: Math.random() * 30 - 15, // -15 to 15 degrees wobble
    });
  }

  return particles;
}

// SVG Shape Components - kept subtle with reduced opacity
function SnowflakeShape({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" opacity="0.6">
      <g stroke={color} strokeWidth="1" strokeLinecap="round">
        {/* Main cross */}
        <line x1="12" y1="2" x2="12" y2="22" />
        <line x1="2" y1="12" x2="22" y2="12" />
        {/* Diagonal lines */}
        <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
        <line x1="19.07" y1="4.93" x2="4.93" y2="19.07" />
        {/* Small branches */}
        <line x1="12" y1="2" x2="9" y2="5" />
        <line x1="12" y1="2" x2="15" y2="5" />
        <line x1="12" y1="22" x2="9" y2="19" />
        <line x1="12" y1="22" x2="15" y2="19" />
      </g>
    </svg>
  );
}

function LeafShape({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} opacity="0.5">
      <path d="M12 2C6.5 2 2 6.5 2 12c0 2.5 1 4.8 2.5 6.5L12 22l7.5-3.5C21 16.8 22 14.5 22 12c0-5.5-4.5-10-10-10z" />
    </svg>
  );
}

function PetalShape({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} opacity="0.5">
      <ellipse cx="12" cy="12" rx="5" ry="10" />
    </svg>
  );
}

function SparkleShape({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} opacity="0.6">
      <path d="M12 0L14 10L24 12L14 14L12 24L10 14L0 12L10 10L12 0Z" />
    </svg>
  );
}

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

// Render the appropriate shape based on particle config
function ParticleShape({ shape, size, color }: { shape: string; size: number; color: string }) {
  switch (shape) {
    case 'snowflake':
      return <SnowflakeShape size={size} color={color} />;
    case 'leaf':
      return <LeafShape size={size} color={color} />;
    case 'petal':
      return <PetalShape size={size} color={color} />;
    case 'sparkle':
      return <SparkleShape size={size} color={color} />;
    default:
      return null; // Circle is handled by the div itself
  }
}

// Seasonal Particle Field background component
function AnimatedBackground() {
  // Memoize season config and particles to prevent recalculation on re-renders
  const seasonConfig = useMemo(() => getSeasonConfig(), []);
  const particles = useMemo(() => generateSeasonalParticles(seasonConfig), [seasonConfig]);

  // Determine animation based on direction
  const getAnimation = (particle: ReturnType<typeof generateSeasonalParticles>[0]) => {
    const { direction } = seasonConfig;

    if (direction === 'down') {
      // Falling animation (snowflakes, leaves)
      return {
        y: [0, 800],
        x: [0, particle.wobble, -particle.wobble, particle.wobble, 0],
        rotate: [particle.rotation, particle.rotation + 360],
        opacity: [0, 1, 1, 0],
        scale: [0.5, 1, 1, 0.5],
      };
    } else if (direction === 'up') {
      // Rising animation (fireflies, sparkles)
      return {
        y: [0, -800],
        opacity: [0, 1, 1, 0],
        scale: [0.3, 1, 1.2, 0.5],
      };
    } else {
      // Float animation (petals - gentle side-to-side)
      return {
        y: [0, -400, -800],
        x: [0, particle.wobble * 3, -particle.wobble * 2, particle.wobble * 2, 0],
        rotate: [particle.rotation, particle.rotation + 180],
        opacity: [0, 1, 1, 0],
        scale: [0.5, 1, 0.8],
      };
    }
  };

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Subtle gradient base */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a192f] via-[#0a192f] to-[#0d1f3c]" />

      {/* Seasonal particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute flex items-center justify-center"
          style={{
            left: `${particle.x}%`,
            top: seasonConfig.direction === 'down' ? `${particle.y - 30}%` : undefined,
            bottom: seasonConfig.direction !== 'down' ? `${100 - particle.y}%` : undefined,
            width: particle.shape === 'circle' ? particle.size : 'auto',
            height: particle.shape === 'circle' ? particle.size : 'auto',
            ...(particle.shape === 'circle' && {
              background: `radial-gradient(circle, ${particle.color} 0%, transparent 70%)`,
              boxShadow: `0 0 4px 1px ${particle.color}30`,
              borderRadius: '50%',
            }),
          }}
          animate={getAnimation(particle)}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: seasonConfig.direction === 'down' ? 'easeIn' : 'linear',
            times: seasonConfig.direction === 'float' ? [0, 0.5, 1] : [0, 0.1, 0.9, 1],
          }}
        >
          {particle.shape !== 'circle' && (
            <ParticleShape shape={particle.shape} size={particle.size} color={particle.color} />
          )}
        </motion.div>
      ))}

      {/* Subtle ambient glow at bottom - uses seasonal colors */}
      <div
        className="absolute bottom-0 left-0 right-0 h-40"
        style={{
          background: `linear-gradient(to top, ${seasonConfig.glowColors[0]} 0%, transparent 100%)`,
        }}
      />

      {/* Subtle ambient glow at top corners - uses seasonal colors */}
      <div
        className="absolute top-0 right-0 w-96 h-96 opacity-30"
        style={{
          background: `radial-gradient(circle, ${seasonConfig.glowColors[0]} 0%, transparent 70%)`,
        }}
      />
      <div
        className="absolute top-0 left-0 w-80 h-80 opacity-20"
        style={{
          background: `radial-gradient(circle, ${seasonConfig.glowColors[1] || seasonConfig.glowColors[0]} 0%, transparent 70%)`,
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
