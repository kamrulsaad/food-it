import prisma from "@/lib/prisma";
import { authMiddleware } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function RestaurantsPage() {
  const user = await authMiddleware();

  if (!user || (user.role !== "SUPERADMIN" && user.role !== "ADMIN")) {
    redirect("/");
  }

  const restaurants = await prisma.restaurant.findMany({
    include: {
      owner: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Restaurants</h1>

      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Owner Email</th>
              <th className="p-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {restaurants.map((restaurant) => (
              <tr key={restaurant.id} className="hover:bg-accent">
                <td className="p-3">
                  <Link
                    href={`/dash/admin/restaurants/${restaurant.id}`}
                    className="text-primary underline cursor-pointer"
                  >
                    {restaurant.name}
                  </Link>
                </td>
                <td className="p-3">{restaurant.owner?.email || "N/A"}</td>
                <td className="p-3">
                  {restaurant.approved ? (
                    <span className="text-green-600 font-semibold">
                      Approved
                    </span>
                  ) : (
                    <span className="text-yellow-600 font-semibold">
                      Pending
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
