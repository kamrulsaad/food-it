// app/r/layout.tsx
import React from "react";

type Props = {
  children: React.ReactNode;
};

export const metadata = {
  title: "Browse Restaurants",
  description: "Explore restaurants in your area",
};

const BrowseLayout = ({ children }: Props) => {
  return (
    <div className="px-4 sm:px-10 md:px-20 xl:px-40 py-10 min-h-screen">
      {children}
    </div>
  );
};

export default BrowseLayout;
