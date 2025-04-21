import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import Link from "next/link";
import React from "react";

type Props = {
  navItems: {
    href: string;
    label: string;
  }[];
};

const MobileMenu = ({ navItems }: Props) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Menu className="md:hidden font-bold" />
      </SheetTrigger>

      <SheetContent side="right" className="pl-1">
        <SheetTitle></SheetTitle>
        <div className="flex flex-col gap-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-xl font-medium hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenu;
