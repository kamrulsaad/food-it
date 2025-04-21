import { Metadata } from "next";
import React from "react";
import MobileNavbar from "./_components/Navbar";
import Footer from "./_components/Footer";

export const metadata: Metadata = {
  title: "Home",
};

const FrontLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <MobileNavbar />
      {children}
      <Footer />
    </div>
  );
};

export default FrontLayout;
