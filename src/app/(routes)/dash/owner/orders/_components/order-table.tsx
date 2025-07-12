// /app/dash/owner/orders/_components/order-table.tsx
"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import {
  Order,
  OrderStatus,
} from "../../../../../../../prisma/generated/prisma";

interface FullOrder extends Order {
  user: { email: string };
  OrderItem: { quantity: number; menuItem: { name: string } }[];
}

const nextStatusMap: Record<OrderStatus, OrderStatus | null> = {
  PLACED: "ACCEPTED_BY_RESTAURANT",
  ACCEPTED_BY_RESTAURANT: "READY_FOR_PICKUP",
  READY_FOR_PICKUP: null, // After this, Rider is involved
  RIDER_ASSIGNED: null,
  PICKED_UP_BY_RIDER: null,
  ON_THE_WAY: null,
  DELIVERED: null,
  CANCELLED: null,
};

export default function OrderTable() {
  const [orders, setOrders] = useState<FullOrder[]>([]);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/restaurant/order")
      .then((res) => res.json())
      .then(setOrders)
      .catch(() => toast.error("Failed to load orders"));
  }, []);

  const handleUpdate = async (id: string, status: OrderStatus) => {
    setLoadingId(id);
    try {
      const res = await fetch("/api/order/status", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: id, status }),
      });

      if (!res.ok) throw new Error("Failed to update");

      toast.success("Order updated");
      setOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, status } : o))
      );
    } catch (err) {
      console.error(err);
      toast.error("Error updating order");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="overflow-x-auto rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead>Items</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Placed</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order, index) => {
            const nextStatus = nextStatusMap[order.status];
            return (
              <TableRow key={order.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  <ul className="text-sm">
                    {order.OrderItem.map((item, i) => (
                      <li key={i}>
                        {item.menuItem.name} × {item.quantity}
                      </li>
                    ))}
                  </ul>
                </TableCell>
                <TableCell>{order.user.email}</TableCell>
                <TableCell>
                  <Badge className="uppercase text-xs">{order.status}</Badge>
                </TableCell>
                <TableCell>
                  {formatDistanceToNow(new Date(order.createdAt), {
                    addSuffix: true,
                  })}
                </TableCell>
                <TableCell className="text-right">
                  {nextStatus ? (
                    <Button
                      size="sm"
                      disabled={loadingId === order.id}
                      onClick={() => handleUpdate(order.id, nextStatus)}
                    >
                      {loadingId === order.id
                        ? "Updating..."
                        : `Mark as ${nextStatus.replace(/_/g, " ")}`}
                    </Button>
                  ) : (
                    <span className="text-muted-foreground text-xs">
                      No Action
                    </span>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
