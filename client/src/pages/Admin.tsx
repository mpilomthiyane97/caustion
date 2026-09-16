import { useEffect, useState } from 'react';
import SEO from '../components/SEO';
import { fetchAdminOrders, updateOrderStatus } from '../lib/api';
import { formatCents } from '../lib/format';
import type { AdminOrder, OrderStatus } from '../types';

const SESSION_KEY = 'caution-sa-admin-key';

const statusOptions: { value: OrderStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'paid', label: 'Paid' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'failed', label: 'Failed' },
  { value: 'cancelled', label: 'Cancelled' },
];

const statusColors: Record<OrderStatus, string> = {
  pending: 'bg-sand text-ink/70',
  paid: 'bg-amber/20 text-amber-dark',
  delivered: 'bg-success/15 text-success',
  failed: 'bg-red-100 text-red-700',
  cancelled: 'bg-red-100 text-red-700',
};

function formatAddress(order: AdminOrder): string {
  return [
    order.address.street,
    order.address.suburb,
    `${order.address.city}, ${order.address.postalCode}`,
    order.address.province,
  ].join(', ');
}

function whatsappHref(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  const normalized = digits.startsWith('0') ? `27${digits.slice(1)}` : digits;
  return `https://wa.me/${normalized}`;
}

export default function Admin() {
  const [adminKey, setAdminKey] = useState<string | null>(null);
  const [keyInput, setKeyInput] = useState('');
  const [orders, setOrders] = useState<AdminOrder[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('paid');
  const [copiedRef, setCopiedRef] = useState<string | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem(SESSION_KEY);
    if (stored) setAdminKey(stored);
  }, []);

  const loadOrders = (key: string, status: OrderStatus | 'all') => {
    setError(null);
    fetchAdminOrders(key, status === 'all' ? undefined : status)
      .then(setOrders)
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Failed to load orders');
        if (err instanceof Error && err.message.toLowerCase().includes('unauthorized')) {
          sessionStorage.removeItem(SESSION_KEY);
          setAdminKey(null);
        }
      });
  };

  useEffect(() => {
    if (adminKey) loadOrders(adminKey, statusFilter);
  }, [adminKey, statusFilter]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    sessionStorage.setItem(SESSION_KEY, keyInput);
    setAdminKey(keyInput);
  };

  const handleCopy = async (order: AdminOrder) => {
    try {
      await navigator.clipboard.writeText(formatAddress(order));
      setCopiedRef(order.orderRef);
      setTimeout(() => setCopiedRef(null), 1500);
    } catch {
      // clipboard unavailable — user can select the text manually
    }
  };

  const handleMarkDelivered = async (order: AdminOrder) => {
    if (!adminKey) return;
    try {
      await updateOrderStatus(adminKey, order.orderRef, 'delivered');
      loadOrders(adminKey, statusFilter);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update order');
    }
  };

  if (!adminKey) {
    return (
      <div className="mx-auto max-w-sm px-4 py-20">
        <SEO title="Admin" description="Caution SA admin login." />
        <h1 className="font-heading text-xl font-bold text-ink text-center">Admin login</h1>
        <form onSubmit={handleLogin} className="mt-6 space-y-3">
          <label htmlFor="admin-key" className="sr-only">
            Admin key
          </label>
          <input
            id="admin-key"
            type="password"
            value={keyInput}
            onChange={(e) => setKeyInput(e.target.value)}
            placeholder="Admin key"
            className="w-full rounded-lg border border-ink/20 px-3 py-2 text-sm"
            required
          />
          <button
            type="submit"
            className="w-full rounded-lg bg-amber px-6 py-2.5 font-semibold text-ink hover:bg-amber-dark"
          >
            Enter
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <SEO title="Admin" description="Caution SA admin dashboard." />
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="font-heading text-2xl font-bold text-ink">Orders</h1>
        <button
          type="button"
          onClick={() => {
            sessionStorage.removeItem(SESSION_KEY);
            setAdminKey(null);
          }}
          className="text-sm text-ink/50 hover:text-ink"
        >
          Log out
        </button>
      </div>

      <div className="mt-4 flex gap-2 flex-wrap">
        {statusOptions.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => setStatusFilter(opt.value)}
            className={`rounded-full px-3 py-1.5 text-sm font-medium border ${
              statusFilter === opt.value
                ? 'bg-ink text-white border-ink'
                : 'border-ink/20 text-ink hover:bg-sand'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {error && <p className="mt-4 text-sm text-red-700">{error}</p>}

      {orders === null ? (
        <p className="mt-8 text-ink/60">Loading...</p>
      ) : orders.length === 0 ? (
        <p className="mt-8 text-ink/60">No orders in this view.</p>
      ) : (
        <ul className="mt-6 space-y-4">
          {orders.map((order) => (
            <li key={order._id} className="rounded-xl border border-ink/10 p-5">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-heading font-semibold text-ink">{order.orderRef}</p>
                  <p className="text-xs text-ink/50">
                    {new Date(order.createdAt).toLocaleString('en-ZA')}
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColors[order.status]}`}
                >
                  {order.status}
                </span>
              </div>

              <div className="mt-3 grid sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium text-ink">{order.customer.name}</p>
                  <a
                    href={whatsappHref(order.customer.phone)}
                    target="_blank"
                    rel="noreferrer"
                    className="text-success hover:underline"
                  >
                    {order.customer.phone} (WhatsApp)
                  </a>
                  <p className="text-ink/60">{order.customer.email}</p>
                </div>
                <div>
                  <p className="text-ink/80">{formatAddress(order)}</p>
                  <button
                    type="button"
                    onClick={() => handleCopy(order)}
                    className="mt-1 text-amber-dark text-xs font-semibold hover:underline"
                  >
                    {copiedRef === order.orderRef ? 'Copied!' : 'Copy address'}
                  </button>
                </div>
              </div>

              {order.deliveryNotes && (
                <p className="mt-2 text-xs text-ink/60">Notes: {order.deliveryNotes}</p>
              )}

              <ul className="mt-3 text-sm text-ink/80 space-y-0.5">
                {order.items.map((item) => (
                  <li key={item.productId}>
                    {item.name} x{item.quantity} — {formatCents(item.unitPriceCents * item.quantity)}
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-sm font-semibold text-ink">
                Total: {formatCents(order.totalCents)}
              </p>

              {order.status === 'paid' && (
                <button
                  type="button"
                  onClick={() => handleMarkDelivered(order)}
                  className="mt-3 rounded-lg bg-success px-4 py-2 text-sm font-semibold text-white hover:brightness-110"
                >
                  Mark delivered
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
