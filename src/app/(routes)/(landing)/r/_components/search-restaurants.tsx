"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface Restaurant {
  id: string;
  name: string;
  logo: string | null;
  city: string;
  address: string;
  phone: string;
}

interface SearchRestaurantsProps {
  restaurants: Restaurant[];
}

export default function SearchRestaurants({
  restaurants,
}: SearchRestaurantsProps) {
  const [query, setQuery] = useState("");

  const filtered = restaurants.filter(
    (r) =>
      r.name.toLowerCase().includes(query.toLowerCase()) ||
      r.city.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <input
        type="text"
        placeholder="Search by name or city..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
      />

      {filtered.length === 0 ? (
        <p className="text-muted-foreground text-sm">No restaurants found.</p>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filtered.map((restaurant) => (
            <Link
              href={`/user/restaurant/${restaurant.id}`}
              key={restaurant.id}
              className="bg-white border rounded-lg shadow hover:shadow-md transition overflow-hidden cursor-pointer"
            >
              <div className="relative w-full h-40">
                <Image
                  src={restaurant.logo || "/assets/restaurent-demo.jpeg"}
                  alt={restaurant.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4 space-y-1">
                <h2 className="text-lg font-semibold">{restaurant.name}</h2>
                <p className="text-sm text-muted-foreground">
                  {restaurant.city}
                </p>
                <p className="text-xs text-muted-foreground">
                  {restaurant.address}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
