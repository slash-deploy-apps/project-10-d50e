'use client';

import { useTranslations } from 'next-intl';
import { Link } from '~/i18n/navigation';
import { LanguageSwitcher } from '~/components/language-switcher';
import { ThemeToggle } from '~/components/theme-toggle';
import { Button } from '~/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '~/components/ui/sheet';
import { MenuIcon, ZapIcon } from 'lucide-react';
import { useState } from 'react';

export function SiteHeader() {
  const t = useTranslations('nav');
  const tc = useTranslations('common');
  const [open, setOpen] = useState(false);

  const navLinks = [
    { href: '/', label: t('home') },
    { href: '/products', label: t('products') },
    { href: '/quote', label: t('quote') },
    { href: '/about', label: t('about') },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center px-4">
        <Link href="/" className="flex items-center gap-2 font-bold">
          <ZapIcon className="size-5 text-primary" />
          <span className="font-mono text-lg tracking-tight">POWERPLAZA</span>
        </Link>

        <nav className="ml-8 hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <LanguageSwitcher />
          <ThemeToggle />
          <Link href="/admin">
            <Button variant="outline" size="sm">
              {tc('admin')}
            </Button>
          </Link>
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="ml-2 md:hidden">
            <Button variant="ghost" size="icon">
              <MenuIcon className="size-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72">
            <nav className="flex flex-col gap-4 pt-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-lg font-medium"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/admin"
                className="text-lg font-medium text-muted-foreground"
                onClick={() => setOpen(false)}
              >
                {tc('admin')}
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}