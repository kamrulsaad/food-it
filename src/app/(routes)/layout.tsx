import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Home",
};

const FrontLayout = ({ children }: { children: React.ReactNode }) => {
  return <div>{children}</div>;
};

export default FrontLayout;
