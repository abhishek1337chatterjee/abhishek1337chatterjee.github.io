import wearlyImg from '../assets/images/Wearly.gif';
import pearImg from '../assets/images/Pear.gif';
import freshlyImg from '../assets/images/Freshly.gif';
import fireImg from '../assets/images/Fire.gif';

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
      'Personal RSS dashboard for aggregating news, GitHub activity, and custom feeds. Self-hosted on personal infrastructure.',
    techStack: ['Docker', 'Glance', 'Self-hosted', 'RSS'],
    features: ['RSS feed aggregation', 'GitHub activity tracking', 'Custom widgets', 'Dark theme'],
    responsibilities: ['Full deployment and configuration'],
    deployedUrl: 'https://glance.abhishekmediaserver.online',
    type: 'personal',
    hasDemo: true,
    hasCode: false,
  },
  {
    id: 102,
    commitHash: '',
    title: 'GitHub Advisory RSS',
    description:
      'Docker container that converts GitHub Security Advisories into RSS/XML feed format for easy monitoring and integration with feed readers.',
    techStack: ['Docker', 'RSS', 'GitHub API', 'XML'],
    features: ['Security advisory monitoring', 'RSS feed generation', 'Docker containerized'],
    responsibilities: ['Architecture design', 'Docker configuration', 'API integration'],
    type: 'personal',
    hasDemo: false,
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
