export type ScriptStatus = 'pending' | 'approved' | 'rejected' | 'deleted';
export type ScriptChannel = 'tech' | 'finance';

export interface Script {
  id: string;
  title: string;
  slug: string;
  channel: ScriptChannel;
  status: ScriptStatus;
  hook: string;
  duration: string;
  content: string; // Markdown content
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  role: 'founder' | 'creator';
  avatar?: string;
}

export interface ShootSchedule {
  id: string;
  scriptId: string;
  creatorId: string;
  shootDate: string;
  status: 'scheduled' | 'filmed' | 'editing' | 'published';
}
