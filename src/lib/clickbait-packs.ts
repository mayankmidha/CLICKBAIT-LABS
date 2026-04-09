export type ClickbaitPackId = 'core' | 'tech' | 'finance' | 'production' | 'distribution';

export type ClickbaitCapability =
  // Core Platform
  | 'auth'
  | 'roles'
  | 'notifications'
  | 'global-search'
  
  // Tech Channel
  | 'tech-scripting'
  | 'hardware-reviews'
  | 'ai-investigations'
  | 'gadget-unboxing'
  
  // Finance Channel
  | 'finance-scripting'
  | 'macro-analysis'
  | 'tax-exposes'
  | 'wealth-tracking'
  
  // Production
  | 'script-approval'
  | 'shoot-scheduling'
  | 'location-scouting'
  | 'equipment-inventory'
  | 'teleprompter-mode'
  
  // Distribution
  | 'youtube-analytics'
  | 'thumbnail-a-b'
  | 'title-optimization'
  | 'cross-platform-sync';

export interface ClickbaitPackDefinition {
  id: ClickbaitPackId;
  name: string;
  description: string;
  capabilities: ClickbaitCapability[];
}

export const CLICKBAIT_PACKS: Record<ClickbaitPackId, ClickbaitPackDefinition> = {
  core: {
    id: 'core',
    name: 'Clickbait Core',
    description: 'Management core for Mayank & Tathagat.',
    capabilities: ['auth', 'roles', 'notifications', 'global-search'],
  },
  tech: {
    id: 'tech',
    name: 'Tech Channel Pack',
    description: 'High-retention tech content tools.',
    capabilities: ['tech-scripting', 'hardware-reviews', 'ai-investigations', 'gadget-unboxing'],
  },
  finance: {
    id: 'finance',
    name: 'Finance Channel Pack',
    description: 'Macro-economic and wealth content tools.',
    capabilities: ['finance-scripting', 'macro-analysis', 'tax-exposes', 'wealth-tracking'],
  },
  production: {
    id: 'production',
    name: 'Movie Production Pack',
    description: 'Professional shoot and approval pipeline.',
    capabilities: ['script-approval', 'shoot-scheduling', 'teleprompter-mode', 'equipment-inventory'],
  },
  distribution: {
    id: 'distribution',
    name: 'Growth Pack',
    description: 'Viral distribution and retention analytics.',
    capabilities: ['youtube-analytics', 'thumbnail-a-b', 'title-optimization', 'cross-platform-sync'],
  },
};
