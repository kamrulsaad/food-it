"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Order } from "../../../../../../prisma/generated/prisma";
import { motion } from "framer-motion";
import { CheckCircle, Circle, Clock } from "lucide-react";

const statusSteps = [
  { status: "PLACED", timeKey: "placedAt" },
  { status: "ACCEPTED_BY_RESTAURANT", timeKey: "acceptedAt" },
  { status: "RIDER_ASSIGNED", timeKey: "riderAssignedAt" },
  { status: "READY_FOR_PICKUP", timeKey: "readyAt" },
  { status: "PICKED_UP_BY_RIDER", timeKey: "pickedUpAt" },
  { status: "ON_THE_WAY", timeKey: "onTheWayAt" },
  { status: "DELIVERED", timeKey: "deliveredAt" },
] as const;

type ExtendedOrder = Order & {
  OrderItem: {
    id: string;
    quantity: number;
    menuItem: {
      name: string;
    } | null;
  }[];
  restaurant: {
    name: string;
    address: string;
  } | null;
};

export default function OrderTrackingPage() {
  const { id } = useParams();
  const [order, setOrder] = useState<ExtendedOrder | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      const res = await fetch(`/api/user/orders/${id}`);
      const data = await res.json();
      setOrder(data);
      setLoading(false);
    };

    fetchOrder();
    const interval = setInterval(fetchOrder, 5000);
    return () => clearInterval(interval);
  }, [id]);

  if (loading || !order)
    return (
      <p className="p-6 text-center text-muted-foreground">
        Loading your order...
      </p>
    );

  const currentStepIndex = statusSteps.findIndex(
    (step) => step.status === order.status
  );

  return (
    <div className="mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Order Tracking */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">
            Order Tracking – #{order.id.slice(0, 6)}
          </CardTitle>
        </CardHeader>
        <CardContent className="relative">
          {/* Timeline Line */}
          {/* <div className="absolute left-8 top-5 bottom-5 w-0.5 bg-gray-200 rounded" /> */}

          <ol className="relative space-y-2">
            {statusSteps.map(({ status, timeKey }, index) => {
              // or order status is delivered
              const isCompleted =
                index < currentStepIndex || order.status === "DELIVERED";
              const isActive = index === currentStepIndex;
              const timestamp = order[timeKey as keyof ExtendedOrder] as
                | string
                | Date
                | null;

              const dotColor = isCompleted
                ? "text-green-600"
                : isActive
                ? "text-yellow-500 animate-pulse"
                : "text-gray-400";

              const labelColor = isCompleted
                ? "text-green-800 font-medium"
                : isActive
                ? "text-yellow-700 font-semibold"
                : "text-gray-400";

              const Icon = isCompleted
                ? CheckCircle
                : isActive
                ? Clock
                : Circle;

              return (
                <motion.li
                  key={status}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="relative flex items-start justify-between"
                >
                  {/* Left: Dot + Label */}
                  <div className="flex items-center gap-3">
                    <Icon className={`w-5 h-5 ${dotColor}`} />
                    <span className={`text-sm ${labelColor}`}>
                      {status.replace(/_/g, " ")}
                    </span>
                  </div>

                  {/* Right: Timestamp */}
                  {timestamp && (
                    <span className="text-xs text-muted-foreground">
                      {new Date(timestamp).toLocaleString()}
                    </span>
                  )}
                </motion.li>
              );
            })}
          </ol>
        </CardContent>
      </Card>

      {/* Order Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-medium">Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-sm text-muted-foreground">
          <p>
            <strong>Status:</strong> {order.status.replace(/_/g, " ")}
          </p>
          <p>
            <strong>Order ID:</strong> {order.id}
          </p>
          <p>
            <strong>Delivery Address:</strong> {order.address}
          </p>
          <p>
            <strong>Delivery Fee:</strong> ৳{order.deliveryFee}
          </p>
          <p>
            <strong>Total Amount:</strong> ৳{order.totalAmount}
          </p>
          <p>
            <strong>Placed On:</strong>{" "}
            {new Date(order.createdAt).toLocaleString()}
          </p>
        </CardContent>
      </Card>

      {/* Rider Info */}
      {order.riderId && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Rider Info</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <p>
              <strong>Assigned Rider ID:</strong> {order.riderId}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Menu Items */}
      {order.OrderItem?.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Ordered Items
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            {order.OrderItem.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center border-b pb-1"
              >
                <p>{item.menuItem?.name || "Item"}</p>
                <p>x{item.quantity}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Restaurant Info */}
      {order.restaurant && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Restaurant Info
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-1">
            <p>
              <strong>Name:</strong> {order.restaurant.name}
            </p>
            <p>
              <strong>Address:</strong> {order.restaurant.address}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
