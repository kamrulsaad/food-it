import { authMiddleware } from "@/lib/auth";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import React from "react";

type Props = {
  children: React.ReactNode;
};

export const metadata: Metadata = {
  title: "Restaurant Dashboard",
};

const OwnerDashLayout = async ({ children }: Props) => {
  const user = await authMiddleware();

  if (!user || user.role !== "RESTATURANT_OWNER") {
    redirect("/");
  }

  return <div>{children}</div>;
};

export default OwnerDashLayout;
