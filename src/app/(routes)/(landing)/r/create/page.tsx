import { Metadata } from "next";
import CreateRestaurantForm from "@/components/forms/CreateRestaurant";

export const metadata: Metadata = {
  title: "Create Restaurant",
};

export default function RestaurantCreatePage() {
  return (
    <div className="flex justify-center items-center py-10 px-4 sm:px-10 md:px-20 xl:px-40">
      <div className="w-full max-w-3xl">
        <CreateRestaurantForm />
      </div>
    </div>
  );
}
