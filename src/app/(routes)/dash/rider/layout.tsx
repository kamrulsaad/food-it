import { Button } from "@/components/ui/button";
import { authMiddleware } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { ArrowLeft } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Rider Dashboard",
};

export default async function RiderDashLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await authMiddleware();

  if (!user || user.role !== "RIDER") {
    redirect("/");
  }

  const rider = await prisma.rider.findUnique({
    where: { email: user.email ?? undefined },
  });

  const isApproved = rider?.approved === true;

  return (
    <main className="px-4 pt-2 relative min-h-[calc(100vh-34px)] flex flex-col">
      {!isApproved && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/10 backdrop-blur-xs">
          <div className="text-center px-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Your rider profile is not yet approved
            </h2>
            <p className="text-sm text-gray-600">
              Please wait for an admin to review and approve your application.
            </p>
            <Link href={"/"}>
              <Button variant="outline" className="mt-4 cursor-pointer">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      )}

      <div
        className={isApproved ? "" : "blur-xs pointer-events-none select-none"}
      >
        {children}
      </div>
    </main>
  );
}
