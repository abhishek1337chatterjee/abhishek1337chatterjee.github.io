/**
 * Import About data to Sanity
 * Run with: SANITY_TOKEN="..." npx tsx studio/migrations/import-about.ts
 */
import { createClient } from '@sanity/client';

const client = createClient({
  projectId: '1ewtvnrz',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_TOKEN,
});

const aboutData = {
  _id: 'about',
  _type: 'about',
  name: 'Abhishek Chatterjee',
  title: 'Serverless Engineer | React Developer',
  location: 'India',
  experience: '2+ years',
  bio: `I'm a passionate Software Engineer with 2+ years of experience building scalable applications. My journey started as a Frontend Developer, where I spent a year crafting user interfaces with React and building production-ready projects.

Currently, I'm working as a Serverless Engineer at a Fintech company, where I architect and build cloud-native solutions using AWS services including Lambda, Step Functions, EventBridge, SQS, SNS, Cognito, and SES. I've also worked with Sanity CMS for content management and explored Temporal.io for workflow orchestration.

Beyond my day job, I'm constantly exploring new technologies. Currently diving into Docker for containerization and Mockoon for API mocking. I'm a big advocate of open source and love working with Linux servers, especially Ubuntu.

When I'm not coding, you'll find me watching cricket, assembling PCs, or exploring open source projects.`,
  highlights: [
    '2+ Years Experience',
    'Serverless Engineer',
    'Linux Enthusiast',
    'Open Source Lover',
  ],
  interests: ['Cricket', 'PC Building', 'Open Source', 'Linux'],
};

async function migrate() {
  console.log('🚀 Importing About data...\n');

  try {
    // Check if about document already exists
    const existing = await client.fetch('*[_type == "about" && _id == "about"][0]');

    if (existing) {
      console.log('📝 About document exists, updating...');
      await client.patch('about').set(aboutData).commit();
      console.log('✅ About document updated!\n');
    } else {
      console.log('📝 Creating new About document...');
      await client.createOrReplace(aboutData);
      console.log('✅ About document created!\n');
    }

    console.log('🎉 About data imported successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

migrate();
