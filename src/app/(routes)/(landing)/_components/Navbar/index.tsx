import Image from "next/image";
import Link from "next/link";
import MobileMenu from "./MobileMenu";

import CartDrawer from "@/components/global/cart-drawer";
import NavAuth from "./NavAuth";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/my-orders", label: "My Orders" },
  { href: "/preorder", label: "Pre-Order" },
  { href: "/r?homemade=1", label: "Homemade" },
];

export default async function MobileNavbar() {
  return (
    <nav className="w-full px-4 sm:px-10 md:px-20 xl:px-40 py-3 border-b shadow-sm sticky top-0 z-50 bg-white">
      <div className="flex items-center justify-between w-full">
        {/* Logo */}
        <Link className="flex items-center" href="/">
          <Image
            src="/logo.png"
            alt="Food IT Logo"
            width={40}
            height={40}
            className="h-auto w-auto"
          />
          <p className="ml-2 text-primary text-2xl font-bold tracking-tight">
            foodit
          </p>
        </Link>

        {/* Mobile Menu Button */}
        <MobileMenu navItems={navItems} />

        <div className="flex items-center gap-2">
          <CartDrawer />
        </div>

        {/* Desktop Nav */}
        <div className="hidden xl:flex items-center gap-4 text-xl font-semibold">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className=" hover:text-orange-600 hover:cursor-pointer"
            >
              {item.label}
            </Link>
          ))}
          <NavAuth />
        </div>
      </div>
    </nav>
  );
}
