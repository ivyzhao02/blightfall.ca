import type { Project } from './models';

export const projects: Project[] = [
  {
    id: 'blightfall-game',
    slug: 'blightfall',
    name: 'BlightFall',
    type: 'game',
    status: 'prealpha',
    featured: true,
    platform: ['Roblox'],
    summary: 'An upcoming dark-fantasy Roblox RPG in pre-alpha development.',
    description:
      'BlightFall is an upcoming dark-fantasy Roblox RPG in pre-alpha development, combining exploration, party-based turn combat, and progression across lives.',
    publicPageEnabled: true,
  },
];

const flagshipProject = projects.find((project) => project.id === 'blightfall-game');

if (!flagshipProject) throw new Error('The flagship BlightFall project record is required.');

export const blightFallGame = flagshipProject;
