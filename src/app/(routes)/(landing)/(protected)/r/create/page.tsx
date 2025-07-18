import { Metadata } from "next";
import CreateRestaurantForm from "@/components/forms/CreateRestaurant";
import { authMiddleware } from "@/lib/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Create Restaurant",
};

export default async function RestaurantCreatePage() {
  const user = await authMiddleware();

  if (!user || user.role !== "CUSTOMER") return redirect("/");

  return (
    <div className="flex justify-center items-center">
      <div className="w-full">
        <CreateRestaurantForm />
      </div>
    </div>
  );
}
