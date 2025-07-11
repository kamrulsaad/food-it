"use client";

import { toast } from "sonner";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";

interface ApproveRiderButtonProps {
  approveRider: () => Promise<void>;
}

export function ApproveRiderButton({
  approveRider,
}: ApproveRiderButtonProps) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      onClick={() => {
        startTransition(async () => {
          try {
            await approveRider();
            toast.success("Rider Approved Successfully!");
          } catch (error) {
            console.error("Error approving Rider:", error);
            // toast.error("Something went wrong!");
          }
        });
      }}
      disabled={isPending}
      variant="default"
      className="cursor-pointer mt-2"
    >
      {isPending ? "Approving..." : "Approve Rider"}
    </Button>
  );
}
