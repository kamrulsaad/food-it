// src/app/api/customer/preorders/[id]/route.ts
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

interface PreOrderParams {
  params: Promise<{
    id: string;
  }>;
}

export async function DELETE(
  _: Request,
  { params }: { params: PreOrderParams["params"] }
) {
  const { id } = await params;
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const preOrder = await prisma.preOrder.findUnique({
    where: { id },
  });

  if (!preOrder || preOrder.userId !== userId) {
    return NextResponse.json(
      { error: "Not found or unauthorized" },
      { status: 403 }
    );
  }

  if (preOrder.status === "CONVERTED" || preOrder.status === "CANCELLED") {
    // Customer can delete it
    await prisma.preOrder.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Pre-order deleted" });
  } else if (preOrder.status === "PENDING") {
    // Customer can cancel before confirmation
    await prisma.preOrder.update({
      where: { id },
      data: { status: "CANCELLED" },
    });
    return NextResponse.json({ success: true, message: "Pre-order cancelled" });
  } else {
    return NextResponse.json(
      { error: "Cannot modify this pre-order at current status" },
      { status: 403 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: PreOrderParams["params"] }
) {
  const { id } = await params;
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { scheduledDate } = body;

  if (!scheduledDate) {
    return NextResponse.json(
      { error: "Missing scheduledDate" },
      { status: 400 }
    );
  }

  const preOrder = await prisma.preOrder.findUnique({
    where: { id },
  });

  if (
    !preOrder ||
    preOrder.userId !== userId ||
    preOrder.status !== "PENDING"
  ) {
    return NextResponse.json(
      { error: "Not allowed to update this pre-order" },
      { status: 403 }
    );
  }

  await prisma.preOrder.update({
    where: { id },
    data: {
      scheduledDate: new Date(scheduledDate),
    },
  });

  return NextResponse.json({ success: true });
}
