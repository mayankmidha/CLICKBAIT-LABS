import prisma from '../src/lib/prisma';
import fs from 'fs';
import path from 'path';

// Removed explicit constructor as it should pick up from prisma.config.ts via the generated client

const TECH_PATH = '/Users/midha/Downloads/CLICKBAIT_TECH';
const FINANCE_PATH = '/Users/midha/Downloads/CLICKBAIT_FINANCE';

async function parseAndSeed() {
  console.log('--- Starting Script Ingestion ---');

  // Create default users
  const mayank = await prisma.user.upsert({
    where: { email: 'mayank@clickbait.labs' },
    update: {},
    create: {
      email: 'mayank@clickbait.labs',
      name: 'Mayank',
      role: 'founder',
    },
  });

  const tathagat = await prisma.user.upsert({
    where: { email: 'tathagat@clickbait.labs' },
    update: {},
    create: {
      email: 'tathagat@clickbait.labs',
      name: 'Tathagat',
      role: 'founder',
    },
  });

  await seedChannel('tech', TECH_PATH);
  await seedChannel('finance', FINANCE_PATH);

  console.log('--- Ingestion Complete ---');
}

async function seedChannel(channel: 'tech' | 'finance', dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    console.warn(`Directory not found: ${dirPath}`);
    return;
  }

  const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.md'));
  console.log(`Found ${files.length} files in ${channel} channel.`);

  for (const file of files) {
    const fullPath = path.join(dirPath, file);
    const content = fs.readFileSync(fullPath, 'utf-8');
    
    // Split by "## VIDEO"
    const sections = content.split(/## VIDEO \d+:/).slice(1);
    
    for (const section of sections) {
      const lines = section.trim().split('\n');
      const title = lines[0].trim();
      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      
      let duration = '10:00';
      let tone = 'High-Stakes';
      let hook = '';
      
      // Extract metadata
      const durationMatch = section.match(/\*\*Duration:\*\*\s*(.*)/);
      if (durationMatch) duration = durationMatch[1].trim();

      const toneMatch = section.match(/\*\*Tone:\*\*\s*(.*)/);
      if (toneMatch) tone = toneMatch[1].trim();

      // Extract hook (BEAST HOOK)
      const hookMatch = section.match(/### \[\d+:\d+ - \d+:\d+\] THE (?:BEAST )?HOOK\n([\s\S]*?)(?=###|---|$)/);
      if (hookMatch) {
        hook = hookMatch[1].trim().split('\n').slice(0, 3).join(' ');
      }

      await prisma.script.upsert({
        where: { slug },
        update: {
          title,
          channel,
          duration,
          tone,
          hook,
          content: `## ${title}\n\n${section.trim()}`,
          status: 'pending',
        },
        create: {
          title,
          slug,
          channel,
          status: 'pending',
          duration,
          tone,
          hook,
          content: `## ${title}\n\n${section.trim()}`,
        },
      });
    }
  }
}

parseAndSeed()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
