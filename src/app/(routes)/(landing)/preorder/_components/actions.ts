'use server';

import prisma from "@/lib/prisma";

export async function confirmPreOrder({
  id,
  totalAmount,
  address,
}: {
  id: string;
  totalAmount: number;
  address: string;
}) {
  await prisma.preOrder.update({
    where: { id },
    data: {
      status: "CONFIRMED",
      totalAmount,
      address,
    },
  });
}
