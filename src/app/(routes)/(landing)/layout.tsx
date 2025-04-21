import { Metadata } from "next";
import React from "react";
import MobileNavbar from "./_components/Navbar";

export const metadata: Metadata = {
  title: "Home",
};

const FrontLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <MobileNavbar />
      {children}
    </div>
  );
};

export default FrontLayout;
