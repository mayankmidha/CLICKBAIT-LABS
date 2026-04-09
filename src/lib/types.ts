export type ScriptStatus = 'pending' | 'approved' | 'rejected' | 'deleted';
export type ScriptChannel = 'tech' | 'finance';

export interface Creator {
  id: string;
  name: string;
  email: string;
  niche: ScriptChannel;
  avatar?: string;
  createdAt: string;
}

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
  assignedTo?: string; // Creator ID
}

export interface User {
  id: string;
  name: string;
  role: 'founder' | 'creator';
  email?: string;
  avatar?: string;
}

export interface ShootSchedule {
  id: string;
  scriptId: string;
  creatorId: string;
  shootDate: string;
  status: 'scheduled' | 'filmed' | 'editing' | 'published';
}
