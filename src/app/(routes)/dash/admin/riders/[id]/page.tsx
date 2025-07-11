import prisma from "@/lib/prisma";
import { authMiddleware } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import { ApproveRestaurantButton } from "@/components/dashboard/approve-restaurant-button";
import Image from "next/image";

export default async function RestaurantDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await authMiddleware();

  if (!user || (user.role !== "SUPERADMIN" && user.role !== "ADMIN")) {
    redirect("/");
  }

  const restaurant = await prisma.restaurant.findUnique({
    where: {
      id,
    },
    include: {
      owner: true,
      cityRef: true,
    },
  });

  if (!restaurant) {
    notFound();
  }

  async function approveRestaurant() {
    "use server";
    await prisma.restaurant.update({
      where: { id },
      data: { approved: true },
    });

    redirect("/dash/admin/restaurants");
  }

  return (
    <div>
      <h1 className="text-3xl font-bold">{restaurant.name}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
        {/* Restaurant Info */}
        <div className="border rounded-lg p-4 space-y-2">
          <h2 className="font-semibold text-lg mb-2">Restaurant Info</h2>
          <p>
            <strong>Email:</strong> {restaurant.email}
          </p>
          <p>
            <strong>Phone:</strong> {restaurant.phone}
          </p>
          <p>
            <strong>Address:</strong> {restaurant.address}
          </p>
          <p>
            <strong>City:</strong> {restaurant.cityRef?.name || "N/A"}
          </p>
          <p>
            <strong>State:</strong> {restaurant.state}
          </p>
          <p>
            <strong>Zip Code:</strong> {restaurant.zipCode}
          </p>
          <p>
            <strong>Delivery Fee:</strong> ৳{restaurant.deliveryFee}
          </p>
          <p>
            <strong>Delivery Time:</strong> {restaurant.deliveryTime}
          </p>
          <p>
            <strong>Opening Time:</strong> {restaurant.openingTime || "N/A"}
          </p>
          <p>
            <strong>Closing Time:</strong> {restaurant.closingTime || "N/A"}
          </p>
          <p>
            <strong>Working Days:</strong>{" "}
            {restaurant.workingDays && restaurant.workingDays.length > 0
              ? restaurant.workingDays.join(", ")
              : "N/A"}
          </p>
          <p>
            <strong>Status:</strong>{" "}
            {restaurant.approved ? "✅ Approved" : "⏳ Pending Approval"}
          </p>
        </div>

        {/* Restaurant Media */}
        <div className="space-y-4">
          {restaurant.logo && (
            <div>
              <p className="font-medium">Logo</p>
              <Image
                src={restaurant.logo}
                alt="Restaurant Logo"
                width={200}
                height={200}
                className="rounded border object-contain"
              />
            </div>
          )}
          {restaurant.coverPhoto && (
            <div>
              <p className="font-medium">Cover Photo</p>
              <Image
                src={restaurant.coverPhoto}
                alt="Cover"
                width={600}
                height={200}
                className="rounded border object-cover"
              />
            </div>
          )}
        </div>

        {/* Owner Info */}
        <div className="border rounded-lg p-4 space-y-2 col-span-full">
          <h2 className="font-semibold text-lg mb-2">Owner Info</h2>
          <p>
            <strong>ID:</strong> {restaurant.owner?.clerkId || "N/A"}
          </p>
          <p>
            <strong>Email:</strong> {restaurant.owner?.email || "N/A"}
          </p>
        </div>
      </div>

      {!restaurant.approved && (
        <ApproveRestaurantButton approveRestaurant={approveRestaurant} />
      )}
    </div>
  );
}
