import RestaurantGrid from "./_components/RestaurantGrid";
import SidebarFilters from "./_components/SidebarFilters";

export default function ExplorePage() {
  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="md:w-1/4">
        <SidebarFilters />
      </div>
      <div className="md:w-3/4">
        <RestaurantGrid />
      </div>
    </div>
  );
}
