"use client";

import { toast } from "sonner";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";

interface ApproveRestaurantButtonProps {
  approveRestaurant: () => Promise<void>;
}

export function ApproveRestaurantButton({
  approveRestaurant,
}: ApproveRestaurantButtonProps) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      onClick={() => {
        startTransition(async () => {
          try {
            await approveRestaurant();
            toast.success("Restaurant Approved Successfully!");
          } catch (error) {
            console.error("Error approving restaurant:", error);
            toast.error("Something went wrong!");
          }
        });
      }}
      disabled={isPending}
      variant="default"
      className="cursor-pointer"
    >
      {isPending ? "Approving..." : "Approve Restaurant"}
    </Button>
  );
}
