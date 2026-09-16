import crypto from 'crypto';
import { Request, Response, NextFunction } from 'express';
import { config } from '../config';

function timingSafeEqualStrings(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) {
    // still run a comparison of equal-length buffers to avoid leaking length via timing
    crypto.timingSafeEqual(bufA, bufA);
    return false;
  }
  return crypto.timingSafeEqual(bufA, bufB);
}

export function adminAuth(req: Request, res: Response, next: NextFunction): void {
  const provided = req.header('x-admin-key') ?? '';
  if (!provided || !timingSafeEqualStrings(provided, config.adminKey)) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  next();
}
