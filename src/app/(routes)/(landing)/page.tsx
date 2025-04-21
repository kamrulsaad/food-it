import React from "react";
import HeroSection from "./_components/Hero";
import RestaurantDeals from "./_components/Home/Restaurants";

const HomePage = () => {
  return (
    <div>
      <HeroSection />
      <RestaurantDeals />
    </div>
  );
};

export default HomePage;
