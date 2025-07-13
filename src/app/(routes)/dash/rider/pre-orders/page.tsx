"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { MealSlot } from "../../../../../../prisma/generated/prisma";

interface EnrichedItem {
  itemId: string;
  quantity: number;
  name: string;
  price: number;
}

interface RiderScheduleData {
  id: string;
  scheduledFor: string;
  mealSlot: MealSlot;
  enrichedItems: EnrichedItem[];
  address: string | null;
  restaurantName: string;
}

export default function RiderDashboardPreOrders() {
  const [data, setData] = useState<RiderScheduleData[]>([]);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const loadData = () => {
    fetch("/api/rider/preorders")
      .then((res) => res.json())
      .then(setData);
  };

  useEffect(() => {
    loadData();
  }, []);

  const markPickedUp = async (id: string) => {
    setLoadingId(id);
    const res = await fetch(`/api/rider/preorders/${id}/mark-picked-up`, {
      method: "POST",
    });
    if (res.ok) {
      toast.success("Marked as picked up");
      loadData();
    } else {
      toast.error("Failed to mark");
    }
    setLoadingId(null);
  };

  return (
    <div className="mx-auto">
      <h2 className="text-2xl font-bold mb-6">Assigned Pre-Orders</h2>

      {data.length === 0 && <p>No assigned pre-orders found.</p>}

      <div className="space-y-4">
        {data.map((s) => {
          const slotTime = format(new Date(s.scheduledFor), "PPP");
          return (
            <div key={s.id} className="border p-4 rounded shadow-sm">
              <h3 className="font-semibold text-lg mb-2">
                {slotTime} — {s.mealSlot} ({s.restaurantName})
              </h3>
              <p className="text-sm text-gray-500 mb-2">
                Delivery Address: {s.address || "N/A"}
              </p>
              <ul className="list-disc list-inside text-sm mb-2">
                {s.enrichedItems.map((item, idx) => (
                  <li key={idx}>
                    {item.name} × {item.quantity} = ৳
                    {item.price * item.quantity}
                  </li>
                ))}
              </ul>
              <Button
                onClick={() => markPickedUp(s.id)}
                disabled={loadingId === s.id}
                className="cursor-pointer"
              >
                {loadingId === s.id ? "Marking..." : "Mark as Picked Up"}
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
