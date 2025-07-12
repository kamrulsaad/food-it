"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { Loader2 } from "lucide-react";

interface DashboardData {
  stats: {
    totalRevenue: number;
    totalOrders: number;
    avgOrderValue: number;
    largestOrder: {
      id: string;
      amount: number;
      restaurant: string;
    } | null;
  };
  topRestaurantShares: { name: string; value: number }[];
  monthlyRevenue: { month: string; total: number }[];
}

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#a4de6c"];

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/dashboard")
      .then((res) => res.json())
      .then(setData)
      .catch((err) => console.error("Failed to load dashboard", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading || !data)
    return (
      <div className="flex justify-center p-20">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );

  const { stats, topRestaurantShares, monthlyRevenue } = data;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Revenue</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            ৳{stats.totalRevenue}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Orders</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            {stats.totalOrders}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Avg Order Value</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            ৳{stats.avgOrderValue.toFixed(2)}
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Selling Restaurants (Market Share)</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={topRestaurantShares}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {topRestaurantShares.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Platform Revenue</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total" fill="#8884d8" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Extra Insights */}
      {stats.largestOrder && (
        <Card>
          <CardHeader>
            <CardTitle>Largest Order</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              <strong>Amount:</strong> ৳{stats.largestOrder.amount}
            </p>
            <p>
              <strong>Restaurant:</strong> {stats.largestOrder.restaurant}
            </p>
            <p className="text-xs text-muted-foreground">
              Order ID: {stats.largestOrder.id}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
