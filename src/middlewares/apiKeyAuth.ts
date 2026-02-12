import { Request, Response, NextFunction } from 'express';
import { config } from '../config';

export function apiKeyAuth(req: Request, res: Response, next: NextFunction): void {
  if (!config.apiKey) {
    next();
    return;
  }

  const key =
    req.headers['x-api-key'] ??
    (req.headers.authorization?.startsWith('Bearer ')
      ? req.headers.authorization.slice(7)
      : null);

  if (!key || key !== config.apiKey) {
    res.status(401).json({
      error: 'Unauthorized',
      message: 'Missing or invalid API key. Use X-API-Key header or Authorization: Bearer <key>.',
    });
    return;
  }

  next();
}
