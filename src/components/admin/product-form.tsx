'use client';

import { useState } from 'react';
import { api } from '~/trpc/react';
import { Button } from '~/components/ui/button';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '~/components/ui/dialog';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '~/components/ui/select';

interface ProductFormProps {
  productId: string | null;
  onClose: () => void;
}

export function ProductForm({ productId, onClose }: ProductFormProps) {
  const { data: categories } = api.category.list.useQuery();

  const [form, setForm] = useState({
    modelName: '',
    slug: '',
    seriesId: '',
    inputVoltage: '',
    outputVoltage: '',
    outputCurrent: '',
    outputType: '',
    price: '',
    status: 'active',
  });

  const seriesOptions = categories?.flatMap((cat) =>
    (cat.series ?? []).map((s) => ({ value: s.id, label: `${cat.name} > ${s.name}` }))
  ) ?? [];

  return (
    <Dialog open onOpenChange={() => onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{productId ? '제품 수정' : '제품 추가'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>시리즈</Label>
            <Select value={form.seriesId} onValueChange={(v) => setForm({ ...form, seriesId: v })}>
              <SelectTrigger><SelectValue placeholder="시리즈 선택" /></SelectTrigger>
              <SelectContent>
                {seriesOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>모델명</Label>
              <Input value={form.modelName} onChange={(e) => setForm({ ...form, modelName: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>슬러그</Label>
              <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>입력 전압</Label>
              <Input value={form.inputVoltage} onChange={(e) => setForm({ ...form, inputVoltage: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>출력 전압</Label>
              <Input value={form.outputVoltage} onChange={(e) => setForm({ ...form, outputVoltage: e.target.value })} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>출력 전류</Label>
              <Input value={form.outputCurrent} onChange={(e) => setForm({ ...form, outputCurrent: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>출력 타입</Label>
              <Input value={form.outputType} onChange={(e) => setForm({ ...form, outputType: e.target.value })} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>가격</Label>
              <Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>상태</Label>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">판매 중</SelectItem>
                  <SelectItem value="inactive">단종</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>취소</Button>
          <Button>{productId ? '수정' : '추가'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}