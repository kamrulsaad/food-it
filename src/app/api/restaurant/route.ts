import { authMiddleware } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { CreateRestaurantSchema } from "@/validations/restaurant";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = CreateRestaurantSchema.parse(body);

    const restaurant = await prisma.restaurant.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address,
        cityId: data.cityId || null,
        state: data.state,
        zipCode: data.zipCode,
        logo: data.logo,
        coverPhoto: data.coverPhoto || null,
        openingTime: data.openingTime,
        closingTime: data.closingTime,
        workingDays: data.workingDays,
        deliveryTime: data.deliveryTime,
        deliveryFee: data.deliveryFee,
        ownerId: data.ownerId,
      },
    });

    await prisma.user.update({
      where: { clerkId: data.ownerId },
      data: { role: "RESTATURANT_OWNER" },
    });

    return NextResponse.json(restaurant, { status: 201 });
  } catch (error) {
    console.error("Create Restaurant Error:", error);
  }
}

export async function PUT(req: Request) {
  const user = await authMiddleware();
  if (!user || user.role !== "RESTATURANT_OWNER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  const restaurant = await prisma.restaurant.update({
    where: { ownerId: user.clerkId },
    data: {
      name: body.name,
      address: body.address,
      zipCode: body.zipCode,
      state: body.state,
      logo: body.logo,
    },
  });

  return NextResponse.json(restaurant);
}
