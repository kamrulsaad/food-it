"use client";

import { useEffect, useState } from "react";
import { useUser, SignInButton, SignUpButton } from "@clerk/nextjs";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

type Props = {
  children?: React.ReactNode;
};

const ProtectedLayout = ({ children }: Props) => {
  const { user, isLoaded } = useUser();
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoaded) {
      if (!user) {
        // Store the intended route
        localStorage.setItem("redirectAfterLogin", pathname);
        setShowLoginPrompt(true);
      }
    }
  }, [isLoaded, user, pathname]);

  // After login, Clerk will redirect you back to the app. Use a middleware or a listener to redirect to saved path.
  useEffect(() => {
    if (user && typeof window !== "undefined") {
      const redirectTo = localStorage.getItem("redirectAfterLogin");
      if (redirectTo && pathname === "/auth-required") {
        localStorage.removeItem("redirectAfterLogin");
        router.replace(redirectTo);
      }
    }
  }, [user, router, pathname]);

  if (!isLoaded) return null;

  if (showLoginPrompt) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center px-4 text-center">
        <h1 className="text-2xl font-semibold mb-2">Authentication Required</h1>
        <p className="mb-6 text-gray-600">
          Please sign in or register to continue.
        </p>
        <div className="flex gap-4">
          <SignInButton mode="modal">
            <Button className="cursor-pointer" variant={"outline"}>
              Sign In
            </Button>
          </SignInButton>
          <SignUpButton mode="modal">
            <Button className="cursor-pointer">Register</Button>
          </SignUpButton>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-10 md:px-20 xl:px-40 py-10 min-h-[calc(100vh-80px)]">
      {children}
    </div>
  );
};

export default ProtectedLayout;
