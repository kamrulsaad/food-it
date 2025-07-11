import prisma from "@/lib/prisma";
import { authMiddleware } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import { ApproveRiderButton } from "@/components/dashboard/approve-rider-button";

export default async function RiderDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await authMiddleware();

  if (!user || (user.role !== "SUPERADMIN" && user.role !== "ADMIN")) {
    redirect("/");
  }

  const rider = await prisma.rider.findUnique({
    where: {
      id,
    },
    include: {
      city: true,
    },
  });

  if (!rider) {
    notFound();
  }

  async function approveRider() {
    "use server";
    await prisma.rider.update({
      where: { id },
      data: { approved: true },
    });

    redirect("/dash/admin/riders");
  }

  return (
    <div>
      <h1 className="text-3xl font-bold">{rider.name}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
        {/* Rider Info */}
        <div className="border rounded-lg p-4 space-y-2">
          <h2 className="font-semibold text-lg mb-2">Rider Info</h2>
          <p>
            <strong>Email:</strong> {rider.email}
          </p>
          <p>
            <strong>Phone:</strong> {rider.phone}
          </p>
          <p>
            <strong>Address:</strong> {rider.address}
          </p>
          <p>
            <strong>City:</strong> {rider.city?.name || "N/A"}
          </p>
          <p>
            <strong>State:</strong> {rider.state}
          </p>
          <p>
            <strong>Zip Code:</strong> {rider.zipCode}
          </p>

          <p>
            <strong>Status:</strong>{" "}
            {rider.approved ? "✅ Approved" : "⏳ Pending Approval"}
          </p>
        </div>

        {/* Rider Media */}
        <div className="space-y-4"></div>
      </div>

      {!rider.approved && <ApproveRiderButton approveRider={approveRider} />}
    </div>
  );
}
