import CreateRestaurantSchema from "@/validations/restaurant";
import prisma from "@/lib/prisma";
import { authMiddleware } from "@/lib/auth";
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
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
        logo: data.logo,
        ownerId: data.ownerId,
      },
    });

    // Update user's role to RESTAURANT_OWNER
    await prisma.user.update({
      where: { clerkId: data.ownerId },
      data: {
        role: "RESTATURANT_OWNER",
      },
    });

    return Response.json(restaurant);
  } catch (error) {
    console.error(error);
    return new Response("Internal Server Error", { status: 500 });
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
      city: body.city,
      zipCode: body.zipCode,
      state: body.state,
      logo: body.logo,
    },
  });

  return NextResponse.json(restaurant);
}
