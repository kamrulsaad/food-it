import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { getApprovedRestaurants } from "@/queries/restaurant";

export default async function RestaurantDeals() {
  const restaurants = await getApprovedRestaurants();

  return (
    <section className="w-full px-4 sm:px-10 md:px-20 xl:px-40 py-6">
      <h2 className="text-2xl md:text-3xl font-semibold mb-6">
        Daily deals on Food IT
      </h2>

      <div className="flex gap-5 overflow-x-auto pb-2 no-scrollbar">
        {restaurants.length > 0 ? (
          restaurants.map((restaurant) => (
            <Link
              key={restaurant.id}
              href={`/r/${restaurant.id}`}
              className="min-w-[260px] max-w-[260px] bg-white rounded-xl shadow border overflow-hidden cursor-pointer hover:shadow-md transition"
            >
              <div className="relative">
                <Image
                  src={restaurant.logo || "/assets/restaurent-demo.jpeg"}
                  alt={restaurant.name}
                  width={260}
                  height={160}
                  className="object-contain w-full h-[160px]"
                />
                <div className="absolute top-2 left-2 bg-primary text-white text-xs font-semibold rounded px-2 py-1">
                  Tk. 100 off Tk. 699
                </div>
                <div className="absolute mt-1 top-8 left-2 bg-primary text-white text-xs font-semibold rounded px-2 py-1">
                  Gift: Free delivery
                </div>
              </div>
              <div className="p-3">
                <h3 className="text-sm font-bold truncate mb-1">
                  {restaurant.name}
                </h3>
                <div className="flex items-center text-xs text-gray-500 mb-1">
                  <Star size={12} className="text-yellow-500 mr-1" />
                  4.8 (250+)
                </div>
                <p className="text-xs text-gray-500">15-30 min • ৳ Free</p>
              </div>
            </Link>
          ))
        ) : (
          <p className="text-gray-500 text-sm">No approved restaurants yet.</p>
        )}
      </div>
    </section>
  );
}
