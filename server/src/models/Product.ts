import { Schema, model, InferSchemaType } from 'mongoose';

const productSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    category: { type: String, enum: ['pepper-spray', 'stun-gun'], required: true },
    description: { type: String, required: true },
    priceCents: { type: Number, required: true, min: 0 },
    images: { type: [String], default: [] },
    specs: { type: Map, of: String, default: {} },
    inStock: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export type Product = InferSchemaType<typeof productSchema>;
export const ProductModel = model('Product', productSchema);
