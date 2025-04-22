import React from "react";
import HeroSection from "./_components/Hero";
import RestaurantDeals from "./_components/Home/Restaurants";
import PartnerCTA from "./_components/Home/Partners";
import PlatformSummary from "./_components/Home/Summary";
import WhyChooseFoodIT from "./_components/Home/WhyUs";
import NationwideDelivery from "./_components/Home/NationWideDelivery";

const HomePage = () => {
  return (
    <main className="overflow-hidden">
      <HeroSection />
      <RestaurantDeals />
      <PartnerCTA />
      <PlatformSummary />
      <WhyChooseFoodIT />
      <NationwideDelivery />
    </main>
  );
};

export default HomePage;
