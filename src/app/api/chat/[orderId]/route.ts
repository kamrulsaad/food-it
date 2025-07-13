import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

interface ChatParams {
  params: Promise<{
    orderId: string;
  }>;
}

export async function GET(
  _req: Request,
  { params }: { params: ChatParams["params"] }
) {
  const { orderId } = await params;
  const { searchParams } = new URL(_req.url);
  const withRole = searchParams.get("withRole");

  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (!withRole || !["OWNER", "RIDER"].includes(withRole)) {
    return NextResponse.json({ error: "Invalid withRole" }, { status: 400 });
  }

  try {
    const chat = await prisma.chat.upsert({
      where: {
        orderId_withRole: {
          orderId,
          withRole,
        },
      },
      update: {},
      create: {
        orderId,
        withRole,
      },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    return NextResponse.json(chat);
  } catch (err) {
    console.error("GET /api/chat/[orderId] error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
