"use client";

import { useEffect, useState } from "react";
import { format, parseISO } from "date-fns";
import DaySection from "./DaySection";
import { RestaurantPreOrder } from "@/types/preorder";

export default function RestaurantPreOrderDashboard() {
  const [data, setData] = useState<Record<string, RestaurantPreOrder[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/restaurant/preorders")
      .then((res) => res.json())
      .then((res: Record<string, RestaurantPreOrder[]>) => setData(res))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (Object.keys(data).length === 0)
    return <p className="text-gray-500">No upcoming pre-orders found.</p>;

  return (
    <div className="space-y-6">
      {Object.entries(data).map(([date, preorders]) => (
        <DaySection
          key={date}
          dateLabel={format(parseISO(date), "PPP")}
          preorders={preorders}
        />
      ))}
    </div>
  );
}
