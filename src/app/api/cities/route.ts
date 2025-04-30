// /app/api/cities/route.ts
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const cities = await prisma.city.findMany({
      where: { available: true },
      select: { id: true, name: true },
    });

    return NextResponse.json(cities);
  } catch (error) {
    console.error("Error fetching cities:", error);
    return new NextResponse("Failed to fetch cities", { status: 500 });
  }
}

export async function POST(req: Request) {
  const body = await req.json();
  const city = await prisma.city.create({ data: body });
  return NextResponse.json(city);
}
