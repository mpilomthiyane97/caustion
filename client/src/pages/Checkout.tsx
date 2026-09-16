import { FormEvent, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { createOrder, fetchProducts } from '../lib/api';
import { getCart } from '../lib/cart';
import { formatCents } from '../lib/format';
import type { Product } from '../types';

interface FormState {
  name: string;
  phone: string;
  email: string;
  street: string;
  suburb: string;
  city: string;
  postalCode: string;
  deliveryNotes: string;
  ageConfirmed: boolean;
  lawfulUseConfirmed: boolean;
}

const initialForm: FormState = {
  name: '',
  phone: '',
  email: '',
  street: '',
  suburb: '',
  city: '',
  postalCode: '',
  deliveryNotes: '',
  ageConfirmed: false,
  lawfulUseConfirmed: false,
};

export default function Checkout() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [products, setProducts] = useState<Product[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [slow, setSlow] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const cart = getCart();

  useEffect(() => {
    if (cart.length === 0) return;
    fetchProducts().then(setProducts).catch(() => setProducts([]));
  }, []);

  if (cart.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <p className="text-ink/60">Your cart is empty.</p>
        <Link to="/shop" className="mt-4 inline-block text-amber-dark font-semibold">
          Browse products
        </Link>
      </div>
    );
  }

  const bySlug = new Map(products.map((p) => [p.slug, p]));
  const subtotal = cart.reduce((sum, line) => {
    const product = bySlug.get(line.slug);
    return sum + (product ? product.priceCents * line.quantity : 0);
  }, 0);

  const update = (field: keyof FormState) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const target = e.target;
    const value = target instanceof HTMLInputElement && target.type === 'checkbox'
      ? target.checked
      : target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const slowTimer = setTimeout(() => setSlow(true), 2500);

    try {
      const payment = await createOrder({
        customer: { name: form.name, phone: form.phone, email: form.email },
        address: {
          street: form.street,
          suburb: form.suburb,
          city: form.city,
          postalCode: form.postalCode,
          province: 'Gauteng',
        },
        deliveryNotes: form.deliveryNotes,
        items: cart.map((line) => ({ slug: line.slug, quantity: line.quantity })),
        consents: {
          ageConfirmed: form.ageConfirmed,
          lawfulUseConfirmed: form.lawfulUseConfirmed,
        },
      });

      const formEl = document.createElement('form');
      formEl.method = 'POST';
      formEl.action = payment.action;
      for (const [key, value] of Object.entries(payment.fields)) {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = value;
        formEl.appendChild(input);
      }
      document.body.appendChild(formEl);
      formEl.submit();
    } catch (err) {
      clearTimeout(slowTimer);
      setSubmitting(false);
      setSlow(false);
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <SEO title="Checkout" description="Complete your Caution SA order." />
      <h1 className="font-heading text-2xl font-bold text-ink">Checkout</h1>

      <form ref={formRef} onSubmit={handleSubmit} className="mt-6 space-y-6" noValidate>
        <fieldset className="space-y-4">
          <legend className="font-heading font-semibold text-ink mb-1">Your details</legend>
          <Field label="Full name" id="name" value={form.name} onChange={update('name')} required />
          <Field
            label="Phone number"
            id="phone"
            type="tel"
            placeholder="082 123 4567"
            value={form.phone}
            onChange={update('phone')}
            required
          />
          <Field
            label="Email address"
            id="email"
            type="email"
            value={form.email}
            onChange={update('email')}
            required
          />
        </fieldset>

        <fieldset className="space-y-4">
          <legend className="font-heading font-semibold text-ink mb-1">Delivery address</legend>
          <Field label="Street address" id="street" value={form.street} onChange={update('street')} required />
          <div className="grid grid-cols-2 gap-4">
            <Field label="Suburb" id="suburb" value={form.suburb} onChange={update('suburb')} required />
            <Field label="City" id="city" value={form.city} onChange={update('city')} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field
              label="Postal code"
              id="postalCode"
              value={form.postalCode}
              onChange={update('postalCode')}
              required
            />
            <div>
              <label htmlFor="province" className="block text-sm font-medium text-ink mb-1">
                Province
              </label>
              <input
                id="province"
                value="Gauteng"
                disabled
                className="w-full rounded-lg border border-ink/20 bg-sand px-3 py-2 text-sm text-ink/70"
              />
            </div>
          </div>
          <div>
            <label htmlFor="deliveryNotes" className="block text-sm font-medium text-ink mb-1">
              Delivery notes (optional)
            </label>
            <textarea
              id="deliveryNotes"
              value={form.deliveryNotes}
              onChange={update('deliveryNotes')}
              rows={2}
              className="w-full rounded-lg border border-ink/20 px-3 py-2 text-sm"
              placeholder="Gate code, landmark, preferred time..."
            />
          </div>
          <p className="text-xs text-ink/60 bg-sand rounded-lg px-3 py-2">
            Delivered via Uber within Gauteng once payment is confirmed. We&apos;ll WhatsApp you
            when it&apos;s on the way.
          </p>
        </fieldset>

        <fieldset className="space-y-3">
          <label className="flex items-start gap-2 text-sm text-ink">
            <input
              type="checkbox"
              checked={form.ageConfirmed}
              onChange={update('ageConfirmed')}
              required
              className="mt-0.5 h-4 w-4"
            />
            I confirm I am 18 years or older
          </label>
          <label className="flex items-start gap-2 text-sm text-ink">
            <input
              type="checkbox"
              checked={form.lawfulUseConfirmed}
              onChange={update('lawfulUseConfirmed')}
              required
              className="mt-0.5 h-4 w-4"
            />
            I will use these products for lawful self-defence only
          </label>
        </fieldset>

        <div className="flex items-center justify-between border-t border-ink/10 pt-4">
          <span className="text-sm text-ink/70">Subtotal</span>
          <span className="font-semibold text-ink">{formatCents(subtotal)}</span>
        </div>
        <p className="text-xs text-ink/50 -mt-4">Delivery fee is added on the next screen.</p>

        {error && <p className="text-sm text-red-700">{error}</p>}
        {slow && (
          <p className="text-sm text-amber-dark">Connecting securely, please wait...</p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-amber px-6 py-3 font-semibold text-ink hover:bg-amber-dark disabled:opacity-60"
        >
          {submitting ? 'Processing...' : 'Pay with PayFast'}
        </button>
      </form>
    </div>
  );
}

function Field({
  label,
  id,
  type = 'text',
  value,
  onChange,
  required,
  placeholder,
}: {
  label: string;
  id: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-ink mb-1">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-lg border border-ink/20 px-3 py-2 text-sm focus:border-amber"
      />
    </div>
  );
}
