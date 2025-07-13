"use client";

import { useEffect, useRef, useState } from "react";
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
import Link from "next/link";

// Full order type
interface FullOrder extends Order {
  user: { email: string };
  OrderItem: { quantity: number; menuItem: { name: string } }[];
}

// Determine valid next status for restaurant side
function getNextStatus(order: FullOrder): OrderStatus | null {
  if (order.status === "PLACED") return "ACCEPTED_BY_RESTAURANT";
  if (order.status === "RIDER_ASSIGNED" && order.riderId)
    return "READY_FOR_PICKUP";
  return null;
}

export default function OrderTable() {
  const [orders, setOrders] = useState<FullOrder[]>([]);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/restaurant/order");
      const data = await res.json();
      setOrders(data);
    } catch {
      toast.error("Failed to load orders");
    }
  };

  // Initial + polling logic (stable length)
  useEffect(() => {
    fetchOrders();
    const interval = setInterval(() => {
      // We'll avoid fetching while an order is being updated
      if (!loadingIdRef.current) {
        fetchOrders();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Track current loadingId in a ref (safe in intervals)
  const loadingIdRef = useRef<string | null>(null);
  useEffect(() => {
    loadingIdRef.current = loadingId;
  }, [loadingId]);

  // Update order status
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
      await fetchOrders(); // Immediately refresh after update
    } catch (err) {
      console.error(err);
      toast.error("Error updating order");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="overflow-x-auto mt-2 rounded-lg border">
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
            const nextStatus = getNextStatus(order);

            return (
              <TableRow key={order.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell className="hover:underline hover:text-blue-600 cursor-pointer">
                  <Link href={`/dash/owner/orders/${order.id}`}>
                    <ul className="text-sm">
                      {order.OrderItem.map((item, i) => (
                        <li key={i}>
                          {item.menuItem.name} × {item.quantity}
                        </li>
                      ))}
                    </ul>
                  </Link>
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
