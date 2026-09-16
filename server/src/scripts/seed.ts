import { connectDb, disconnectDb } from '../lib/db';
import { ProductModel } from '../models/Product';

const products = [
  {
    slug: 'pepperguard-compact-15ml',
    name: 'PepperGuard Compact 15ml',
    category: 'pepper-spray' as const,
    description:
      'A slim, pocket-friendly pepper spray designed for quick access when you need it most. Simple flip-top safety cap and a focused stream for accurate use.',
    priceCents: 15900,
    images: ['/products/pepperguard-compact.jpg'],
    specs: { Volume: '15ml', Range: '~2m', Weight: '35g', 'Safety cap': 'Flip-top' },
    inStock: true,
  },
  {
    slug: 'pepperguard-keyring-10ml',
    name: 'PepperGuard Keyring 10ml',
    category: 'pepper-spray' as const,
    description:
      'Clips straight onto your keys so it is always within reach. A discreet, everyday-carry option for walking to your car or the taxi rank.',
    priceCents: 12900,
    images: ['/products/pepperguard-keyring.jpg'],
    specs: { Volume: '10ml', Range: '~1.5m', Weight: '22g', Attachment: 'Keyring clip' },
    inStock: true,
  },
  {
    slug: 'pepperguard-max-50ml',
    name: 'PepperGuard Max 50ml',
    category: 'pepper-spray' as const,
    description:
      'A larger canister for home or car storage, with more sprays and greater range. Ideal as a second unit kept at your front door.',
    priceCents: 24900,
    images: ['/products/pepperguard-max.jpg'],
    specs: { Volume: '50ml', Range: '~3m', Weight: '90g', 'Safety cap': 'Twist-lock' },
    inStock: true,
  },
  {
    slug: 'voltshield-slim-stun-gun',
    name: 'VoltShield Slim Stun Gun',
    category: 'stun-gun' as const,
    description:
      'A slim, rechargeable stun device with a textured non-slip grip and a bright built-in flashlight for use in low light.',
    priceCents: 34900,
    images: ['/products/voltshield-slim.jpg'],
    specs: { Charging: 'USB-C rechargeable', Flashlight: 'Yes', 'Safety switch': 'Yes' },
    inStock: true,
  },
  {
    slug: 'voltshield-classic-stun-gun',
    name: 'VoltShield Classic Stun Gun',
    category: 'stun-gun' as const,
    description:
      'Our most established stun gun model, with a wrist strap and a loud built-in alarm to draw attention when activated.',
    priceCents: 39900,
    images: ['/products/voltshield-classic.jpg'],
    specs: { Charging: 'USB-C rechargeable', Alarm: '120dB', 'Wrist strap': 'Yes' },
    inStock: true,
  },
  {
    slug: 'voltshield-mini-stun-gun',
    name: 'VoltShield Mini Stun Gun',
    category: 'stun-gun' as const,
    description:
      'Our smallest stun device, sized to sit in a small handbag pocket without adding bulk, with a simple one-button safety switch.',
    priceCents: 29900,
    images: ['/products/voltshield-mini.jpg'],
    specs: { Charging: 'USB-C rechargeable', Size: 'Compact', 'Safety switch': 'Yes' },
    inStock: true,
  },
];

async function seed() {
  await connectDb();
  for (const product of products) {
    await ProductModel.findOneAndUpdate({ slug: product.slug }, product, {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    });
    console.log(`[seed] upserted ${product.slug}`);
  }
  await disconnectDb();
  console.log('[seed] done');
}

seed().catch((err) => {
  console.error('[seed] failed', err);
  process.exit(1);
});
