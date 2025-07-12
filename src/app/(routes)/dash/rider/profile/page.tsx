"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/global/skeleton";

type Order = {
  id: string;
  deliveryFee: number;
  createdAt: string;
  restaurant: {
    name: string;
  };
};

type RiderProfile = {
  rider: {
    name: string;
    email: string;
    phone: string;
    vehicleType: string;
    city: string;
  };
  orders: Order[];
  totalIncome: number;
};

export default function RiderProfilePage() {
  const [data, setData] = useState<RiderProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const res = await fetch("/api/rider/profile");
      const json = await res.json();
      setData(json);
      setLoading(false);
    };
    fetchProfile();
  }, []);

  if (loading || !data) {
    return (
      <div className="mx-auto space-y-4">
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  const { rider, orders } = data;

  return (
    <div className="mx-auto space-y-6">
      {/* Profile Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Rider Profile</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm text-muted-foreground">
          <p>
            <strong>Name:</strong> {rider.name}
          </p>
          <p>
            <strong>Email:</strong> {rider.email}
          </p>
          <p>
            <strong>Phone:</strong> {rider.phone}
          </p>
          <p>
            <strong>Vehicle:</strong> {rider.vehicleType}
          </p>
          <p>
            <strong>City:</strong> {rider.city}
          </p>
        </CardContent>
      </Card>

      {/* Delivered Orders List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Delivered Orders</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {orders.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No delivered orders yet.
            </p>
          ) : (
            orders.map((order) => (
              <div
                key={order.id}
                className="border-b pb-2 flex justify-between text-sm"
              >
                <div>
                  <p>
                    <strong>Restaurant:</strong> {order.restaurant.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    Delivered on {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="font-medium">৳{order.deliveryFee}</div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
