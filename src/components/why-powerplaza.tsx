'use client';

import { useTranslations } from 'next-intl';
import { FactoryIcon, ShieldCheckIcon, AwardIcon, WrenchIcon } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '~/components/ui/card';

const features = [
  { icon: FactoryIcon, titleKey: 'whyExperience' as const, descKey: 'whyExperienceDesc' as const },
  { icon: ShieldCheckIcon, titleKey: 'whyAutomation' as const, descKey: 'whyAutomationDesc' as const },
  { icon: AwardIcon, titleKey: 'whyCertifications' as const, descKey: 'whyCertificationsDesc' as const },
  { icon: WrenchIcon, titleKey: 'whyCustom' as const, descKey: 'whyCustomDesc' as const },
];

export function WhyPowerPlaza() {
  const t = useTranslations('home');

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="mb-8 text-center text-2xl font-bold">{t('whyTitle')}</h2>
        <div className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-2">
          {features.map(({ icon: Icon, titleKey, descKey }) => (
            <Card key={titleKey} className="group h-full transition-shadow hover:shadow-lg">
              <CardHeader>
                <div className="mb-3 flex size-12 items-center justify-center rounded-lg bg-[#0369A1]/10">
                  <Icon className="size-6 text-[#0369A1]" />
                </div>
                <CardTitle className="text-lg">{t(titleKey)}</CardTitle>
                <CardDescription className="line-clamp-3">{t(descKey)}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}