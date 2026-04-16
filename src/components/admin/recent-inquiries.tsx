'use client';

import { api } from '~/trpc/react';
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from '~/components/ui/table';
import { Badge } from '~/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '~/components/ui/card';
import { Spinner } from '~/components/ui/spinner';

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

export function RecentInquiries() {
  const { data: inquiries, isLoading } = api.inquiry.list.useQuery();

  if (isLoading) {
    return <div className="flex justify-center py-12"><Spinner className="size-6" /></div>;
  }

  const recent = (inquiries ?? []).slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle>최근 견적 문의</CardTitle>
      </CardHeader>
      <CardContent>
        {recent.length === 0 ? (
          <p className="text-sm text-muted-foreground">문의가 없습니다</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>고객명</TableHead>
                <TableHead>회사</TableHead>
                <TableHead>상태</TableHead>
                <TableHead>날짜</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recent.map((inquiry) => (
                <TableRow key={inquiry.id}>
                  <TableCell>{inquiry.customerName}</TableCell>
                  <TableCell>{inquiry.companyName ?? '-'}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`${statusColors[inquiry.status] ?? ''} border-0`}>
                      {statusLabels[inquiry.status] ?? inquiry.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">
                    {inquiry.createdAt ? new Date(inquiry.createdAt).toLocaleDateString('ko-KR') : '-'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}