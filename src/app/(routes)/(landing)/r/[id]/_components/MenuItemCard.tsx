// _components/MenuItemCard.tsx
"use client";

import { useState } from "react";
import MenuItemModal from "./MenuItemModal";
import Image from "next/image";

interface Props {
  item: {
    id: string;
    name: string;
    price: number;
    description?: string;
    imageUrl?: string;
  };
  restaurant: {
    id: string;
    name: string;
    deliveryFee: number;
  };
}

export default function MenuItemCard({ item, restaurant }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        className="p-4 border rounded-lg bg-white hover:shadow-md cursor-pointer transition"
        onClick={() => setOpen(true)}
      >
        <div className="flex justify-between items-start gap-4">
          <div>
            <h3 className="font-semibold text-sm">{item.name}</h3>
            <p className="text-muted-foreground text-xs line-clamp-2">
              {item.description}
            </p>
            <p className="text-sm font-medium mt-1">৳{item.price}</p>
          </div>
          {item.imageUrl && (
            <div className="relative w-16 h-16 shrink-0">
              <Image
                src={item.imageUrl}
                alt={item.name}
                fill
                className="object-contain rounded-md"
              />
            </div>
          )}
        </div>
      </div>

      <MenuItemModal
        open={open}
        onClose={() => setOpen(false)}
        item={item}
        restaurant={restaurant}
      />
    </>
  );
}
