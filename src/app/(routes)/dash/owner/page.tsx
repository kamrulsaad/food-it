"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/global/skeleton";

type DashboardData = {
  restaurant: {
    name: string;
    address: string;
  };
  stats: {
    totalEarnings: number;
    orderCount: number;
    todayIncome: number; // updated
  };
  dailyEarnings: { date: string; total: number }[]; // updated
  topItems: { name: string; quantity: number }[];
  recentOrders: {
    id: string;
    createdAt: string;
    totalAmount: number;
  }[];
};

export default function OwnerDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/owner/dashboard");
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading || !data) {
    return (
      <div className="mx-auto  space-y-4">
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-56 w-full" />
      </div>
    );
  }

  const { restaurant, stats, dailyEarnings, topItems, recentOrders } = data;

  return (
    <div className="mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold">
          Welcome back, {restaurant.name}
        </h1>
        <p className="text-sm text-muted-foreground">{restaurant.address}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Earnings</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold text-green-600">
            ৳{stats.totalEarnings.toFixed(2)}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Orders</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold text-blue-600">
            {stats.orderCount}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Today&apos;s Earnings</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold text-orange-600">
            ৳{stats.todayIncome.toFixed(2)}
          </CardContent>
        </Card>
      </div>

      {/* Daily Earnings Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Daily Revenue (Past 7 Days)</CardTitle>
        </CardHeader>
        <CardContent className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dailyEarnings}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Top Selling Items */}
      <Card>
        <CardHeader>
          <CardTitle>Top-Selling Items</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="text-sm space-y-2">
            {topItems.length === 0 ? (
              <p className="text-muted-foreground">No items sold yet.</p>
            ) : (
              topItems.map((item) => (
                <li key={item.name} className="flex justify-between">
                  <span>{item.name}</span>
                  <span className="font-medium text-green-700">
                    {item.quantity} sold
                  </span>
                </li>
              ))
            )}
          </ul>
        </CardContent>
      </Card>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2">
          {recentOrders.length === 0 ? (
            <p className="text-muted-foreground">No recent orders.</p>
          ) : (
            recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex justify-between border-b pb-1"
              >
                <p>Order #{order.id.slice(0, 6)}</p>
                <p className="text-right font-semibold text-green-600">
                  ৳{order.totalAmount}
                </p>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
