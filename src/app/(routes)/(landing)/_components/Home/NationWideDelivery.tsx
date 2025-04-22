import Image from "next/image";

export default function NationwideDelivery() {
  return (
    <section className="px-4 sm:px-10 md:px-20 xl:px-40 py-16 bg-white">
      <div className="mx-auto flex flex-col-reverse md:flex-row items-center gap-10">
        <div className="flex-1">
          <Image
            src="/assets/nationwide-delivery.png"
            alt="Nationwide delivery map"
            width={500}
            height={400}
            className="rounded-xl shadow-lg"
          />
        </div>
        <div className="flex-1">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Delivering across all major cities
          </h2>
          <p className="text-gray-700 text-base leading-relaxed">
            Whether you&apos;re in Dhaka, Chattogram, Rajshahi, Sylhet, or
            Khulna — Food IT brings your favorite meals and grocery items
            straight to your door. With expanding coverage and partnerships,
            we&apos;re committed to reaching even more districts with reliable
            and fast delivery.
          </p>
        </div>
      </div>
    </section>
  );
}
