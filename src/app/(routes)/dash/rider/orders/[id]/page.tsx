"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Order } from "../../../../../../../prisma/generated/prisma";
import ChatWithRider from "@/components/chat/ChatWithRider";

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
  user: {
    name: string | null;
    phone: string | null;
  };
};

export default function RiderOrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState<ExtendedOrder | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      const res = await fetch(`/api/rider/orders/${id}`);
      const data = await res.json();
      setOrder(data);
      setLoading(false);
    };

    fetchOrder();
  }, [id]);

  if (loading || !order) return <p className="p-6">Loading order...</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
      <Card>
        <CardHeader>
          <CardTitle>Order Details</CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2">
          <p>
            <strong>Order ID:</strong> {order.id}
          </p>
          <p>
            <strong>Customer Name:</strong> {order.user?.name || "N/A"}
          </p>
          <p>
            <strong>Customer Phone:</strong> {order.user?.phone || "N/A"}
          </p>
          <p>
            <strong>Delivery Address:</strong> {order.address}
          </p>
          <p>
            <strong>Total Amount:</strong> ৳{order.totalAmount}
          </p>
          <p>
            <strong>Status:</strong> {order.status}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Restaurant Info</CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2">
          <p>
            <strong>Name:</strong> {order.restaurant?.name}
          </p>
          <p>
            <strong>Address:</strong> {order.restaurant?.address}
          </p>
        </CardContent>
      </Card>

      {order.OrderItem?.length > 0 && (
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Items</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            {order.OrderItem.map((item) => (
              <div key={item.id} className="flex justify-between border-b pb-1">
                <p>{item.menuItem?.name}</p>
                <p>x{item.quantity}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Chat Box */}
      <ChatWithRider orderId={order.id} role="RIDER" />
    </div>
  );
}
