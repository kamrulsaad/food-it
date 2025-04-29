"use client";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

type Props = {
  item: { id: string };
};

const DeleteMenu = ({ item }: Props) => {
  const router = useRouter();

  const deleteMenuItem = async () => {
    try {
      const res = await fetch(`/api/menu-items/${item.id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error();

      router.refresh();
      toast.success("Item deleted successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };

  return (
    <DropdownMenuItem
      onClick={deleteMenuItem}
      className="text-red-600 cursor-pointer"
    >
      Delete
    </DropdownMenuItem>
  );
};

export default DeleteMenu;
