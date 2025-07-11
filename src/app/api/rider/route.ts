import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { CreateRiderSchema } from "@/validations/rider";

const DISALLOWED_ROLES = [
  "SUPERADMIN",
  "ADMIN",
  "RESTATURANT_OWNER",
  "RESTATURANT_ADMIN",
];

export async function POST(req: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (!user || DISALLOWED_ROLES.includes(user.role)) {
    return NextResponse.json(
      { error: "You are not allowed to apply as a rider." },
      { status: 403 }
    );
  }

  const body = await req.json();
  const data = CreateRiderSchema.parse(body);

  const rider = await prisma.rider.create({
    data: {
      ...data,
    },
  });

  await prisma.user.update({
    where: { clerkId: userId },
    data: {
      role: "RIDER",
    },
  });

  return NextResponse.json(rider, { status: 201 });
}
