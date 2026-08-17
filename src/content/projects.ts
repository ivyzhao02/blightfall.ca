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
    hook: 'A world consumed by the Blight. A life you may not keep.',
    summary:
      'A turn-based dark-fantasy RPG for Roblox about fragile vessels, party battles, and building a legacy across lives.',
    description:
      'Explore a hand-built world, train into branching classes, take on quests and bosses, and fight through formal turn-based battles alone or with a party. Death can end a character, but permanent Remnants carry part of each lost life into the next.',
    publicPageEnabled: true,
  },
];

const flagshipProject = projects.find((project) => project.id === 'blightfall-game');

if (!flagshipProject) throw new Error('The flagship BlightFall project record is required.');

export const blightFallGame = flagshipProject;
