import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { SiteHeader } from "@/components/dashboard/site-header";
import prisma from "@/lib/prisma";
import { authMiddleware } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";

export default async function ApprovalsPage() {
  const user = await authMiddleware();

  if (!user || user.role !== "SUPERADMIN") {
    redirect("/");
  }

  const pendingRestaurants = await prisma.restaurant.findMany({
    where: { approved: false },
  });

  async function approveRestaurant(formData: FormData) {
    "use server";

    const id = formData.get("id") as string;
    if (!id) return;

    await prisma.restaurant.update({
      where: { id },
      data: { approved: true },
    });
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col gap-6 p-6">
          <h1 className="text-2xl font-bold">Pending Restaurants</h1>
          <div className="flex flex-col gap-4">
            {pendingRestaurants.length === 0 ? (
              <p className="text-muted-foreground">No pending applications!</p>
            ) : (
              pendingRestaurants.map((restaurant) => (
                <form
                  key={restaurant.id}
                  action={approveRestaurant}
                  className="flex items-center justify-between border p-4 rounded-lg"
                >
                  <div>
                    <h2 className="text-lg font-semibold">{restaurant.name}</h2>
                    <p className="text-sm text-muted-foreground">
                      {restaurant.email}
                    </p>
                  </div>
                  <input type="hidden" name="id" value={restaurant.id} />
                  <Button type="submit" variant="default">
                    Approve
                  </Button>
                </form>
              ))
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
