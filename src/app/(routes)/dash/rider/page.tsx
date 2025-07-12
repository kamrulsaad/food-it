// /app/dash/rider/page.tsx
import { authMiddleware } from "@/lib/auth";
import prisma from "@/lib/prisma";
import AvailabilityToggle from "./_components/availability-toggle";

export default async function RiderDashboardPage() {
  const user = await authMiddleware();

  if (!user || user.role !== "RIDER") {
    return <p className="text-center text-red-500">Unauthorized</p>;
  }

  const rider = await prisma.rider.findUnique({
    where: { email: user.email ?? undefined },
    select: { available: true, name: true },
  });

  if (!rider) {
    return <p className="text-center text-red-500">Rider profile not found</p>;
  }

  return (
    <div className="">
      <h1 className="text-2xl font-semibold">
        Welcome, {rider.name || "Rider"}!
      </h1>
      <AvailabilityToggle initialStatus={rider.available} />
    </div>
  );
}
