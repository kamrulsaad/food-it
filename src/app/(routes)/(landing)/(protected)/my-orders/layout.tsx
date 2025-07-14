import React from "react";

type Props = {
  children: React.ReactNode;
};

const MyOrdersPageLayout = ({ children }: Props) => {
  return (
    <div className="px-4 sm:px-10 md:px-20 xl:px-40 py-10 min-h-screen">
      {children}
    </div>
  );
};

export default MyOrdersPageLayout;
