import { Script, User } from './types';

export const founders: User[] = [
  { id: '1', name: 'Mayank', role: 'founder' },
  { id: '2', name: 'Tathagat', role: 'founder' },
];

export const initialScripts: Script[] = [
  // --- TECH SCRIPTS ---
  {
    id: 't1',
    title: 'The Death of the Smartphone: What\'s Next?',
    slug: 'death-of-smartphone',
    channel: 'tech',
    status: 'pending',
    duration: '10:00',
    hook: 'I threw my iPhone in a blender...',
    createdAt: '2026-04-09',
    content: `# SCRIPT 1: THE DEATH OF THE SMARTPHONE\n\n[0:00 - 0:45] THE EXPLOSIVE HOOK\n[VISUAL: Host standing in a busy metro station. Everyone is hunched over rectangles...]\n\nHOST: "Look at this. Every person in this frame is addicted to a 6-inch rectangle..."`
  },
  {
    id: 't2',
    title: 'The AI Job Massacre: Who is Actually Safe?',
    slug: 'ai-job-massacre',
    channel: 'tech',
    status: 'approved',
    duration: '10:00',
    hook: '20 Lakh jobs are about to vanish...',
    createdAt: '2026-04-09',
    content: `# SCRIPT 2: AI JOB MASSACRE\n\n[0:00 - 0:45] THE EXPLOSIVE HOOK\n[VISUAL: Fast-paced montage of empty office buildings...]\n\nHOST: "In the next five years, 20 Lakh jobs in India’s IT sector could simply... vanish."`
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
    content: `# SCRIPT 3: HUMANOID ROBOT REALITY\n\n[0:00 - 0:45] THE EXPLOSIVE HOOK\n[VISUAL: Massive high-tech crate being lowered by a crane...]\n\nHOST: "I just spent $30,000 on a roommate that never sleeps, never eats..."`
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
    content: `# SCRIPT 4: AI CLONE IDENTITY CRISIS\n\n[0:00 - 0:45] THE EXPLOSIVE HOOK\n[VISUAL: Host sitting in a dark room. Screen glitches. A second identical host appears...]\n\nHOST: "I didn't record this intro. My AI clone did."`
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
    content: `# SCRIPT 5: GOOGLE SEARCH WAR\n\n[0:00 - 0:45] THE EXPLOSIVE HOOK\n[VISUAL: Host standing in front of a giant Google logo. Hits delete key...]\n\nHOST: "Twenty-five years of dominance. One search bar to rule them all. Today, it's crumbling."`
  },

  // --- FINANCE SCRIPTS ---
  {
    id: 'f1',
    title: 'Why the Indian Middle Class is Actually Broke',
    slug: 'middle-class-trap',
    channel: 'finance',
    status: 'pending',
    duration: '10:00',
    hook: 'You earn 1 Lakh but you are poor...',
    createdAt: '2026-04-09',
    content: `# SCRIPT 1: MIDDLE CLASS TRAP\n\n[0:00 - 0:45] THE EXPLOSIVE HOOK\n[VISUAL: Host standing in a middle-class apartment. Walls covered in EMI sticky notes...]\n\nHOST: "You earn ₹1 Lakh a month. You vacation in Bali. But you are a high-income prisoner."`
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
    content: `# SCRIPT 2: REAL ESTATE BUBBLE\n\n[0:00 - 0:45] THE EXPLOSIVE HOOK\n[VISUAL: Host standing in front of a half-finished luxury skyscraper in Gurgaon...]\n\nHOST: "This apartment costs ₹5 Crore. The rent? Only ₹80,000. The math doesn't work."`
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
    content: `# SCRIPT 3: ZERO TAX PLAYBOOK\n\n[0:00 - 0:45] THE EXPLOSIVE HOOK\n[VISUAL: Host at an airport, holding a Tax Invoice and a Gift Deed...]\n\nHOST: "The Indian government took ₹30 Lakh from this entrepreneur. This year? Zero."`
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
    content: `# SCRIPT 4: ADANI VS AMBANI\n\n[0:00 - 0:45] THE EXPLOSIVE HOOK\n[VISUAL: Giant digital chessboard. Adani vs Ambani...]\n\nHOST: "This isn't a business competition. It’s a war for the soul of the Indian economy."`
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
    content: `# SCRIPT 5: SAVINGS SCAM\n\n[0:00 - 0:45] THE EXPLOSIVE HOOK\n[VISUAL: Host standing inside a high-security bank vault. Holding cash...]\n\nHOST: "The bank is lying to you. Every second your money sits here, it's losing value."`
  }
];
