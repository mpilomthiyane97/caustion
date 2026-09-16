import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-16 text-center">
      <SEO title="Page not found" description="This page does not exist." />
      <h1 className="font-heading text-2xl font-bold text-ink">Page not found</h1>
      <p className="mt-2 text-ink/70">The page you&apos;re looking for doesn&apos;t exist.</p>
      <Link to="/" className="mt-6 inline-block text-amber-dark font-semibold">
        Back to home
      </Link>
    </div>
  );
}
