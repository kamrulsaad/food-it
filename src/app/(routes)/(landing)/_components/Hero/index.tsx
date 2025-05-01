"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function HeroSection() {
  const router = useRouter();
  const [city, setCity] = useState("");
  const [loadingLocation, setLoadingLocation] = useState(false);

  const handleSearch = () => {
    if (!city.trim()) return;
    router.push(`/r?city=${encodeURIComponent(city.trim())}`);
  };

  const handleLocateMe = async () => {
    try {
      setLoadingLocation(true);
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        const res = await fetch(
          `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${process.env.NEXT_PUBLIC_OPENCAGE_KEY}`
        );
        const data = await res.json();
        const components = data?.results?.[0]?.components;
        const detectedCity =
          components?.city || components?.town || components?.village;

        if (detectedCity) {
          setCity(detectedCity);
          router.push(`/r?city=${encodeURIComponent(detectedCity)}`);
        }
      });
    } catch (err) {
      console.error("Location error:", err);
    } finally {
      setLoadingLocation(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <section className="w-full bg-accent px-4 sm:px-10 md:px-20 xl:px-40 py-10 md:h-[50vh]">
      <div className="mx-auto h-full flex flex-col md:flex-row items-center justify-center gap-10">
        <div className="flex-1">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-6 max-w-xl">
            Sign up for free delivery on your first order
          </h1>

          <div className="flex flex-col sm:flex-row items-stretch gap-3">
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter your city"
              className="flex-1 px-4 py-2 rounded-lg border focus:outline-none"
            />
            <Button
              size="lg"
              variant="outline"
              className="flex gap-2 items-center cursor-pointer"
              onClick={handleLocateMe}
              disabled={loadingLocation}
            >
              <span>📍</span> {loadingLocation ? "Locating..." : "Locate me"}
            </Button>
            <Button
              size="lg"
              className="text-white font-semibold rounded-lg shadow cursor-pointer"
              onClick={handleSearch}
            >
              Find food
            </Button>
          </div>

          <p className="mt-3 text-sm text-gray-600">
            <Link
              href="#"
              className="text-blue-700 font-medium hover:underline"
            >
              Log in to see saved addresses
            </Link>
          </p>
        </div>

        <div className="flex-1 hidden md:block">
          <Image
            src="/assets/hero-bg.png"
            alt="Food IT"
            width={400}
            height={400}
            className="ml-auto"
          />
        </div>
      </div>
    </section>
  );
}
