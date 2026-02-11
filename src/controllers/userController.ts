import { Request, Response, NextFunction } from 'express';
import * as userService from '../services/userService.js';

export async function createUser(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { name, email, role } = req.body;
    const result = await userService.createUser({ name, email, role });
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}
