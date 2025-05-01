"use client";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/cart-context";

export default function CartDrawer() {
  const { cart, removeItem, clearCart, addItem } = useCart();

  const subtotal =
    cart?.items.reduce((sum, item) => sum + item.price * item.quantity, 0) || 0;

  const total = subtotal + (cart?.deliveryFee || 0);

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          className="fixed bottom-6 left-6 cursor-pointer z-50 shadow-lg"
        >
          View Cart ({cart?.items.length ?? 0})
        </Button>
      </DrawerTrigger>

      <DrawerContent className="max-w-md mr-auto">
        <DrawerHeader>
          <DrawerTitle className="text-lg font-bold">Your Order</DrawerTitle>
        </DrawerHeader>

        <div className="p-4 space-y-4 max-h-[70vh] overflow-y-auto">
          {cart && cart.items.length > 0 ? (
            <>
              <div className="text-sm text-muted-foreground">
                {cart.restaurantName} — ৳{cart.deliveryFee} Delivery Fee
              </div>

              {cart.items.map((item) => (
                <div
                  key={item.itemId}
                  className="border rounded-md p-4 flex justify-between items-start gap-4 bg-white shadow-sm"
                >
                  {/* Left: Info */}
                  <div className="flex flex-col gap-1">
                    <span className="font-semibold text-sm">{item.name}</span>
                    {item.note && (
                      <span className="text-xs italic text-muted-foreground">
                        “{item.note}”
                      </span>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-6 px-2 cursor-pointer"
                        onClick={() =>
                          item.quantity > 1
                            ? removeItem(item.itemId)
                            : removeItem(item.itemId)
                        }
                      >
                        −
                      </Button>
                      <span className="text-sm font-medium">
                        {item.quantity}
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-6 px-2 cursor-pointer"
                        onClick={() =>
                          addItem(
                            {
                              id: cart.restaurantId,
                              name: cart.restaurantName,
                              deliveryFee: cart.deliveryFee,
                            },
                            {
                              itemId: item.itemId,
                              name: item.name,
                              price: item.price,
                              quantity: 1,
                              note: item.note,
                            }
                          )
                        }
                      >
                        +
                      </Button>
                    </div>
                  </div>

                  {/* Right: Price + Remove */}
                  <div className="flex flex-col items-end gap-1 text-sm">
                    <span className="font-semibold">
                      ৳{item.price * item.quantity}
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-red-500 text-xs px-0 cursor-pointer py-0 h-auto hover:bg-transparent"
                      onClick={() => removeItem(item.itemId)}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}

              <div className="space-y-2 text-sm font-medium">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>৳{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery</span>
                  <span>৳{cart.deliveryFee}</span>
                </div>
                <div className="flex justify-between text-base font-bold">
                  <span>Total</span>
                  <span>৳{total}</span>
                </div>
              </div>

              <Button className="w-full mt-4 cursor-pointer">
                Proceed to Checkout
              </Button>
              <Button
                variant="ghost"
                className="w-full text-red-500 cursor-pointer"
                onClick={clearCart}
              >
                Clear Cart
              </Button>
            </>
          ) : (
            <p className="text-sm text-muted-foreground text-center mt-10">
              Your cart is empty.
            </p>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
