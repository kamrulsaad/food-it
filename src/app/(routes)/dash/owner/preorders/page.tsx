"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { MealSlot } from "../../../../../../prisma/generated/prisma";

type EnrichedItem = {
  itemId: string;
  quantity: number;
  name: string;
  price: number;
};

type ScheduleData = {
  id: string;
  scheduledFor: string;
  mealSlot: MealSlot;
  enrichedItems: EnrichedItem[];
  isDelivered: boolean;
  user: {
    address: string | null;
    email: string | null;
  } | null;
};

export default function PreOrderPage() {
  const [data, setData] = useState<ScheduleData[]>([]);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const loadData = () => {
    fetch("/api/restaurant/preorders")
      .then((res) => res.json())
      .then(setData);
  };

  useEffect(() => {
    loadData();
  }, []);

  const markPrepared = async (id: string) => {
    setLoadingId(id);
    const res = await fetch(`/api/restaurant/preorders/${id}/mark-prepared`, {
      method: "POST",
    });
    if (res.ok) {
      toast.success("Marked as prepared");
      loadData();
    } else {
      toast.error("Failed to mark");
    }
    setLoadingId(null);
  };

  return (
    <div className="mx-auto">
      <h2 className="text-2xl font-bold mb-6">Upcoming Pre-Orders</h2>

      {data.length === 0 ? (
        <p>No upcoming pre-orders found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border text-sm">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="border px-4 py-2">Scheduled Date</th>
                <th className="border px-4 py-2">Meal Slot</th>
                <th className="border px-4 py-2">Items</th>
                <th className="border px-4 py-2">Delivery Address</th>
                <th className="border px-4 py-2">Customer Email</th>
                <th className="border px-4 py-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {data.map((s) => (
                <tr key={s.id} className="border-t">
                  <td className="border px-4 py-2">
                    {format(new Date(s.scheduledFor), "PPP")}
                  </td>
                  <td className="border px-4 py-2">{s.mealSlot}</td>
                  <td className="border px-4 py-2">
                    <ul className="list-disc list-inside space-y-1">
                      {s.enrichedItems.map((item, idx) => (
                        <li key={idx}>
                          {item.name} × {item.quantity} = ৳
                          {item.price * item.quantity}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="border px-4 py-2">
                    {s.user?.address || "N/A"}
                  </td>
                  <td className="border px-4 py-2">{s.user?.email || "N/A"}</td>
                  <td className="border px-4 py-2 text-center">
                    <Button
                      onClick={() => markPrepared(s.id)}
                      disabled={
                        loadingId === s.id ||
                        s.scheduledFor > new Date().toISOString()
                      }
                      className="cursor-pointer"
                    >
                      {loadingId === s.id ? "Marking..." : "Mark as Prepared"}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
