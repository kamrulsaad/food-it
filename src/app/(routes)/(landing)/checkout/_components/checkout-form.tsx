"use client";

import { useCart } from "@/context/cart-context";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2Icon } from "lucide-react";
import CartSummary from "./cart-summary";

export default function CheckoutForm() {
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

      console.log("Order response:", res);

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
    <div className="">
      <h2 className="text-2xl font-bold">Checkout</h2>

      <CartSummary cart={cart} />

      <div className="space-y-4 mt-2">
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

      <Button
        disabled={loading}
        onClick={handleSubmit}
        className="w-full cursor-pointer mt-2"
      >
        {loading && <Loader2Icon className="animate-spin mr-2 h-4 w-4" />}
        Place Order
      </Button>
    </div>
  );
}
