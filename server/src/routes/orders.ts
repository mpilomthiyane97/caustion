import { Router } from 'express';
import { ProductModel } from '../models/Product';
import { OrderModel } from '../models/Order';
import { createOrderSchema } from '../validators/order';
import { generateOrderRef } from '../lib/orderRef';
import { buildPayfastPayment } from '../lib/payfast';
import { config } from '../config';

export const ordersRouter = Router();

function splitName(fullName: string): { first: string; last: string } {
  const trimmed = fullName.trim();
  const idx = trimmed.indexOf(' ');
  if (idx === -1) return { first: trimmed, last: trimmed };
  return { first: trimmed.slice(0, idx), last: trimmed.slice(idx + 1) };
}

ordersRouter.post('/', async (req, res) => {
  const parsed = createOrderSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid order', details: parsed.error.flatten() });
    return;
  }
  const input = parsed.data;

  const slugs = input.items.map((item) => item.slug);
  const products = await ProductModel.find({ slug: { $in: slugs } }).lean();
  const productBySlug = new Map(products.map((p) => [p.slug, p]));

  const orderItems: { productId: any; name: string; unitPriceCents: number; quantity: number }[] = [];

  for (const item of input.items) {
    const product = productBySlug.get(item.slug);
    if (!product) {
      res.status(400).json({ error: `Product not found: ${item.slug}` });
      return;
    }
    if (!product.inStock) {
      res.status(400).json({ error: `Out of stock: ${product.name}` });
      return;
    }
    orderItems.push({
      productId: product._id,
      name: product.name,
      unitPriceCents: product.priceCents,
      quantity: item.quantity,
    });
  }

  const subtotalCents = orderItems.reduce((sum, item) => sum + item.unitPriceCents * item.quantity, 0);
  const deliveryCents = config.deliveryFeeCents;
  const totalCents = subtotalCents + deliveryCents;

  const orderRef = await generateOrderRef();

  const order = await OrderModel.create({
    orderRef,
    status: 'pending',
    customer: input.customer,
    address: input.address,
    deliveryNotes: input.deliveryNotes,
    items: orderItems,
    subtotalCents,
    deliveryCents,
    totalCents,
    consents: {
      ageConfirmed: input.consents.ageConfirmed,
      lawfulUseConfirmed: input.consents.lawfulUseConfirmed,
      consentAt: new Date(),
    },
  });

  const { first, last } = splitName(input.customer.name);
  const payment = buildPayfastPayment({
    orderRef: order.orderRef,
    amountCents: totalCents,
    nameFirst: first,
    nameLast: last,
    cellNumber: input.customer.phone,
  });

  res.status(201).json(payment);
});

ordersRouter.get('/:ref/status', async (req, res) => {
  const order = await OrderModel.findOne({ orderRef: req.params.ref }).select('status').lean();
  if (!order) {
    res.status(404).json({ error: 'Order not found' });
    return;
  }
  res.json({ status: order.status });
});
