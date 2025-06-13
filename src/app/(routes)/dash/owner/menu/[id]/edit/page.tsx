import EditMenuItemForm from "@/components/forms/EditMenuItem";
import { authMiddleware } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";

interface EditMenuItemPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditMenuItemPage({
  params,
}: EditMenuItemPageProps) {
  const { id } = await params;

  const user = await authMiddleware();

  if (!user || user.role !== "RESTATURANT_OWNER") {
    notFound();
  }

  const menuItem = await prisma.menuItem.findUnique({
    where: { id },
  });

  if (!menuItem) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Edit Menu Item</h1>
      <EditMenuItemForm menuItem={menuItem} />
    </div>
  );
}
