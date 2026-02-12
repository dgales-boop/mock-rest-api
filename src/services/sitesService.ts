import { sitesData } from '../data/sites';
import type { Level1Item, Level2Item, Protocol } from '../data/sites';

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

export function getLevel2BySiteIdAndLevel2Id(siteId: string, level2Id: string): Level2Item | null {
  const site = sitesData.level1.find((s) => s.id === siteId);
  if (!site) return null;
  const item = site.level2.find((l2) => l2.id === level2Id);
  return item ?? null;
}

export function getProtocolBySiteIdLevel2IdAndProtocolId(
  siteId: string,
  level2Id: string,
  protocolId: string
): Protocol | null {
  const level2 = getLevel2BySiteIdAndLevel2Id(siteId, level2Id);
  if (!level2) return null;
  const protocol = level2.protocols.find((p) => p.id === protocolId);
  return protocol ?? null;
}

export function getProtocolsByLevel2Id(level2Id: string): { level2: Level2Item; protocols: Protocol[] } | null {
  const result = getLevel2ById(level2Id);
  if (!result) return null;
  return { level2: result.item, protocols: result.item.protocols };
}

export function getProtocolById(protocolId: string): { level2: Level2Item; protocol: Protocol } | null {
  for (const site of sitesData.level1) {
    for (const level2 of site.level2) {
      const protocol = level2.protocols.find((p) => p.id === protocolId);
      if (protocol) return { level2, protocol };
    }
  }
  return null;
}
