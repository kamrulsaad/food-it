// /app/api/restaurant/preorders/[id]/mark-prepared/route.ts
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

interface Params {
  params: Promise<{ id: string }>;
}

export async function POST(_req: Request, { params }: Params) {
  const { id } = await params;
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Optional: verify ownership
  const updated = await prisma.preOrderSchedule.update({
    where: { id },
    data: { isDelivered: true },
  });

  return NextResponse.json(updated);
}
