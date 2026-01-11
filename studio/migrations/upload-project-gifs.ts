/**
 * Migration script to upload project GIFs to Sanity
 * Run with: SANITY_TOKEN=your_token npx tsx studio/migrations/upload-project-gifs.ts
 */
import { createClient } from '@sanity/client';
import { createReadStream } from 'fs';
import { basename } from 'path';

const client = createClient({
  projectId: '1ewtvnrz',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_TOKEN, // Needs write access
});

// Mapping of project titles to their GIF file paths
const projectGifMapping: Record<string, string> = {
  'Glance Dashboard': 'src/assets/images/glance.gif',
  'Wearly Website': 'src/assets/images/Wearly.gif',
  'Pear Website': 'src/assets/images/Pear.gif',
  'Freshly Website': 'src/assets/images/Freshly.gif',
  'Fire Calculator': 'src/assets/images/Fire.gif',
  // Jet Prints has no GIF (discontinued professional project)
};

async function uploadGifToSanity(filePath: string): Promise<string> {
  const fileName = basename(filePath);
  console.log(`  📤 Uploading ${fileName}...`);

  const imageAsset = await client.assets.upload('image', createReadStream(filePath), {
    filename: fileName,
  });

  console.log(`  ✅ Uploaded: ${imageAsset._id}`);
  return imageAsset._id;
}

async function updateProjectWithImage(projectTitle: string, assetId: string): Promise<void> {
  // Find the project by title
  const project = await client.fetch<{ _id: string } | null>(
    `*[_type == "project" && title == $title][0]{ _id }`,
    { title: projectTitle }
  );

  if (!project) {
    console.log(`  ⚠️ Project not found: ${projectTitle}`);
    return;
  }

  // Update the project with the image reference
  await client.patch(project._id).set({
    image: {
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: assetId,
      },
    },
  }).commit();

  console.log(`  ✅ Updated project: ${projectTitle}`);
}

async function migrate() {
  console.log('🚀 Starting GIF migration...\n');

  if (!process.env.SANITY_TOKEN) {
    console.error('❌ SANITY_TOKEN environment variable is required');
    console.log('Run with: SANITY_TOKEN=your_token npx tsx studio/migrations/upload-project-gifs.ts');
    process.exit(1);
  }

  const entries = Object.entries(projectGifMapping);
  let successCount = 0;
  let failCount = 0;

  for (const [projectTitle, gifPath] of entries) {
    console.log(`\n📁 Processing: ${projectTitle}`);

    try {
      // Upload the GIF to Sanity
      const assetId = await uploadGifToSanity(gifPath);

      // Update the project document with the image reference
      await updateProjectWithImage(projectTitle, assetId);

      successCount++;
    } catch (error) {
      console.log(`  ❌ Failed: ${error instanceof Error ? error.message : String(error)}`);
      failCount++;
    }
  }

  console.log('\n' + '─'.repeat(50));
  console.log(`\n🎉 Migration completed!`);
  console.log(`   ✅ Success: ${successCount}`);
  console.log(`   ❌ Failed: ${failCount}`);
  console.log('\n📌 Next steps:');
  console.log('1. Open Sanity Studio to verify images');
  console.log('2. Check the portfolio website to see the GIFs');
}

migrate();
