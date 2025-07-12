import prisma from "@/lib/prisma";
import { OrdersTable } from "./_components/OrdersTable";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: true,
      restaurant: true,
    },
  });

  return (
    <div className="">
      <h1 className="text-2xl font-bold">All Orders</h1>
      <OrdersTable orders={orders} />
    </div>
  );
}
