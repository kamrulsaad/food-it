import { authMiddleware } from "@/lib/auth";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import React from "react";

type Props = {
  children: React.ReactNode;
};

export const metadata: Metadata = {
  title: "Rider Dashboard",
};

const RiderDashLayout = async ({ children }: Props) => {
  const user = await authMiddleware();

  if (!user || user.role !== "RIDER") {
    redirect("/");
  }

  return <div>{children}</div>;
};

export default RiderDashLayout;
