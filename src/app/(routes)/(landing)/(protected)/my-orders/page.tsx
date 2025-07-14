"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Order } from "../../../../../../prisma/generated/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/user/orders")
      .then((res) => res.json())
      .then((data) => setOrders(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-1">My Orders</h1>
        <p className="text-muted-foreground">
          View the status and details of your food orders.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent className="space-y-3">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : orders.length === 0 ? (
        <p className="text-muted-foreground">
          You haven&apos;t placed any orders yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {orders.map((order) => (
            <Link key={order.id} href={`/my-orders/${order.id}`}>
              <Card className="hover:shadow-md hover:ring-1 ring-primary/30 transition cursor-pointer">
                <CardHeader>
                  <CardTitle className="text-lg">
                    Order #{order.id.slice(0, 6)}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p>
                    <span className="font-medium">Status:</span>{" "}
                    <span className="uppercase text-primary">
                      {order.status.replace(/_/g, " ")}
                    </span>
                  </p>
                  <p>
                    <span className="font-medium">Created:</span>{" "}
                    {formatDistanceToNow(new Date(order.createdAt), {
                      addSuffix: true,
                    })}
                  </p>
                  <p>
                    <span className="font-medium">Delivery To:</span>{" "}
                    {order.address?.split(",")[0]}
                  </p>
                  <p>
                    <span className="font-medium">Delivery Fee:</span> ৳
                    {order.deliveryFee}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
