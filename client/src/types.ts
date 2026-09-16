export type Category = 'pepper-spray' | 'stun-gun';

export interface Product {
  _id: string;
  slug: string;
  name: string;
  category: Category;
  description: string;
  priceCents: number;
  images: string[];
  specs: Record<string, string>;
  inStock: boolean;
}

export interface CartLine {
  slug: string;
  quantity: number;
}

export interface PayfastPaymentResponse {
  action: string;
  fields: Record<string, string>;
}

export type OrderStatus = 'pending' | 'paid' | 'failed' | 'cancelled' | 'delivered';

export interface AdminOrder {
  _id: string;
  orderRef: string;
  status: OrderStatus;
  customer: { name: string; phone: string };
  address: { street: string; suburb: string; city: string; postalCode: string; province: string };
  deliveryNotes: string;
  items: { productId: string; name: string; unitPriceCents: number; quantity: number }[];
  subtotalCents: number;
  deliveryCents: number;
  totalCents: number;
  paidAt?: string;
  deliveredAt?: string;
  createdAt: string;
}
