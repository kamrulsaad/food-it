import prisma from "@/lib/prisma";
import { authMiddleware } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function RidersPage() {
  const user = await authMiddleware();

  if (!user || (user.role !== "SUPERADMIN" && user.role !== "ADMIN")) {
    redirect("/");
  }

  const riders = await prisma.rider.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Riders</h1>

      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Approved</th>
            </tr>
          </thead>
          <tbody>
            {riders.map((rider) => (
              <tr key={rider.id} className="hover:bg-accent">
                <td className="p-3">
                  <Link
                    href={`/dash/admin/riders/${rider.id}`}
                    className="text-primary underline cursor-pointer"
                  >
                    {rider.name}
                  </Link>
                </td>
                <td className="p-3">{rider?.email || "N/A"}</td>
                <td className="p-3">
                  {rider.available ? (
                    <span className="text-green-600 font-semibold">
                      Approved
                    </span>
                  ) : (
                    <span className="text-yellow-600 font-semibold">
                      Pending
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
