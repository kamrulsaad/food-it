import prisma from "@/lib/prisma";
import { authMiddleware } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function RestaurantSettingsPage() {
  const user = await authMiddleware();

  if (!user || user.role !== "RESTATURANT_OWNER") {
    redirect("/");
  }

  const restaurant = await prisma.restaurant.findUnique({
    where: { ownerId: user.clerkId },
  });

  if (!restaurant) notFound();

  return (
    <div className="mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Restaurant Info</h1>
        <Button asChild className="cursor-pointer">
          <Link href="/dash/owner/restaurant-details/settings">
            Edit Details
          </Link>
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-8 p-6 border rounded-lg bg-background">
        {/* Left side text */}
        <div className="space-y-4">
          <div>
            <h2 className="text-muted-foreground">Name</h2>
            <p className="text-lg font-semibold">{restaurant.name}</p>
          </div>
          <div>
            <h2 className="text-muted-foreground">Address</h2>
            <p className="text-lg font-semibold">{restaurant.address}</p>
          </div>
          <div>
            <h2 className="text-muted-foreground">City</h2>
            <p className="text-lg font-semibold">{restaurant.city}</p>
          </div>
          <div>
            <h2 className="text-muted-foreground">Zip Code</h2>
            <p className="text-lg font-semibold">{restaurant.zipCode}</p>
          </div>
          <div>
            <h2 className="text-muted-foreground">State</h2>
            <p className="text-lg font-semibold">{restaurant.state}</p>
          </div>
        </div>

        {/* Right side logo */}
        <div className="flex items-center justify-center">
          {restaurant.logo ? (
            <div className="relative w-48 h-48">
              <Image
                src={restaurant.logo}
                alt="Restaurant Logo"
                fill
                className="object-contain rounded-lg"
              />
            </div>
          ) : (
            <div className="w-48 h-48 flex items-center justify-center border rounded-lg bg-muted">
              <span className="text-sm text-muted-foreground">No Logo</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
