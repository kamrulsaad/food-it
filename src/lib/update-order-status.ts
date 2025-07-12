import prisma from "@/lib/prisma";
import { OrderStatus, Prisma } from "../../prisma/generated/prisma";

const statusTimestampMap: Record<OrderStatus, keyof Prisma.OrderUpdateInput> = {
  PLACED: "placedAt",
  ACCEPTED_BY_RESTAURANT: "acceptedAt",
  RIDER_ASSIGNED: "riderAssignedAt",
  READY_FOR_PICKUP: "readyAt",
  PICKED_UP_BY_RIDER: "pickedUpAt",
  ON_THE_WAY: "onTheWayAt",
  DELIVERED: "deliveredAt",
  CANCELLED: "cancelledAt",
};

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  const timestampField = statusTimestampMap[status];

  const data: Prisma.OrderUpdateInput = {
    status,
    [timestampField]: new Date(),
  };

  return await prisma.order.update({
    where: { id: orderId },
    data,
  });
}
