import { Skeleton } from "@/components/global/skeleton";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { SiteHeader } from "@/components/dashboard/site-header";

export default function LoadingRestaurantsPage() {
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

        <div className="p-6 space-y-6">
          <Skeleton className="h-8 w-1/3" /> {/* fake page title */}

          <div className="border rounded-lg overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Owner Email</th>
                  <th className="p-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 5 }).map((_, idx) => (
                  <tr key={idx} className="hover:bg-accent">
                    <td className="p-3">
                      <Skeleton className="h-4 w-32 rounded" />
                    </td>
                    <td className="p-3">
                      <Skeleton className="h-4 w-48 rounded" />
                    </td>
                    <td className="p-3">
                      <Skeleton className="h-4 w-24 rounded" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </SidebarInset>
    </SidebarProvider>
  );
}
