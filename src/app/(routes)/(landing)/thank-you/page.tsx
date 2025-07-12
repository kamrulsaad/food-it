import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

export default function ThankYouPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center space-y-6">
      <CheckCircle className="w-16 h-16 text-green-500" />
      <h1 className="text-3xl font-bold">Thank you for your order!</h1>
      <p className="text-muted-foreground max-w-md">
        Your order has been placed successfully. You will receive a confirmation
        shortly. We’ll notify you when your food is on the way.
      </p>
      <Link href="/r">
        <Button className="mt-4">Back to Home</Button>
      </Link>
    </div>
  );
}
