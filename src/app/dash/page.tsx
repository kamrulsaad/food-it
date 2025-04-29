import { currentUser } from "@clerk/nextjs/server";

export default async function DashboardPage() {
  const user = await currentUser();
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
          <h1 className="text-2xl font-bold">Welcome, {user?.fullName}!</h1>
          <p className="text-muted-foreground">Manage your platform here.</p>
        </div>
      </div>
    </div>
  );
}
