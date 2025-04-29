import prisma from "@/lib/prisma";
import { authMiddleware } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import RestaurantSettingsForm from "@/components/forms/UpdateRestaurant";

export default async function RestaurantSettingsEditPage() {
  const user = await authMiddleware();

  if (!user || user.role !== "RESTATURANT_OWNER") {
    redirect("/");
  }

  const restaurant = await prisma.restaurant.findUnique({
    where: { ownerId: user.clerkId },
  });

  if (!restaurant) notFound();

  return (
    <div className="space-y-6">
      <RestaurantSettingsForm restaurant={restaurant} />
    </div>
  );
}
