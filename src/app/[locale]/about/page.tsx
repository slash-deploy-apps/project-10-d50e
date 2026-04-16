import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '~/components/ui/card';
import { CertificationBadge } from '~/components/certification-badge';
import {
  CalendarIcon,
  TrendingUpIcon,
  PackageIcon,
  GlobeIcon,
  ZapIcon,
  PlugIcon,
  CarIcon,
  ShieldCheckIcon,
  MapPinIcon,
  PhoneIcon,
  MailIcon,
  PrinterIcon,
} from 'lucide-react';

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('about');
  const tc = await getTranslations('common');

  const stats = [
    { icon: CalendarIcon, label: t('statFounded'), value: t('statFoundedValue') },
    { icon: TrendingUpIcon, label: t('statRevenue'), value: t('statRevenueValue') },
    { icon: PackageIcon, label: t('statProducts'), value: t('statProductsValue') },
    { icon: GlobeIcon, label: t('statExports'), value: t('statExportsValue') },
  ];

  const businessAreas = [
    { icon: ZapIcon, title: t('businessDcdc'), desc: t('businessDcdcDesc') },
    { icon: PlugIcon, title: t('businessAcdc'), desc: t('businessAcdcDesc') },
    { icon: CarIcon, title: t('businessEv'), desc: t('businessEvDesc') },
  ];

  const milestones = [
    { year: '1993', event: t('history1993') },
    { year: '1998', event: t('history1998') },
    { year: '2004', event: t('history2004') },
    { year: '2010', event: t('history2010') },
    { year: '2015', event: t('history2015') },
    { year: '2020', event: t('history2020') },
    { year: '2023', event: t('history2023') },
    { year: '2025', event: t('history2025') },
  ];

  const certifications = ['ce', 'ul', 'rohs', 'cb', 'emc', 'tuv'] as const;

  return (
    <main>
      {/* Hero Banner */}
      <section className="bg-primary/5 border-b py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tight">{t('heroTitle')}</h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            {t('heroSubtitle')}
          </p>
        </div>
      </section>

      {/* Company Overview */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-4 text-center text-2xl font-bold">{t('overviewTitle')}</h2>
          <p className="mx-auto mb-12 max-w-3xl text-center text-muted-foreground">
            {t('overviewDescription')}
          </p>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {stats.map((stat) => (
              <Card key={stat.label} className="text-center">
                <CardContent className="pt-6">
                  <stat.icon className="mx-auto mb-3 size-8 text-primary" />
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Business Areas */}
      <section className="bg-muted/50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-2xl font-bold">{t('businessTitle')}</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {businessAreas.map((area) => (
              <Card key={area.title} className="transition-shadow hover:shadow-md">
                <CardHeader>
                  <area.icon className="mb-2 size-10 text-primary" />
                  <CardTitle className="text-xl">{area.title}</CardTitle>
                  <CardDescription className="text-sm">{area.desc}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* History Timeline */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-2xl font-bold">{t('historyTitle')}</h2>
          <div className="mx-auto max-w-2xl space-y-0">
            {milestones.map((ms, i) => (
              <div key={ms.year} className="relative flex gap-4 pb-8 last:pb-0">
                <div className="relative flex flex-col items-center">
                  <div className="relative z-10 size-4 shrink-0 rounded-full border-2 border-primary bg-background" />
                  {i < milestones.length - 1 && (
                    <div className="w-px flex-1 bg-border" />
                  )}
                </div>
                <div className="pb-2 pt-0.5">
                  <span className="text-lg font-bold text-primary">{ms.year}</span>
                  <p className="text-sm text-muted-foreground">{ms.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="bg-muted/50 py-16">
        <div className="container mx-auto px-4 text-center">
          <ShieldCheckIcon className="mx-auto mb-4 size-10 text-primary" />
          <h2 className="mb-2 text-2xl font-bold">{t('certTitle')}</h2>
          <p className="mb-8 text-muted-foreground">{t('certDescription')}</p>
          <div className="flex flex-wrap justify-center gap-3">
            {certifications.map((cert) => (
              <CertificationBadge key={cert} type={cert} />
            ))}
          </div>
        </div>
      </section>

      {/* Contact & Location */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-2xl font-bold">{t('contactTitle')}</h2>
          <div className="mx-auto max-w-xl">
            <Card>
              <CardContent className="space-y-4 pt-6">
                <div className="flex items-start gap-3">
                  <MapPinIcon className="mt-0.5 size-5 shrink-0 text-primary" />
                  <div>
                    <p className="font-medium">{t('contactAddress')}</p>
                    <p className="text-sm text-muted-foreground">{tc('address')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <PhoneIcon className="size-5 shrink-0 text-primary" />
                  <div>
                    <p className="font-medium">{t('contactTel')}</p>
                    <p className="text-sm text-muted-foreground">{tc('phone')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <PrinterIcon className="size-5 shrink-0 text-primary" />
                  <div>
                    <p className="font-medium">{t('contactFax')}</p>
                    <p className="text-sm text-muted-foreground">{t('contactFaxNumber')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MailIcon className="size-5 shrink-0 text-primary" />
                  <div>
                    <p className="font-medium">{t('contactEmail')}</p>
                    <p className="text-sm text-muted-foreground">{tc('email')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
}