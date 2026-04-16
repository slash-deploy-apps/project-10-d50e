'use client';

import { useTranslations } from 'next-intl';
import { Badge } from '~/components/ui/badge';
import { ShieldCheckIcon } from 'lucide-react';

type CertType = 'ce' | 'ul' | 'rohs' | 'cb' | 'emc' | 'tuv';

interface CertificationBadgeProps {
  type: string;
}

const certColors: Record<string, string> = {
  ce: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  ul: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  rohs: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300',
  cb: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300',
  emc: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
  tuv: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
};

export function CertificationBadge({ type }: CertificationBadgeProps) {
  const t = useTranslations('certifications');
  const colorClass = certColors[type] ?? 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';

  return (
    <Badge
      variant="outline"
      className={`${colorClass} border-0 font-mono text-xs uppercase`}
    >
      <ShieldCheckIcon className="mr-1 size-3" />
      {t(type as CertType) ?? type.toUpperCase()}
    </Badge>
  );
}