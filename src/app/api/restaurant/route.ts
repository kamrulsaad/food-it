import { authMiddleware } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { CreateRestaurantSchema } from "@/validations/restaurant";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Schema validation
const querySchema = z.object({
  city: z.string().min(1),
  category: z.string().optional(),
  sort: z.enum(["deliveryTime", "price"]).optional(),
});

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const query = Object.fromEntries(url.searchParams.entries());
    const parsed = querySchema.safeParse(query);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid query" }, { status: 400 });
    }

    const { city, category, sort } = parsed.data;

    const restaurants = await prisma.restaurant.findMany({
      where: {
        approved: true,
        cityRef: { name: city },
        ...(category
          ? {
              menuItems: {
                some: {
                  category: {
                    name: category,
                  },
                },
              },
            }
          : {}),
      },
      include: {
        cityRef: true,
        menuItems: {
          where: { available: true },
          select: { price: true, category: { select: { name: true } } },
        },
      },
    });

    const enriched = restaurants.map((r) => ({
      id: r.id,
      name: r.name,
      logo: r.logo,
      coverPhoto: r.coverPhoto,
      deliveryTime: r.deliveryTime,
      deliveryFee: r.deliveryFee,
      categories: Array.from(
        new Set(
          r.menuItems
            .map((item) => item.category?.name)
            .filter((name): name is string => typeof name === "string")
        )
      ),
      minPrice: Math.min(
        ...(r.menuItems.map((item) => item.price) ?? [Infinity])
      ),
    }));

    // Sorting
    if (sort === "deliveryTime") {
      enriched.sort(
        (a, b) => parseInt(a.deliveryTime) - parseInt(b.deliveryTime)
      );
    } else if (sort === "price") {
      enriched.sort((a, b) => a.minPrice - b.minPrice);
    }

    return NextResponse.json(enriched);
  } catch (err) {
    console.error("[API ERROR]", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

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
        cityId: data.cityId,
        state: data.state,
        zipCode: data.zipCode,
        logo: data.logo,
        coverPhoto: data.coverPhoto,
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
