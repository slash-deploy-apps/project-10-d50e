'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '~/i18n/navigation';
import { routing } from '~/i18n/routing';
import { Button } from '~/components/ui/button';
import { GlobeIcon } from 'lucide-react';

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <div className="flex items-center gap-1">
      <GlobeIcon className="size-4 text-muted-foreground" />
      {routing.locales.map((l) => (
        <Button
          key={l}
          variant={l === locale ? 'default' : 'ghost'}
          size="xs"
          onClick={() => switchLocale(l)}
          className="uppercase font-mono"
        >
          {l}
        </Button>
      ))}
    </div>
  );
}