// MyPreOrdersPage.tsx
"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { MealSlot } from "../../../../../../prisma/generated/prisma";

interface EnrichedItem {
  name: string;
  price: number;
  quantity: number;
}

interface ScheduleEntry {
  id: string;
  scheduledFor: string;
  mealSlot: MealSlot;
  restaurantId: string;
  restaurantName: string;
  items: EnrichedItem[];
}

interface CustomerPreOrder {
  id: string;
  status: string;
  totalAmount: number;
  discount: number;
  recurring: boolean;
  days: number;
  createdAt: string;
  schedule: ScheduleEntry[];
}

export default function MyPreOrdersPage() {
  const [data, setData] = useState<CustomerPreOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/customer/preorders")
      .then((res) => res.json())
      .then((res) => {
        if (Array.isArray(res)) setData(res);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return <p className="text-sm text-gray-500">Loading your pre-orders...</p>;

  if (!data.length)
    return <p className="text-sm text-gray-500">You have no pre-orders yet.</p>;

  return (
    <div className="mx-auto max-w-3xl">
      <h2 className="text-2xl font-bold mb-6">My Pre-Orders</h2>

      <div className="space-y-5">
        {data.map((preOrder) => (
          <div
            key={preOrder.id}
            className="border rounded-md shadow-sm p-4 bg-white"
          >
            <div className="text-sm text-gray-600 flex flex-wrap justify-between gap-y-1 mb-3">
              <div>Created: {format(new Date(preOrder.createdAt), "PPP")}</div>
              <div>
                Status:{" "}
                <span className="font-medium text-black">
                  {preOrder.status}
                </span>
              </div>
              <div>
                Recurring:{" "}
                {preOrder.recurring ? `Yes (${preOrder.days} day(s))` : "No"}
              </div>
              <div className="font-semibold">
                Total: ৳{preOrder.totalAmount}
              </div>
            </div>

            <div className="space-y-3">
              {preOrder.schedule.map((schedule) => {
                const dateObj = new Date(schedule.scheduledFor);
                const dateFormatted = isNaN(dateObj.getTime())
                  ? "Invalid Date"
                  : format(dateObj, "PPP");

                return (
                  <div
                    key={schedule.id}
                    className="border-t pt-2 text-sm text-gray-700"
                  >
                    <div className="font-medium mb-1">
                      {dateFormatted} — {schedule.mealSlot} (
                      {schedule.restaurantName})
                    </div>
                    {schedule.items.length === 0 ? (
                      <p className="text-gray-400 italic">No items listed</p>
                    ) : (
                      <ul className="list-disc list-inside text-sm space-y-1">
                        {schedule.items.map((item, idx) => (
                          <li key={idx}>
                            {item.name} × {item.quantity} = ৳
                            {item.quantity * item.price}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
