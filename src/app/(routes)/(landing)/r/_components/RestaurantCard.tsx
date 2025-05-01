// app/r/components/RestaurantCard.tsx
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { RestaurantPreview } from "@/lib/types";
import { Package2Icon } from "lucide-react";
import Link from "next/link";

export default function RestaurantCard({
  name,
  id,
  coverPhoto,
  deliveryTime,
  deliveryFee,
  minPrice,
}: RestaurantPreview) {
  return (
    <Link href={"/r/" + id}>
      <Card className="cursor-pointer pb-2 pt-0 hover:shadow-md transition-all duration-200 rounded-xl overflow-hidden">
        <div className="relative w-full h-28 sm:h-32 md:h-36">
          <Image
            src={coverPhoto}
            alt={`${name} cover`}
            fill
            className="object-contain transition-transform group-hover:scale-105"
          />
        </div>

        <CardContent className="px-3 space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-sm line-clamp-1">{name}</h3>
          </div>

          <div className="flex gap-2 text-xs text-muted-foreground font-medium pt-1">
            <span>From ৳{minPrice}</span>
            <span>{deliveryTime}</span>
          </div>
          <span className="flex items-center gap-0.5 text-xs text-muted-foreground font-medium">
            <Package2Icon className="w-3.5" /> ৳{deliveryFee}
          </span>
        </CardContent>
      </Card>
    </Link>
  );
}
