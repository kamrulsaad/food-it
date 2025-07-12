// /app/dash/rider/_components/availability-toggle.tsx
"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface Props {
  initialStatus: boolean;
}

export default function AvailabilityToggle({ initialStatus }: Props) {
  const [isAvailable, setIsAvailable] = useState(initialStatus);
  const [loading, setLoading] = useState(false);

  const toggleAvailability = async (newValue: boolean) => {
    setIsAvailable(newValue);
    setLoading(true);
    try {
      const res = await fetch("/api/rider/availability", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ available: newValue }),
      });

      if (!res.ok) throw new Error("Failed to update availability");

      toast.success(
        newValue
          ? "You are now available for deliveries"
          : "You are now unavailable"
      );
    } catch (err) {
      console.error(err);
      toast.error("Failed to update availability");
      setIsAvailable(!newValue); // revert
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-4 mt-4">
      <Label htmlFor="availability-switch">Available for Delivery</Label>
      <Switch
        id="availability-switch"
        checked={isAvailable}
        disabled={loading}
        onCheckedChange={toggleAvailability}
      />
    </div>
  );
}
