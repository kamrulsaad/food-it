// /app/api/rider/availability/route.ts
import { authMiddleware } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
  const user = await authMiddleware();
  if (!user || user.role !== "RIDER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { available } = await req.json();

  const updated = await prisma.rider.update({
    where: { email: user.email ?? undefined },
    data: { available },
  });

  return NextResponse.json({ success: true, available: updated.available });
}
