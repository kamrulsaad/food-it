"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import PreOrderCard from "./PreOrderCard";
import SkeletonLoader from "./SkeletonLoader";

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

export default function PreOrderList() {
  const [data, setData] = useState<PreOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingID, setDeletingID] = useState<string>("");

  const fetchData = () => {
    setLoading(true);
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

  const handleDeleteOrCancel = async (id: string) => {
    setDeletingID(id);
    const res = await fetch(`/api/customer/preorders/${id}`, {
      method: "DELETE",
    });
    const data = await res.json();

    if (res.ok) {
      toast.success(data.message);
      fetchData();
    } else {
      toast.error("Action failed.");
    }
    setDeletingID("");
  };

  if (loading) return <SkeletonLoader />;

  if (!data.length)
    return <p className="text-sm text-gray-500">You have no pre-orders yet.</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {data.map((preOrder) => (
        <PreOrderCard
          key={preOrder.id}
          preOrder={preOrder}
          isProcessing={deletingID === preOrder.id}
          onAction={() => handleDeleteOrCancel(preOrder.id)}
          onSuccess={fetchData} // ✅ Pass fetchData as onSuccess
        />
      ))}
    </div>
  );
}
