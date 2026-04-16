'use client';

import { useState } from 'react';
import { api } from '~/trpc/react';
import { Button } from '~/components/ui/button';
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from '~/components/ui/table';
import { Badge } from '~/components/ui/badge';
import { Spinner } from '~/components/ui/spinner';
import { PlusIcon, PencilIcon } from 'lucide-react';
import { ProductForm } from '~/components/admin/product-form';

export function AdminProductList() {
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const { data, isLoading } = api.product.list.useQuery({ page, limit: 20 });

  if (isLoading) {
    return <div className="flex justify-center py-12"><Spinner className="size-6" /></div>;
  }

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <Button onClick={() => { setEditId(null); setShowForm(true); }}>
          <PlusIcon className="mr-1 size-4" />제품 추가
        </Button>
      </div>

      {showForm && (
        <ProductForm
          productId={editId}
          onClose={() => { setShowForm(false); setEditId(null); }}
        />
      )}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>모델명</TableHead>
            <TableHead>시리즈</TableHead>
            <TableHead>입력 전압</TableHead>
            <TableHead>출력 전압</TableHead>
            <TableHead>상태</TableHead>
            <TableHead>관리</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {(data?.items ?? []).map((product) => (
            <TableRow key={product.id}>
              <TableCell className="font-mono">{product.modelName}</TableCell>
              <TableCell>{product.series?.name ?? '-'}</TableCell>
              <TableCell>{product.inputVoltage ?? '-'}</TableCell>
              <TableCell>{product.outputVoltage ?? '-'}</TableCell>
              <TableCell>
                <Badge variant={product.status === 'active' ? 'default' : 'secondary'}>
                  {product.status === 'active' ? '판매 중' : '단종'}
                </Badge>
              </TableCell>
              <TableCell>
                <Button variant="ghost" size="icon-xs" onClick={() => { setEditId(product.id); setShowForm(true); }}>
                  <PencilIcon className="size-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="mt-4 flex items-center justify-between">
        <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>
          이전
        </Button>
        <span className="text-sm text-muted-foreground">{page} / {data?.totalPages ?? 1}</span>
        <Button variant="outline" size="sm" disabled={page >= (data?.totalPages ?? 1)} onClick={() => setPage(page + 1)}>
          다음
        </Button>
      </div>
    </div>
  );
}