"use client";

import { Skeleton } from "@/components/global/skeleton";

export default function SkeletonLoader() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="space-y-3 p-4 border rounded shadow-sm bg-white"
        >
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-5/12" />
            <Skeleton className="h-5 w-4/12" />
          </div>
          <Skeleton className="h-5 w-9/12" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-9 w-full bg-red-100" />
        </div>
      ))}
    </div>
  );
}
