'use client';

import { useTranslations } from 'next-intl';
import { Link } from '~/i18n/navigation';
import { Button } from '~/components/ui/button';
import { ArrowRightIcon } from 'lucide-react';

export function MainHero() {
  const t = useTranslations('home');

  const stats = [
    { key: 'heroStatYears' as const },
    { key: 'heroStatProducts' as const },
    { key: 'heroStatSeries' as const },
    { key: 'heroStatCerts' as const },
  ];

  return (
    <section className="relative overflow-hidden bg-[#0F172A] py-24 text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0F172A] via-[#0F172A] to-[#0369A1]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(3,105,161,0.3),transparent_70%)]" />
        <div className="absolute inset-0 opacity-20 bg-[linear-gradient(135deg,transparent_25%,rgba(3,105,161,0.15)_50%,transparent_75%)] bg-[length:200%_200%] animate-[shimmer_8s_ease-in-out_infinite]" />
        <div className="absolute -top-1/2 -left-1/4 size-[600px] rounded-full bg-[#0369A1]/10 blur-[120px]" />
        <div className="absolute -bottom-1/2 -right-1/4 size-[600px] rounded-full bg-[#0369A1]/[0.08] blur-[120px]" />
      </div>
      <div className="container relative mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            {t('heroTitle')}
          </h1>
          <p className="mt-4 text-lg text-white/80 sm:text-xl">
            {t('heroSubtitle')}
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild className="h-12 px-8 text-base bg-white text-[#0F172A] [a]:hover:bg-white/80 [a]:hover:text-[#0F172A]">
              <Link href="/products">
                {t('viewProducts')}
                <ArrowRightIcon className="ml-2 size-4" />
              </Link>
            </Button>
            <Button asChild className="h-12 px-8 text-base border-white/30 bg-white/5 text-white [a]:hover:bg-white/15 [a]:hover:text-white" variant="outline">
              <Link href="/quote">
                {t('requestQuote')}
              </Link>
            </Button>
          </div>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 border-t border-white/10 pt-8 sm:gap-10">
            {stats.map((stat) => (
              <span key={stat.key} className="text-sm font-medium text-white/70">
                {t(stat.key)}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}