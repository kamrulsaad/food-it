import { authMiddleware } from "@/lib/auth";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { DataTable } from "@/components/ui/data-table";
import { PlusIcon } from "lucide-react";
import { menuColumns } from "@/components/columns/menu-items";

export default async function MenuPage() {
  const user = await authMiddleware();

  if (!user || user.role !== "RESTATURANT_OWNER") {
    return <div>Unauthorized</div>;
  }

  const restaurant = await prisma.restaurant.findUnique({
    where: { ownerId: user.clerkId },
  });

  if (!restaurant) {
    return <div>You don&apos;t have a restaurant registered.</div>;
  }

  const menuItems = await prisma.menuItem.findMany({
    where: {
      restaurantId: restaurant.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Menu Items</h1>
        <Link
          href="/dash/owner/menu/new"
          className="px-4 py-2 bg-orange-600 text-white rounded-md text-sm font-medium hover:bg-orange-700 transition cursor-pointer flex items-center gap-2"
        >
          <PlusIcon className="h-4" /> Add New Item
        </Link>
      </div>
      <DataTable columns={menuColumns} data={menuItems} />
    </div>
  );
}
