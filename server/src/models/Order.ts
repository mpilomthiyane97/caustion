import { Schema, model, InferSchemaType, Types } from 'mongoose';

const orderItemSchema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
    unitPriceCents: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const orderSchema = new Schema(
  {
    orderRef: { type: String, required: true, unique: true, index: true },
    status: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'cancelled', 'delivered'],
      default: 'pending',
      index: true,
    },
    customer: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
    },
    address: {
      street: { type: String, required: true },
      suburb: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      province: { type: String, required: true },
    },
    deliveryNotes: { type: String, default: '' },
    items: { type: [orderItemSchema], required: true },
    subtotalCents: { type: Number, required: true, min: 0 },
    deliveryCents: { type: Number, required: true, min: 0 },
    totalCents: { type: Number, required: true, min: 0 },
    consents: {
      ageConfirmed: { type: Boolean, required: true },
      lawfulUseConfirmed: { type: Boolean, required: true },
      consentAt: { type: Date, required: true },
    },
    payfastPaymentId: { type: String },
    paidAt: { type: Date },
    deliveredAt: { type: Date },
  },
  { timestamps: true }
);

type SchemaOrder = InferSchemaType<typeof orderSchema>;

export interface Order extends Omit<SchemaOrder, 'customer' | 'address' | 'consents'> {
  _id: Types.ObjectId;
  customer: { name: string; phone: string };
  address: { street: string; suburb: string; city: string; postalCode: string; province: string };
  consents: { ageConfirmed: boolean; lawfulUseConfirmed: boolean; consentAt: Date };
}

export const OrderModel = model<Order>('Order', orderSchema);
