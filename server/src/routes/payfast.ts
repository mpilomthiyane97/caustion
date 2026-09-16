import { Router } from 'express';
import { OrderModel } from '../models/Order';
import { verifyItnSignature, isRequestFromPayfast, validateWithPayfast } from '../lib/payfast';

export const payfastRouter = Router();

interface RequestWithRawBody {
  rawBody?: string;
}

payfastRouter.post('/notify', async (req, res) => {
  // Respond immediately; PayFast only needs a 200 acknowledgement.
  res.status(200).send('OK');

  const body = req.body as Record<string, string>;
  const rawBody = (req as unknown as RequestWithRawBody).rawBody ?? '';

  try {
    if (!verifyItnSignature(body)) {
      console.warn('[itn] invalid signature', {
        m_payment_id: body.m_payment_id,
        fieldsReceived: Object.keys(body).filter((k) => k !== 'signature'),
      });
      return;
    }

    const fromPayfast = await isRequestFromPayfast(req.ip ?? '');
    if (!fromPayfast) {
      console.warn('[itn] request did not originate from a valid PayFast host', {
        ip: req.ip,
        m_payment_id: body.m_payment_id,
      });
      return;
    }

    const order = await OrderModel.findOne({ orderRef: body.m_payment_id });
    if (!order) {
      console.warn('[itn] order not found', { m_payment_id: body.m_payment_id });
      return;
    }

    const amountReceivedCents = Math.round(
      parseFloat(body.amount_gross ?? body.amount ?? '0') * 100
    );
    if (amountReceivedCents !== order.totalCents) {
      console.warn('[itn] amount mismatch', {
        orderRef: order.orderRef,
        expected: order.totalCents,
        received: amountReceivedCents,
      });
      return;
    }

    const validated = await validateWithPayfast(rawBody);
    if (!validated) {
      console.warn('[itn] payfast server-to-server validation failed', { orderRef: order.orderRef });
      return;
    }

    const paymentStatus = body.payment_status;

    if (paymentStatus === 'COMPLETE') {
      const updated = await OrderModel.findOneAndUpdate(
        { orderRef: order.orderRef, status: 'pending' },
        { status: 'paid', payfastPaymentId: body.pf_payment_id, paidAt: new Date() },
        { new: true }
      );

      if (updated) {
        console.log('[itn] order marked paid', { orderRef: updated.orderRef });
      } else {
        console.log('[itn] duplicate ITN ignored, order already processed', { orderRef: order.orderRef });
      }
    } else if (paymentStatus === 'CANCELLED') {
      await OrderModel.findOneAndUpdate(
        { orderRef: order.orderRef, status: 'pending' },
        { status: 'cancelled' }
      );
      console.log('[itn] order cancelled', { orderRef: order.orderRef });
    } else if (paymentStatus === 'FAILED') {
      await OrderModel.findOneAndUpdate(
        { orderRef: order.orderRef, status: 'pending' },
        { status: 'failed' }
      );
      console.log('[itn] order failed', { orderRef: order.orderRef });
    } else {
      console.log('[itn] unhandled payment_status', { orderRef: order.orderRef, paymentStatus });
    }
  } catch (err) {
    console.error('[itn] processing error', err);
  }
});
