"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { confirmPreOrder } from "./actions"; // We'll create this below

export default function ConfirmCheckoutClient({
  grandTotal,
  discount,
  preOrderId,
}: {
  grandTotal: number;
  discount: number;
  preOrderId: string;
}) {
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const finalTotal = grandTotal - discount;

  const handleConfirm = async () => {
    if (!address.trim()) {
      toast.error("Please enter your delivery address.");
      return;
    }

    setLoading(true);
    try {
      await confirmPreOrder({
        id: preOrderId,
        totalAmount: finalTotal,
        address,
      });

      toast.success("Pre-order confirmed!");
      router.push("/my-orders/preorder");
    } catch (err) {
      console.error("Checkout error:", err);
      toast.error("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6 space-y-3">
      <Input
        placeholder="Enter your delivery address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />

      <Button
        onClick={handleConfirm}
        disabled={loading}
        className="cursor-pointer"
      >
        {loading ? (
          <div className="flex items-center gap-2">
            <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
            Processing...
          </div>
        ) : (
          "Confirm Pre-order"
        )}
      </Button>
    </div>
  );
}
