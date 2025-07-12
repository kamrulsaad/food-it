// File: /app/(dashboard)/dash/rider/orders/page.tsx

import AvailableOrderList from "./_components/available-order-list";

export default function RiderOrdersPage() {
  return (
    <div className="">
      <h1 className="text-2xl font-bold">Available Orders in Your City</h1>
      <AvailableOrderList />
    </div>
  );
}
