// File: app/dash/owner/orders/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ChatWithOwner from "@/components/chat/ChatWithOwner";

type Order = {
  id: string;
  status: string;
  address: string;
  totalAmount: number;
  deliveryFee: number;
  createdAt: string;
};

export default function OwnerOrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      const res = await fetch(`/api/owner/orders/${id}`);
      const data = await res.json();
      setOrder(data);
      setLoading(false);
    };
    fetchOrder();
  }, [id]);

  if (loading || !order) {
    return <p className="p-6 text-center text-muted-foreground">Loading...</p>;
  }

  return (
    <div className="mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">
            Order #{order.id.slice(0, 6)}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>
            <strong>Status:</strong> {order.status.replace(/_/g, " ")}
          </p>
          <p>
            <strong>Address:</strong> {order.address}
          </p>
          <p>
            <strong>Total:</strong> ৳{order.totalAmount}
          </p>
          <p>
            <strong>Delivery Fee:</strong> ৳{order.deliveryFee}
          </p>
          <p>
            <strong>Placed At:</strong>{" "}
            {new Date(order.createdAt).toLocaleString()}
          </p>
        </CardContent>
      </Card>

      {/* ChatBox */}
      <ChatWithOwner orderId={order.id} role="OWNER" />
    </div>
  );
}
