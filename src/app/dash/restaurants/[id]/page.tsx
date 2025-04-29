import prisma from "@/lib/prisma";
import { authMiddleware } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { SiteHeader } from "@/components/dashboard/site-header";
import { revalidatePath } from "next/cache";
import { ApproveRestaurantButton } from "@/components/dashboard/approve-restaurant-button";

export default async function RestaurantDetailsPage({
  params,
}: {
  params: {
    id: string;
  };
}) {
  const user = await authMiddleware();

  if (!user || (user.role !== "SUPERADMIN" && user.role !== "ADMIN")) {
    redirect("/");
  }

  const restaurant = await prisma.restaurant.findUnique({
    where: {
      id: params.id,
    },
    include: {
      owner: true,
    },
  });

  if (!restaurant) {
    notFound();
  }

  async function approveRestaurant() {
    "use server";

    await prisma.restaurant.update({
      where: {
        id: params.id,
      },
      data: {
        approved: true,
      },
    });

    revalidatePath("/dash/restaurants");
    redirect("/dash/restaurants");
  }

  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "calc(var(--spacing) * 72)",
        "--header-height": "calc(var(--spacing) * 12)",
      }}
    >
      <AppSidebar />
      <SidebarInset>
        <SiteHeader />
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">{restaurant.name}</h1>

          <div className="grid gap-4">
            <div className="border rounded-lg p-4">
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
                <strong>City:</strong> {restaurant.city}
              </p>
              <p>
                <strong>State:</strong> {restaurant.state}
              </p>
              <p>
                <strong>Zip Code:</strong> {restaurant.zipCode}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                {restaurant.approved ? "Approved" : "Pending Approval"}
              </p>
            </div>

            <div className="border rounded-lg p-4">
              <h2 className="font-semibold text-lg mb-2">Owner Info</h2>
              <p>
                <strong>Name:</strong> {restaurant.owner?.email || "N/A"}
              </p>
              <p>
                <strong>Clerk ID:</strong> {restaurant.owner?.clerkId || "N/A"}
              </p>
            </div>

            {!restaurant.approved && (
              <ApproveRestaurantButton approveRestaurant={approveRestaurant} />
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
