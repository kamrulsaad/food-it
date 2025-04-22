// components/about/why-choose-section.tsx
import { CheckCircle } from "lucide-react";
import Image from "next/image";

const features = [
  "Fast and reliable delivery across Bangladesh",
  "Thousands of restaurants and shops to choose from",
  "Track your order in real-time",
  "Secure payment with digital wallets & cards",
];

export default function WhyChooseSection() {
  return (
    <section className="px-4 sm:px-10 md:px-20 xl:px-40 py-16 bg-orange-50">
      <div className="mx-auto grid md:grid-cols-2 gap-10 items-center justify-between">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Why choose Food IT?
          </h2>
          <p className="text-gray-700 text-sm md:text-base mb-6">
            We’re not just another delivery service — we’re your reliable
            everyday partner. Whether it’s a last-minute lunch or a weekly
            grocery refill, Food IT gets it done.
          </p>
          <ul className="space-y-3">
            {features.map((feature, idx) => (
              <li key={idx} className="flex items-center text-sm text-gray-800">
                <CheckCircle className="text-orange-600 w-5 h-5 mr-2" />
                {feature}
              </li>
            ))}
          </ul>
        </div>

        <div className="w-full h-full rounded-lg overflow-hidden">
          <Image
            src="/assets/delivery.png"
            alt="Why choose Food IT"
            width={400}
            height={400}
            className="object-cover rounded-lg w-full"
          />
        </div>
      </div>
    </section>
  );
}
