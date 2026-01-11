/**
 * Re-import skills with correct structure matching the frontend
 * Run with: SANITY_TOKEN="..." npx tsx studio/migrations/reimport-skills.ts
 */
import { createClient } from '@sanity/client';

const client = createClient({
  projectId: '1ewtvnrz',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_TOKEN,
});

// Skills matching the frontend structure exactly
const frontendSkills = [
  { name: 'HTML', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg', order: 1 },
  { name: 'CSS', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg', order: 2 },
  { name: 'JavaScript', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg', order: 3 },
  { name: 'TypeScript', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg', order: 4 },
  { name: 'React.js', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg', order: 5 },
  { name: 'Next.js', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg', order: 6 },
  { name: 'Redux', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redux/redux-original.svg', order: 7 },
  { name: 'Tailwind', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg', order: 8 },
];

const backendSkills = [
  { name: 'Node.js', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg', order: 1 },
  { name: 'Express', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg', order: 2 },
  { name: 'MongoDB', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg', order: 3 },
  { name: 'DynamoDB', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/dynamodb/dynamodb-original.svg', order: 4 },
];

const cloudSkills = [
  { name: 'Lambda', shortName: 'λ', color: '#FF9900', order: 1 },
  { name: 'Step Functions', shortName: 'SF', color: '#FF4F8B', order: 2 },
  { name: 'EventBridge', shortName: 'EB', color: '#FF4F8B', order: 3 },
  { name: 'SQS', shortName: 'SQS', color: '#FF4F8B', order: 4 },
  { name: 'SNS', shortName: 'SNS', color: '#DD344C', order: 5 },
  { name: 'Cognito', shortName: 'COG', color: '#DD344C', order: 6 },
  { name: 'SES', shortName: 'SES', color: '#DD344C', order: 7 },
  { name: 'Temporal.io', shortName: 'T', color: '#06b6d4', order: 8 },
];

const toolSkills = [
  { name: 'Git', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg', order: 1 },
  { name: 'GitHub', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg', order: 2 },
  { name: 'Docker', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg', order: 3 },
  { name: 'Ubuntu', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ubuntu/ubuntu-original.svg', order: 4 },
  { name: 'Linux', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg', order: 5 },
  { name: 'VS Code', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg', order: 6 },
  { name: 'Sanity', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/sanity/sanity-original.svg', order: 7 },
  { name: 'NPM', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/npm/npm-original-wordmark.svg', order: 8 },
  { name: 'Vercel', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vercel/vercel-original.svg', order: 9 },
  { name: 'Cypress', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cypressio/cypressio-original.svg', order: 10 },
  { name: 'Serverless', iconUrl: 'https://user-images.githubusercontent.com/2752551/30405068-a7733b34-989e-11e7-8f66-7badaf1373ed.png', order: 11 },
  { name: 'AWS SAM', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-original-wordmark.svg', order: 12 },
  { name: 'Biome', iconUrl: 'https://biomejs.dev/img/favicon.svg', order: 13 },
];

async function migrate() {
  console.log('🚀 Re-importing skills...\n');

  try {
    // Delete all existing skills
    console.log('🗑️  Deleting existing skills...');
    const existingSkills = await client.fetch('*[_type == "skill"]._id');
    if (existingSkills.length > 0) {
      const transaction = client.transaction();
      for (const id of existingSkills) {
        transaction.delete(id);
      }
      await transaction.commit();
      console.log(`   Deleted ${existingSkills.length} old skills\n`);
    }

    // Create frontend skills
    console.log('📝 Creating Frontend skills...');
    for (const skill of frontendSkills) {
      await client.create({ _type: 'skill', category: 'frontend', ...skill });
    }
    console.log(`   ✅ ${frontendSkills.length} frontend skills created\n`);

    // Create backend skills
    console.log('📝 Creating Backend skills...');
    for (const skill of backendSkills) {
      await client.create({ _type: 'skill', category: 'backend', ...skill });
    }
    console.log(`   ✅ ${backendSkills.length} backend skills created\n`);

    // Create cloud skills
    console.log('📝 Creating Cloud & Serverless skills...');
    for (const skill of cloudSkills) {
      await client.create({ _type: 'skill', category: 'cloud', ...skill });
    }
    console.log(`   ✅ ${cloudSkills.length} cloud skills created\n`);

    // Create tool skills
    console.log('📝 Creating Tools & Platforms skills...');
    for (const skill of toolSkills) {
      await client.create({ _type: 'skill', category: 'tools', ...skill });
    }
    console.log(`   ✅ ${toolSkills.length} tool skills created\n`);

    const total = frontendSkills.length + backendSkills.length + cloudSkills.length + toolSkills.length;
    console.log(`🎉 Successfully imported ${total} skills!`);

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

migrate();
