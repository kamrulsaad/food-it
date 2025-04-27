import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function authMiddleware() {
  const { userId } = await auth();
  if (!userId) return null;

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  return user;
}
