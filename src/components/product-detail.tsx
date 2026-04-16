'use client';

import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
import { Link } from '~/i18n/navigation';
import { Card, CardContent } from '~/components/ui/card';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { CertificationBadge } from '~/components/certification-badge';
import { PackageIcon, ArrowLeftIcon, DownloadIcon } from 'lucide-react';
import type { RouterOutputs } from '~/trpc/react';

type Product = NonNullable<RouterOutputs['product']['getBySlug']>;

interface ProductDetailProps {
  product: Product;
}

export function ProductDetail({ product }: ProductDetailProps) {
  const t = useTranslations('products');
  const locale = useLocale();
  const specs = locale === 'en' && product.specsEn ? product.specsEn : product.specs;
  const categorySlug = product.series?.category?.slug ?? '';
  const seriesSlug = product.series?.slug ?? '';

  return (
    <div className="space-y-6">
      <Link
        href={`/products/${categorySlug}/${seriesSlug}`}
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeftIcon className="size-4" />
        {t('viewAll')}
      </Link>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="flex items-center justify-center rounded-lg border bg-muted p-8">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.modelName}
              width={320}
              height={320}
              unoptimized
              className="max-h-80 object-contain"
            />
          ) : (
            <PackageIcon className="size-24 text-muted-foreground" />
          )}
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="font-mono text-2xl font-bold">{product.modelName}</h1>
            <div className="mt-2 flex items-center gap-2">
              <Badge variant={product.status === 'active' ? 'default' : 'secondary'}>
                {product.status === 'active' ? t('active') : t('inactive')}
              </Badge>
              {product.series && (
                <Badge variant="outline">{product.series.name}</Badge>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="font-semibold">{t('specifications')}</h2>
            <Card size="sm">
              <CardContent className="grid grid-cols-2 gap-2 text-sm">
                {product.inputVoltage && (
                  <><span className="text-muted-foreground">{t('inputVoltage')}</span><span>{product.inputVoltage}</span></>
                )}
                {product.outputVoltage && (
                  <><span className="text-muted-foreground">{t('outputVoltage')}</span><span>{product.outputVoltage}</span></>
                )}
                {product.outputCurrent && (
                  <><span className="text-muted-foreground">{t('outputCurrent')}</span><span>{product.outputCurrent}</span></>
                )}
                {product.outputType && (
                  <><span className="text-muted-foreground">{t('outputType')}</span><span>{product.outputType}</span></>
                )}
              </CardContent>
            </Card>
          </div>

          {specs && Object.keys(specs).length > 0 && (
            <div className="space-y-3">
              <h2 className="font-semibold">{t('additionalSpecs')}</h2>
              <Card size="sm">
                <CardContent className="grid grid-cols-2 gap-2 text-sm">
                  {Object.entries(specs).map(([key, value]) => (
                    <><span className="text-muted-foreground">{key}</span><span>{value}</span></>
                  ))}
                </CardContent>
              </Card>
            </div>
          )}

          {product.certifications && product.certifications.length > 0 && (
            <div className="space-y-3">
              <h2 className="font-semibold">{t('certifications')}</h2>
              <div className="flex flex-wrap gap-2">
                {product.certifications.map((cert) => (
                  <CertificationBadge key={cert} type={cert} />
                ))}
              </div>
            </div>
          )}

          {product.price != null && (
            <div className="space-y-3">
              <h2 className="font-semibold">{t('price')}</h2>
              <p className="text-2xl font-bold">₩{product.price.toLocaleString()}</p>
              {product.priceNote && <p className="text-sm text-muted-foreground">{product.priceNote}</p>}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button asChild className="w-full" size="lg">
              <Link href="/quote">
                {t('requestQuoteForProduct')}
              </Link>
            </Button>
            {product.datasheetUrl && (
              <Button asChild variant="outline" size="lg" className="w-full">
                <a href={product.datasheetUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
                  <DownloadIcon className="mr-2 size-4" />
                  {t('downloadDatasheet')}
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}