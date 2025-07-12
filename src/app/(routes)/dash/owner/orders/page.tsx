// /app/dash/owner/orders/page.tsx
import OrderTable from "./_components/order-table";

export default function OwnerOrdersPage() {
  return (
    <div className="">
      <h1 className="text-2xl font-semibold">Manage Orders</h1>
      <OrderTable />
    </div>
  );
}
