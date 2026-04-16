'use client';

import { api } from '~/trpc/react';
import { Card, CardHeader, CardTitle, CardContent } from '~/components/ui/card';
import { PackageIcon, MessageSquareIcon, FolderIcon, ClockIcon } from 'lucide-react';

export function DashboardStats() {
  const { data: stats } = api.admin.dashboard.stats.useQuery();

  const items = [
    {
      title: '전체 제품',
      value: stats?.totalProducts ?? 0,
      icon: PackageIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: '카테고리',
      value: stats?.totalCategories ?? 0,
      icon: FolderIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: '견적 문의',
      value: stats?.totalInquiries ?? 0,
      icon: MessageSquareIcon,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
    },
    {
      title: '대기 중 문의',
      value: stats?.pendingInquiries ?? 0,
      icon: ClockIcon,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className={`${stat.bgColor} ${stat.color} rounded-lg p-2`}>
                <Icon className="size-4" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stat.value}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}