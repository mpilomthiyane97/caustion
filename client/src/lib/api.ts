import type { AdminOrder, OrderStatus, PayfastPaymentResponse, Product } from '../types';

const API_URL = import.meta.env.VITE_API_URL as string;

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers ?? {}),
    },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(body.error ?? `Request failed: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export function fetchProducts(): Promise<Product[]> {
  return request<Product[]>('/api/products');
}

export function fetchProduct(slug: string): Promise<Product> {
  return request<Product>(`/api/products/${slug}`);
}

export interface CreateOrderPayload {
  customer: { name: string; phone: string; email: string };
  address: { street: string; suburb: string; city: string; postalCode: string; province: string };
  deliveryNotes: string;
  items: { slug: string; quantity: number }[];
  consents: { ageConfirmed: boolean; lawfulUseConfirmed: boolean };
}

export function createOrder(payload: CreateOrderPayload): Promise<PayfastPaymentResponse> {
  return request<PayfastPaymentResponse>('/api/orders', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function fetchOrderStatus(ref: string): Promise<{ status: OrderStatus }> {
  return request<{ status: OrderStatus }>(`/api/orders/${ref}/status`);
}

export function fetchAdminOrders(adminKey: string, status?: string): Promise<AdminOrder[]> {
  const query = status ? `?status=${encodeURIComponent(status)}` : '';
  return request<AdminOrder[]>(`/api/admin/orders${query}`, {
    headers: { 'x-admin-key': adminKey },
  });
}

export function updateOrderStatus(
  adminKey: string,
  ref: string,
  status: OrderStatus
): Promise<AdminOrder> {
  return request<AdminOrder>(`/api/admin/orders/${ref}`, {
    method: 'PATCH',
    headers: { 'x-admin-key': adminKey },
    body: JSON.stringify({ status }),
  });
}
