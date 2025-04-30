"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Category = {
  id: string;
  name: string;
};

export default function SidebarFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [categories, setCategories] = useState<Category[]>([]);

  const updateQuery = (key: string, value: string | null) => {
    const params = new URLSearchParams(window.location.search);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/r?${params.toString()}`);
  };

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await fetch("/api/categories");
      const data = await res.json();
      setCategories(data);
    };
    fetchCategories();
  }, []);

  return (
    <aside className="w-full bg-white border rounded-xl p-4 shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Filters</h2>

      {/* Sort By */}
      <div className="mb-6">
        <h3 className="font-medium mb-2">Sort by</h3>
        <div className="space-y-1">
          {["deliveryTime", "price"].map((type) => (
            <button
              key={type}
              onClick={() => updateQuery("sort", type)}
              className={`block w-full text-left px-3 py-1.5 rounded hover:bg-gray-100 ${
                searchParams.get("sort") === type
                  ? "bg-gray-200 font-semibold"
                  : ""
              }`}
            >
              {type === "deliveryTime" ? "Delivery Time" : "Price"}
            </button>
          ))}
        </div>
      </div>

      {/* Category */}
      <div className="mb-6">
        <h3 className="font-medium mb-2">Category</h3>
        <div className="space-y-1 max-h-40 overflow-y-auto">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => updateQuery("category", cat.name)}
              className={`block w-full text-left px-3 py-1.5 rounded hover:bg-gray-100 ${
                searchParams.get("category") === cat.name
                  ? "bg-gray-200 font-semibold"
                  : ""
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Delivery Fee */}
      <div className="mb-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            onChange={(e) =>
              updateQuery("freeDelivery", e.target.checked ? "1" : null)
            }
            checked={searchParams.get("freeDelivery") === "1"}
          />
          <span>Free Delivery</span>
        </label>
      </div>

      {/* Open Now */}
      <div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            onChange={(e) =>
              updateQuery("openNow", e.target.checked ? "1" : null)
            }
            checked={searchParams.get("openNow") === "1"}
          />
          <span>Open Now</span>
        </label>
      </div>
    </aside>
  );
}
