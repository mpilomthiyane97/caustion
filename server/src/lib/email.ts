import { Resend } from 'resend';
import { config } from '../config';
import type { Order } from '../models/Order';

let resendClient: Resend | null = null;

function getClient(): Resend | null {
  if (!config.resendApiKey) return null;
  if (!resendClient) resendClient = new Resend(config.resendApiKey);
  return resendClient;
}

function formatRand(cents: number): string {
  return `R${(cents / 100).toFixed(2)}`;
}

export async function sendAlertEmail(order: Order & { orderRef: string }): Promise<void> {
  const client = getClient();
  if (!client || !config.alertEmail || !config.fromEmail) {
    console.warn('[email] alert email skipped: Resend not configured');
    return;
  }

  const itemsList = order.items
    .map((item) => `- ${item.name} x${item.quantity} (${formatRand(item.unitPriceCents * item.quantity)})`)
    .join('\n');

  const text = [
    `New paid order: ${order.orderRef}`,
    '',
    'Items:',
    itemsList,
    '',
    `Total: ${formatRand(order.totalCents)}`,
    '',
    `Customer: ${order.customer.name}`,
    `Phone: ${order.customer.phone}`,
    `Email: ${order.customer.email}`,
    '',
    'Delivery address:',
    order.address.street,
    order.address.suburb,
    `${order.address.city}, ${order.address.postalCode}`,
    order.address.province,
    '',
    `Delivery notes: ${order.deliveryNotes || '(none)'}`,
  ].join('\n');

  await client.emails.send({
    from: config.fromEmail,
    to: config.alertEmail,
    subject: `[Caution SA] Paid order ${order.orderRef}`,
    text,
  });
}

export async function sendCustomerConfirmationEmail(order: Order & { orderRef: string }): Promise<void> {
  const client = getClient();
  if (!client || !config.fromEmail) {
    console.warn('[email] customer email skipped: Resend not configured');
    return;
  }

  await client.emails.send({
    from: config.fromEmail,
    to: order.customer.email,
    subject: `Caution SA — payment received (${order.orderRef})`,
    text: `Hi ${order.customer.name},\n\nPayment received. We'll WhatsApp you when your Uber delivery is on the way.\n\nOrder reference: ${order.orderRef}\n\nBe cautious.\nCaution SA`,
  });
}
