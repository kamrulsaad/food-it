"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Skeleton } from "@/components/global/skeleton";

type Order = {
  id: string;
  deliveryFee: number;
  createdAt: string;
  restaurant: {
    name: string;
  };
};

type RiderDashboardData = {
  rider: {
    name: string;
    city: string;
    vehicleType: string;
  };
  orders: Order[];
  totalIncome: number;
  dailyData: { date: string; income: number }[];
};

export default function RiderDashboard() {
  const [data, setData] = useState<RiderDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/rider/profile");
      const json = await res.json();
      setData(json);
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading || !data) {
    return (
      <div className="mx-auto space-y-6">
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  const { rider, orders, totalIncome, dailyData } = data;

  return (
    <div className="mx-auto space-y-6">
      {/* Dashboard Header */}
      <div>
        <h1 className="text-2xl font-semibold">Rider Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Welcome back, {rider.name}. Here&lsquo;s your delivery performance
          overview.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Total Delivered Orders</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold text-green-600">
            {orders.length}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Total Income</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold text-green-600">
            ৳{totalIncome}
          </CardContent>
        </Card>
      </div>

      {/* Monthly Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Daily Income (Last 30 Days)</CardTitle>
        </CardHeader>
        <CardContent className="h-72">
          {dailyData?.length === 0 ? (
            <p className="text-sm text-muted-foreground">No data available.</p>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.dailyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="income" fill="#22c55e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
