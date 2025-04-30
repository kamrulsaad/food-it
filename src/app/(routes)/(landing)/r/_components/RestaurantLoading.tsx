// app/r/components/RestaurantGridSkeleton.tsx
import { Skeleton } from "@/components/ui/skeleton";

export default function RestaurantLoading() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="rounded-xl border bg-white p-3 space-y-3">
          <Skeleton className="w-full h-28 sm:h-32 md:h-36 rounded-lg" />
          <Skeleton className="w-2/3 h-4" />
          <div className="flex justify-between gap-2">
            <Skeleton className="w-1/3 h-3" />
            <Skeleton className="w-1/3 h-3" />
            <Skeleton className="w-1/4 h-3" />
          </div>
        </div>
      ))}
    </div>
  );
}
