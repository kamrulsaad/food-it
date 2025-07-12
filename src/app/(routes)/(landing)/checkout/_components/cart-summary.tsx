// /app/checkout/_components/cart-summary.tsx
import React from "react";

interface Props {
  cart: {
    restaurantName: string;
    deliveryFee: number;
    items: {
      itemId: string;
      name: string;
      quantity: number;
      price: number;
    }[];
  };
}

export default function CartSummary({ cart }: Props) {
  const subtotal = cart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="space-y-3 text-sm">
      <p className="font-medium">Restaurant: {cart.restaurantName}</p>
      {cart.items.map((item) => (
        <div key={item.itemId} className="flex justify-between border-b py-2">
          <div>
            <p>{item.name}</p>
            <p className="text-xs text-muted-foreground">
              Qty: {item.quantity}
            </p>
          </div>
          <p>৳{item.price * item.quantity}</p>
        </div>
      ))}
      <div className="pt-2 space-y-1">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>৳{subtotal}</span>
        </div>
        <div className="flex justify-between">
          <span>Delivery Fee</span>
          <span>৳{cart.deliveryFee}</span>
        </div>
        <div className="flex justify-between font-semibold">
          <span>Total</span>
          <span>৳{subtotal + cart.deliveryFee}</span>
        </div>
      </div>
    </div>
  );
}
