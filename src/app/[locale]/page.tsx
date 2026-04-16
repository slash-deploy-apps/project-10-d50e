import { setRequestLocale } from 'next-intl/server';
import { MainHero } from '~/components/main-hero';
import { VolkerLaunchBanner } from '~/components/volker-launch-banner';
import { CategoryGrid } from '~/components/category-grid';
import { WhyPowerPlaza } from '~/components/why-powerplaza';
import { FeaturedProducts } from '~/components/featured-products';
import { TrustSection } from '~/components/trust-section';

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main>
      <MainHero />
      <VolkerLaunchBanner />
      <CategoryGrid />
      <WhyPowerPlaza />
      <FeaturedProducts />
      <TrustSection />
    </main>
  );
}