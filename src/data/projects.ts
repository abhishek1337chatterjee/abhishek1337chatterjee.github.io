import wearlyImg from '../assets/images/Wearly.gif';
import pearImg from '../assets/images/Pear.gif';
import freshlyImg from '../assets/images/Freshly.gif';
import fireImg from '../assets/images/Fire.gif';

export interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  techStack: string[];
  features: string[];
  responsibilities: string[];
  githubUrl: string;
  deployedUrl: string;
  teamSize?: number;
  duration?: string;
}

export const projects: Project[] = [
  {
    id: 1,
    title: 'Wearly Website',
    description: 'Wearly is a full-stack online fashion and cosmetic retailer. The project was built in 5 days as a collaborative effort.',
    image: wearlyImg,
    techStack: ['React', 'Redux', 'React Router', 'Chakra UI', 'Node.js', 'Express', 'MongoDB'],
    features: ['Login/Signup', 'Google Authentication', 'Admin Section', 'Cart', 'Place Order'],
    responsibilities: ['Login and SignUp Page using Firebase', 'Protecting the Routes', 'Showing the user after login in the homepage'],
    githubUrl: 'https://github.com/abhishek1337chatterjee/Wearly-Website',
    deployedUrl: 'https://wearly.vercel.app/',
    teamSize: 5,
    duration: '5 days',
  },
  {
    id: 2,
    title: 'Pear Website',
    description: 'Pear is built with the reference website apple.com. A sleek product showcase website.',
    image: pearImg,
    techStack: ['React', 'Redux', 'Axios', 'React-Router-Dom', 'Firebase-Auth', 'Chakra-UI', 'Vitejs'],
    features: ['Login/Signup', 'Google Authentication', 'Admin Section', 'Cart', 'Place Order'],
    responsibilities: ['Login and SignUp Page using Firebase', 'Protecting the Routes', 'Showing the user after login in the homepage'],
    githubUrl: 'https://github.com/abhishek1337chatterjee/Pear-website',
    deployedUrl: 'https://pear-website.netlify.app/',
    teamSize: 5,
    duration: '5 days',
  },
  {
    id: 3,
    title: 'Freshly Website',
    description: 'Freshly delivers gourmet ready-made meals, prepared and delivered at the door. It is dedicated to making healthy eating and achieving health and fitness goals easier than ever.',
    image: freshlyImg,
    techStack: ['HTML', 'CSS', 'JavaScript'],
    features: ['Login/Signup using local storage', 'Filtering Sorting', 'Adding items to chart'],
    responsibilities: ['The complete landing page', 'After login user details shown in landing page'],
    githubUrl: 'https://github.com/abhishek1337chatterjee/freshly.com',
    deployedUrl: 'https://fluffy-croquembouche-14d5f2.netlify.app/',
    teamSize: 5,
    duration: '5 days',
  },
  {
    id: 4,
    title: 'Fire Calculator',
    description: 'The fire calculator is a calculator that will return the yearly expenses (as of Today), year expenses (as of Retirement) and the fire number is the amount that you need to become financially independent.',
    image: fireImg,
    techStack: ['React', 'React-Reducer', 'CSS'],
    features: ['Calculate FIRE number', 'Retirement planning'],
    responsibilities: ['Full application development'],
    githubUrl: 'https://github.com/abhishek1337chatterjee/Fire-Calculator',
    deployedUrl: 'https://fire-calculator-zeta.vercel.app/',
  },
];
