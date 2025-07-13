import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import ConfirmCheckoutClient from "../../_components/ConfirmCheckoutClient";

export default async function PreOrderCheckout({
  params,
}: {
  params: { id: string };
}) {
  const { userId } = await auth();
  if (!userId) return notFound();

  const preOrder = await prisma.preOrder.findUnique({
    where: {
      id: params.id,
      userId,
    },
    include: {
      schedule: true,
    },
  });

  if (!preOrder) return notFound();

  // Collect all menuItem IDs for lookup
  const allItems = preOrder.schedule.flatMap((s) =>
    (s.menuItems as { itemId: string; quantity: number }[]).map((i) => i.itemId)
  );

  const menuItems = await prisma.menuItem.findMany({
    where: { id: { in: allItems } },
    select: {
      id: true,
      name: true,
      price: true,
      restaurant: {
        select: {
          id: true,
          name: true,
          deliveryFee: true,
        },
      },
    },
  });

  // Build price map
  const priceMap = new Map(menuItems.map((item) => [item.id, item]));

  // Group by slot + restaurant
  const grouped = preOrder.schedule.reduce((acc, s) => {
    const key = `${s.mealSlot}_${s.restaurantId}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(s);
    return acc;
  }, {} as Record<string, typeof preOrder.schedule>);

  let grandTotal = 0;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h2 className="text-xl font-bold mb-6">Pre-order Summary</h2>

      <div className="space-y-4">
        {Object.entries(grouped).map(([key, schedules]) => {
          const slot = schedules[0].mealSlot;
          const restaurantId = schedules[0].restaurantId;
          const restaurant = menuItems.find(
            (m) => m.restaurant.id === restaurantId
          )?.restaurant;
          const deliveryFee = restaurant?.deliveryFee || 0;

          let slotTotal = 0;

          // Collect total price for this slot
          const itemsMarkup = schedules.flatMap((s) => {
            const items = s.menuItems as { itemId: string; quantity: number }[];
            return items.map((item, idx) => {
              const menu = priceMap.get(item.itemId);
              const subtotal = (menu?.price || 0) * item.quantity;
              slotTotal += subtotal;
              return (
                <li key={s.id + "_" + idx}>
                  {menu?.name || "Item"} × {item.quantity} = ৳{subtotal}
                </li>
              );
            });
          });

          // Safely accumulate grand total
          grandTotal += slotTotal + deliveryFee;

          return (
            <div key={key} className="border rounded p-4">
              <h3 className="font-semibold mb-2">
                {slot} — {restaurant?.name || "Restaurant"}
              </h3>
              <ul className="text-sm space-y-1">{itemsMarkup}</ul>
              <div className="mt-2 text-sm">Delivery Fee: ৳{deliveryFee}</div>
              <div className="font-medium mt-1">
                Slot Total: ৳{slotTotal + deliveryFee}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 border-t pt-4 space-y-2 text-sm">
        <div>Subtotal: ৳{grandTotal}</div>
        <div>Discount: -৳{preOrder.discountAmount || 0}</div>
        <div className="font-semibold">
          Final Total: ৳{grandTotal - (preOrder.discountAmount || 0)}
        </div>
      </div>

      <ConfirmCheckoutClient
        grandTotal={grandTotal}
        discount={preOrder.discountAmount || 0}
        preOrderId={params.id}
      />
    </div>
  );
}
