"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import {
  Order,
  Restaurant,
  User,
  OrderStatus,
} from "../../../../../../../prisma/generated/prisma";

interface OrderWithDetails extends Order {
  restaurant: Restaurant;
  user: User;
}

const nextRiderStatusMap: Record<OrderStatus, OrderStatus | null> = {
  READY_FOR_PICKUP: "PICKED_UP_BY_RIDER",
  PICKED_UP_BY_RIDER: "ON_THE_WAY",
  ON_THE_WAY: "DELIVERED",
  DELIVERED: null,
  PLACED: null,
  ACCEPTED_BY_RESTAURANT: null,
  RIDER_ASSIGNED: null,
  CANCELLED: null,
};

export default function AvailableOrderList() {
  const [activeOrder, setActiveOrder] = useState<OrderWithDetails | null>(null);
  const [availableOrders, setAvailableOrders] = useState<OrderWithDetails[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/rider/orders/available");
      const data = await res.json();
      setActiveOrder(data.activeOrder || null);
      setAvailableOrders(data.availableOrders || []);
    } catch (err) {
      console.error("Failed to load orders", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const handleAssign = async (orderId: string) => {
    try {
      const res = await fetch("/api/rider/orders/assign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });

      if (!res.ok) throw new Error("Failed to assign order");

      toast.success("You have been assigned to this order");
      fetchOrders(); // Refresh state after assignment
    } catch (err) {
      console.error(err);
      toast.error("Assignment failed");
    }
  };

  const handleProgress = async () => {
    if (!activeOrder) return;

    const nextStatus = nextRiderStatusMap[activeOrder.status];
    if (!nextStatus) return;

    setUpdating(true);
    try {
      const res = await fetch("/api/order/status", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: activeOrder.id, status: nextStatus }),
      });

      if (!res.ok) throw new Error("Failed to update status");

      toast.success(`Order marked as ${nextStatus.replace(/_/g, " ")}`);
      fetchOrders(); // Refetch latest state
    } catch (err) {
      console.error(err);
      toast.error("Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <p>Loading orders...</p>;

  if (activeOrder) {
    const nextStatus = nextRiderStatusMap[activeOrder.status];

    return (
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Active Order #{activeOrder.id.slice(0, 6)}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p>
            <strong>Status:</strong> {activeOrder.status.replace(/_/g, " ")}
          </p>
          <p>
            <strong>Restaurant:</strong> {activeOrder.restaurant.name}
          </p>
          <p>
            <strong>Delivery Fee:</strong> ৳{activeOrder.deliveryFee}
          </p>
          <p>
            <strong>Customer Address:</strong> {activeOrder.address}
          </p>

          {nextStatus ? (
            <Button onClick={handleProgress} disabled={updating}>
              {updating
                ? "Updating..."
                : `Mark as ${nextStatus.replace(/_/g, " ")}`}
            </Button>
          ) : activeOrder.status === "DELIVERED" ||
            activeOrder.status === "CANCELLED" ? (
            <p className="text-muted-foreground text-sm">
              This order is completed.
            </p>
          ) : (
            <p className="text-muted-foreground text-sm">
              Waiting for restaurant to update status...
            </p>
          )}
        </CardContent>
      </Card>
    );
  }

  if (!availableOrders.length) {
    return <p>No available orders in your city right now.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {availableOrders.map((order) => (
        <Card key={order.id} className="shadow-md">
          <CardHeader>
            <CardTitle>Order #{order.id.slice(0, 6)}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p>
              <strong>Restaurant:</strong> {order.restaurant.name}
            </p>
            <p>
              <strong>Delivery Fee:</strong> ৳{order.deliveryFee}
            </p>
            <p>
              <strong>Customer Address:</strong> {order.address}
            </p>
            <Button onClick={() => handleAssign(order.id)}>Accept Order</Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
