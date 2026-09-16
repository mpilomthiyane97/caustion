# Caution SA

Online store for pepper spray and tasers. Payment via PayFast, manual delivery via Uber to addresses in Gauteng.

Monorepo:
- `client/` — React + Vite + TypeScript + Tailwind (deploy: Netlify)
- `server/` — Node + Express + TypeScript (deploy: Render)
- MongoDB Atlas via Mongoose

## 1. Local setup

### Server

```bash
cd server
cp .env.example .env   # fill in values, see below
npm install
npm run seed            # loads 6 placeholder products
npm run dev              # http://localhost:4000
```

### Client

```bash
cd client
cp .env.example .env
npm install
npm run dev              # http://localhost:5173
```

## 2. MongoDB Atlas setup

1. Create a free cluster at https://cloud.mongodb.com.
2. Database Access → add a database user with a strong password (read/write on this project).
3. Network Access → add an IP entry `0.0.0.0/0` (Render's free tier has no static IP) — or, once you know Render's egress IPs, restrict to those.
4. Get the connection string (Drivers → Node.js), and set it as `MONGODB_URI` in `server/.env` (and later in Render). Include the database name, e.g. `.../caution-sa?retryWrites=true&w=majority`.

## 3. Environment variables

### Server (`server/.env`, and Render dashboard)

| Variable | Notes |
|---|---|
| `MONGODB_URI` | Atlas connection string |
| `PAYFAST_MERCHANT_ID` / `PAYFAST_MERCHANT_KEY` | From PayFast (sandbox credentials for testing) |
| `PAYFAST_PASSPHRASE` | Optional but recommended; must match your PayFast account settings |
| `PAYFAST_MODE` | `sandbox` or `live` — switches API host automatically |
| `FRONTEND_URL` | Deployed Netlify URL (used for PayFast return/cancel URLs and CORS) |
| `BACKEND_URL` | Deployed Render URL (used for the PayFast notify URL) |
| `DELIVERY_FEE_CENTS` | Flat delivery fee in cents, added on top of product prices. Currently `0` since delivery within Gauteng is baked into the displayed product prices — only change this if you stop including delivery in prices. |
| `ADMIN_KEY` | Long random string, required in `x-admin-key` header for `/api/admin/*` |
| `RESEND_API_KEY` | From resend.com |
| `ALERT_EMAIL` | Where new-paid-order alerts are sent |
| `FROM_EMAIL` | Verified sender in Resend |
| `NODE_ENV` | `development` locally, `production` on Render |
| `SELF_PING_URL` | Your public Render `/api/health` URL — only used when `NODE_ENV=production` |

### Client (`client/.env`, and Netlify dashboard)

| Variable | Notes |
|---|---|
| `VITE_API_URL` | Deployed Render backend URL |
| `VITE_WHATSAPP_NUMBER` | International format, no `+`, e.g. `27821234567` |

### Keep-alive script

| Variable | Notes |
|---|---|
| `HEALTH_URL` | Full URL to `/api/health` |
| `PING_INTERVAL_MINUTES` | Default `10` |

### GitHub Actions secret

| Secret | Notes |
|---|---|
| `RENDER_HEALTH_URL` | Full URL to your Render `/api/health` endpoint |

## 4. Seeding products

```bash
cd server
npm run seed
```

Seeds the 2 live products (SABRE Red pepper spray, VoltShield taser) — edit `server/src/scripts/seed.ts` to change names, descriptions, prices (in cents) or image paths, then re-run.

## 5. Deploying

### Render (server)

1. New → Web Service → connect this repo.
2. Render should pick up `render.yaml` at the repo root (Blueprint). If not, set manually: Root directory `server`, Build command `npm install && npm run build`, Start command `npm start`, Health check path `/api/health`.
3. Fill in all env vars listed above in the Render dashboard (they are marked `sync: false` in `render.yaml`, i.e. not stored in git).
4. Deploy, then copy the public URL (e.g. `https://caution-sa-server.onrender.com`) — this is your `BACKEND_URL` and `SELF_PING_URL`.

### Netlify (client)

1. New site from Git → select this repo.
2. Netlify should read `client/netlify.toml` if you set the site's **Base directory** to `client` in the UI (Netlify only auto-discovers a root-level `netlify.toml` in a monorepo; the base directory setting tells it where to look otherwise). Base `client`, build `npm run build`, publish `dist`.
3. Set `VITE_API_URL` and `VITE_WHATSAPP_NUMBER` in Site settings → Environment variables.
4. Deploy, then copy the site URL — this is your `FRONTEND_URL` on the Render side. Update it on Render and redeploy the server so CORS and PayFast return/cancel URLs are correct.

### PayFast

- Sandbox testing is done against the deployed Render URL (no ngrok) since PayFast needs a publicly reachable `notify_url`.
- Sandbox merchant credentials: use PayFast's published sandbox `merchant_id` / `merchant_key`, or your own sandbox account.
- In the PayFast sandbox, set your notify URL expectations to allow `BACKEND_URL/api/payfast/notify`.

### Switching sandbox → live

1. Get live `PAYFAST_MERCHANT_ID`, `PAYFAST_MERCHANT_KEY`, `PAYFAST_PASSPHRASE` from your live PayFast account.
2. In Render, set `PAYFAST_MODE=live` and update the three credential env vars.
3. Redeploy. No code changes needed — the PayFast host and process URL switch automatically based on `PAYFAST_MODE`.

## 6. Keep-alive (Render free tier sleeps after inactivity)

Three layers, use as many as you like:

1. **GitHub Actions** (`.github/workflows/keep-alive.yml`) — runs every 10 minutes via cron plus manual `workflow_dispatch`. Add the `RENDER_HEALTH_URL` secret in the repo's Settings → Secrets and variables → Actions.
2. **Standalone script** (`server/scripts/keep-alive.ts` — run via `npm run keep-alive` from `server/`) — can run on any always-on machine or your own cron. Set `HEALTH_URL` and optionally `PING_INTERVAL_MINUTES`.
3. **In-server self-ping** — automatic in production when `SELF_PING_URL` is set; pings itself every 10 minutes as a backup.

Recommended: also add the health URL to [UptimeRobot](https://uptimerobot.com) or [cron-job.org](https://cron-job.org) as a fourth, independent layer.

## 7. Manual test checklist

- [ ] Sandbox purchase end-to-end: add items to cart → checkout → redirected to PayFast sandbox → pay → redirected back to `/payment/success` → status shows "Payment confirmed".
- [ ] ITN marks the order `paid` in the database; sending the same ITN twice (e.g. replaying it) does not double-process or error — the second call is a no-op because the update filter requires `status: 'pending'`.
- [ ] Alert email (to `ALERT_EMAIL`) and customer confirmation email both arrive after payment.
- [ ] Admin (`/admin`) lists the paid order, "Copy address" copies the full delivery address, WhatsApp link opens a chat with the customer's number, and "Mark delivered" updates status and sets `deliveredAt`.
- [ ] Cancelled payment flow: cancel from PayFast → redirected to `/payment/cancelled` → cart is still intact.
- [ ] Price tampering: attempt to POST `/api/orders` with a modified `priceCents`/amount is ignored — the server always recalculates from the database.
- [ ] Keep-alive workflow: manually trigger `workflow_dispatch` in GitHub Actions and confirm it hits `/api/health` successfully.
