import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

interface ChatParams {
  params: Promise<{
    orderId: string;
  }>;
}

export async function GET(
  req: Request,
  { params }: { params: ChatParams["params"] }
) {
  const { orderId } = await params;
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const chat = await prisma.chat.findUnique({
      where: { orderId },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!chat) {
      return NextResponse.json({ messages: [] }, { status: 200 });
    }

    return NextResponse.json(chat, { status: 200 });
  } catch (err) {
    console.error("GET /api/chat/:orderId ERROR:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: ChatParams["params"] }
) {
  const { orderId } = await params;
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const chat = await prisma.chat.upsert({
      where: { orderId },
      update: {},
      create: { orderId },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    return NextResponse.json(chat);
  } catch (err) {
    console.error("POST /api/chat/:orderId ERROR:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
