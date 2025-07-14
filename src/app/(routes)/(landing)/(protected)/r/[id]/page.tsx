// app/r/[id]/page.tsx
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import MenuItemCard from "./_components/MenuItemCard";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function RestaurantPage({ params }: Props) {
  const { id } = await params;

  const restaurant = await prisma.restaurant.findUnique({
    where: { id, approved: true },
    include: {
      menuItems: {
        where: { available: true },
        include: { category: true },
        orderBy: { name: "asc" },
      },
    },
  });

  if (!restaurant) return notFound();

  const categorizedMenu = restaurant.menuItems.reduce((acc, item) => {
    const cat = item.category?.name || "Uncategorized";
    acc[cat] = acc[cat] || [];
    acc[cat].push(item);
    return acc;
  }, {} as Record<string, typeof restaurant.menuItems>);

  return (
    <div className="pt-5 pb-10 space-y-10">
      {/* Restaurant Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
        <Image
          src={restaurant.logo}
          alt={restaurant.name}
          width={80}
          height={80}
          className="rounded-xl border object-cover"
        />
        <div>
          <h1 className="text-2xl font-bold">{restaurant.name}</h1>
          <p className="text-muted-foreground text-sm">
            Delivery Fee: ৳{restaurant.deliveryFee} • {restaurant.deliveryTime}{" "}
            mins
          </p>
        </div>
      </div>

      {/* Categorized Menu */}
      <div className="space-y-10">
        {Object.entries(categorizedMenu).map(([category, items]) => (
          <div key={category}>
            <h2 className="text-xl font-semibold mb-4">{category}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((item) => (
                <MenuItemCard
                  key={item.id}
                  item={{
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    description: item.description || "",
                    imageUrl: item.imageUrl || "",
                  }}
                  restaurant={{
                    id: restaurant.id,
                    name: restaurant.name,
                    deliveryFee: restaurant.deliveryFee,
                  }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
