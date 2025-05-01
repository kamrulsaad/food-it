// src/app/api/admin/cities/[id]/route.ts

import { authMiddleware } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

interface City {
  params: Promise<{
    id: string;
  }>;
}

export async function PUT(
  req: Request,
  { params }: { params: City["params"] }
) {
  try {
    const { id } = await params;

    const body = await req.json();

    const updated = await prisma.city.update({
      where: { id },
      data: {
        name: body.name,
        imageUrl: body.imageUrl,
      },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error(err);
    return new NextResponse("Failed to update city", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: City["params"] }
) {
  const { id } = await params;

  const user = await authMiddleware();
  if (!user || user.role !== "SUPERADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const city = await prisma.city.findUnique({
    where: { id },
  });

  if (!city) {
    return NextResponse.json({ error: "Item not found" }, { status: 404 });
  }

  const updated = await prisma.city.update({
    where: { id },
    data: { available: !city.available },
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  req: Request,
  { params }: { params: City["params"] }
) {
  try {
    const { id } = await params;

    await prisma.city.delete({
      where: { id },
    });

    return NextResponse.json({ message: "City deleted successfully" });
  } catch (err) {
    console.error(err);
    return new NextResponse("Failed to delete city", { status: 500 });
  }
}
