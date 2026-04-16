import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { QuoteForm } from '~/components/quote-form';

export default async function QuotePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('quote');

  return (
    <main className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-2 text-3xl font-bold">{t('title')}</h1>
        <p className="mb-8 text-muted-foreground">{t('subtitle')}</p>
        <QuoteForm />
      </div>
    </main>
  );
}