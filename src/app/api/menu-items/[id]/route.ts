import { authMiddleware } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { CreateMenuItemSchema } from "@/validations/menu-item";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const user = await authMiddleware();
  if (!user || user.role !== "RESTATURANT_OWNER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = CreateMenuItemSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const updated = await prisma.menuItem.update({
    where: { id: params.id },
    data: {
      name: parsed.data.name,
      description: parsed.data.description,
      price: parseInt(parsed.data.price),
      imageUrl: parsed.data.imageUrl,
    },
  });

  return NextResponse.json(updated);
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const user = await authMiddleware();
  if (!user || user.role !== "RESTATURANT_OWNER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const menuItem = await prisma.menuItem.findUnique({
    where: { id: params.id },
  });

  if (!menuItem) {
    return NextResponse.json({ error: "Item not found" }, { status: 404 });
  }

  const updated = await prisma.menuItem.update({
    where: { id: params.id },
    data: { available: !menuItem.available },
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const user = await authMiddleware();
  if (!user || user.role !== "RESTATURANT_OWNER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const item = await prisma.menuItem.findUnique({
    where: { id: params.id },
  });

  if (!item) {
    return NextResponse.json({ error: "Item not found" }, { status: 404 });
  }

  await prisma.menuItem.delete({
    where: { id: params.id },
  });

  return NextResponse.json({ message: "Deleted successfully" });
}
