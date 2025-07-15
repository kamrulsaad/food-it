// /app/checkout/page.tsx
"use client";

import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import CheckoutForm from "./_components/checkout-form";
import { Button } from "@/components/ui/button";

export default function CheckoutPage() {
  return (
    <div className="max-w-3xl mx-auto">
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
