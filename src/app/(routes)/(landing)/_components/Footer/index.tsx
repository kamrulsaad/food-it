// components/footer/site-footer.tsx
import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram } from "lucide-react";

const footerLinks = [
  [
    { label: "Create Restaurant", href: "/r/create" },
    { label: "Restaurant Dashboard", href: "/dash/owner" },
    { label: "Terms and Conditions", href: "#" },
    { label: "Areas delivered in Gazipur", href: "#" },
    { label: "Areas delivered in Sylhet", href: "#" },
    { label: "Areas delivered in Rajshahi", href: "#" },
    { label: "Areas delivered in Barisal", href: "#" },
  ],
  [
    { label: "Rider Sign Up", href: "/rider/sign-up" },
    { label: "Rider Dasboard", href: "/dash/rider" },
    { label: "Cashback Program", href: "#" },
    { label: "Partner with Us", href: "#" },
    { label: "foodit Deals", href: "#" },
    { label: "All cities", href: "#" },
    { label: "Areas delivered in Khulna", href: "#" },
  ],
  [
    { label: "My Pre-Orders", href: "/my-orders/preorder" },
    { label: "Admin Dashboard", href: "/dash/admin" },
    { label: "Grocery delivery", href: "#" },
    { label: "Ramadan delivery", href: "#" },
    { label: "Areas delivered in Comilla", href: "#" },
    { label: "Areas delivered in Mymensingh", href: "#" },
    { label: "Areas delivered in Rangpur", href: "#" },
  ],
];

export default function Footer() {
  return (
    <footer className="border-t text-gray-600">
      <div className="px-4 sm:px-10 md:px-20 xl:px-40 py-3 mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {footerLinks.map((column, colIndex) => (
          <div key={colIndex} className="flex flex-col gap-2">
            {column.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="hover:underline"
              >
                {link.label}
              </Link>
            ))}
          </div>
        ))}
      </div>

      <div className="mt-10 border-t sm:px-10 md:px-20 xl:px-40 py-3 flex flex-col md:flex-row items-center justify-between gap-4">
        <Image src="/logo.png" alt="Food IT" width={30} height={30} />
        <p>© Food IT</p>

        <div className="flex gap-4">
          <Link href="#">
            <Instagram />
          </Link>
          <Facebook />
        </div>
      </div>
    </footer>
  );
}
