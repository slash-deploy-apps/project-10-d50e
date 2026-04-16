'use client';

import { api } from '~/trpc/react';
import { Button } from '~/components/ui/button';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '~/components/ui/dialog';
import { Badge } from '~/components/ui/badge';
import { Spinner } from '~/components/ui/spinner';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '~/components/ui/select';
import { Textarea } from '~/components/ui/textarea';
import { Label } from '~/components/ui/label';

const statusLabels: Record<string, string> = {
  pending: '대기',
  reviewed: '검토 중',
  replied: '답변 완료',
  closed: '종료',
};

const statusColors: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-800',
  reviewed: 'bg-blue-100 text-blue-800',
  replied: 'bg-green-100 text-green-800',
  closed: 'bg-gray-100 text-gray-800',
};

interface InquiryDetailProps {
  inquiryId: string;
  onClose: () => void;
}

export function InquiryDetail({ inquiryId, onClose }: InquiryDetailProps) {
  const { data: inquiries } = api.inquiry.list.useQuery();
  const inquiry = inquiries?.find((i) => i.id === inquiryId);

  if (!inquiry) {
    return (
      <Dialog open onOpenChange={() => onClose()}>
        <DialogContent>
          <div className="flex justify-center py-12"><Spinner className="size-6" /></div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open onOpenChange={() => onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>문의 상세</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">고객명</p>
              <p className="font-medium">{inquiry.customerName}</p>
            </div>
            <div>
              <p className="text-muted-foreground">회사명</p>
              <p className="font-medium">{inquiry.companyName ?? '-'}</p>
            </div>
            <div>
              <p className="text-muted-foreground">이메일</p>
              <p className="font-medium">{inquiry.email}</p>
            </div>
            <div>
              <p className="text-muted-foreground">연락처</p>
              <p className="font-medium">{inquiry.phone ?? '-'}</p>
            </div>
          </div>
          <div>
            <p className="mb-1 text-sm text-muted-foreground">상태</p>
            <Badge variant="outline" className={`${statusColors[inquiry.status] ?? ''} border-0`}>
              {statusLabels[inquiry.status] ?? inquiry.status}
            </Badge>
          </div>
          {inquiry.message && (
            <div>
              <p className="mb-1 text-sm text-muted-foreground">문의 내용</p>
              <p className="rounded-lg border p-3 text-sm">{inquiry.message}</p>
            </div>
          )}
          <div>
            <Label>상태 변경</Label>
            <Select defaultValue={inquiry.status}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">대기</SelectItem>
                <SelectItem value="reviewed">검토 중</SelectItem>
                <SelectItem value="replied">답변 완료</SelectItem>
                <SelectItem value="closed">종료</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>관리자 메모</Label>
            <Textarea placeholder="메모를 입력하세요" defaultValue={inquiry.adminNote ?? ''} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>닫기</Button>
          <Button>저장</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}