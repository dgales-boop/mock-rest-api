import { sitesData } from '../data/sites';
import type { Level1Item, Level2Item } from '../data/sites';

export function getAllSites(): { level1: Level1Item[] } {
  return { level1: sitesData.level1 };
}

export function getSiteById(id: string): Level1Item | null {
  return sitesData.level1.find((site) => site.id === id) ?? null;
}

export function getLevel2ById(level2Id: string): { site: Level1Item; item: Level2Item } | null {
  for (const site of sitesData.level1) {
    const item = site.level2.find((l2) => l2.id === level2Id);
    if (item) return { site, item };
  }
  return null;
}
