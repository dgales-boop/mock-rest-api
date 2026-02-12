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
