import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import Image from "next/image";
import { Star } from "lucide-react";

interface Props {
  params: {
    id: string;
  };
}

export default async function RestaurantDetailsPage({ params }: Props) {
  const restaurant = await prisma.restaurant.findUnique({
    where: { id: params.id, approved: true },
    include: {
      menuItems: {
        where: { available: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!restaurant) notFound();

  return (
    <div className="w-full px-4 sm:px-10 md:px-20 xl:px-40 py-6 space-y-8">
      {/* Restaurant Header */}
      <div className="flex flex-col sm:flex-row items-start gap-6">
        <Image
          src={restaurant.logo || "/assets/restaurent-demo.jpeg"}
          alt={restaurant.name}
          width={120}
          height={120}
          className="rounded-md object-cover border"
        />
        <div>
          <h1 className="text-2xl font-bold mb-1">{restaurant.name}</h1>
          <p className="text-sm text-muted-foreground mb-1">
            {restaurant.city} • {restaurant.address}
          </p>
          <p className="text-sm text-muted-foreground">
            Phone: {restaurant.phone}
          </p>
          <div className="mt-2 flex items-center text-sm">
            <Star size={14} className="text-yellow-500 mr-1" />
            4.8 (250+ reviews)
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Menu</h2>

        {restaurant.menuItems.length === 0 && (
          <p className="text-muted-foreground text-sm">
            No menu items available.
          </p>
        )}

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {restaurant.menuItems.map((item) => (
            <div
              key={item.id}
              className="bg-white border rounded-md shadow hover:shadow-md transition"
            >
              <div className="relative h-40 w-full">
                <Image
                  src={item.imageUrl || "/assets/food-demo.jpg"}
                  alt={item.name}
                  fill
                  className="rounded-t-md object-cover"
                />
              </div>
              <div className="p-3 space-y-1">
                <h3 className="text-sm font-semibold">{item.name}</h3>
                <p className="text-xs text-muted-foreground truncate">
                  {item.description || "No description"}
                </p>
                <p className="text-orange-600 font-medium">
                  ৳ {Number(item.price).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
