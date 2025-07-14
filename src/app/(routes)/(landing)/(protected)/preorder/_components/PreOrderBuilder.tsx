// src/app/(routes)/(landing)/preorder/_components/PreOrderBuilder.tsx
"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type MealSlot = "BREAKFAST" | "LUNCH" | "DINNER";

type Restaurant = {
  id: string;
  name: string;
  menuItems: {
    id: string;
    name: string;
    price: number;
  }[];
};

type ItemSelection = {
  restaurantId: string;
  itemId: string;
  quantity: number;
};

type MealSelections = {
  [key in MealSlot]?: ItemSelection[];
};

export default function PreOrderBuilder({
  availableRestaurants,
}: {
  availableRestaurants: Restaurant[];
}) {
  const [mealSelections, setMealSelections] = useState<MealSelections>({});
  const [days, setDays] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState("");

  const router = useRouter();

  const filteredRestaurants = availableRestaurants.filter(
    (r) =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.menuItems.some((m) =>
        m.name.toLowerCase().includes(search.toLowerCase())
      )
  );

  const addItemToSlot = (
    slot: MealSlot,
    restaurantId: string,
    itemId: string
  ) => {
    setMealSelections((prev) => {
      const existing = prev[slot] || [];
      const already = existing.find(
        (item) => item.itemId === itemId && item.restaurantId === restaurantId
      );
      let updated: ItemSelection[];

      if (already) {
        updated = existing.map((item) =>
          item.itemId === itemId && item.restaurantId === restaurantId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        updated = [...existing, { restaurantId, itemId, quantity: 1 }];
      }

      return { ...prev, [slot]: updated };
    });
  };

  const updateQuantity = (
    slot: MealSlot,
    restaurantId: string,
    itemId: string,
    quantity: number
  ) => {
    setMealSelections((prev) => {
      const existing = prev[slot] || [];
      const updated = existing.map((item) =>
        item.itemId === itemId && item.restaurantId === restaurantId
          ? { ...item, quantity }
          : item
      );
      return { ...prev, [slot]: updated };
    });
  };

  const removeItem = (slot: MealSlot, restaurantId: string, itemId: string) => {
    setMealSelections((prev) => {
      const filtered = (prev[slot] || []).filter(
        (item) =>
          !(item.itemId === itemId && item.restaurantId === restaurantId)
      );
      return { ...prev, [slot]: filtered };
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    const selectedItems = Object.entries(mealSelections).flatMap(
      ([mealSlot, items]) => {
        return items!.map((item) => ({
          restaurantId: item.restaurantId,
          mealSlot,
          itemId: item.itemId,
          quantity: item.quantity,
        }));
      }
    );

    if (!selectedItems.length) {
      toast.error("Please select at least one item.");
      return;
    }

    if (!address) {
      toast.error("Please enter a delivery address.");
      setLoading(false);
      return;
    }

    const res = await fetch("/api/preorder", {
      method: "POST",
      body: JSON.stringify({
        startDate: new Date().toISOString(),
        days,
        selectedItems,
        address,
      }),
    });

    const data = await res.json();
    if (res.ok) {
      setLoading(false);
      toast.success("Pre-order(s) submitted!");
      setMealSelections({});
      router.push("/my-orders/preorder"); // Refresh to clear state or show pre-order list later
    } else {
      setLoading(false);
      toast.error(data.error || "Failed to submit pre-order.");
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* LEFT: Meal Slot Selections */}
      <div className="space-y-6">
        <div className="space-y-2">
          <Label>Number of Days (1–7)</Label>
          <Input
            type="number"
            min={1}
            max={7}
            value={days}
            onChange={(e) => setDays(parseInt(e.target.value))}
          />
        </div>

        {(["BREAKFAST", "LUNCH", "DINNER"] as MealSlot[]).map((slot) => (
          <div key={slot} className="border p-4 rounded-md space-y-2">
            <h3 className="font-semibold text-sm">{slot}</h3>

            {(mealSelections[slot] || []).map((entry) => {
              const restaurant = availableRestaurants.find(
                (r) => r.id === entry.restaurantId
              );
              const item = restaurant?.menuItems.find(
                (m) => m.id === entry.itemId
              );
              return (
                <div
                  key={entry.itemId}
                  className="flex items-center justify-between gap-2 text-sm"
                >
                  <span>
                    {restaurant?.name} — {item?.name} (৳{item?.price})
                  </span>
                  <div className="flex items-center gap-1">
                    <Input
                      type="number"
                      className="w-16"
                      value={entry.quantity}
                      onChange={(e) =>
                        updateQuantity(
                          slot,
                          entry.restaurantId,
                          entry.itemId,
                          parseInt(e.target.value)
                        )
                      }
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() =>
                        removeItem(slot, entry.restaurantId, entry.itemId)
                      }
                    >
                      ✕
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        ))}

        <div className="space-y-2">
          <Label htmlFor="address">Delivery Address</Label>
          <Input
            id="address"
            placeholder="Enter your delivery address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>

        <Button
          disabled={loading}
          className="w-full mt-4 cursor-pointer"
          onClick={handleSubmit}
        >
          {loading ? "Submitting..." : "Submit Pre-Order"}
        </Button>
      </div>

      {/* RIGHT: Restaurant + Item Picker */}
      <div className="space-y-4">
        <Input
          placeholder="Search restaurant or item..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
          {filteredRestaurants.map((r) => (
            <div key={r.id} className="border p-4 rounded-md">
              <h4 className="font-semibold text-sm mb-2">{r.name}</h4>
              <div className="space-y-2">
                {r.menuItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between text-sm"
                  >
                    <span>
                      {item.name}{" "}
                      <span className="text-xs text-gray-500">
                        ৳{item.price}
                      </span>
                    </span>
                    <div className="flex gap-2">
                      {(["BREAKFAST", "LUNCH", "DINNER"] as MealSlot[]).map(
                        (slot) => (
                          <Button
                            key={slot}
                            variant="outline"
                            size="sm"
                            onClick={() => addItemToSlot(slot, r.id, item.id)}
                          >
                            {slot[0]}
                          </Button>
                        )
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
