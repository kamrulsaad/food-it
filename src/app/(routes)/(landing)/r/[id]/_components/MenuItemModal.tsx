"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState } from "react";
import { useCart } from "@/context/cart-context";

interface MenuItemModalProps {
  open: boolean;
  onClose: () => void;
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

export default function MenuItemModal({
  open,
  onClose,
  item,
  restaurant,
}: MenuItemModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState("");
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem(
      {
        id: restaurant.id,
        name: restaurant.name,
        deliveryFee: restaurant.deliveryFee,
      },
      {
        itemId: item.id,
        name: item.name,
        price: item.price,
        quantity,
        note,
      }
    );
    onClose(); // close modal
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-6 space-y-4">
        <DialogHeader>
          <DialogTitle className="text-xl">{item.name}</DialogTitle>
        </DialogHeader>

        {item.imageUrl && (
          <div className="relative w-full h-48">
            <Image
              src={item.imageUrl}
              alt={item.name}
              fill
              className="object-contain rounded-md"
            />
          </div>
        )}

        <div className="text-sm text-muted-foreground">{item.description}</div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Special instructions
          </label>
          <textarea
            className="w-full border rounded-md px-3 py-2 text-sm"
            placeholder="e.g., No mayo"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="cursor-pointer"
            >
              −
            </Button>
            <span className="w-6 text-center">{quantity}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setQuantity(quantity + 1)}
              className="cursor-pointer"
            >
              +
            </Button>
          </div>

          <Button
            className="text-sm font-semibold cursor-pointer"
            onClick={handleAddToCart}
          >
            Add {quantity} • ৳{item.price * quantity}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
