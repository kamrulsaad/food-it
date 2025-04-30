import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const category = await prisma.category.create({ data: body });
  return NextResponse.json(category);
}
