'use client';

import { useTranslations } from 'next-intl';
import { CertificationBadge } from '~/components/certification-badge';
import { ShieldCheckIcon, Building2Icon, UsersIcon, TrendingUpIcon, GlobeIcon } from 'lucide-react';

const certifications = ['ce', 'ul', 'rohs', 'cb', 'emc', 'tuv'] as const;

export function TrustSection() {
  const t = useTranslations('home');

  const stats = [
    { icon: Building2Icon, label: t('trustStatFounded'), value: t('trustStatFoundedValue') },
    { icon: UsersIcon, label: t('trustStatEmployees'), value: t('trustStatEmployeesValue') },
    { icon: TrendingUpIcon, label: t('trustStatRevenue'), value: t('trustStatRevenueValue') },
    { icon: GlobeIcon, label: t('trustStatExports'), value: t('trustStatExportsValue') },
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-4 flex justify-center">
            <ShieldCheckIcon className="size-10 text-[#0369A1]" />
          </div>
          <h2 className="mb-4 text-2xl font-bold">{t('trustTitle')}</h2>
          <p className="mb-8 text-muted-foreground">
            {t('trustDescription')}
          </p>
          <div className="mb-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {stats.map(({ icon: Icon, label, value }) => (
              <div key={label} className="rounded-xl border bg-card p-4 text-center shadow-sm">
                <Icon className="mx-auto mb-2 size-6 text-[#0369A1]" />
                <p className="text-2xl font-bold">{value}</p>
                <p className="text-sm text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {certifications.map((cert) => (
              <CertificationBadge key={cert} type={cert} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}