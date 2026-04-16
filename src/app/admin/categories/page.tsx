import { AdminCategoryList } from './category-list-client';

export default function AdminCategoriesPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">카테고리 & 시리즈 관리</h1>
      <AdminCategoryList />
    </div>
  );
}