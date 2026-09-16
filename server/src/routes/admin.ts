import { Router } from 'express';
import { OrderModel } from '../models/Order';
import { adminAuth } from '../middleware/adminAuth';

export const adminRouter = Router();

adminRouter.use(adminAuth);

const ALLOWED_STATUSES = ['pending', 'paid', 'failed', 'cancelled', 'delivered'];

adminRouter.get('/orders', async (req, res) => {
  const status = typeof req.query.status === 'string' ? req.query.status : undefined;
  if (status && !ALLOWED_STATUSES.includes(status)) {
    res.status(400).json({ error: 'Invalid status filter' });
    return;
  }
  const filter = status ? { status } : {};
  const orders = await OrderModel.find(filter).sort({ createdAt: -1 }).lean();
  res.json(orders);
});

adminRouter.patch('/orders/:ref', async (req, res) => {
  const { status } = req.body as { status?: string };
  if (!status || !ALLOWED_STATUSES.includes(status)) {
    res.status(400).json({ error: 'Invalid status' });
    return;
  }

  const update: Record<string, unknown> = { status };
  if (status === 'delivered') {
    update.deliveredAt = new Date();
  }

  const order = await OrderModel.findOneAndUpdate({ orderRef: req.params.ref }, update, { new: true });
  if (!order) {
    res.status(404).json({ error: 'Order not found' });
    return;
  }
  res.json(order);
});
