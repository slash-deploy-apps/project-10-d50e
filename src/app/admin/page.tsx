import { DashboardStats } from '~/components/admin/dashboard-stats';
import { RecentInquiries } from '~/components/admin/recent-inquiries';

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">대시보드</h1>
      <DashboardStats />
      <RecentInquiries />
    </div>
  );
}