import RiderSignupForm from "@/components/forms/RiderSignUpForm";
import { Button } from "@/components/ui/button";
import { authMiddleware } from "@/lib/auth";
import Link from "next/link";

const DISALLOWED_ROLES = [
  "SUPERADMIN",
  "ADMIN",
  "RESTATURANT_OWNER",
  "RESTATURANT_ADMIN",
];

export default async function RiderSignupPage() {
  const user = await authMiddleware();

  if (!user || DISALLOWED_ROLES.includes(user.role)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] p-4">
        <h1 className="text-2xl font-bold text-red-500">Access Denied</h1>
        <p>You are not allowed to apply as a rider.</p>
        <Link href="/" className="mt-4">
          <Button variant="outline" className="cursor-pointer">
            Go to Home
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl">
        <RiderSignupForm />
      </div>
    </div>
  );
}
