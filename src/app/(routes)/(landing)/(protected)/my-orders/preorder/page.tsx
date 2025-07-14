// app/(routes)/(landing)/(protected)/my-orders/preorder/page.tsx
import PreOrderList from "./_components/PreOrderList";

export default function MyPreOrdersPage() {
  return (
    <div className="mx-auto">
      <h2 className="text-2xl font-bold mb-4">My Pre-Orders</h2>
      <PreOrderList />
    </div>
  );
}
