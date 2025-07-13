"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";

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

  const resetFilters = () => {
    const params = new URLSearchParams(window.location.search);
    params.delete("sort");
    params.delete("category");
    params.delete("freeDelivery");
    params.delete("openNow");
    params.delete("homemade"); 
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
    <div className="space-y-6">
      {/* Sort By */}
      <div>
        <Label className="text-sm font-medium mb-2 block">Sort by</Label>
        <div className="space-y-1">
          {["deliveryTime", "price"].map((type) => (
            <Button
              key={type}
              variant={
                searchParams.get("sort") === type ? "secondary" : "ghost"
              }
              size="sm"
              className="w-full justify-start text-left capitalize cursor-pointer"
              onClick={() => updateQuery("sort", type)}
            >
              {type === "deliveryTime" ? "Delivery Time" : "Price"}
            </Button>
          ))}
        </div>
      </div>

      {/* Category */}
      <div>
        <Label className="text-sm font-medium mb-2 block">Category</Label>
        <Button
          variant={!searchParams.get("category") ? "secondary" : "ghost"}
          size="sm"
          className="w-full justify-start text-left cursor-pointer"
          onClick={() => updateQuery("category", null)}
        >
          All Categories
        </Button>

        <ScrollArea className="pr-2 mt-2">
          <div className="space-y-1">
            {categories.map((cat) => (
              <Button
                key={cat.id}
                variant={
                  searchParams.get("category") === cat.name
                    ? "secondary"
                    : "ghost"
                }
                size="sm"
                className="w-full justify-start text-left cursor-pointer"
                onClick={() => updateQuery("category", cat.name)}
              >
                {cat.name}
              </Button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Checkboxes */}

      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Checkbox
            className="cursor-pointer"
            id="homemade"
            checked={searchParams.get("homemade") === "1"}
            onCheckedChange={(checked) =>
              updateQuery("homemade", checked ? "1" : null)
            }
          />
          <Label htmlFor="homemade">Homemade</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            className="cursor-pointer"
            id="freeDelivery"
            checked={searchParams.get("freeDelivery") === "1"}
            onCheckedChange={(checked) =>
              updateQuery("freeDelivery", checked ? "1" : null)
            }
          />
          <Label htmlFor="freeDelivery">Free Delivery</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            className="cursor-pointer"
            id="openNow"
            checked={searchParams.get("openNow") === "1"}
            onCheckedChange={(checked) =>
              updateQuery("openNow", checked ? "1" : null)
            }
          />
          <Label htmlFor="openNow">Open Now</Label>
        </div>
      </div>

      {/* Reset Button */}
      <div>
        <Button
          variant="destructive"
          size="sm"
          className="w-full cursor-pointer"
          onClick={resetFilters}
        >
          Reset Filters
        </Button>
      </div>
    </div>
  );
}
