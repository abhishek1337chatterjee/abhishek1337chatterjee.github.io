/**
 * Migration script to import existing portfolio data into Sanity
 * Run with: npx tsx studio/migrations/import-data.ts
 */
import { createClient } from '@sanity/client';

const client = createClient({
  projectId: '1ewtvnrz',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_TOKEN, // Needs write access
});

// About data
const aboutData = {
  _id: 'about',
  _type: 'about',
  name: 'Abhishek Chatterjee',
  title: 'Serverless Engineer | React Developer',
  location: 'India',
  experience: '3+ years',
  bio: 'Serverless Engineer specializing in AWS Lambda, Step Functions, and event-driven architectures. Previously a MERN Stack Developer with expertise in React, TypeScript, and Node.js. Passionate about building scalable, efficient solutions.',
  highlights: [
    'AWS Lambda & Step Functions',
    'Event-driven architecture',
    'React & TypeScript',
    'Full-stack development',
  ],
  interests: [
    'Open Source',
    'Cloud Architecture',
    'Developer Tools',
    'Home Lab & Self-hosting',
  ],
};

// Site settings
const siteSettingsData = {
  _id: 'siteSettings',
  _type: 'siteSettings',
  email: 'abhishek1337chatterjee@gmail.com',
  phone: '+91 8420739602',
  whatsappUrl: 'https://wa.me/918420739602',
  githubUsername: 'abhishek1337chatterjee',
  openSourceDescription: 'Active contributor to open source projects',
  openSourceActivities: [
    'Bug fixes',
    'Feature contributions',
    'Documentation improvements',
  ],
};

// Skills data
const skillsData = [
  { _type: 'skill', name: 'HTML', icon: 'html5', category: 'technical', order: 1 },
  { _type: 'skill', name: 'CSS', icon: 'css3', category: 'technical', order: 2 },
  { _type: 'skill', name: 'JavaScript', icon: 'javascript', category: 'technical', order: 3 },
  { _type: 'skill', name: 'TypeScript', icon: 'typescript', category: 'technical', order: 4 },
  { _type: 'skill', name: 'React.js', icon: 'react', category: 'technical', order: 5 },
  { _type: 'skill', name: 'Next.js', icon: 'nextjs', category: 'technical', order: 6 },
  { _type: 'skill', name: 'Redux', icon: 'redux', category: 'technical', order: 7 },
  { _type: 'skill', name: 'Node.js', icon: 'nodejs', category: 'technical', order: 8 },
  { _type: 'skill', name: 'MongoDB', icon: 'mongodb', category: 'technical', order: 9 },
  { _type: 'skill', name: 'Express', icon: 'express', category: 'technical', order: 10 },
  { _type: 'skill', name: 'Tailwind CSS', icon: 'tailwindcss', category: 'technical', order: 11 },
  { _type: 'skill', name: 'Git', icon: 'git', category: 'tools', order: 12 },
  { _type: 'skill', name: 'GitHub', icon: 'github', category: 'tools', order: 13 },
  { _type: 'skill', name: 'NPM', icon: 'npm', category: 'tools', order: 14 },
  { _type: 'skill', name: 'Cypress', icon: 'cypress', category: 'tools', order: 15 },
  { _type: 'skill', name: 'Vercel', icon: 'vercel', category: 'tools', order: 16 },
  { _type: 'skill', name: 'VS Code', icon: 'vscode', category: 'tools', order: 17 },
  // Cloud skills
  { _type: 'skill', name: 'AWS Lambda', icon: 'aws', category: 'cloud', order: 18 },
  { _type: 'skill', name: 'Step Functions', icon: 'aws', category: 'cloud', order: 19 },
  { _type: 'skill', name: 'EventBridge', icon: 'aws', category: 'cloud', order: 20 },
  { _type: 'skill', name: 'SQS/SNS', icon: 'aws', category: 'cloud', order: 21 },
  { _type: 'skill', name: 'Cognito', icon: 'aws', category: 'cloud', order: 22 },
];

// Social links
const socialsData = [
  {
    _type: 'social',
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/in/abhishekchatterjee-saheb1337/',
    icon: 'linkedin',
    color: 'bg-[#0077B5]',
    order: 1,
  },
  {
    _type: 'social',
    name: 'GitHub',
    url: 'https://github.com/abhishek1337chatterjee',
    icon: 'github',
    color: 'bg-[#333]',
    order: 2,
  },
  {
    _type: 'social',
    name: 'Email',
    url: 'mailto:abhishek1337chatterjee@gmail.com',
    icon: 'mail',
    color: 'bg-[#25D366]',
    order: 3,
  },
  {
    _type: 'social',
    name: 'Resume',
    url: '/Abhishek-Chatterjee-Resume.pdf',
    icon: 'file-text',
    color: 'bg-gray-600',
    order: 4,
  },
];

// Projects data
const projectsData = [
  {
    _type: 'project',
    title: 'Glance Dashboard',
    slug: { _type: 'slug', current: 'glance-dashboard' },
    description:
      'Self-hosted personal dashboard with two custom Node.js microservices for specialized RSS feed generation. Features GitHub security advisories, kernel.org LTS tracking, movie/OTT feeds, and more. Deployed via Docker Compose with health checks and auto-start.',
    techStack: ['Node.js 24', 'Express.js 5', 'Docker', 'Docker Compose', 'GraphQL', 'REST APIs', 'RSS/Atom'],
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
    projectType: 'personal',
    source: 'side-project',
    hasDemo: true,
    hasCode: false,
  },
  {
    _type: 'project',
    title: 'Wearly Website',
    slug: { _type: 'slug', current: 'wearly-website' },
    description:
      'Wearly is a full-stack online fashion and cosmetic retailer. The project was built in 5 days as a collaborative effort.',
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
    projectType: 'showcase',
    source: 'masai',
    hasDemo: true,
    hasCode: true,
  },
  {
    _type: 'project',
    title: 'Pear Website',
    slug: { _type: 'slug', current: 'pear-website' },
    description: 'Pear is built with the reference website apple.com. A sleek product showcase website.',
    techStack: ['React', 'Redux', 'Axios', 'React-Router-Dom', 'Firebase-Auth', 'Chakra-UI', 'Vitejs'],
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
    projectType: 'showcase',
    source: 'masai',
    hasDemo: true,
    hasCode: true,
  },
  {
    _type: 'project',
    title: 'Freshly Website',
    slug: { _type: 'slug', current: 'freshly-website' },
    description:
      'Freshly delivers gourmet ready-made meals, prepared and delivered at the door. It is dedicated to making healthy eating and achieving health and fitness goals easier than ever.',
    techStack: ['HTML', 'CSS', 'JavaScript'],
    features: ['Login/Signup using local storage', 'Filtering Sorting', 'Adding items to chart'],
    responsibilities: ['The complete landing page', 'After login user details shown in landing page'],
    githubUrl: 'https://github.com/abhishek1337chatterjee/freshly.com',
    deployedUrl: 'https://fluffy-croquembouche-14d5f2.netlify.app/',
    teamSize: 5,
    duration: '5 days',
    projectType: 'showcase',
    source: 'masai',
    hasDemo: true,
    hasCode: true,
  },
  {
    _type: 'project',
    title: 'Fire Calculator',
    slug: { _type: 'slug', current: 'fire-calculator' },
    description:
      'The fire calculator is a calculator that will return the yearly expenses (as of Today), year expenses (as of Retirement) and the fire number is the amount that you need to become financially independent.',
    techStack: ['React', 'React-Reducer', 'CSS'],
    features: ['Calculate FIRE number', 'Retirement planning'],
    responsibilities: ['Full application development'],
    githubUrl: 'https://github.com/abhishek1337chatterjee/Fire-Calculator',
    deployedUrl: 'https://fire-calculator-zeta.vercel.app/',
    projectType: 'showcase',
    source: 'masai',
    hasDemo: true,
    hasCode: true,
  },
  {
    _type: 'project',
    title: 'Jet Prints',
    slug: { _type: 'slug', current: 'jet-prints' },
    description:
      'Advanced eCommerce platform for custom printing on products like mugs and business cards. Integrated PDF upload and payment processing.',
    techStack: ['React', 'Redux', 'TypeScript', 'Express.js', 'Node.js', 'Canvas API'],
    features: ['Custom product design', 'PDF upload', 'Payment processing', 'Canvas-based editor'],
    responsibilities: ['Frontend architecture', 'Canvas integration', 'Payment API integration'],
    projectType: 'experience',
    source: 'professional',
    isDiscontinued: true,
    hasDemo: false,
    hasCode: false,
  },
];

// Career phases
const careerPhasesData = [
  {
    _type: 'careerPhase',
    title: 'Serverless Engineer',
    role: 'Serverless Engineer',
    companyName: 'time.money',
    companyWebsite: 'https://time.money',
    period: '2024 - Present',
    description:
      'Building scalable serverless architectures and event-driven systems for fintech applications.',
    highlights: ['AWS Lambda', 'Step Functions', 'EventBridge', 'SQS', 'SNS', 'Cognito', 'SES'],
    order: 1,
    isEducation: false,
  },
  {
    _type: 'careerPhase',
    title: 'Frontend Developer',
    role: 'MERN Stack Developer',
    companyName: 'Latitude Technolabs',
    companyWebsite: 'https://latitudetechnolabs.com',
    period: '2023 - 2024',
    description:
      'Specialized in frontend development and client-focused solutions. Proactive in API development with technologies like Appwrite.',
    highlights: ['React', 'TypeScript', 'Redux', 'Appwrite', 'Canvas API'],
    order: 2,
    isEducation: false,
    // Note: Projects will be linked via reference after creation
  },
  {
    _type: 'careerPhase',
    title: 'Masai School',
    role: 'Full Stack Web Development',
    period: '2022 - 2023',
    description:
      'Intensive 11-month bootcamp transforming into a full-stack developer. Built multiple collaborative projects with teams.',
    highlights: ['MERN Stack', 'React', 'Node.js', 'MongoDB', 'Team Collaboration'],
    order: 3,
    isEducation: true,
  },
];

async function migrate() {
  console.log('🚀 Starting migration...\n');

  try {
    // Create singletons
    console.log('📝 Creating About...');
    await client.createOrReplace(aboutData);
    console.log('✅ About created\n');

    console.log('📝 Creating Site Settings...');
    await client.createOrReplace(siteSettingsData);
    console.log('✅ Site Settings created\n');

    // Create skills
    console.log('📝 Creating Skills...');
    for (const skill of skillsData) {
      await client.create(skill);
    }
    console.log(`✅ ${skillsData.length} skills created\n`);

    // Create socials
    console.log('📝 Creating Social Links...');
    for (const social of socialsData) {
      await client.create(social);
    }
    console.log(`✅ ${socialsData.length} social links created\n`);

    // Create projects
    console.log('📝 Creating Projects...');
    const createdProjects: Record<string, string> = {};
    for (const project of projectsData) {
      const result = await client.create(project);
      createdProjects[project.title] = result._id;
    }
    console.log(`✅ ${projectsData.length} projects created\n`);

    // Create career phases
    console.log('📝 Creating Career Phases...');
    for (const phase of careerPhasesData) {
      await client.create(phase);
    }
    console.log(`✅ ${careerPhasesData.length} career phases created\n`);

    console.log('🎉 Migration completed successfully!');
    console.log('\n📌 Next steps:');
    console.log('1. Open Sanity Studio at http://localhost:3333');
    console.log('2. Review and adjust the imported content');
    console.log('3. Link projects to career phases manually');
    console.log('4. Upload images for projects');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

migrate();
