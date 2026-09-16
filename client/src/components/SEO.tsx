import { useEffect } from 'react';

interface SEOProps {
  title: string;
  description: string;
}

function setMeta(property: string, content: string, attr: 'name' | 'property' = 'name') {
  let el = document.querySelector<HTMLMetaElement>(`meta[${attr}="${property}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, property);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

export default function SEO({ title, description }: SEOProps) {
  useEffect(() => {
    const fullTitle = `${title} | Caution SA`;
    document.title = fullTitle;
    setMeta('description', description);
    setMeta('og:title', fullTitle, 'property');
    setMeta('og:description', description, 'property');
  }, [title, description]);

  return null;
}
