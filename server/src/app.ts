import express, { Express, Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import mongoSanitize from 'express-mongo-sanitize';
import { config } from './config';
import { productsRouter } from './routes/products';
import { ordersRouter } from './routes/orders';
import { payfastRouter } from './routes/payfast';
import { adminRouter } from './routes/admin';
import { ordersRateLimit, adminRateLimit } from './middleware/rateLimit';

export function createApp(): Express {
  const app = express();

  // Render sits behind a proxy; needed for correct req.ip (X-Forwarded-For) and rate limiting.
  app.set('trust proxy', 1);

  app.use(helmet());

  const corsOptions = { origin: config.frontendUrl };

  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ ok: true, time: new Date().toISOString() });
  });

  // PayFast ITN: urlencoded body, raw body captured for the server-to-server validate call.
  // Intentionally no CORS here — this is a server-to-server callback, not a browser request.
  app.use(
    '/api/payfast',
    express.urlencoded({
      extended: false,
      verify: (req, _res, buf) => {
        (req as unknown as { rawBody?: string }).rawBody = buf.toString('utf8');
      },
    }),
    mongoSanitize(),
    payfastRouter
  );

  app.use(express.json());
  app.use(mongoSanitize());

  app.use('/api/products', cors(corsOptions), productsRouter);
  app.use('/api/orders', cors(corsOptions), ordersRateLimit, ordersRouter);
  app.use('/api/admin', cors(corsOptions), adminRateLimit, adminRouter);

  app.use((_req: Request, res: Response) => {
    res.status(404).json({ error: 'Not found' });
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error('[app] unhandled error', err);
    res.status(500).json({ error: 'Internal server error' });
  });

  return app;
}
