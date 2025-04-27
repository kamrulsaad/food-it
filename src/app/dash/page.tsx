import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { SiteHeader } from "@/components/dashboard/site-header";
import { authMiddleware } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const user = await authMiddleware();

  if (!user || user.role !== "SUPERADMIN") {
    redirect("/");
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
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
              {/* Your SuperAdmin dashboard content here */}
              <h1 className="text-2xl font-bold">Welcome, Super Admin!</h1>
              <p className="text-muted-foreground">Manage the platform here.</p>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
