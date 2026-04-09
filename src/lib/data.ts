import { Script } from './types';

// Helper to simulate script content from the factory files
const getScriptContent = (id: string, title: string) => {
  return `# ${title}\n\n[0:00 - 0:45] THE EXPLOSIVE HOOK\n[VISUAL: Cinematic high-stakes opening...]\n\nHOST: "Welcome to the future of Clickbait. This is a 10-minute deep dive into ${title}."\n\n[Full 1600-word script integrated from CLICKBAIT_FACTORY...]`;
};

export const initialScripts: Script[] = [
  // --- TECH FLAGSHIPS ---
  {
    id: 't1',
    title: 'The Death of the Smartphone: What\'s Next?',
    slug: 'death-of-smartphone',
    channel: 'tech',
    status: 'pending',
    duration: '10:00',
    hook: 'I threw my iPhone in a blender...',
    createdAt: '2026-04-09',
    content: getScriptContent('t1', 'The Death of the Smartphone')
  },
  {
    id: 't2',
    title: 'The AI Job Massacre: Who is Actually Safe?',
    slug: 'ai-job-massacre',
    channel: 'tech',
    status: 'pending',
    duration: '10:00',
    hook: '20 Lakh jobs are about to vanish...',
    createdAt: '2026-04-09',
    content: getScriptContent('t2', 'The AI Job Massacre')
  },
  {
    id: 't3',
    title: 'Humanoid Robot Reality: 48 Hours with Unit 01',
    slug: 'humanoid-robot-reality',
    channel: 'tech',
    status: 'pending',
    duration: '10:00',
    hook: 'I spent $30,000 on a roommate that never sleeps...',
    createdAt: '2026-04-09',
    content: getScriptContent('t3', 'Humanoid Robot Reality')
  },
  {
    id: 't4',
    title: 'The AI Clone Identity Crisis: They Stole My Life',
    slug: 'ai-clone-crisis',
    channel: 'tech',
    status: 'pending',
    duration: '10:00',
    hook: 'My clone bypassed my bank security in 4 seconds...',
    createdAt: '2026-04-09',
    content: getScriptContent('t4', 'The AI Clone Identity Crisis')
  },
  {
    id: 't5',
    title: 'Why Google is Losing the Search War',
    slug: 'google-search-war',
    channel: 'tech',
    status: 'pending',
    duration: '10:00',
    hook: 'Google failed 40% of my questions...',
    createdAt: '2026-04-09',
    content: getScriptContent('t5', 'Why Google is Losing the Search War')
  },
  {
    id: 't6',
    title: 'Neuralink: 1 Year Later (The Reality)',
    slug: 'neuralink-reality',
    channel: 'tech',
    status: 'pending',
    duration: '10:00',
    hook: 'I am playing games with my mind...',
    createdAt: '2026-04-09',
    content: getScriptContent('t6', 'Neuralink: 1 Year Later')
  },
  {
    id: 't7',
    title: 'How AI is Stealing the Internet (The Slop Crisis)',
    slug: 'slop-crisis',
    channel: 'tech',
    status: 'pending',
    duration: '10:00',
    hook: '90% of the web is now fake garbage...',
    createdAt: '2026-04-09',
    content: getScriptContent('t7', 'The Slop Crisis')
  },
  {
    id: 't8',
    title: 'China vs USA: The 2026 Silicon War',
    slug: 'silicon-war',
    channel: 'tech',
    status: 'pending',
    duration: '10:00',
    hook: 'The war for world dominance is inside this chip...',
    createdAt: '2026-04-09',
    content: getScriptContent('t8', 'China vs USA Silicon War')
  },

  // --- FINANCE FLAGSHIPS ---
  {
    id: 'f1',
    title: 'Why the Indian Middle Class is Actually Broke',
    slug: 'middle-class-trap',
    channel: 'finance',
    status: 'pending',
    duration: '10:00',
    hook: 'You earn 1 Lakh but you are poor...',
    createdAt: '2026-04-09',
    content: getScriptContent('f1', 'Why the Indian Middle Class is Broke')
  },
  {
    id: 'f2',
    title: 'The 2026 Real Estate Bubble: Is your Home a Liability?',
    slug: 'real-estate-bubble',
    channel: 'finance',
    status: 'pending',
    duration: '10:00',
    hook: '₹5 Crore for a flat with ₹80k rent. The math is broken.',
    createdAt: '2026-04-09',
    content: getScriptContent('f2', 'The Real Estate Bubble')
  },
  {
    id: 'f3',
    title: 'How to pay 0% Tax in India (Legally)',
    slug: 'zero-tax-playbook',
    channel: 'finance',
    status: 'pending',
    duration: '10:00',
    hook: 'I gave a CA ₹1 Lakh to delete my tax bill...',
    createdAt: '2026-04-09',
    content: getScriptContent('f3', 'Zero Tax Playbook')
  },
  {
    id: 'f4',
    title: 'The Truth About Adani & Ambani (The Monopoly War)',
    slug: 'adani-vs-ambani',
    channel: 'finance',
    status: 'pending',
    duration: '10:00',
    hook: 'One owns the ports, the other owns the data...',
    createdAt: '2026-04-09',
    content: getScriptContent('f4', 'Adani vs Ambani Monopoly War')
  },
  {
    id: 'f5',
    title: 'Why Your Savings Account is a Scam',
    slug: 'savings-scam',
    channel: 'finance',
    status: 'pending',
    duration: '10:00',
    hook: 'You are being robbed in broad daylight...',
    createdAt: '2026-04-09',
    content: getScriptContent('f5', 'Why Your Savings Account is a Scam')
  },
  {
    id: 'f6',
    title: 'The Rise of the Finfluencer Scams',
    slug: 'finfluencer-scams',
    channel: 'finance',
    status: 'pending',
    duration: '10:00',
    hook: 'They show you Porsches, but they sell you traps...',
    createdAt: '2026-04-09',
    content: getScriptContent('f6', 'The Finfluencer Scams')
  }
];
