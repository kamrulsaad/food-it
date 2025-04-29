"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

// Utility: Format path parts nicely
function formatBreadcrumb(text: string) {
  if (!text) return "";

  // Match UUID v4 or numeric IDs
  const uuidRegex =
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
  const numberRegex = /^\d+$/;

  if (uuidRegex.test(text) || numberRegex.test(text)) {
    return "Details";
  }

  return text.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

export function DashboardBreadcrumb() {
  const pathname = usePathname();
  const paths = pathname.split("/").filter((p) => p);

  return (
    <Breadcrumb className="text-sm font-medium flex items-center">
      <BreadcrumbItem>
        <BreadcrumbLink asChild>
          <Link href="/dash" className="text-muted-foreground hover:underline">
            Dashboard
          </Link>
        </BreadcrumbLink>
      </BreadcrumbItem>

      {paths.map((segment, index) => {
        // Skip the first segment (which is always "dash")
        if (index === 0) return null;

        if (segment === "admin" || segment === "rider" || segment === "owner")
          return null;

        const href = "/" + paths.slice(0, index + 1).join("/");
        const isLast = index === paths.length - 1;
        const label = formatBreadcrumb(segment);

        return (
          <div key={index} className="flex items-center">
            <BreadcrumbSeparator className="flex items-center px-2" />
            <BreadcrumbItem>
              {isLast ? (
                <span className="text-foreground">{label}</span>
              ) : (
                <BreadcrumbLink asChild>
                  <Link
                    href={href}
                    className="text-muted-foreground hover:underline"
                  >
                    {label}
                  </Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </div>
        );
      })}
    </Breadcrumb>
  );
}
