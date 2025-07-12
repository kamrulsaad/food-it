import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export default async function DashboardPage() {
  const user = await currentUser();
  if (!user) redirect("/");

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: user.id },
    select: { role: true },
  });

  switch (dbUser?.role) {
    case "ADMIN":
      redirect("/dash/admin");
    case "SUPERADMIN":
      redirect("/dash/admin");
    case "RESTATURANT_ADMIN":
      redirect("/dash/admin/restaurants");
    case "RESTATURANT_OWNER":
      redirect("/dash/owner");
    case "RIDER":
      redirect("/dash/rider");
    case "CUSTOMER":
      redirect("/my-orders");
    default:
      redirect("/");
  }
}
