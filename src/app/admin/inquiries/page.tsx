'use client';

import { useState } from 'react';
import { api } from '~/trpc/react';
import { Button } from '~/components/ui/button';
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from '~/components/ui/table';
import { Badge } from '~/components/ui/badge';
import { Spinner } from '~/components/ui/spinner';
import { InquiryDetail } from '~/components/admin/inquiry-detail';
import { EyeIcon } from 'lucide-react';

const statusLabels: Record<string, string> = {
  pending: '대기',
  reviewed: '검토 중',
  replied: '답변 완료',
  closed: '종료',
};

const statusColors: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300',
  reviewed: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  replied: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  closed: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
};

export default function AdminInquiriesPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { data, isLoading } = api.admin.inquiry.list.useQuery({});
  const inquiries = data?.items ?? [];

  if (isLoading) {
    return <div className="flex justify-center py-12"><Spinner className="size-6" /></div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">견적 문의 관리</h1>

      {selectedId && (
        <InquiryDetail inquiryId={selectedId} onClose={() => setSelectedId(null)} />
      )}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>문의 번호</TableHead>
            <TableHead>고객명</TableHead>
            <TableHead>회사명</TableHead>
            <TableHead>이메일</TableHead>
            <TableHead>상태</TableHead>
            <TableHead>날짜</TableHead>
            <TableHead>관리</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {inquiries.map((inquiry) => {
            const status = String(inquiry.status ?? 'pending');
            return (
              <TableRow key={String(inquiry.id)}>
                <TableCell className="font-mono text-xs">{String(inquiry.id).slice(0, 8)}</TableCell>
                <TableCell>{String(inquiry.customerName ?? '')}</TableCell>
                <TableCell>{String(inquiry.companyName ?? '-')}</TableCell>
                <TableCell>{String(inquiry.email ?? '')}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={`${statusColors[status] ?? ''} border-0`}>
                    {statusLabels[status] ?? status}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm">{inquiry.createdAt ? new Date(inquiry.createdAt).toLocaleDateString('ko-KR') : '-'}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedId(String(inquiry.id))}>
                    <EyeIcon className="size-4" />
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}