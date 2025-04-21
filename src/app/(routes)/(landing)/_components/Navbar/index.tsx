import Image from "next/image";
import Link from "next/link";
import MobileMenu from "./MobileMenu";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/deals", label: "Deals" },
  { href: "/login", label: "Login" },
  { href: "/signup", label: "Sign Up" },
];

export default function MobileNavbar() {
  return (
    <nav className="w-full px-4 sm:px-10 md:px-20 xl:px-40 py-3 border-b shadow-sm sticky top-0 z-50 bg-white">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <Link className="flex items-center" href="/">
          <Image
            src="/assets/logo.png"
            alt="Food IT Logo"
            width={40}
            height={40}
            className="h-auto w-auto"
          />
          <p className="text-primary text-2xl">foodit</p>
        </Link>

        {/* Mobile Menu Button */}
        <MobileMenu navItems={navItems} />

        {/* Desktop Nav */}
        <div className="hidden md:flex gap-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-xl font-semibold hover:text-orange-600"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
