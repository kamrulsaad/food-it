// /app/checkout/page.tsx
"use client";

import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import CheckoutForm from "./_components/checkout-form";
import { Button } from "@/components/ui/button";

export default function CheckoutPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-10 md:px-20 xl:px-40 py-10">
      <SignedIn>
        <CheckoutForm />
      </SignedIn>

      <SignedOut>
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-semibold">You must be signed in to checkout</h2>
          <SignInButton mode="modal">
            <Button>Sign In to Continue</Button>
          </SignInButton>
        </div>
      </SignedOut>
    </div>
  );
}
