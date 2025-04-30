import prisma from "@/lib/prisma";
import { authMiddleware } from "@/lib/auth";
import { redirect } from "next/navigation";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "@/components/columns/cities/city-columns";
import { CityFormModal } from "./_components/CreateCityModal";

export default async function CitiesPage() {
  const user = await authMiddleware();

  if (!user || user.role !== "SUPERADMIN") {
    redirect("/");
  }

  const cities = await prisma.city.findMany();

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Manage Cities</h1>
        <CityFormModal />
      </div>
      <DataTable columns={columns} data={cities} />
    </div>
  );
}
