import { Request, Response, NextFunction } from 'express';
import { DuplicateEmailError } from '../services/userService.js';

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof DuplicateEmailError) {
    res.status(409).json({
      error: 'Conflict',
      message: err.message,
    });
    return;
  }

  console.error(err);
  res.status(500).json({
    error: 'Internal server error',
    message: 'An unexpected error occurred',
  });
}
