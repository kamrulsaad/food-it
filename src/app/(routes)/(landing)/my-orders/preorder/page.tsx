"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Item {
  name: string;
  price: number;
  quantity: number;
}

interface PreOrder {
  id: string;
  mealSlot: string;
  scheduledDate: string;
  restaurantName: string;
  items: Item[];
  createdAt: string;
  status: string;
}

export default function MyPreOrdersPage() {
  const [data, setData] = useState<PreOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingID, setDeletingID] = useState<string>("");

  const fetchData = () => {
    fetch("/api/customer/preorders")
      .then((res) => res.json())
      .then((res) => {
        if (Array.isArray(res)) setData(res);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const cancelPreOrder = async (id: string) => {
    setDeletingID(id);
    const res = await fetch(`/api/customer/preorders/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      toast.success("Pre-order cancelled.");
      fetchData();
      setDeletingID("");
    } else {
      toast.error("Failed to cancel.");
      setDeletingID("");
    }
  };

  if (loading)
    return <p className="text-sm text-gray-500">Loading your pre-orders...</p>;

  if (!data.length)
    return <p className="text-sm text-gray-500">You have no pre-orders yet.</p>;

  return (
    <div className="mx-auto">
      <h2 className="text-2xl font-bold mb-6">My Pre-Orders</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map((preOrder) => (
          <div
            key={preOrder.id}
            className="border rounded-md shadow-sm p-4 bg-white"
          >
            <div className="flex flex-wrap justify-between text-sm text-gray-600 mb-2">
              <span>
                Created: {format(new Date(preOrder.createdAt), "PPP")}
              </span>
              <span>
                Status:{" "}
                <strong className="text-black">{preOrder.status}</strong>
              </span>
            </div>

            <div className="mb-2 text-sm">
              <strong className="text-gray-700">Scheduled for:</strong>{" "}
              {format(new Date(preOrder.scheduledDate), "PPP")} —{" "}
              {preOrder.mealSlot}
            </div>
            <div className="mb-2 text-sm">
              <strong className="text-gray-700">Restaurant:</strong>{" "}
              {preOrder.restaurantName}
            </div>

            <div className="text-sm space-y-1 mb-4">
              {preOrder.items.map((item, idx) => (
                <div key={idx}>
                  {item.name} × {item.quantity} = ৳{item.quantity * item.price}
                </div>
              ))}
            </div>

            <Button
              className="cursor-pointer"
              variant="destructive"
              disabled={deletingID === preOrder.id}
              onClick={() => cancelPreOrder(preOrder.id)}
            >
              {deletingID === preOrder.id
                ? "Cancelling..."
                : preOrder.status === "CONFIRMED"
                ? "Delete"
                : "Cancel Pre-Order"}
              {}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
