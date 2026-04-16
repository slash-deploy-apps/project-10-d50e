'use client';

import { useState } from 'react';
import { Button } from '~/components/ui/button';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '~/components/ui/dialog';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Textarea } from '~/components/ui/textarea';

interface SeriesFormProps {
  categoryId: string;
  onClose: () => void;
}

export function SeriesForm({ onClose }: SeriesFormProps) {
  const [form, setForm] = useState({
    name: '',
    slug: '',
    description: '',
    descriptionEn: '',
  });

  return (
    <Dialog open onOpenChange={() => onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>시리즈 추가</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>시리즈 이름</Label>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>슬러그</Label>
            <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="series-name" />
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