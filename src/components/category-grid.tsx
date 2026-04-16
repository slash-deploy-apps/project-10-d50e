'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Link } from '~/i18n/navigation';
import { Card, CardHeader, CardTitle, CardDescription } from '~/components/ui/card';
import { ZapIcon, PlugIcon, CarIcon } from 'lucide-react';
import { api } from '~/trpc/react';

const categoryIcons: Record<string, React.ReactNode> = {
  'dc-dc': <ZapIcon className="size-8" />,
  'ac-dc': <PlugIcon className="size-8" />,
  'ev-component': <CarIcon className="size-8" />,
};

export function CategoryGrid() {
  const t = useTranslations('home');
  const locale = useLocale();
  const { data: categories } = api.category.list.useQuery();

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="mb-8 text-center text-2xl font-bold">{t('categories')}</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {(categories ?? []).map((cat) => (
            <Link key={cat.id} href={`/products/${cat.slug}`}>
              <Card className="group h-full overflow-hidden transition-shadow hover:shadow-lg">
                <div className="relative h-48 w-full bg-muted">
                  {cat.imageUrl ? (
                    <img
                      src={cat.imageUrl}
                      alt={locale === 'en' ? cat.nameEn : cat.name}
                      className="h-full w-full object-contain p-4"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-[#0369A1]">
                      {categoryIcons[cat.slug] ?? <ZapIcon className="size-12" />}
                    </div>
                  )}
                </div>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {locale === 'en' ? cat.nameEn : cat.name}
                  </CardTitle>
                  <CardDescription className="line-clamp-2">
                    {locale === 'en' ? cat.descriptionEn : cat.description}
                  </CardDescription>
                  <p className="mt-2 text-sm font-medium text-[#0369A1]">
                    {t('categorySeriesCount', { count: cat.seriesCount })} · {t('categoryProductCount', { count: cat.productCount })}
                  </p>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}