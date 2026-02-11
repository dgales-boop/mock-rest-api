import { body, validationResult, ValidationChain } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

const allowedFields = ['name', 'email', 'role'];

export const createUserValidation: ValidationChain[] = [
  body('name').trim().notEmpty().withMessage('name is required'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('email is required')
    .isEmail()
    .withMessage('email must be a valid email address'),
  body('role').trim().notEmpty().withMessage('role is required'),
];

export function rejectUnknownFields(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const bodyKeys = Object.keys(req.body ?? {});
  const unknown = bodyKeys.filter((k) => !allowedFields.includes(k));
  if (unknown.length > 0) {
    res.status(400).json({
      error: 'Validation failed',
      details: `Unknown field(s): ${unknown.join(', ')}`,
    });
    return;
  }
  next();
}

export function handleValidationErrors(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      error: 'Validation failed',
      details: errors.array().map((e) => ({
        field: 'path' in e ? e.path : (e as { param?: string }).param,
        message: e.msg,
      })),
    });
    return;
  }
  next();
}
