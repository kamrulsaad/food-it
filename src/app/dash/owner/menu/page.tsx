import { authMiddleware } from "@/lib/auth";
import prisma from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";

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
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Menu Items</h1>
        <Link
          href="/dash/owner/menu/new"
          className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-orange-700 transition cursor-pointer"
        >
          + Add New Item
        </Link>
      </div>

      {menuItems.length === 0 ? (
        <p className="text-sm text-gray-600">
          No items found. Add your first one.
        </p>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {menuItems.map((item) => (
            <li
              key={item.id}
              className="p-4 border rounded-md bg-white shadow-sm"
            >
              {item.imageUrl && (
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  width={400}
                  height={300}
                  className="rounded mb-3 object-cover w-full h-40"
                />
              )}
              <h3 className="text-lg font-bold">{item.name}</h3>
              <p className="text-sm text-gray-700">{item.description}</p>
              <p className="text-orange-600 font-medium mt-2">
                ৳ {item.price.toFixed(2)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {item.available ? "Available" : "Not available"}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
