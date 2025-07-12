"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import {
  Order,
  Restaurant,
  User,
} from "../../../../../../../prisma/generated/prisma";

interface OrderWithDetails extends Order {
  restaurant: Restaurant;
  user: User;
}

export default function AvailableOrderList() {
  const [activeOrder, setActiveOrder] = useState<OrderWithDetails | null>(null);
  const [availableOrders, setAvailableOrders] = useState<OrderWithDetails[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/rider/orders/available");
        const data = await res.json();

        if (data.activeOrder) {
          setActiveOrder(data.activeOrder);
        } else {
          setAvailableOrders(data.availableOrders);
        }
      } catch (err) {
        console.error("Failed to load orders", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleAssign = async (orderId: string) => {
    try {
      const res = await fetch("/api/rider/orders/assign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });

      if (!res.ok) throw new Error("Failed to assign order");

      const data = await res.json();
      toast.success("You have been assigned to this order");
      setActiveOrder(data.order);
      setAvailableOrders([]);
    } catch (err) {
      console.error(err);
      toast.error("Assignment failed");
    }
  };

  if (loading) return <p>Loading orders...</p>;

  if (activeOrder) {
    return (
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Order #{activeOrder.id.slice(0, 6)}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p>
            <strong>Status:</strong> {activeOrder.status}
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
        </CardContent>
      </Card>
    );
  }

  if (!availableOrders?.length)
    return <p>No available orders in your city right now.</p>;

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
