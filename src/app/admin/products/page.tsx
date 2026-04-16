import { AdminProductList } from './product-list-client';

export default function AdminProductsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">제품 관리</h1>
      <AdminProductList />
    </div>
  );
}