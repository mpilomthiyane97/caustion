import dotenv from 'dotenv';

dotenv.config();

const HEALTH_URL = process.env.HEALTH_URL;
const PING_INTERVAL_MINUTES = Number(process.env.PING_INTERVAL_MINUTES ?? 10);
const MAX_RETRIES = 3;

if (!HEALTH_URL) {
  console.error('[keep-alive] HEALTH_URL env var is required');
  process.exit(1);
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function pingOnce(): Promise<void> {
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    const start = Date.now();
    try {
      const res = await fetch(HEALTH_URL as string, { signal: AbortSignal.timeout(15000) });
      const elapsedMs = Date.now() - start;
      console.log(`[keep-alive] ${new Date().toISOString()} status=${res.status} time=${elapsedMs}ms attempt=${attempt}`);
      return;
    } catch (err) {
      const elapsedMs = Date.now() - start;
      console.error(
        `[keep-alive] ${new Date().toISOString()} failed attempt=${attempt} time=${elapsedMs}ms error=${
          err instanceof Error ? err.message : String(err)
        }`
      );
      if (attempt < MAX_RETRIES) {
        await sleep(2000 * attempt);
      }
    }
  }
  console.error('[keep-alive] all retry attempts failed for this cycle');
}

async function main() {
  console.log(
    `[keep-alive] starting, pinging ${HEALTH_URL} every ${PING_INTERVAL_MINUTES} minute(s)`
  );
  // eslint-disable-next-line no-constant-condition
  while (true) {
    await pingOnce();
    await sleep(PING_INTERVAL_MINUTES * 60 * 1000);
  }
}

main().catch((err) => {
  console.error('[keep-alive] fatal error, exiting', err);
  process.exit(1);
});
