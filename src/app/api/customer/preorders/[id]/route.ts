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

  await prisma.preOrder.delete({
    where: { id },
  });

  return NextResponse.json({ success: true });
}
