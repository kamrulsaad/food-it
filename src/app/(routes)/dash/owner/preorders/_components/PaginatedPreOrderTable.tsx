"use client";

import { format } from "date-fns";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { RestaurantPreOrder } from "@/types/preorder";

interface Props {
  preorders: RestaurantPreOrder[];
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function PaginatedPreOrderTable({
  preorders,
  page,
  totalPages,
  onPageChange,
}: Props) {
  const [localOrders, setLocalOrders] = useState(preorders);
  const [loadingMap, setLoadingMap] = useState<
    Record<string, "confirm" | "cancel" | null>
  >({});

  useEffect(() => {
    setLocalOrders(preorders);
  }, [preorders]);

  const updateStatus = async (
    id: string,
    status: "CONFIRMED" | "CANCELLED_BY_RESTAURANT"
  ) => {
    setLoadingMap((prev) => ({
      ...prev,
      [id]: status === "CONFIRMED" ? "confirm" : "cancel",
    }));

    const res = await fetch(`/api/restaurant/preorders/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    if (res.ok) {
      toast.success(
        `Pre-order ${status === "CONFIRMED" ? "confirmed" : "cancelled"}`
      );
      setLocalOrders((prev) =>
        prev.map((order) => (order.id === id ? { ...order, status } : order))
      );
    } else {
      toast.error("Failed to update pre-order");
    }

    setLoadingMap((prev) => ({ ...prev, [id]: null }));
  };

  return (
    <div className="overflow-x-auto border rounded mb-4">
      <table className="w-full text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2">Scheduled</th>
            <th className="px-4 py-2">Meal Slot</th>
            <th className="px-4 py-2">Items</th>
            <th className="px-4 py-2">Customer</th>
            <th className="px-4 py-2">Address</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {localOrders.map((p) => (
            <tr key={p.id} className="border-t">
              <td className="px-4 py-2">
                {format(new Date(p.scheduledDate), "PPP p")}
              </td>
              <td className="px-4 py-2">{p.mealSlot}</td>
              <td className="px-4 py-2">
                <ul className="space-y-1">
                  {p.items.map((item, i) => (
                    <li key={i}>
                      {item.name} × {item.quantity} = ৳
                      {item.price * item.quantity}
                    </li>
                  ))}
                </ul>
              </td>
              <td className="px-4 py-2">{p.customer.email}</td>
              <td className="px-4 py-2">{p.customer.address}</td>
              <td className="px-4 py-2 font-medium">{p.status}</td>
              <td className="px-4 py-2 space-x-2">
                {p.status === "PENDING" && (
                  <>
                    <Button
                      size="sm"
                      onClick={() => updateStatus(p.id, "CONFIRMED")}
                      disabled={loadingMap[p.id] === "confirm"}
                      className="cursor-pointer"
                    >
                      {loadingMap[p.id] === "confirm"
                        ? "Confirming..."
                        : "Confirm"}
                    </Button>
                    <Button
                      size="sm"
                      className="cursor-pointer"
                      variant="destructive"
                      onClick={() =>
                        updateStatus(p.id, "CANCELLED_BY_RESTAURANT")
                      }
                      disabled={loadingMap[p.id] === "cancel"}
                    >
                      {loadingMap[p.id] === "cancel"
                        ? "Cancelling..."
                        : "Cancel"}
                    </Button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className="flex justify-center border-t items-center gap-2 px-4 py-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page - 1)}
            className="cursor-pointer"
            disabled={page === 1}
          >
            Prev
          </Button>
          <span className="text-xs">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            className="cursor-pointer"
            onClick={() => onPageChange(page + 1)}
            disabled={page === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
