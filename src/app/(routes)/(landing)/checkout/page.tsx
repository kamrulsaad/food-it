"use client";

import { useCart } from "@/context/cart-context";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2Icon } from "lucide-react";

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  if (!cart || cart.items.length === 0) {
    return (
      <p className="text-center py-10 text-muted-foreground">
        Your cart is empty.
      </p>
    );
  }

  const subtotal = cart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const total = subtotal + cart.deliveryFee;

  const handleSubmit = async () => {
    if (!name || !phone || !address) {
      toast.error("Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          restaurantId: cart.restaurantId,
          items: cart.items,
          totalAmount: total,
          deliveryFee: cart.deliveryFee,
          address,
          name,
          phone,
        }),
      });

      if (!res.ok) throw new Error("Order failed");

      toast.success("Order placed successfully");
      clearCart();
      router.push("/thank-you");
    } catch (err) {
      console.error("Order submission error:", err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-10 md:px-20 xl:px-40 py-10 space-y-6">
      <h2 className="text-2xl font-bold">Checkout</h2>

      {/* Cart Summary */}
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
            <span>৳{total}</span>
          </div>
        </div>
      </div>

      {/* Delivery Info Form */}
      <div className="space-y-4">
        <Input
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <Textarea
          placeholder="Delivery Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </div>

      <Button disabled={loading} onClick={handleSubmit} className="w-full">
        {loading && <Loader2Icon className="animate-spin" />}
        Place Order
      </Button>
    </div>
  );
}
