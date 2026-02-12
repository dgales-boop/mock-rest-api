import { Request, Response } from 'express';
import * as sitesService from '../services/sitesService';

export function listSites(_req: Request, res: Response): void {
  const data = sitesService.getAllSites();
  res.status(200).json(data);
}

export function getSiteById(req: Request, res: Response): void {
  const { id } = req.params;
  const site = sitesService.getSiteById(id);
  if (!site) {
    res.status(404).json({ error: 'Not found', message: `Site with id '${id}' not found` });
    return;
  }
  res.status(200).json(site);
}

export function getLevel2ById(req: Request, res: Response): void {
  const { id } = req.params;
  const result = sitesService.getLevel2ById(id);
  if (!result) {
    res.status(404).json({ error: 'Not found', message: `Level2 item with id '${id}' not found` });
    return;
  }
  res.status(200).json(result.item);
}

export function getLevel2BySiteAndLevel2(req: Request, res: Response): void {
  const { siteId, level2Id } = req.params;
  const item = sitesService.getLevel2BySiteIdAndLevel2Id(siteId, level2Id);
  if (!item) {
    res.status(404).json({
      error: 'Not found',
      message: `Level2 item '${level2Id}' not found under site '${siteId}'`,
    });
    return;
  }
  res.status(200).json(item);
}

export function getProtocolsByLevel2Id(req: Request, res: Response): void {
  const { level2Id } = req.params;
  const result = sitesService.getProtocolsByLevel2Id(level2Id);
  if (!result) {
    res.status(404).json({ error: 'Not found', message: `Level2 item with id '${level2Id}' not found` });
    return;
  }
  res.status(200).json({ protocols: result.protocols });
}

export function getProtocolById(req: Request, res: Response): void {
  const { protocolId } = req.params;
  const result = sitesService.getProtocolById(protocolId);
  if (!result) {
    res.status(404).json({ error: 'Not found', message: `Protocol with id '${protocolId}' not found` });
    return;
  }
  res.status(200).json(result.protocol);
}

export function getProtocolBySiteLevel2AndProtocol(req: Request, res: Response): void {
  const { siteId, level2Id, protocolId } = req.params;
  const protocol = sitesService.getProtocolBySiteIdLevel2IdAndProtocolId(siteId, level2Id, protocolId);
  if (!protocol) {
    res.status(404).json({
      error: 'Not found',
      message: `Protocol '${protocolId}' not found under site '${siteId}' / level2 '${level2Id}'`,
    });
    return;
  }
  res.status(200).json(protocol);
}
