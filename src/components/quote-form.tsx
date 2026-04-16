'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { api } from '~/trpc/react';
import { Button } from '~/components/ui/button';
import { Card, CardContent } from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Textarea } from '~/components/ui/textarea';
import { XIcon, PlusIcon, CheckCircleIcon } from 'lucide-react';
import { z } from 'zod';

interface SelectedProduct {
  id: string;
  modelName: string;
  quantity: number;
}

export function QuoteForm() {
  const t = useTranslations('quote');
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [inquiryId, setInquiryId] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { data: searchResults } = api.product.search.useQuery(
    { query: searchQuery },
    { enabled: searchQuery.length > 0 }
  );

  const createInquiry = api.inquiry.create.useMutation();

  const [form, setForm] = useState({
    customerName: '',
    companyName: '',
    email: '',
    phone: '',
    message: '',
  });

  const addProduct = (product: { id: string; modelName: string }) => {
    const existing = selectedProducts.find((p) => p.id === product.id);
    if (existing) {
      setSelectedProducts(
        selectedProducts.map((p) =>
          p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p
        )
      );
    } else {
      setSelectedProducts([...selectedProducts, { ...product, quantity: 1 }]);
    }
    setShowSearch(false);
    setSearchQuery('');
  };

  const removeProduct = (id: string) => {
    setSelectedProducts(selectedProducts.filter((p) => p.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!form.customerName.trim()) newErrors.customerName = t('validation.nameRequired');
    if (!form.email.trim()) newErrors.email = t('validation.emailRequired');
    else if (!z.string().email().safeParse(form.email).success) newErrors.email = t('validation.emailInvalid');
    if (selectedProducts.length === 0) newErrors.products = t('validation.atLeastOneProduct');

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      const result = await createInquiry.mutateAsync({
        ...form,
        items: selectedProducts.map((p) => ({ productId: p.id, quantity: p.quantity })),
      });
      setInquiryId(result.id);
      setSubmitted(true);
    } catch {
      setErrors({ submit: 'Failed to submit inquiry' });
    }
  };

  if (submitted) {
    return (
      <div className="mx-auto max-w-xl py-16 text-center">
        <CheckCircleIcon className="mx-auto size-16 text-green-500" />
        <h2 className="mt-4 text-2xl font-bold">{t('successTitle')}</h2>
        <p className="mt-2 text-muted-foreground">{t('successMessage')}</p>
        <p className="mt-4 text-sm">{t('inquiryNumber')}: <span className="font-mono font-bold">{inquiryId}</span></p>
        <Button className="mt-6" onClick={() => {
          setSubmitted(false);
          setSelectedProducts([]);
          setForm({ customerName: '', companyName: '', email: '', phone: '', message: '' });
        }}>
          {t('anotherInquiry')}
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">{t('selectedProducts')}</h3>
          <Button type="button" variant="outline" size="sm" onClick={() => setShowSearch(true)}>
            <PlusIcon className="mr-1 size-4" />{t('addProduct')}
          </Button>
        </div>

        {showSearch && (
          <Card size="sm">
            <CardContent className="pt-4">
              <Input
                placeholder={t('searchProduct')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchResults && searchResults.length > 0 && (
                <ul className="mt-2 max-h-40 overflow-y-auto border rounded-lg">
                  {searchResults.map((product) => (
                    <li
                      key={product.id}
                      className="cursor-pointer px-3 py-2 hover:bg-muted text-sm"
                      onClick={() => addProduct(product)}
                    >
                      <span className="font-mono">{product.modelName}</span>
                    </li>
                  ))}
                </ul>
              )}
              <Button type="button" variant="ghost" size="sm" className="mt-2" onClick={() => { setShowSearch(false); setSearchQuery(''); }}>
                {t('remove')}
              </Button>
            </CardContent>
          </Card>
        )}

        {selectedProducts.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t('noProductsSelected')}</p>
        ) : (
          <div className="space-y-2">
            {selectedProducts.map((sp) => (
              <div key={sp.id} className="flex items-center justify-between rounded-lg border p-3">
                <span className="font-mono text-sm">{sp.modelName}</span>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Label className="text-xs">{t('quantity')}</Label>
                    <Input
                      type="number"
                      min={1}
                      value={sp.quantity}
                      onChange={(e) =>
                        setSelectedProducts(
                          selectedProducts.map((p) =>
                            p.id === sp.id ? { ...p, quantity: Math.max(1, parseInt(e.target.value) || 1) } : p
                          )
                        )
                      }
                      className="w-16"
                    />
                  </div>
                  <Button type="button" variant="ghost" size="icon-xs" onClick={() => removeProduct(sp.id)}>
                    <XIcon className="size-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
        {errors.products && <p className="text-sm text-destructive">{errors.products}</p>}
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold">{t('customerInfo')}</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <Label htmlFor="name">{t('name')} *</Label>
            <Input
              id="name"
              value={form.customerName}
              onChange={(e) => setForm({ ...form, customerName: e.target.value })}
            />
            {errors.customerName && <p className="text-xs text-destructive">{errors.customerName}</p>}
          </div>
          <div className="space-y-1">
            <Label htmlFor="company">{t('company')}</Label>
            <Input
              id="company"
              value={form.companyName}
              onChange={(e) => setForm({ ...form, companyName: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="email">{t('email')} *</Label>
            <Input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
          </div>
          <div className="space-y-1">
            <Label htmlFor="phone">{t('phone')}</Label>
            <Input
              id="phone"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>
        </div>
        <div className="space-y-1">
          <Label htmlFor="message">{t('message')}</Label>
          <Textarea
            id="message"
            placeholder={t('messagePlaceholder')}
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            rows={4}
          />
        </div>
      </div>

      {errors.submit && <p className="text-sm text-destructive">{errors.submit}</p>}

      <Button type="submit" size="lg" className="w-full" disabled={createInquiry.isPending}>
        {createInquiry.isPending ? '...' : t('submit')}
      </Button>
    </form>
  );
}