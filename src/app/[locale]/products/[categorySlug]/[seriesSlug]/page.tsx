import { setRequestLocale } from 'next-intl/server';
import { api } from '~/trpc/server';
import { ProductTableClient } from './product-table-client';
import { Link } from '~/i18n/navigation';
import { ArrowLeftIcon } from 'lucide-react';
import { notFound } from 'next/navigation';

export default async function SeriesPage({
  params,
}: {
  params: Promise<{ locale: string; categorySlug: string; seriesSlug: string }>;
}) {
  const { locale, categorySlug, seriesSlug } = await params;
  setRequestLocale(locale);
  const categories = await api.category.list();
  const category = categories.find((c) => c.slug === categorySlug);
  if (!category) notFound();
  const series = category.series?.find((s) => s.slug === seriesSlug);
  if (!series) notFound();

  return (
    <main className="container mx-auto px-4 py-12">
      <Link href={`/products/${categorySlug}`} className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeftIcon className="size-4" />
        {locale === 'en' ? category.nameEn : category.name}
      </Link>
      <div className="mb-8 flex gap-8">
        {series.imageUrl && (
          <div className="flex h-40 w-40 shrink-0 items-center justify-center rounded-lg border bg-muted">
            <img src={series.imageUrl} alt={series.name} className="h-full object-contain p-2" />
          </div>
        )}
        <div>
          <h1 className="mb-2 text-3xl font-bold">{series.name}</h1>
          <p className="text-muted-foreground">{locale === 'en' ? series.descriptionEn : series.description}</p>
        </div>
      </div>
      <ProductTableClient categorySlug={categorySlug} seriesSlug={seriesSlug} />
    </main>
  );
}