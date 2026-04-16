'use client';

import { api } from '~/trpc/react';
import { ProductTable } from '~/components/product-table';
import { Spinner } from '~/components/ui/spinner';
import { useTranslations } from 'next-intl';

interface ProductTableClientProps {
  categorySlug: string;
  seriesSlug: string;
}

export function ProductTableClient({ categorySlug, seriesSlug }: ProductTableClientProps) {
  const t = useTranslations('products');
  const { data, isLoading } = api.product.list.useQuery({
    page: 1,
    limit: 100,
    categorySlug,
    seriesSlug,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner className="size-6" />
      </div>
    );
  }

  const items = data?.items ?? [];

  if (items.length === 0) {
    return (
      <div className="rounded-lg border bg-muted/50 py-12 text-center">
        <p className="text-muted-foreground">{t('noProductsInSeries')}</p>
      </div>
    );
  }

  return (
    <ProductTable
      products={items}
      categorySlug={categorySlug}
      seriesSlug={seriesSlug}
    />
  );
}