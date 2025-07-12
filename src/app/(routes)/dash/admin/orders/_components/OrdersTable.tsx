"use client";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDistanceToNow } from "date-fns";
import {
  Order,
  OrderStatus,
  Restaurant,
  User,
} from "../../../../../../../prisma/generated/prisma";
import Link from "next/link";

type AdminOrder = Order & {
  user: User;
  restaurant: Restaurant;
};

interface OrdersTableProps {
  orders: AdminOrder[];
}

const statusColors: Record<
  OrderStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  PLACED: "default",
  ACCEPTED_BY_RESTAURANT: "secondary",
  RIDER_ASSIGNED: "default",
  READY_FOR_PICKUP: "default",
  PICKED_UP_BY_RIDER: "default",
  ON_THE_WAY: "default",
  DELIVERED: "secondary",
  CANCELLED: "destructive",
};

export function OrdersTable({ orders }: OrdersTableProps) {
  if (!orders.length) {
    return (
      <p className="text-muted-foreground text-center py-10">
        No orders found.
      </p>
    );
  }

  return (
    <div className="w-full overflow-x-auto border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Restaurant</TableHead>
            <TableHead>Total (৳)</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-mono text-xs hover:text-blue-500 hover:underline">
                <Link href={`/dash/admin/orders/${order.id}`}>
                  {order.id.slice(0, 8)}...
                </Link>
              </TableCell>
              <TableCell>{order.name || "User"}</TableCell>
              <TableCell>{order.restaurant.name}</TableCell>
              <TableCell>{order.totalAmount + order.deliveryFee}</TableCell>
              <TableCell>
                <Badge
                  variant={statusColors[order.status]}
                  className="uppercase text-xs"
                >
                  {order.status.replace(/_/g, " ")}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {formatDistanceToNow(new Date(order.createdAt), {
                  addSuffix: true,
                })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
