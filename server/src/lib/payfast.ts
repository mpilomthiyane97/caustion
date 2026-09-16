import crypto from 'crypto';
import dns from 'dns/promises';
import { config, payfastHost } from '../config';

/**
 * PayFast expects PHP urlencode()-style encoding: spaces as '+', and
 * !*'() percent-encoded (encodeURIComponent leaves those untouched).
 */
export function pfEncode(value: string): string {
  return encodeURIComponent(value)
    .replace(/%20/g, '+')
    .replace(/[!'()*~]/g, (c) => '%' + c.charCodeAt(0).toString(16).toUpperCase());
}

function buildSignatureString(pairs: [string, string][]): string {
  const parts = pairs
    .filter(([, value]) => value !== undefined && value !== null && value !== '')
    .map(([key, value]) => `${key}=${pfEncode(String(value))}`);
  let str = parts.join('&');
  if (config.payfast.passphrase) {
    str += `&passphrase=${pfEncode(config.payfast.passphrase)}`;
  }
  return str;
}

export function signPairs(pairs: [string, string][]): string {
  const str = buildSignatureString(pairs);
  return crypto.createHash('md5').update(str).digest('hex');
}

export interface PayfastPaymentParams {
  orderRef: string;
  amountCents: number;
  nameFirst: string;
  nameLast: string;
  email: string;
  cellNumber: string;
}

export function buildPayfastPayment(params: PayfastPaymentParams): {
  action: string;
  fields: Record<string, string>;
} {
  const amount = (params.amountCents / 100).toFixed(2);
  const pairs: [string, string][] = [
    ['merchant_id', config.payfast.merchantId],
    ['merchant_key', config.payfast.merchantKey],
    ['return_url', `${config.frontendUrl}/payment/success?ref=${params.orderRef}`],
    ['cancel_url', `${config.frontendUrl}/payment/cancelled`],
    ['notify_url', `${config.backendUrl}/api/payfast/notify`],
    ['name_first', params.nameFirst],
    ['name_last', params.nameLast],
    ['email_address', params.email],
    ['cell_number', params.cellNumber],
    ['m_payment_id', params.orderRef],
    ['amount', amount],
    ['item_name', `Caution SA order ${params.orderRef}`],
  ];
  const signature = signPairs(pairs);
  const fields: Record<string, string> = {};
  for (const [key, value] of pairs) fields[key] = value;
  fields.signature = signature;

  return { action: `https://${payfastHost}/eng/process`, fields };
}

export function verifyItnSignature(body: Record<string, string>): boolean {
  const { signature, ...rest } = body;
  if (!signature) return false;
  const pairs = Object.entries(rest) as [string, string][];
  const expected = signPairs(pairs);
  return expected.toLowerCase() === String(signature).toLowerCase();
}

const VALID_PAYFAST_HOSTNAMES = [
  'www.payfast.co.za',
  'sandbox.payfast.co.za',
  'w1w.payfast.co.za',
  'w2w.payfast.co.za',
];

export async function isRequestFromPayfast(requestIp: string): Promise<boolean> {
  const cleanIp = requestIp.replace('::ffff:', '');
  for (const hostname of VALID_PAYFAST_HOSTNAMES) {
    try {
      const results = await dns.lookup(hostname, { all: true });
      if (results.some((r) => r.address === cleanIp)) return true;
    } catch {
      // ignore lookup failures for individual hostnames and try the rest
    }
  }
  return false;
}

export async function validateWithPayfast(rawBody: string): Promise<boolean> {
  try {
    const response = await fetch(`https://${payfastHost}/eng/query/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: rawBody,
    });
    const text = await response.text();
    return text.trim() === 'VALID';
  } catch (err) {
    console.error('[payfast] server validation call failed', err);
    return false;
  }
}
