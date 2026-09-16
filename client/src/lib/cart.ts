import type { CartLine } from '../types';

const CART_KEY = 'caution-sa-cart';

function readCart(): CartLine[] {
  try {
    const raw = localStorage.getItem(CART_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (line): line is CartLine =>
        typeof line?.slug === 'string' && typeof line?.quantity === 'number' && line.quantity > 0
    );
  } catch {
    return [];
  }
}

function writeCart(cart: CartLine[]): void {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    window.dispatchEvent(new CustomEvent('cart-updated'));
  } catch {
    // localStorage unavailable (private browsing etc.), cart just won't persist
  }
}

export function getCart(): CartLine[] {
  return readCart();
}

export function addToCart(slug: string, quantity: number): void {
  const cart = readCart();
  const existing = cart.find((line) => line.slug === slug);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ slug, quantity });
  }
  writeCart(cart);
}

export function updateCartQuantity(slug: string, quantity: number): void {
  const cart = readCart();
  if (quantity <= 0) {
    writeCart(cart.filter((line) => line.slug !== slug));
    return;
  }
  const existing = cart.find((line) => line.slug === slug);
  if (existing) {
    existing.quantity = quantity;
    writeCart(cart);
  }
}

export function removeFromCart(slug: string): void {
  writeCart(readCart().filter((line) => line.slug !== slug));
}

export function clearCart(): void {
  writeCart([]);
}

export function cartItemCount(): number {
  return readCart().reduce((sum, line) => sum + line.quantity, 0);
}
