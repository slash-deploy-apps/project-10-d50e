'use client';

import { useState } from 'react';
import { Button } from '~/components/ui/button';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '~/components/ui/dialog';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Textarea } from '~/components/ui/textarea';

interface CategoryFormProps {
  onClose: () => void;
}

export function CategoryForm({ onClose }: CategoryFormProps) {
  const [form, setForm] = useState({
    name: '',
    nameEn: '',
    slug: '',
    description: '',
    descriptionEn: '',
  });

  return (
    <Dialog open onOpenChange={() => onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>카테고리 추가</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>이름 (한국어)</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>이름 (English)</Label>
              <Input value={form.nameEn} onChange={(e) => setForm({ ...form, nameEn: e.target.value })} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>슬러그</Label>
            <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="dc-dc" />
          </div>
          <div className="space-y-2">
            <Label>설명 (한국어)</Label>
            <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>설명 (English)</Label>
            <Textarea value={form.descriptionEn} onChange={(e) => setForm({ ...form, descriptionEn: e.target.value })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>취소</Button>
          <Button>추가</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}