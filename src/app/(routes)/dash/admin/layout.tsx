import { authMiddleware } from "@/lib/auth";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import React from "react";

type Props = {
  children: React.ReactNode;
};

export const metadata: Metadata = {
  title: "Admin Dashboard",
};

const AdminDashLayout = async ({ children }: Props) => {
  const user = await authMiddleware();

  if (!user || user.role !== "SUPERADMIN") {
    redirect("/");
  }

  return <div className="px-4 py-2">{children}</div>;
};

export default AdminDashLayout;
