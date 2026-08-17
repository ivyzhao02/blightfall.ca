export type ProjectStatus = 'concept' | 'prealpha' | 'alpha' | 'beta' | 'released' | 'inactive';

export interface StudioProfile {
  id: string;
  name: string;
  publicDescriptor: 'independent game studio';
  description: string;
  legalEntityName: string | null;
  flagshipProjectId: string;
}

export interface Project {
  id: string;
  slug: string;
  name: string;
  type: 'game';
  status: ProjectStatus;
  featured: boolean;
  platform: string[];
  hook: string;
  summary: string;
  description: string;
  publicPageEnabled: boolean;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  biography: string;
  image: string | null;
  links: Array<{ label: string; url: string }>;
  approvedForPublication: boolean;
}

export interface NewsEntry {
  id: string;
  slug: string;
  title: string;
  summary: string;
  publishedAt: string;
  scope: 'studio' | 'project';
  projectId: string | null;
  approvedForPublication: boolean;
}
