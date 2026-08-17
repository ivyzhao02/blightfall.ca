import { describe, expect, it } from 'vitest';
import { getEnabledLinks, getPrimaryLink, officialLinks, siteConfig } from '../src/config/site';
import { newsEntries } from '../src/content/news';
import { blightFallGame, projects } from '../src/content/projects';
import { studioProfile } from '../src/content/studio';
import { teamMembers } from '../src/content/team';

describe('public site configuration', () => {
  it('has unique link IDs and display orders', () => {
    expect(new Set(officialLinks.map((link) => link.id)).size).toBe(officialLinks.length);
    expect(new Set(officialLinks.map((link) => link.order)).size).toBe(officialLinks.length);
  });

  it('renders only confirmed HTTPS destinations', () => {
    const enabled = getEnabledLinks();
    expect(enabled.length).toBeGreaterThan(0);

    for (const link of enabled) {
      expect(link.url).toMatch(/^https:\/\//);
      expect(link.label.trim()).not.toBe('');
      expect(link.analyticsId?.trim()).not.toBe('');
    }
  });

  it('uses Discord as the confirmed prelaunch primary action', () => {
    expect(siteConfig.release.state).toBe('prelaunch');
    expect(getPrimaryLink()).toMatchObject({
      id: 'discord',
      url: 'https://discord.gg/blightfall',
    });
  });

  it('publishes the approved public social profiles', () => {
    expect(
      getEnabledLinks()
        .filter((link) => link.id !== 'discord')
        .map((link) => link.id),
    ).toEqual(['youtube', 'tiktok', 'instagram', 'x', 'bluesky']);
  });

  it('fails safely when launch is selected before the play URL is approved', () => {
    expect(() => getPrimaryLink('launch')).toThrow(/requires an enabled, confirmed URL/);
    expect(() => getPrimaryLink('live')).toThrow(/requires an enabled, confirmed URL/);
  });

  it('does not expose an unapproved release date or analytics provider', () => {
    expect(siteConfig.release.launchDate).toBeNull();
    expect(siteConfig.release.showLaunchDate).toBe(false);
    expect(siteConfig.release.showCountdown).toBe(false);
    expect(siteConfig.release.showPlayNow).toBe(false);
    expect(siteConfig.analytics.provider).toBe('none');
  });

  it('retains the requested public-link priority in configuration', () => {
    expect(
      officialLinks
        .filter((link) => link.id !== 'play')
        .sort((a, b) => a.order - b.order)
        .map((link) => link.id),
    ).toEqual([
      'discord',
      'roblox',
      'latest-video',
      'youtube',
      'tiktok',
      'instagram',
      'x',
      'bluesky',
    ]);
  });

  it('separates the independent studio from its flagship game', () => {
    expect(studioProfile).toMatchObject({
      name: 'BlightFall',
      publicDescriptor: 'independent game studio',
      legalEntityName: null,
      flagshipProjectId: 'blightfall-game',
    });
    expect(blightFallGame).toMatchObject({
      name: 'BlightFall',
      type: 'game',
      status: 'prealpha',
      featured: true,
      platform: ['Roblox'],
    });
    expect(projects).toHaveLength(1);
  });

  it('does not publish unapproved team members or news entries', () => {
    expect(teamMembers).toEqual([]);
    expect(newsEntries).toEqual([]);
    expect(teamMembers.every((member) => member.approvedForPublication)).toBe(true);
    expect(newsEntries.every((entry) => entry.approvedForPublication)).toBe(true);
  });
});
