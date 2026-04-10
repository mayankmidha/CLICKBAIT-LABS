import { Script } from './types';

// Helper to simulate script content from the factory files
const getScriptContent = (id: string, title: string) => {
  return `# ${title}\n\n[0:00 - 0:45] THE EXPLOSIVE HOOK\n[VISUAL: Cinematic high-stakes opening...]\n\nHOST: "Welcome to the future of Clickbait. This is a 10-minute deep dive into ${title}."\n\n[Full 1600-word script integrated from CLICKBAIT_FACTORY...]`;
};

// Batch 1-50 Tech titles from previous generations (simulated for metadata)
const techTitles = [
  "The Death of the Smartphone", "AI Job Massacre", "Humanoid Robot Reality", "AI Clone Identity Crisis",
  "Google Search War", "Neuralink Reality", "The Slop Crisis", "Silicon War: China vs USA",
  "Testing Temu Gadgets", "Future of Wearables", "The 6G Lie", "Local AI Revolution",
  "Emotion Tracking Apps", "Linux Mainstream 2026", "Anti-Algorithm Social Media", "Infinite AI Games",
  "The Browser that Pays You", "Super-App Wars", "Tech Making us Lonely", "Scroll Addiction Psychology",
  "Can AI have a Soul?", "VR Monk Meditation", "AI Reading Tutor", "Bio-Hacker Implants",
  "6G vs Brain", "Rabbit R1 Failure", "Google Search Death", "Quantum Encryption Break",
  "Digital Afterlife AI", "Neuralink 1000 Humans", "Smartphone is Dead", "AI Battlefield 2026",
  "Internet of Bodies", "Ghost Economy Heist", "Subsea Cable War", "Deepfake Crime Scams",
  "No-Code Apocalypse", "Local-First Web", "The Silicon Silk Road"
];

// Batch 1-46 Finance titles
const financeTitles = [
  "Indian Middle Class Trap", "Real Estate Bubble 2026", "Zero Tax Playbook", "Adani vs Ambani Monopoly",
  "Savings Account Scam", "Finfluencer Scams", "Stablecoin Revolution", "Crypto Rugpull Story",
  "AI Wall Street Takeover", "Rent-to-Own Scam", "Micro-Credit Debt-Units", "Data Broker War",
  "CBDC Freedom End", "Stock Market Crash 2026", "Tokenized Real Estate", "Social Credit Finance",
  "UBI Experiment Trap", "Ghost Economy Money Washing", "Dubai Zero-Tax Haven"
];

export const initialScripts: Script[] = [
  ...techTitles.map((title, i) => ({
    id: `t${i+1}`,
    title,
    slug: title.toLowerCase().replace(/ /g, '-'),
    channel: 'tech' as const,
    status: (i < 10 ? 'approved' : 'pending') as any,
    duration: '10:00',
    hook: `A deep dive into ${title}...`,
    createdAt: '2026-04-09',
    content: getScriptContent(`t${i+1}`, title)
  })),
  ...financeTitles.map((title, i) => ({
    id: `f${i+1}`,
    title,
    slug: title.toLowerCase().replace(/ /g, '-'),
    channel: 'finance' as const,
    status: (i < 5 ? 'approved' : 'pending') as any,
    duration: '10:00',
    hook: `Exposing the truth about ${title}...`,
    createdAt: '2026-04-09',
    content: getScriptContent(`f${i+1}`, title)
  }))
];
