import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

interface MenuItemPageProps {
  params: Promise<{ id: string }>;
}

export default async function MenuItemPage({ params }: MenuItemPageProps) {
  const { id } = await params;

  const menuItem = await prisma.menuItem.findUnique({
    where: { id },
  });

  if (!menuItem) notFound();

  return (
    <div className="flex flex-col md:flex-row gap-10">
      {/* Left: Details */}
      <div className="flex-1 space-y-4">
        <h1 className="text-2xl font-bold">{menuItem.name}</h1>
        <p className="text-sm text-gray-500">ID: {menuItem.id}</p>
        <p className="text-sm text-gray-500">
          Created At: {new Date(menuItem.createdAt).toLocaleString()}
        </p>
        <p className="text-gray-700">
          {menuItem.description || "No description available."}
        </p>
        <p className="text-lg font-semibold text-orange-600">
          ৳ {Number(menuItem.price).toFixed(2)}
        </p>
        <p className="text-sm">
          Status: {menuItem.available ? "Available" : "Unavailable"}
        </p>
        <Link
          href={`/dash/owner/menu/${menuItem.id}/edit`}
          className="inline-block mt-4 px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-orange-700 transition cursor-pointer"
        >
          Edit Item
        </Link>
      </div>

      {/* Right: Image */}
      {menuItem.imageUrl && (
        <div className="relative w-full md:w-1/2 h-64">
          <Image
            src={menuItem.imageUrl}
            alt={menuItem.name}
            fill
            className="rounded-md object-contain"
          />
        </div>
      )}
    </div>
  );
}
