import prisma from '../src/lib/prisma';
import fs from 'fs';
import path from 'path';

const TECH_PATH = '/Users/midha/Downloads/CLICKBAIT_FACTORY/TECH';
const FINANCE_PATH = '/Users/midha/Downloads/CLICKBAIT_FACTORY/FINANCE';

async function parseAndSeed() {
  console.log('--- Starting Script Ingestion ---');

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

    // Each file is ONE script. Extract metadata from the markdown.
    // Format:
    //   # CLICKBAIT TECH — SCRIPT N
    //   ## TITLE: <title>
    //   **Duration:** 10:00 (approx. 1600 words)
    //   **Tone:** Investigative, Disruptive, High-Stakes.
    //   ---
    //   ### [0:00 - 0:45] THE EXPLOSIVE HOOK
    //   ...

    // Extract title
    const titleMatch = content.match(/## TITLE:\s*(.+)/);
    const title = titleMatch ? titleMatch[1].trim() : file.replace(/\.md$/, '').replace(/^\d+_/, '').replace(/_/g, ' ');

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    // Extract duration
    let duration = '10:00';
    const durationMatch = content.match(/\*\*Duration:\*\*\s*([^\n(]+)/);
    if (durationMatch) duration = durationMatch[1].trim();

    // Extract tone
    let tone = 'High-Stakes';
    const toneMatch = content.match(/\*\*Tone:\*\*\s*(.+)/);
    if (toneMatch) tone = toneMatch[1].trim().replace(/\.$/, '');

    // Extract hook — first HOST: line
    let hook = '';
    const hookMatch = content.match(/\*\*HOST:\*\*\s*"([^"]+)"/);
    if (hookMatch) {
      hook = hookMatch[1].substring(0, 200);
    } else {
      // Fallback: first non-empty line after THE HOOK section
      const hookSection = content.match(/THE (?:EXPLOSIVE |BEAST )?HOOK\n([\s\S]*?)(?=###|---|$)/);
      if (hookSection) {
        const firstLine = hookSection[1].trim().split('\n').find(l => l.trim() && !l.startsWith('[') && !l.startsWith('**['));
        if (firstLine) hook = firstLine.replace(/\*\*/g, '').replace(/^HOST:\s*/, '').replace(/"/g, '').substring(0, 200);
      }
    }

    if (!hook) hook = `A deep dive into ${title}`;

    try {
      await prisma.script.upsert({
        where: { slug },
        update: {
          title,
          channel,
          duration,
          tone,
          hook,
          content,
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
          content,
        },
      });
      console.log(`  ✓ ${channel}/${file} → "${title}"`);
    } catch (err: any) {
      // Slug collision — append file number
      const altSlug = slug + '-' + file.match(/^(\d+)/)?.[1];
      console.warn(`  ⚠ Slug collision for "${title}", using: ${altSlug}`);
      await prisma.script.upsert({
        where: { slug: altSlug },
        update: { title, channel, duration, tone, hook, content, status: 'pending' },
        create: { title, slug: altSlug, channel, status: 'pending', duration, tone, hook, content },
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
