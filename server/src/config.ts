import dotenv from 'dotenv';

dotenv.config();

function required(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (value === undefined || value === '') {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const config = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT ?? 4000),
  mongodbUri: required('MONGODB_URI'),
  payfast: {
    merchantId: required('PAYFAST_MERCHANT_ID'),
    merchantKey: required('PAYFAST_MERCHANT_KEY'),
    passphrase: process.env.PAYFAST_PASSPHRASE ?? '',
    mode: (process.env.PAYFAST_MODE ?? 'sandbox') as 'sandbox' | 'live',
  },
  frontendUrl: required('FRONTEND_URL'),
  backendUrl: required('BACKEND_URL'),
  deliveryFeeCents: Number(process.env.DELIVERY_FEE_CENTS ?? 6000),
  adminKey: required('ADMIN_KEY'),
  resendApiKey: process.env.RESEND_API_KEY ?? '',
  alertEmail: process.env.ALERT_EMAIL ?? '',
  fromEmail: process.env.FROM_EMAIL ?? '',
  selfPingUrl: process.env.SELF_PING_URL ?? '',
};

export const payfastHost =
  config.payfast.mode === 'live' ? 'www.payfast.co.za' : 'sandbox.payfast.co.za';
