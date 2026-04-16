'use client';

import { useState } from 'react';
import { api } from '~/trpc/react';
import { Button } from '~/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '~/components/ui/card';
import { Spinner } from '~/components/ui/spinner';
import { PlusIcon } from 'lucide-react';
import { CategoryForm } from '~/components/admin/category-form';
import { SeriesForm } from '~/components/admin/series-form';

export function AdminCategoryList() {
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showSeriesForm, setShowSeriesForm] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const { data: categories, isLoading } = api.category.list.useQuery();

  if (isLoading) {
    return <div className="flex justify-center py-12"><Spinner className="size-6" /></div>;
  }

  return (
    <div>
      <div className="mb-4 flex gap-2">
        <Button onClick={() => setShowCategoryForm(true)}>
          <PlusIcon className="mr-1 size-4" />카테고리 추가
        </Button>
      </div>

      {showCategoryForm && (
        <CategoryForm onClose={() => setShowCategoryForm(false)} />
      )}

      {showSeriesForm && selectedCategoryId && (
        <SeriesForm categoryId={selectedCategoryId} onClose={() => setShowSeriesForm(false)} />
      )}

      <div className="space-y-4">
        {(categories ?? []).map((cat) => (
          <Card key={cat.id}>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>{cat.name} / {cat.nameEn}</CardTitle>
                <p className="text-sm text-muted-foreground">{cat.slug}</p>
              </div>
              <Button size="sm" variant="outline" onClick={() => { setSelectedCategoryId(cat.id); setShowSeriesForm(true); }}>
                <PlusIcon className="mr-1 size-4" />시리즈 추가
              </Button>
            </CardHeader>
            <CardContent>
              {(cat.series ?? []).length === 0 ? (
                <p className="text-sm text-muted-foreground">시리즈가 없습니다</p>
              ) : (
                <div className="space-y-2">
                  {cat.series.map((s) => (
                    <div key={s.id} className="flex items-center justify-between rounded-lg border p-3">
                      <div>
                        <span className="font-mono font-medium">{s.name}</span>
                        <span className="ml-2 text-sm text-muted-foreground">{s.slug}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}