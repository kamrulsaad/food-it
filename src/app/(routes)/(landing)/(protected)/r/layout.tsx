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
  return children;
};

export default BrowseLayout;
