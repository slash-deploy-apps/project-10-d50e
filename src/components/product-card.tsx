'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Link } from '~/i18n/navigation';
import { Card, CardContent, CardFooter } from '~/components/ui/card';
import { Badge } from '~/components/ui/badge';
import { CertificationBadge } from '~/components/certification-badge';
import { PackageIcon } from 'lucide-react';
import type { RouterOutputs } from '~/trpc/react';

type Product = NonNullable<RouterOutputs['product']['list']['items'][number]>;

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const t = useTranslations('products');
  const categorySlug = product.series?.category?.slug ?? '';
  const seriesSlug = product.series?.slug ?? '';

  return (
    <Link href={`/products/${categorySlug}/${seriesSlug}/${product.slug}`}>
      <Card className="group h-full transition-shadow hover:shadow-md">
        <CardContent className="pt-4">
          <div className="mb-3 flex h-32 items-center justify-center rounded-lg bg-muted">
            {product.imageUrl ? (
              <Image
                src={product.imageUrl}
                alt={product.modelName}
                width={128}
                height={128}
                unoptimized
                className="h-full w-full rounded-lg object-contain p-2"
              />
            ) : (
              <PackageIcon className="size-12 text-muted-foreground" />
            )}
          </div>
          <h3 className="font-mono text-sm font-semibold">{product.modelName}</h3>
          <p className="mt-1 text-xs text-muted-foreground line-clamp-1">
            {product.inputVoltage} → {product.outputVoltage} / {product.outputCurrent}
          </p>
          {product.certifications && product.certifications.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {product.certifications.map((cert) => (
                <CertificationBadge key={cert} type={cert} />
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter className="justify-between">
          {product.price != null && (
            <span className="text-sm font-medium">
              ₩{product.price.toLocaleString()}
            </span>
          )}
          <Badge variant="outline" className="text-xs">
            {product.status === 'active' ? t('active') : t('inactive')}
          </Badge>
        </CardFooter>
      </Card>
    </Link>
  );
}