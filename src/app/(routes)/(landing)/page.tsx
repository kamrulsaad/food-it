import React from "react";
import HeroSection from "./_components/Hero";
import RestaurantDeals from "./_components/Home/Restaurants";
import PartnerCTA from "./_components/Home/Partners";
import PlatformSummary from "./_components/Home/Summary";

const HomePage = () => {
  return (
    <div>
      <HeroSection />
      <RestaurantDeals />
      <PartnerCTA />
      <PlatformSummary />
    </div>
  );
};

export default HomePage;
