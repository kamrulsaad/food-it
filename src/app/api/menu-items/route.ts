import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authMiddleware } from "@/lib/auth";
import { CreateMenuItemSchema } from "@/validations/menu-item";

export async function POST(req: Request) {
  const user = await authMiddleware();
  if (!user || user.role !== "RESTATURANT_OWNER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = CreateMenuItemSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const restaurant = await prisma.restaurant.findUnique({
    where: { ownerId: user.clerkId },
  });

  if (!restaurant) {
    return NextResponse.json({ error: "No restaurant found" }, { status: 404 });
  }

  const { name, description, price, imageUrl } = parsed.data;

  const item = await prisma.menuItem.create({
    data: {
      name,
      description,
      price: parseFloat(price),
      imageUrl,
      restaurantId: restaurant.id,
    },
  });

  return NextResponse.json(item, { status: 201 });
}
