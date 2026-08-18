import { blightFallGame } from '../content/projects';
import { studioProfile } from '../content/studio';

export type ReleaseState = 'prelaunch' | 'launch' | 'live';
export type LinkPresentation = 'primary' | 'secondary';
export type Platform = 'bluesky' | 'discord' | 'instagram' | 'roblox' | 'tiktok' | 'x' | 'youtube';

export interface OfficialLink {
  id: string;
  label: string;
  url: string | null;
  platform: Platform;
  icon: Platform;
  order: number;
  enabled: boolean;
  presentation: LinkPresentation;
  analyticsId?: string;
}

export const siteConfig = {
  name: studioProfile.name,
  siteUrl: 'https://blightfall.ca',
  description: studioProfile.description,
  shortDescription: `${studioProfile.name} is an ${studioProfile.publicDescriptor}.`,
  flagshipProjectId: studioProfile.flagshipProjectId,
  flagshipProjectSummary: blightFallGame.summary,
  socialImage: '/social/blightfall-social-preview.png',
  release: {
    state: 'prelaunch' as ReleaseState,
    launchDate: null as string | null,
    showLaunchDate: false,
    showCountdown: false,
    showPlayNow: false,
    showNewsletter: false,
    showAnnouncementPrompt: false,
  },
  releaseCopy: {
    prelaunch: {
      eyebrow: 'Pre-alpha development',
      message: 'Enter the community and follow BlightFall as it takes shape.',
    },
    launch: {
      eyebrow: 'Launch approaching',
      message: 'BlightFall is preparing to open on Roblox.',
    },
    live: {
      eyebrow: 'Now on Roblox',
      message: 'BlightFall is now available on Roblox.',
    },
  },
  primaryLinkByState: {
    prelaunch: 'discord',
    launch: 'play',
    live: 'play',
  } satisfies Record<ReleaseState, string>,
  analytics: {
    provider: 'none' as 'none' | 'plausible' | 'cloudflare',
    plausibleDomain: null as string | null,
    cloudflareToken: null as string | null,
  },
  discordWidget: {
    guildId: '1511511102351998996',
    statsEndpoint: 'https://discord.com/api/v10/invites/blightfall?with_counts=true',
  },
} as const;

/**
 * Public destinations live here and nowhere else.
 * Keep an entry disabled until its exact official URL has been confirmed.
 */
export const officialLinks: OfficialLink[] = [
  {
    id: 'play',
    label: 'Play BlightFall',
    url: null,
    platform: 'roblox',
    icon: 'roblox',
    order: 0,
    enabled: false,
    presentation: 'primary',
    analyticsId: 'play-blightfall',
  },
  {
    id: 'discord',
    label: 'Join the Discord',
    url: 'https://discord.gg/blightfall',
    platform: 'discord',
    icon: 'discord',
    order: 1,
    enabled: true,
    presentation: 'primary',
    analyticsId: 'join-discord',
  },
  {
    id: 'roblox',
    label: 'Join the Roblox group',
    url: 'https://www.roblox.com/share/g/15580589',
    platform: 'roblox',
    icon: 'roblox',
    order: 2,
    enabled: true,
    presentation: 'secondary',
    analyticsId: 'roblox-group',
  },
  {
    id: 'latest-video',
    label: 'Watch the latest gameplay',
    url: null,
    platform: 'youtube',
    icon: 'youtube',
    order: 3,
    enabled: false,
    presentation: 'secondary',
    analyticsId: 'latest-video',
  },
  {
    id: 'youtube',
    label: 'YouTube',
    url: 'https://www.youtube.com/@BlightFallRoblox',
    platform: 'youtube',
    icon: 'youtube',
    order: 4,
    enabled: true,
    presentation: 'secondary',
    analyticsId: 'youtube',
  },
  {
    id: 'tiktok',
    label: 'TikTok',
    url: 'https://www.tiktok.com/@blightfallroblox',
    platform: 'tiktok',
    icon: 'tiktok',
    order: 5,
    enabled: true,
    presentation: 'secondary',
    analyticsId: 'tiktok',
  },
  {
    id: 'instagram',
    label: 'Instagram',
    url: 'https://www.instagram.com/blightfallroblox/',
    platform: 'instagram',
    icon: 'instagram',
    order: 6,
    enabled: true,
    presentation: 'secondary',
    analyticsId: 'instagram',
  },
  {
    id: 'x',
    label: 'X',
    url: 'https://x.com/BlightFallRblx',
    platform: 'x',
    icon: 'x',
    order: 7,
    enabled: true,
    presentation: 'secondary',
    analyticsId: 'x',
  },
  {
    id: 'bluesky',
    label: 'Bluesky',
    url: 'https://bsky.app/profile/blightfallroblox.bsky.social',
    platform: 'bluesky',
    icon: 'bluesky',
    order: 8,
    enabled: true,
    presentation: 'secondary',
    analyticsId: 'bluesky',
  },
];

export function getEnabledLinks(): OfficialLink[] {
  return officialLinks
    .filter(
      (link) => link.enabled && link.url && (link.id !== 'play' || siteConfig.release.showPlayNow),
    )
    .sort((left, right) => left.order - right.order);
}

export function getPrimaryLink(state = siteConfig.release.state): OfficialLink {
  const primaryId = siteConfig.primaryLinkByState[state];
  const primary = getEnabledLinks().find((link) => link.id === primaryId);

  if (!primary) {
    throw new Error(
      `Release state "${state}" requires an enabled, confirmed URL for link "${primaryId}".`,
    );
  }

  return primary;
}
