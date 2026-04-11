import prisma from '../src/lib/prisma';
import fs from 'fs';
import path from 'path';

const FACTORY_TECH_PATH = '/Users/midha/Downloads/CLICKBAIT_FACTORY/TECH';
const FACTORY_FINANCE_PATH = '/Users/midha/Downloads/CLICKBAIT_FACTORY/FINANCE';
const BATCH_TECH_PATH = '/Users/midha/Downloads/CLICKBAIT_TECH';
const BATCH_FINANCE_PATH = '/Users/midha/Downloads/CLICKBAIT_FINANCE';

async function parseAndSeed() {
  console.log('--- Starting Comprehensive Script Ingestion & Cleaning ---');

  // Create default users (cofounders)
  await prisma.user.upsert({
    where: { email: 'mayank@clickbait.labs' },
    update: {},
    create: {
      email: 'mayank@clickbait.labs',
      name: 'Mayank',
      role: 'founder',
    },
  });

  await prisma.user.upsert({
    where: { email: 'tathagat@clickbait.labs' },
    update: {},
    create: {
      email: 'tathagat@clickbait.labs',
      name: 'Tathagat',
      role: 'founder',
    },
  });

  // 1. Seed from Factory (Individual Files)
  await seedFromFactory('tech', FACTORY_TECH_PATH);
  await seedFromFactory('finance', FACTORY_FINANCE_PATH);

  // 2. Seed from Batch Files (Multi-video files)
  await seedFromBatch('tech', BATCH_TECH_PATH);
  await seedFromBatch('finance', BATCH_FINANCE_PATH);

  console.log('--- Ingestion & Cleaning Complete ---');
}

async function seedFromFactory(channel: 'tech' | 'finance', dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    console.warn(`Directory not found: ${dirPath}`);
    return;
  }

  const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.md'));
  console.log(`Processing ${files.length} factory files in ${channel} channel.`);

  for (const file of files) {
    const fullPath = path.join(dirPath, file);
    const content = fs.readFileSync(fullPath, 'utf-8');
    await upsertScript(content, channel, file);
  }
}

async function seedFromBatch(channel: 'tech' | 'finance', dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    console.warn(`Directory not found: ${dirPath}`);
    return;
  }

  const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.md'));
  console.log(`Processing ${files.length} batch files in ${channel} channel.`);

  for (const file of files) {
    const fullPath = path.join(dirPath, file);
    const content = fs.readFileSync(fullPath, 'utf-8');
    
    // Split by "## VIDEO"
    const parts = content.split(/## VIDEO \d+:/);
    if (parts.length <= 1) continue;

    console.log(`  Found ${parts.length - 1} videos in batch file: ${file}`);
    
    for (let i = 1; i < parts.length; i++) {
      const videoContent = parts[i];
      // Reconstruct a "pseudo-file" content for parsing
      const titleMatch = videoContent.match(/^\s*(.+)/);
      const title = titleMatch ? titleMatch[1].trim() : `Batch Video ${i}`;
      
      // Check if this video has full content or just hook
      const hasFullContent = videoContent.includes('### [');
      
      if (!hasFullContent) {
        // Skip hooks for now if we want "Clean" scripts only, 
        // OR we can create a placeholder script.
        // Let's only ingest full scripts from batch to keep it "Clean".
        continue;
      }

      await upsertScript(videoContent, channel, `${file}_v${i}`, title);
    }
  }
}

async function upsertScript(content: string, channel: 'tech' | 'finance', sourceRef: string, providedTitle?: string) {
  // Extract metadata
  const titleMatch = content.match(/## TITLE:\s*(.+)/) || content.match(/^\s*(.+)/);
  const title = providedTitle || (titleMatch ? titleMatch[1].trim() : sourceRef);

  // Clean title: remove markdown bolding if present
  const cleanTitle = title.replace(/\*\*/g, '').trim();
  const slug = cleanTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  if (!slug) return;

  // Extract duration
  let duration = '10:00';
  const durationMatch = content.match(/\*\*Duration:\*\*\s*([^\n(]+)/);
  if (durationMatch) duration = durationMatch[1].trim();

  // Extract tone
  let tone = 'High-Stakes';
  const toneMatch = content.match(/\*\*Tone:\*\*\s*(.+)/);
  if (toneMatch) tone = toneMatch[1].trim().replace(/\.$/, '').replace(/\*\*/g, '');

  // Extract hook
  let hook = '';
  const hookMatch = content.match(/\*\*HOST:\*\*\s*"([^"]+)"/);
  if (hookMatch) {
    hook = hookMatch[1].substring(0, 200);
  } else {
    const hookSection = content.match(/THE (?:EXPLOSIVE |BEAST )?HOOK\n([\s\S]*?)(?=###|---|$)/);
    if (hookSection) {
      const firstLine = hookSection[1].trim().split('\n').find(l => l.trim() && !l.startsWith('[') && !l.startsWith('**['));
      if (firstLine) hook = firstLine.replace(/\*\*/g, '').replace(/^HOST:\s*/, '').replace(/"/g, '').substring(0, 200);
    }
  }

  if (!hook) hook = `A deep dive into ${cleanTitle}`;

  try {
    await prisma.script.upsert({
      where: { slug },
      update: {
        title: cleanTitle,
        channel,
        duration,
        tone,
        hook,
        content,
        // Don't overwrite status if it's already approved/rejected
      },
      create: {
        title: cleanTitle,
        slug,
        channel,
        status: 'pending',
        duration,
        tone,
        hook,
        content,
      },
    });
    // console.log(`  ✓ ${channel} → "${cleanTitle}"`);
  } catch (err: any) {
    console.error(`  ✗ Error upserting "${cleanTitle}":`, err.message);
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
