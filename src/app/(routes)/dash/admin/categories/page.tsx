import prisma from "@/lib/prisma";
import { authMiddleware } from "@/lib/auth";
import { redirect } from "next/navigation";
import { DataTable } from "@/components/ui/data-table";
import { CreateCategoryModal } from "./_components/CreateCategoryModal";
import { categoryColumns } from "@/components/columns/categories/category-columns";

export default async function CitiesPage() {
  const user = await authMiddleware();

  if (!user || user.role !== "SUPERADMIN") {
    redirect("/");
  }

  const categories = await prisma.category.findMany();

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Manage Categories</h1>
        <CreateCategoryModal />
      </div>
      <DataTable columns={categoryColumns} data={categories} />
    </div>
  );
}
