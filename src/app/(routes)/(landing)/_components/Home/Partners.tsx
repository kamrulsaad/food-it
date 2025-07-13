import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function PartnerCTA() {
  return (
    <section className="relative w-full md:h-[500px] px-4 sm:px-10 md:px-20 xl:px-40 py-6 overflow-hidden">
      {/* Background image */}
      <Image
        src="/assets/chef-cooking.jpg" // Replace with your image path
        alt="Chef cooking in the kitchen"
        fill
        className="object-cover object-center -z-10"
      />

      {/* Overlay content */}
      <div className="max-w-xl bg-white/90 backdrop-blur-md rounded-xl shadow-xl p-6 md:p-8 mt-20 ">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">
          List your Restaurant or Homemade Shop 
        </h2>
        <p className="text-sm text-gray-700 mb-2">
          Would you like millions of new customers to enjoy your amazing food
          and groceries? So would we!
        </p>
        <p className="text-sm text-gray-700 mb-4">
          It&apos;s simple: we list your menu and product lists online, help you
          process orders, pick them up, and deliver them to hungry customers –
          in a heartbeat!
        </p>
        <p className="text-sm font-medium">
          Interested? Let&apos;s start our partnership today!
        </p>

        <Button className="mt-4 bg-orange-600 hover:bg-orange-700 text-white">
          Get started
        </Button>
      </div>
    </section>
  );
}
