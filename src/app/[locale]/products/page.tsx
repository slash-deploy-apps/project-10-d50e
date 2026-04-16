import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { api } from '~/trpc/server';
import { Link } from '~/i18n/navigation';
import { Card, CardHeader, CardTitle, CardDescription } from '~/components/ui/card';
import { ZapIcon, PlugIcon, CarIcon } from 'lucide-react';

const categoryIcons: Record<string, React.ReactNode> = {
  'dc-dc': <ZapIcon className="size-8" />,
  'ac-dc': <PlugIcon className="size-8" />,
  'ev-component': <CarIcon className="size-8" />,
};

export default async function ProductsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('products');
  const categories = await api.category.list();

  return (
    <main className="container mx-auto px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold">{t('title')}</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat) => (
          <Link key={cat.id} href={`/products/${cat.slug}`}>
            <Card className="h-full transition-shadow hover:shadow-lg">
              <CardHeader>
                <div className="mb-2 text-[#0369A1]">
                  {categoryIcons[cat.slug] ?? <ZapIcon className="size-8" />}
                </div>
                <CardTitle>{locale === 'en' ? cat.nameEn : cat.name}</CardTitle>
                <CardDescription>
                  {locale === 'en' ? cat.descriptionEn : cat.description}
                </CardDescription>
                {cat.series && (
                  <p className="mt-2 text-xs text-muted-foreground">
                    {cat.series.length} series
                  </p>
                )}
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </main>
  );
}