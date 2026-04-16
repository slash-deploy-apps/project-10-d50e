'use client';

import { useTranslations } from 'next-intl';
import { Link } from '~/i18n/navigation';
import { Button } from '~/components/ui/button';
import { ProductCard } from '~/components/product-card';
import { ArrowRightIcon } from 'lucide-react';
import { api } from '~/trpc/react';

export function FeaturedProducts() {
  const t = useTranslations('home');
  const { data } = api.product.list.useQuery({ page: 1, limit: 4 });

  return (
    <section className="bg-muted/50 py-16">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold">{t('featuredProducts')}</h2>
          <Button asChild variant="outline" className="gap-2">
            <Link href="/products">
              {t('viewMore')}
              <ArrowRightIcon className="size-4" />
            </Link>
          </Button>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {(data?.items ?? []).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}