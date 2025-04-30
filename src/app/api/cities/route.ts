import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const city = await prisma.city.create({ data: body });
  return NextResponse.json(city);
}
