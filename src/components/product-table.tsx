'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Link } from '~/i18n/navigation';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '~/components/ui/table';
import { CertificationBadge } from '~/components/certification-badge';
import { PackageIcon } from 'lucide-react';
import type { RouterOutputs } from '~/trpc/react';

type Product = NonNullable<RouterOutputs['product']['list']['items'][number]>;

interface ProductTableProps {
  products: Product[];
  categorySlug: string;
  seriesSlug: string;
}

export function ProductTable({ products, categorySlug, seriesSlug }: ProductTableProps) {
  const t = useTranslations('products');

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-16">{t('image')}</TableHead>
          <TableHead className="font-mono">{t('modelName')}</TableHead>
          <TableHead>{t('inputVoltage')}</TableHead>
          <TableHead>{t('outputVoltage')}</TableHead>
          <TableHead>{t('outputCurrent')}</TableHead>
          <TableHead>{t('outputType')}</TableHead>
          <TableHead>{t('certifications')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product) => (
          <TableRow key={product.id}>
            <TableCell>
              <div className="flex h-10 w-10 items-center justify-center rounded bg-muted">
                {product.imageUrl ? (
                  <Image
                    src={product.imageUrl}
                    alt={product.modelName}
                    width={40}
                    height={40}
                    unoptimized
                    className="h-full w-full rounded object-contain"
                  />
                ) : (
                  <PackageIcon className="size-5 text-muted-foreground" />
                )}
              </div>
            </TableCell>
            <TableCell className="font-mono font-medium">
              <Link
                href={`/products/${categorySlug}/${seriesSlug}/${product.slug}`}
                className="text-[#0369A1] hover:underline"
              >
                {product.modelName}
              </Link>
            </TableCell>
            <TableCell>{product.inputVoltage ?? '-'}</TableCell>
            <TableCell>{product.outputVoltage ?? '-'}</TableCell>
            <TableCell>{product.outputCurrent ?? '-'}</TableCell>
            <TableCell>{product.outputType ?? '-'}</TableCell>
            <TableCell>
              <div className="flex flex-wrap gap-1">
                {(product.certifications ?? []).map((cert) => (
                  <CertificationBadge key={cert} type={cert} />
                ))}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}