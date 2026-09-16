import { connectDb, disconnectDb } from '../lib/db';
import { ProductModel } from '../models/Product';

const products = [
  {
    slug: 'sabre-red-pepper-spray',
    name: 'SABRE Red Maximum Strength Pepper Spray',
    category: 'pepper-spray' as const,
    description:
      'SABRE Red Maximum Strength pepper spray in a pocket-sized canister with a UV marking dye and a reinforced twist-lock safety to help prevent accidental discharge. Delivers a focused stream up to 10ft (3m) away, with enough contents for multiple bursts, and clips discreetly to a pocket or waistband for quick access.',
    priceCents: 35000,
    images: ['/pepper-spray/pepper1.jpeg', '/pepper-spray/pepper2.jpeg', '/pepper-spray/pepper3.jpeg'],
    specs: {
      Range: 'Up to 10ft (3m)',
      Bursts: 'Up to 35',
      'Safety cap': 'Twist-lock',
      Size: '4in x 1in x 1in (approx.)',
      'Made in': 'U.S.A.',
    },
    inStock: true,
  },
  {
    slug: 'voltshield-compact-taser',
    name: 'VoltShield Compact Taser',
    category: 'stun-gun' as const,
    description:
      'A compact, rechargeable taser sized to fit in a small bag or pocket without adding bulk. Fitted with a safety switch to help prevent accidental activation, and available in black or pink.',
    priceCents: 40000,
    images: ['/taser/taser1.webp', '/taser/taser2.jpg'],
    specs: {
      Size: 'Compact',
      Colour: 'Black or Pink',
      'Safety switch': 'Yes',
    },
    inStock: true,
  },
];

async function seed() {
  await connectDb();

  const activeSlugs = products.map((p) => p.slug);

  for (const product of products) {
    await ProductModel.findOneAndUpdate({ slug: product.slug }, product, {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    });
    console.log(`[seed] upserted ${product.slug}`);
  }

  const { deletedCount } = await ProductModel.deleteMany({ slug: { $nin: activeSlugs } });
  if (deletedCount) console.log(`[seed] removed ${deletedCount} product(s) no longer in the catalog`);

  await disconnectDb();
  console.log('[seed] done');
}

seed().catch((err) => {
  console.error('[seed] failed', err);
  process.exit(1);
});
