import Image from "next/image";
import Link from "next/link";
import MobileMenu from "./MobileMenu";
import { SignInButton, UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/deals", label: "Deals" },
];

export default async function MobileNavbar() {
  const { userId } = await auth();
  return (
    <nav className="w-full px-4 sm:px-10 md:px-20 xl:px-40 py-3 border-b shadow-sm sticky top-0 z-50 bg-white">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <Link className="flex items-center" href="/">
          <Image
            src="/logo.png"
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
        <div className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-xl font-semibold hover:text-orange-600"
            >
              {item.label}
            </Link>
          ))}
          {!userId ? (
            <SignInButton mode="modal">
              <button className="bg-primary text-white px-4 py-2 rounded-md hover:bg-orange-600 transition duration-300 ease-in-out">
                Sign In
              </button>
            </SignInButton>
          ) : (
            <UserButton />
          )}
        </div>
      </div>
    </nav>
  );
}
