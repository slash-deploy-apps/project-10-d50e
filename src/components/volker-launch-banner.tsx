'use client';

import { useTranslations } from 'next-intl';
import { Link } from '~/i18n/navigation';
import { Button } from '~/components/ui/button';
import { ArrowRightIcon, ZapIcon } from 'lucide-react';

export function VolkerLaunchBanner() {
  const t = useTranslations('home');

  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-[#1a1a2e] via-[#16213e] to-[#0f3460] py-16 text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-20 -top-20 size-96 rounded-full bg-[#e94560]/10 blur-[100px]" />
        <div className="absolute -bottom-20 -left-20 size-80 rounded-full bg-[#0f3460]/20 blur-[80px]" />
      </div>
      <div className="container relative mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium backdrop-blur">
            <ZapIcon className="size-4 text-[#e94560]" />
            {t('volkerBadge')}
          </div>
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
            {t('volkerTitle')}
          </h2>
          <p className="mb-8 text-lg text-white/80">
            {t('volkerDescription')}
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" className="bg-[#e94560] text-white [a]:hover:bg-[#e94560]/80 [a]:hover:text-white">
              <Link href="/products/volker-power">
                {t('volkerViewProducts')}
                <ArrowRightIcon className="ml-2 size-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white/30 bg-white/5 text-white [a]:hover:bg-white/15 [a]:hover:text-white">
              <Link href="/quote">
                {t('volkerRequestQuote')}
              </Link>
            </Button>
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-white/60">
            <span>✓ {t('volkerCerts')}</span>
            <span>✓ {t('volkerOfficial')}</span>
            <span>✓ {t('volkerFastResponse')}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
