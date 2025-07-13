import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

interface MessageParams {
  params: Promise<{
    orderId: string;
  }>;
}

export async function POST(
  req: Request,
  { params }: { params: MessageParams["params"] }
) {
  const { orderId } = await params;
  const { searchParams } = new URL(req.url);
  const withRole = searchParams.get("withRole");

  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { content, role } = body;

  if (!withRole || !["OWNER", "RIDER"].includes(withRole)) {
    return NextResponse.json({ error: "Invalid withRole" }, { status: 400 });
  }

  try {
    const chat = await prisma.chat.findUnique({
      where: {
        orderId_withRole: {
          orderId,
          withRole,
        },
      },
    });

    if (!chat) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    const message = await prisma.message.create({
      data: {
        chatId: chat.id,
        content,
        senderId: userId,
        senderRole: role,
      },
    });

    return NextResponse.json(message);
  } catch (err) {
    console.error("POST /api/chat/[orderId]/message error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
