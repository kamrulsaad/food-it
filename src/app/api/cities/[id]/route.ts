// src/app/api/admin/cities/[id]/route.ts

import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();

    const updated = await prisma.city.update({
      where: { id: params.id },
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
