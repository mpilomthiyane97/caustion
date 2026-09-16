import { z } from 'zod';

const saPhoneRegex = /^(\+27|0)[6-8][0-9]{8}$/;

export const createOrderSchema = z.object({
  customer: z.object({
    name: z.string().trim().min(2, 'Name is required').max(120),
    phone: z
      .string()
      .trim()
      .regex(saPhoneRegex, 'Enter a valid South African phone number, e.g. 082 123 4567'),
    email: z.string().trim().email('Enter a valid email address').max(200),
  }),
  address: z.object({
    street: z.string().trim().min(3).max(200),
    suburb: z.string().trim().min(2).max(120),
    city: z.string().trim().min(2).max(120),
    postalCode: z
      .string()
      .trim()
      .regex(/^\d{4}$/, 'Postal code must be 4 digits'),
    province: z.literal('Gauteng', {
      errorMap: () => ({ message: 'We currently only deliver within Gauteng' }),
    }),
  }),
  deliveryNotes: z.string().trim().max(500).optional().default(''),
  items: z
    .array(
      z.object({
        slug: z.string().trim().min(1),
        quantity: z.number().int().min(1).max(20),
      })
    )
    .min(1, 'Your cart is empty'),
  consents: z.object({
    ageConfirmed: z.literal(true, {
      errorMap: () => ({ message: 'You must confirm you are 18 years or older' }),
    }),
    lawfulUseConfirmed: z.literal(true, {
      errorMap: () => ({ message: 'You must confirm lawful self-defence use' }),
    }),
  }),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
