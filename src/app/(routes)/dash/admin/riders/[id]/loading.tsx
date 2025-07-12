// src/app/dash/admin/restaurants/[id]/loading.tsx

import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingRestaurantDetails() {
  return (
    <div>
      <Skeleton className="h-8 w-2/3" /> {/* Title */}
      <div className="grid gap-6 md:grid-cols-2 mt-2">
        {/* Restaurant Info */}
        <div className="space-y-3">
          <Skeleton className="h-5 w-1/2" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-2/5" />
        </div>

        {/* Owner Info */}
        <div className="space-y-3">
          <Skeleton className="h-5 w-1/2" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
      <Skeleton className="h-10 w-40" /> {/* Button */}
    </div>
  );
}
