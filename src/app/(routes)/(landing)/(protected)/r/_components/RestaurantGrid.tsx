"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import RestaurantCard from "./RestaurantCard";
import { RestaurantPreview } from "@/lib/types";
import RestaurantLoading from "./RestaurantLoading";

export default function RestaurantGrid() {
  const searchParams = useSearchParams();
  const [restaurants, setRestaurants] = useState<RestaurantPreview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const url = new URL("/api/restaurant", window.location.origin);
        url.search = searchParams.toString(); // ← this reflects current filters

        setLoading(true);
        const res = await fetch(url.toString());
        const data: RestaurantPreview[] = await res.json();
        setRestaurants(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, [searchParams]); // ✅ reactive dependency

  if (loading) return <RestaurantLoading />;
  if (!restaurants.length)
    return <p className="py-10 text-center">No restaurants found.</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6">
      {restaurants.map((r) => (
        <RestaurantCard key={r.id} {...r} />
      ))}
    </div>
  );
}
