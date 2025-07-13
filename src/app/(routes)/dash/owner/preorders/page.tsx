"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { MealSlot } from "../../../../../../prisma/generated/prisma";

type EnrichedItem = {
  name: string;
  price: number;
  quantity: number;
};

type RestaurantPreOrder = {
  id: string;
  scheduledDate: string;
  mealSlot: MealSlot;
  status: string;
  customer: {
    email: string | null;
    address: string | null;
  };
  items: EnrichedItem[];
};

export default function PreOrderPage() {
  const [data, setData] = useState<RestaurantPreOrder[]>([]);
  const [loading, setLoading] = useState(false);

  const loadData = () => {
    setLoading(true);
    fetch("/api/restaurant/preorders")
      .then((res) => res.json())
      .then(setData);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return <p className="text-center">Loading...</p>;
  }

  return (
    <div className="mx-auto">
      <h2 className="text-2xl font-bold mb-2">Upcoming Orders</h2>

      {data?.length === 0 ? (
        <p className="text-sm text-gray-600">No upcoming orders found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border rounded-sm text-sm">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="border px-4 py-2">Scheduled For</th>
                <th className="border px-4 py-2">Meal Slot</th>
                <th className="border px-4 py-2">Items</th>
                <th className="border px-4 py-2">Customer Email</th>
                <th className="border px-4 py-2">Delivery Address</th>
              </tr>
            </thead>
            <tbody>
              {data?.map((preorder) => (
                <tr key={preorder.id} className="border-t">
                  <td className="border px-4 py-2">
                    {format(new Date(preorder.scheduledDate), "PPP p")}
                  </td>
                  <td className="border px-4 py-2">{preorder.mealSlot}</td>
                  <td className="border px-4 py-2">
                    <ul className="list-disc list-inside space-y-1">
                      {preorder.items.map((item, idx) => (
                        <li key={idx}>
                          {item.name} × {item.quantity} = ৳
                          {item.price * item.quantity}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="border px-4 py-2">
                    {preorder.customer.email || "N/A"}
                  </td>
                  <td className="border px-4 py-2">
                    {preorder.customer.address || "N/A"}
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
