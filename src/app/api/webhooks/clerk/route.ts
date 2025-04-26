import { prisma } from "@/lib/utils";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  const { email_addresses, id } = body.data;

  const email = email_addresses?.[0]?.email_address; // Clerk gives it like this

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (!existingUser) {
    await prisma.user.create({
      data: {
        email,
        clerkId: id,
        role: "CUSTOMER",
      },
    });
  }

  return NextResponse.json({ message: "User processed" });
}
