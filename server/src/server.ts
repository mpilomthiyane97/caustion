import { createApp } from './app';
import { connectDb, disconnectDb } from './lib/db';
import { config } from './config';

let selfPingTimer: ReturnType<typeof setInterval> | undefined;

async function main() {
  await connectDb();

  const app = createApp();
  const server = app.listen(config.port, () => {
    console.log(`[server] listening on port ${config.port} (${config.nodeEnv})`);
  });

  if (config.nodeEnv === 'production' && config.selfPingUrl) {
    const PING_INTERVAL_MS = 10 * 60 * 1000;
    selfPingTimer = setInterval(async () => {
      try {
        const res = await fetch(config.selfPingUrl);
        console.log(`[self-ping] ${res.status} ${config.selfPingUrl}`);
      } catch (err) {
        console.error('[self-ping] failed', err);
      }
    }, PING_INTERVAL_MS);
    console.log('[self-ping] enabled, pinging every 10 minutes');
  }

  const shutdown = async (signal: string) => {
    console.log(`[server] received ${signal}, shutting down gracefully`);
    if (selfPingTimer) clearInterval(selfPingTimer);
    server.close(async () => {
      await disconnectDb();
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => void shutdown('SIGTERM'));
  process.on('SIGINT', () => void shutdown('SIGINT'));
}

main().catch((err) => {
  console.error('[server] fatal startup error', err);
  process.exit(1);
});
