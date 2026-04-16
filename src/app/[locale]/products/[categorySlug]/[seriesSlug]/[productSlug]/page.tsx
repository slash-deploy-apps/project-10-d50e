import { setRequestLocale } from 'next-intl/server';
import { api } from '~/trpc/server';
import { ProductDetail } from '~/components/product-detail';
import { notFound } from 'next/navigation';

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ locale: string; categorySlug: string; seriesSlug: string; productSlug: string }>;
}) {
  const { locale, productSlug } = await params;
  setRequestLocale(locale);
  const product = await api.product.getBySlug({ slug: productSlug });

  if (!product) notFound();

  return (
    <main className="container mx-auto px-4 py-12">
      <ProductDetail product={product} />
    </main>
  );
}