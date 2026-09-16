import { OrderModel } from '../models/Order';

function datePart(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}${m}${d}`;
}

export async function generateOrderRef(): Promise<string> {
  for (let attempt = 0; attempt < 5; attempt++) {
    const random = Math.floor(1000 + Math.random() * 9000);
    const ref = `CSA-${datePart()}-${random}`;
    const existing = await OrderModel.exists({ orderRef: ref });
    if (!existing) return ref;
  }
  throw new Error('Could not generate a unique order reference');
}
