// src/app/api/admin/categories/[id]/route.ts

import { authMiddleware } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

interface Category {
  params: Promise<{
    id: string;
  }>;
}

export async function PUT(
  req: Request,
  { params }: { params: Category["params"] }
) {
  try {
    const { id } = await params;

    const body = await req.json();

    const updated = await prisma.category.update({
      where: { id },
      data: {
        name: body.name,
        imageUrl: body.imageUrl,
      },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error(err);
    return new NextResponse("Failed to update Category", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const user = await authMiddleware();
  if (!user || user.role !== "SUPERADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const category = await prisma.category.findUnique({
    where: { id: params.id },
  });

  if (!category) {
    return NextResponse.json({ error: "Item not found" }, { status: 404 });
  }

  const updated = await prisma.category.update({
    where: { id: params.id },
    data: { available: !category.available },
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  req: Request,
  { params }: { params: Category["params"] }
) {
  try {
    const { id } = await params;

    await prisma.category.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Category deleted successfully" });
  } catch (err) {
    console.error(err);
    return new NextResponse("Failed to delete category", { status: 500 });
  }
}
