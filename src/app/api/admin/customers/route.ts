import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const users = await prisma.user.findMany({
    // where: {
    //   role: "CUSTOMER",
    // },
    select: {
      id: true,
      email: true,
      clerkId: true,
      createdAt: true,
      Order: {
        select: { id: true, createdAt: true },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const customers = users.map((user) => ({
    id: user.id,
    email: user.email,
    clerkID: user.clerkId,
    orderCount: user.Order.length,
    lastOrderDate:
      user.Order.length > 0
        ? new Date(
            Math.max(...user.Order.map((o) => new Date(o.createdAt).getTime()))
          )
        : null,
  }));

  return NextResponse.json(customers);
}
