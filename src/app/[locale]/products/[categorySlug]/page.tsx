import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { api } from '~/trpc/server';
import { Link } from '~/i18n/navigation';
import { Card, CardHeader, CardTitle, CardDescription } from '~/components/ui/card';
import { ArrowLeftIcon } from 'lucide-react';
import { notFound } from 'next/navigation';

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ locale: string; categorySlug: string }>;
}) {
  const { locale, categorySlug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('products');
  const categories = await api.category.list();
  const category = categories.find((c) => c.slug === categorySlug);

  if (!category) notFound();

  return (
    <main className="container mx-auto px-4 py-12">
      <Link href="/products" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeftIcon className="size-4" />
        {t('allProducts')}
      </Link>
      <h1 className="mb-2 text-3xl font-bold">{locale === 'en' ? category.nameEn : category.name}</h1>
      <p className="mb-8 text-muted-foreground">{locale === 'en' ? category.descriptionEn : category.description}</p>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {(category.series ?? []).map((s) => (
          <Link key={s.id} href={`/products/${categorySlug}/${s.slug}`}>
            <Card className="h-full transition-shadow hover:shadow-md">
              <div className="flex h-32 items-center justify-center rounded-t-lg bg-muted">
                <img
                  src={s.imageUrl ?? undefined}
                  alt={s.name}
                  className="h-full object-contain p-2"
                />
              </div>
              <CardHeader>
                <CardTitle className="font-mono">{s.name}</CardTitle>
                <CardDescription className="line-clamp-3">
                  {locale === 'en' ? s.descriptionEn : s.description}
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </main>
  );
}