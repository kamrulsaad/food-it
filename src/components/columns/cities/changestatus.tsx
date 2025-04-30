import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

type Props = {
  item: { id: string };
};

const ChangeCityStatus = ({ item }: Props) => {
  const router = useRouter();

  return (
    <DropdownMenuItem
      onClick={async () => {
        try {
          const res = await fetch(`/api/cities/${item.id}`, {
            method: "PATCH",
          });

          if (!res.ok) throw new Error();

          toast.success("Status updated successfully!");
          router.refresh();
        } catch (err) {
          console.error(err);
          toast.error("Something went wrong");
        }
      }}
      className="cursor-pointer"
    >
      Change Status
    </DropdownMenuItem>
  );
};

export default ChangeCityStatus;
