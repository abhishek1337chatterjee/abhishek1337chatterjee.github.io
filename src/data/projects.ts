import wearlyImg from '../assets/images/Wearly.gif';
import pearImg from '../assets/images/Pear.gif';
import freshlyImg from '../assets/images/Freshly.gif';
import fireImg from '../assets/images/Fire.gif';
import glanceImg from '../assets/images/glance.gif';

// Project types
export type ProjectType = 'showcase' | 'experience' | 'personal';

export interface Project {
  id: number;
  commitHash: string;
  title: string;
  description: string;
  image?: string;
  techStack: string[];
  features: string[];
  responsibilities: string[];
  githubUrl?: string;
  deployedUrl?: string;
  teamSize?: number;
  duration?: string;
  type: ProjectType;
  hasDemo: boolean;
  hasCode: boolean;
  isDiscontinued?: boolean;
}

export interface CompanyInfo {
  name: string;
  website: string;
}

export interface CareerPhase {
  id: string;
  title: string;
  role: string;
  company?: CompanyInfo;
  period: string;
  description: string;
  highlights: string[];
  projects: Project[];
  source: 'static' | 'sanity';
}

// Masai School projects (static forever - never from Sanity)
export const masaiProjects: Project[] = [
  {
    id: 1,
    commitHash: '',
    title: 'Wearly Website',
    description:
      'Wearly is a full-stack online fashion and cosmetic retailer. The project was built in 5 days as a collaborative effort.',
    image: wearlyImg,
    techStack: ['React', 'Redux', 'React Router', 'Chakra UI', 'Node.js', 'Express', 'MongoDB'],
    features: ['Login/Signup', 'Google Authentication', 'Admin Section', 'Cart', 'Place Order'],
    responsibilities: [
      'Login and SignUp Page using Firebase',
      'Protecting the Routes',
      'Showing the user after login in the homepage',
    ],
    githubUrl: 'https://github.com/abhishek1337chatterjee/Wearly-Website',
    deployedUrl: 'https://wearly.vercel.app/',
    teamSize: 5,
    duration: '5 days',
    type: 'showcase',
    hasDemo: true,
    hasCode: true,
  },
  {
    id: 2,
    commitHash: '',
    title: 'Pear Website',
    description:
      'Pear is built with the reference website apple.com. A sleek product showcase website.',
    image: pearImg,
    techStack: [
      'React',
      'Redux',
      'Axios',
      'React-Router-Dom',
      'Firebase-Auth',
      'Chakra-UI',
      'Vitejs',
    ],
    features: ['Login/Signup', 'Google Authentication', 'Admin Section', 'Cart', 'Place Order'],
    responsibilities: [
      'Login and SignUp Page using Firebase',
      'Protecting the Routes',
      'Showing the user after login in the homepage',
    ],
    githubUrl: 'https://github.com/abhishek1337chatterjee/Pear-website',
    deployedUrl: 'https://pear-website.netlify.app/',
    teamSize: 5,
    duration: '5 days',
    type: 'showcase',
    hasDemo: true,
    hasCode: true,
  },
  {
    id: 3,
    commitHash: '',
    title: 'Freshly Website',
    description:
      'Freshly delivers gourmet ready-made meals, prepared and delivered at the door. It is dedicated to making healthy eating and achieving health and fitness goals easier than ever.',
    image: freshlyImg,
    techStack: ['HTML', 'CSS', 'JavaScript'],
    features: ['Login/Signup using local storage', 'Filtering Sorting', 'Adding items to chart'],
    responsibilities: [
      'The complete landing page',
      'After login user details shown in landing page',
    ],
    githubUrl: 'https://github.com/abhishek1337chatterjee/freshly.com',
    deployedUrl: 'https://fluffy-croquembouche-14d5f2.netlify.app/',
    teamSize: 5,
    duration: '5 days',
    type: 'showcase',
    hasDemo: true,
    hasCode: true,
  },
  {
    id: 4,
    commitHash: '',
    title: 'Fire Calculator',
    description:
      'The fire calculator is a calculator that will return the yearly expenses (as of Today), year expenses (as of Retirement) and the fire number is the amount that you need to become financially independent.',
    image: fireImg,
    techStack: ['React', 'React-Reducer', 'CSS'],
    features: ['Calculate FIRE number', 'Retirement planning'],
    responsibilities: ['Full application development'],
    githubUrl: 'https://github.com/abhishek1337chatterjee/Fire-Calculator',
    deployedUrl: 'https://fire-calculator-zeta.vercel.app/',
    type: 'showcase',
    hasDemo: true,
    hasCode: true,
  },
];

// Personal projects (separate from career timeline)
export const personalProjects: Project[] = [
  {
    id: 101,
    commitHash: '',
    title: 'Glance Dashboard',
    description:
      'Self-hosted personal dashboard with two custom Node.js microservices for specialized RSS feed generation. Features GitHub security advisories, kernel.org LTS tracking, movie/OTT feeds, and more. Deployed via Docker Compose with health checks and auto-start.',
    image: glanceImg,
    techStack: [
      'Node.js 24',
      'Express.js 5',
      'Docker',
      'Docker Compose',
      'GraphQL',
      'REST APIs',
      'RSS/Atom',
    ],
    features: [
      'GitHub Security Advisory feeds via GraphQL',
      'Kernel.org LTS release tracking',
      'Movie/OTT streaming feeds (TMDb + OMDb)',
      '15+ RSS endpoints across services',
      '30-60 min in-memory caching',
      'Health checks with dependency chain',
    ],
    responsibilities: [
      'Built github-feed microservice (security advisories, changelog parser)',
      'Built movie-feed microservice (theater, OTT, trending)',
      'Docker Compose orchestration with health checks',
      'Systemd auto-start + Tailscale/Cloudflare tunnel',
    ],
    deployedUrl: 'https://glance.abhishekmediaserver.online',
    type: 'personal',
    hasDemo: true,
    hasCode: false,
  },
];

// Career phases (reverse chronological) - Professional timeline only
export const careerPhases: CareerPhase[] = [
  {
    id: 'serverless-engineer',
    title: 'Serverless Engineer',
    role: 'Serverless Engineer',
    company: {
      name: 'time.money',
      website: 'https://time.money',
    },
    period: '2024 - Present',
    description:
      'Building scalable serverless architectures and event-driven systems for fintech applications.',
    highlights: ['AWS Lambda', 'Step Functions', 'EventBridge', 'SQS', 'SNS', 'Cognito', 'SES'],
    source: 'static', // Will change to 'sanity' later
    projects: [],
  },
  {
    id: 'frontend-developer',
    title: 'Frontend Developer',
    role: 'MERN Stack Developer',
    company: {
      name: 'Latitude Technolabs',
      website: 'https://latitudetechnolabs.com',
    },
    period: '2023 - 2024',
    description:
      'Specialized in frontend development and client-focused solutions. Proactive in API development with technologies like Appwrite.',
    highlights: ['React', 'TypeScript', 'Redux', 'Appwrite', 'Canvas API'],
    source: 'static', // Will change to 'sanity' later
    projects: [
      {
        id: 201,
        commitHash: '',
        title: 'Jet Prints',
        description:
          'Advanced eCommerce platform for custom printing on products like mugs and business cards. Integrated PDF upload and payment processing.',
        techStack: ['React', 'Redux', 'TypeScript', 'Express.js', 'Node.js', 'Canvas API'],
        features: [
          'Custom product design',
          'PDF upload',
          'Payment processing',
          'Canvas-based editor',
        ],
        responsibilities: [
          'Frontend architecture',
          'Canvas integration',
          'Payment API integration',
        ],
        type: 'experience',
        hasDemo: false,
        hasCode: false,
        isDiscontinued: true,
      },
    ],
  },
  {
    id: 'masai-school',
    title: 'Masai School',
    role: 'Full Stack Web Development',
    period: '2022 - 2023',
    description:
      'Intensive 11-month bootcamp transforming into a full-stack developer. Built multiple collaborative projects with teams.',
    highlights: ['MERN Stack', 'React', 'Node.js', 'MongoDB', 'Team Collaboration'],
    source: 'static', // Always static - never from Sanity
    projects: masaiProjects,
  },
];

// Legacy export for backward compatibility (if needed elsewhere)
export const projects = masaiProjects;
