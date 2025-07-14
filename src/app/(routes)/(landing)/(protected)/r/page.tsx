// app/r/page.tsx
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import RestaurantGrid from "./_components/RestaurantGrid";
import SidebarFilters from "./_components/SidebarFilters";
import { Suspense } from "react";

export default function ExplorePage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Browse Restaurants
          </h1>
          <p className="text-muted-foreground text-sm">
            Discover restaurants delivering to your location
          </p>
        </div>

        {/* Filter Toggle Button */}
        <Sheet>
          <SheetTrigger asChild>
            <Button className="gap-2 hover:bg-orange-600 cursor-pointer">
              <Filter className="w-4 h-4" />
              Filters
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="p-6">
            <SheetTitle className="text-lg font-semibold">Filters</SheetTitle>
            <SheetDescription></SheetDescription>
            <SidebarFilters />
          </SheetContent>
        </Sheet>
      </div>

      {/* Main Grid */}
      <Suspense fallback={<div className="py-10 text-center">Loading...</div>}>
        <RestaurantGrid />
      </Suspense>
    </div>
  );
}
