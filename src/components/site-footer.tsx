'use client';

import { useTranslations } from 'next-intl';
import { Link } from '~/i18n/navigation';
import { Separator } from '~/components/ui/separator';
import { MailIcon, PhoneIcon, MapPinIcon, PrinterIcon } from 'lucide-react';

export function SiteFooter() {
  const t = useTranslations('footer');
  const tc = useTranslations('common');
  const tn = useTranslations('nav');

  return (
    <footer className="border-t bg-muted/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="mb-4 font-bold">{t('legalName')}</h3>
            <p className="text-sm text-muted-foreground">{t('description')}</p>
            <p className="mt-2 text-sm text-muted-foreground">{t('established')}</p>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2"><MapPinIcon className="size-4 mt-0.5 shrink-0" />{t('fullAddress')}</li>
              <li className="flex items-center gap-2"><PhoneIcon className="size-4" />{t('tel')}</li>
              <li className="flex items-center gap-2"><PrinterIcon className="size-4" />{t('fax')}</li>
              <li className="flex items-center gap-2"><MailIcon className="size-4" />{tc('email')}</li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-bold">{t('productCategories')}</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/products/dc-dc" className="text-muted-foreground hover:text-foreground">{tn('dcDc')}</Link></li>
              <li><Link href="/products/ac-dc" className="text-muted-foreground hover:text-foreground">{tn('acDc')}</Link></li>
              <li><Link href="/products/ev-component" className="text-muted-foreground hover:text-foreground">{tn('evComponent')}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-bold">{t('customerSupport')}</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/quote" className="text-muted-foreground hover:text-foreground">{t('quoteInquiry')}</Link></li>
              <li><Link href="/about" className="text-muted-foreground hover:text-foreground">{t('aboutLink')}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-bold">{t('aboutUs')}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>{t('ceo')}: {t('ceoName')}</li>
              <li>{t('businessNumber')}: {t('businessNumberValue')}</li>
              <li>{t('mailOrderRegistration')}: {t('mailOrderRegistrationValue')}</li>
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col items-center justify-between gap-4 text-sm text-muted-foreground sm:flex-row">
          <p>{t('copyright')}</p>
          <p>PowerPlaza (Volker Power) — Industrial Power Conversion Solutions</p>
        </div>
      </div>
    </footer>
  );
}