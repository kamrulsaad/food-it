// components/restaurant/restaurant-deals.tsx
import Image from "next/image";
import { Star } from "lucide-react";

const restaurants = [
  {
    name: "Sausly’s Foods",
    image: "/demo/sauslys.png",
    rating: 4.9,
    reviews: "1000+",
    tags: ["Dessert", "Price Match"],
    time: "10-25 min",
    fee: "Free",
    deal: "Tk. 100 off Tk. 699",
    gift: "Free delivery",
  },
  {
    name: "Kacchi Bhai",
    image: "/demo/kacchi.png",
    rating: 4.8,
    reviews: "25000+",
    tags: ["Biryani", "Price Match"],
    time: "15-30 min",
    fee: "Free",
    deal: "Tk. 125 off Tk. 700",
    gift: "Free delivery",
  },
  {
    name: "Sultan’s Dine",
    image: "/demo/sultans.png",
    rating: 4.8,
    reviews: "25000+",
    tags: ["Bangladeshi", "Price Match"],
    time: "10-25 min",
    fee: "Free",
    deal: "Tk. 100 off Tk. 699",
    gift: "Free delivery",
  },
  {
    name: "Glazed – Gulshan",
    image: "/demo/glazed.png",
    rating: 4.9,
    reviews: "5000+",
    tags: ["Dessert", "Price Match"],
    time: "10-25 min",
    fee: "Free",
    deal: "Tk. 200 off Tk. 699",
    gift: "Free delivery",
  },
  {
    name: "Best Fried Chicken",
    image: "/demo/bfc.png",
    rating: 4.9,
    reviews: "10000+",
    tags: ["Fried Chicken", "Price Match"],
    time: "15-30 min",
    fee: "Free",
    deal: "Tk. 100 off Tk. 699",
    gift: "Free delivery",
  },
];

export default function RestaurantDeals() {
  return (
    <section className="w-full px-4 sm:px-10 md:px-20 xl:px-40 py-6">
      <h2 className="text-2xl md:text-3xl font-semibold mb-6">
        Daily deals on Food IT
      </h2>
      <div className="flex gap-5 overflow-x-auto pb-2 no-scrollbar">
        {restaurants.map((restaurant, index) => (
          <div
            key={index}
            className="min-w-[260px] max-w-[260px] bg-white rounded-xl shadow border overflow-hidden"
          >
            <div className="relative">
              <Image
                src="/assets/restaurent-demo.jpeg"
                alt={restaurant.name}
                width={260}
                height={160}
                className="object-cover w-full h-[160px]"
              />
              <div className="absolute top-2 left-2 bg-primary text-white text-xs font-semibold rounded px-2 py-1">
                {restaurant.deal}
              </div>
              <div className="absolute mt-1 top-8 left-2 bg-primary text-white text-xs font-semibold rounded px-2 py-1">
                Gift: {restaurant.gift}
              </div>
            </div>
            <div className="p-3">
              <h3 className="text-sm font-bold truncate mb-1">
                {restaurant.name}
              </h3>
              <div className="flex items-center text-xs text-gray-500 mb-1">
                <Star size={12} className="text-yellow-500 mr-1" />
                {restaurant.rating} ({restaurant.reviews})
              </div>
              <p className="text-xs text-gray-500 mb-1 truncate">
                {restaurant.tags.join(" • ")}
              </p>
              <p className="text-xs text-gray-500">
                {restaurant.time} • ৳ {restaurant.fee}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
