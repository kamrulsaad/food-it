import { getApprovedRestaurants } from "@/queries/restaurant";
import SearchRestaurants from "./_components/search-restaurants";

export default async function RestaurantsPage() {
  const restaurants = await getApprovedRestaurants();

  return (
    <div className="w-full px-4 sm:px-10 md:px-20 xl:px-40 py-6">
      <h1 className="text-2xl font-bold mb-6">
        Find Your Favorite Restaurants
      </h1>
      <SearchRestaurants restaurants={restaurants} />
    </div>
  );
}
