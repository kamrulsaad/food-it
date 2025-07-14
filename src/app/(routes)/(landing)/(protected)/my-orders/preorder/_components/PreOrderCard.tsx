"use client";

import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import EditTimeModal from "./EditTimeModal";

export default function PreOrderCard({
  preOrder,
  isProcessing,
  onAction,
  onSuccess, // ✅ Add this
}: {
  preOrder: {
    id: string;
    mealSlot: string;
    scheduledDate: string;
    restaurantName: string;
    items: { name: string; price: number; quantity: number }[];
    createdAt: string;
    status: string;
  }; // your type
  isProcessing: boolean;
  onAction: () => void;
  onSuccess: () => void; // ✅ Here too
}) {
  const total = preOrder.items.reduce(
    (sum, i) => sum + i.quantity * i.price,
    0
  );

  const showDelete =
    preOrder.status === "CONVERTED" || preOrder.status === "CANCELLED";
  const showCancel = preOrder.status === "PENDING";

  return (
    <div className="border rounded-md shadow-sm p-4 bg-white">
      <div className="flex justify-between text-sm text-gray-600 mb-2">
        <span>Created: {format(new Date(preOrder.createdAt), "PPP")}</span>
        <span>
          Status: <strong className="text-black">{preOrder.status}</strong>
        </span>
      </div>
      <div className="text-sm mb-1">
        <strong>Scheduled:</strong>{" "}
        {format(new Date(preOrder.scheduledDate), "PPP p")}
      </div>
      <div className="text-sm mb-1">
        <strong>Restaurant:</strong> {preOrder.restaurantName}
      </div>
      <div className="text-sm space-y-1 my-2">
        {preOrder.items.map((item, idx) => (
          <div key={idx}>
            {item.name} × {item.quantity} = ৳{item.quantity * item.price}
          </div>
        ))}
      </div>
      <div className="font-semibold mb-3">Total: ৳{total}</div>4
      {preOrder.status === "PENDING" && (
        <EditTimeModal
          id={preOrder.id}
          currentDateTime={new Date(preOrder.scheduledDate)}
          onSuccess={onSuccess} // this will be passed from parent
        />
      )}
      {showCancel || showDelete ? (
        <Button
          variant="destructive"
          onClick={onAction}
          className="cursor-pointer w-full mt-2"
          disabled={isProcessing}
        >
          {isProcessing
            ? showDelete
              ? "Deleting..."
              : "Cancelling..."
            : showDelete
              ? "Delete"
              : "Cancel Pre-Order"}
        </Button>
      ) : null}
    </div>
  );
}
