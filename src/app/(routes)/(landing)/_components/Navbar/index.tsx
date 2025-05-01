import Image from "next/image";
import Link from "next/link";
import MobileMenu from "./MobileMenu";
import {
  SignInButton,
  SignOutButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import CartDrawer from "@/components/global/cart-drawer";

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
        <div className="hidden md:flex items-center gap-4 text-xl font-semibold">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className=" hover:text-orange-600 hover:cursor-pointer"
            >
              {item.label}
            </Link>
          ))}
          {!userId ? (
            <>
              <SignInButton mode="modal">
                <button className="text-primary py-2 rounded-md hover:text-orange-600 transition duration-300 ease-in-out hover:cursor-pointer">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="bg-primary text-white px-4 py-2 rounded-md hover:bg-orange-600 transition duration-300 ease-in-out hover:cursor-pointer">
                  Sign Up
                </button>
              </SignUpButton>
            </>
          ) : (
            <>
              <SignOutButton>
                <button className="py-2 rounded-md hover:text-orange-600 transition duration-300 ease-in-out hover:cursor-pointer">
                  Sign Out
                </button>
              </SignOutButton>
              <UserButton />
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
