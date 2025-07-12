// /app/api/rider/me/route.ts
import { authMiddleware } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const user = await authMiddleware();
  if (!user || user.role !== "RIDER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rider = await prisma.rider.findUnique({
    where: { email: user.email ?? undefined },
  });

  if (!rider) {
    return NextResponse.json({ error: "Rider not found" }, { status: 404 });
  }

  return NextResponse.json(rider);
}
